const fs = require('fs');
const { Client } = require('pg');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function restoreDatabase() {
  try {
    console.log('🔄 Supabase 데이터베이스 복원 도구\n');
    console.log('=' .repeat(70));
    console.log('\n📋 연결 정보를 입력해주세요.\n');
    console.log('Supabase Dashboard에서 확인:');
    console.log('https://supabase.com/dashboard/project/[YOUR-PROJECT]/settings/database\n');
    console.log('→ "Connection string" 섹션에서 "URI" 선택\n');
    console.log('=' .repeat(70));
    console.log('\n');
    
    // 사용자로부터 연결 문자열 입력받기
    const connectionString = await question('📎 Connection String을 입력하세요:\n(형식: postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres)\n\n> ');
    
    if (!connectionString || !connectionString.startsWith('postgresql://')) {
      console.log('\n❌ 올바른 연결 문자열이 아닙니다.');
      rl.close();
      process.exit(1);
    }
    
    console.log('\n✅ 데이터베이스에 연결 중...');
    
    const client = new Client({
      connectionString: connectionString.trim(),
      ssl: { rejectUnauthorized: false }
    });
    
    await client.connect();
    console.log('✅ 데이터베이스 연결 성공!\n');
    
    // 백업 파일 읽기
    console.log('📦 백업 파일을 읽는 중...');
    const backupFile = 'db_cluster-04-08-2025@01-16-39.backup';
    
    if (!fs.existsSync(backupFile)) {
      console.log(`❌ 백업 파일을 찾을 수 없습니다: ${backupFile}`);
      await client.end();
      rl.close();
      process.exit(1);
    }
    
    const sqlContent = fs.readFileSync(backupFile, 'utf8');
    console.log(`✅ 백업 파일 읽기 완료: ${(sqlContent.length / 1024).toFixed(2)} KB\n`);
    
    // SQL 문을 분리
    console.log('📝 SQL 문을 처리하는 중...');
    const statements = [];
    let currentStatement = '';
    const lines = sqlContent.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // 주석이나 빈 줄 건너뛰기
      if (trimmedLine.startsWith('--') || trimmedLine.length === 0) {
        continue;
      }
      
      currentStatement += line + '\n';
      
      // 세미콜론으로 끝나면 하나의 문장 완성
      if (trimmedLine.endsWith(';')) {
        const stmt = currentStatement.trim();
        if (stmt.length > 0) {
          statements.push(stmt);
        }
        currentStatement = '';
      }
    }
    
    console.log(`✅ ${statements.length}개의 SQL 문을 발견했습니다.\n`);
    
    const proceed = await question('🚀 복원을 시작하시겠습니까? (y/n): ');
    
    if (proceed.toLowerCase() !== 'y') {
      console.log('\n❌ 복원이 취소되었습니다.');
      await client.end();
      rl.close();
      process.exit(0);
    }
    
    console.log('\n🚀 데이터베이스 복원 시작...\n');
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    // 무시할 오류 패턴
    const ignoreErrors = [
      'already exists',
      'does not exist',
      'permission denied for schema pg_catalog',
      'must be owner of extension',
      'must be owner of schema',
      'role "postgres" already exists',
      'role "anon" already exists',
      'role "authenticated" already exists',
      'role "authenticator" already exists',
      'role "service_role" already exists',
      'role "supabase_admin" already exists',
      'role "dashboard_user" already exists'
    ];
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      
      // CREATE ROLE 문은 건너뛰기 (Supabase에서 관리)
      if (stmt.match(/^CREATE ROLE (anon|authenticated|authenticator|service_role|supabase|dashboard_user|postgres)/i)) {
        skipCount++;
        continue;
      }
      
      // ALTER ROLE 문도 건너뛰기
      if (stmt.match(/^ALTER ROLE (anon|authenticated|authenticator|service_role|supabase|dashboard_user|postgres)/i)) {
        skipCount++;
        continue;
      }
      
      try {
        await client.query(stmt);
        successCount++;
        
        if ((i + 1) % 50 === 0) {
          console.log(`   진행 중: ${i + 1}/${statements.length} (${((i + 1) / statements.length * 100).toFixed(1)}%) - 성공: ${successCount}, 건너뜀: ${skipCount}, 오류: ${errorCount}`);
        }
      } catch (error) {
        // 무시할 오류인지 확인
        const shouldIgnore = ignoreErrors.some(pattern => 
          error.message.toLowerCase().includes(pattern.toLowerCase())
        );
        
        if (shouldIgnore) {
          skipCount++;
        } else {
          errorCount++;
          // 중요한 오류만 표시
          if (!error.message.includes('permission denied')) {
            console.log(`\n   ⚠️  오류 [${i + 1}]: ${error.message.substring(0, 100)}`);
          }
        }
      }
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ 데이터베이스 복원 완료!');
    console.log('='.repeat(70));
    console.log(`   실행됨: ${successCount}개`);
    console.log(`   건너뜀: ${skipCount}개`);
    console.log(`   오류: ${errorCount}개`);
    console.log('='.repeat(70));
    
    if (errorCount > 0) {
      console.log('\n⚠️  일부 오류가 발생했지만 주요 데이터는 복원되었을 가능성이 높습니다.');
      console.log('   테이블과 데이터가 제대로 복원되었는지 확인해주세요.');
    }
    
    console.log('\n💡 다음 단계:');
    console.log('   1. Supabase Dashboard에서 테이블 확인');
    console.log('   2. 이미지 업로드: node upload-images.js');
    
    await client.end();
    rl.close();
    
  } catch (error) {
    console.error('\n❌ 복원 중 오류 발생:', error.message);
    if (error.stack) {
      console.error('\n상세 오류:', error.stack);
    }
    rl.close();
    process.exit(1);
  }
}

restoreDatabase();
