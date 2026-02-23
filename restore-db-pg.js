const fs = require('fs');
const { Client } = require('pg');

// .env 파일에서 Supabase 연결 정보 읽기
const envContent = fs.readFileSync('.env.development.local', 'utf8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();

// Supabase URL에서 project ref 추출
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)[1];

console.log('🔄 Supabase 데이터베이스 복원 시작...\n');
console.log('📍 Project Reference:', projectRef);
console.log('');

// Supabase PostgreSQL 연결 문자열 구성
// 형식: postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
console.log('⚠️  Supabase 데이터베이스 비밀번호가 필요합니다.\n');
console.log('다음 단계를 따라주세요:');
console.log('1. https://supabase.com/dashboard/project/' + projectRef + '/settings/database');
console.log('2. "Database Settings" 페이지에서 비밀번호 확인');
console.log('3. 비밀번호를 복사하여 아래 명령 실행:\n');
console.log('환경 변수 설정:');
console.log('   $env:SUPABASE_DB_PASSWORD = "your-password-here"');
console.log('');
console.log('그 다음 다시 이 스크립트 실행:');
console.log('   node restore-db-pg.js');
console.log('');

const dbPassword = process.env.SUPABASE_DB_PASSWORD;

if (!dbPassword) {
  console.log('❌ SUPABASE_DB_PASSWORD 환경 변수가 설정되지 않았습니다.');
  console.log('');
  process.exit(1);
}

// Supabase 연결 정보 구성 (Direct connection)
const host = `db.${projectRef}.supabase.co`;
const connectionString = `postgresql://postgres:${dbPassword}@${host}:5432/postgres`;

console.log('✅ 데이터베이스에 연결 중...');
console.log(`   호스트: ${host}`);
console.log('');

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function restoreDatabase() {
  try {
    await client.connect();
    console.log('✅ 데이터베이스 연결 성공!\n');
    
    // 백업 파일 읽기
    console.log('📦 백업 파일을 읽는 중...');
    const backupFile = 'db_cluster-04-08-2025@01-16-39.backup';
    const sqlContent = fs.readFileSync(backupFile, 'utf8');
    console.log(`✅ 백업 파일 읽기 완료: ${(sqlContent.length / 1024).toFixed(2)} KB\n`);
    
    // SQL 문을 분리
    console.log('📝 SQL 문을 처리하는 중...');
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => {
        // 빈 문장이나 주석만 있는 문장 제외
        if (!stmt) return false;
        const lines = stmt.split('\n').filter(line => !line.trim().startsWith('--'));
        return lines.join('').trim().length > 0;
      });
    
    console.log(`✅ ${statements.length}개의 SQL 문을 발견했습니다.\n`);
    
    // 각 SQL 문 실행
    let successCount = 0;
    let errorCount = 0;
    
    console.log('🚀 데이터베이스 복원 시작...\n');
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      
      try {
        await client.query(stmt);
        successCount++;
        
        if ((i + 1) % 100 === 0) {
          console.log(`   진행 중: ${i + 1}/${statements.length} (${((i + 1) / statements.length * 100).toFixed(1)}%)`);
        }
      } catch (error) {
        errorCount++;
        
        // 일부 오류는 무시 (예: 이미 존재하는 역할 등)
        if (error.message.includes('already exists')) {
          // 무시
        } else if (error.message.includes('permission denied')) {
          // 권한 관련 오류는 로그만 출력
          console.log(`   ⚠️  권한 오류 (무시): ${error.message.substring(0, 100)}...`);
        } else {
          console.log(`   ❌ 오류 발생: ${error.message.substring(0, 100)}...`);
        }
      }
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ 데이터베이스 복원 완료!');
    console.log(`   성공: ${successCount}개`);
    console.log(`   오류: ${errorCount}개`);
    console.log('='.repeat(70));
    
  } catch (error) {
    console.error('\n❌ 복원 중 오류 발생:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

restoreDatabase();
