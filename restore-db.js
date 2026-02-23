const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.development.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function restoreDatabase() {
  try {
    console.log('📦 백업 파일을 읽는 중...');
    const backupFile = 'db_cluster-04-08-2025@01-16-39.backup';
    const sqlContent = fs.readFileSync(backupFile, 'utf8');
    
    console.log('✅ 백업 파일 읽기 완료');
    console.log(`📄 파일 크기: ${(sqlContent.length / 1024).toFixed(2)} KB`);
    
    // SQL을 줄 단위로 분리
    const sqlStatements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 ${sqlStatements.length}개의 SQL 문을 발견했습니다.`);
    console.log('');
    console.log('⚠️  주의: Supabase의 웹 인터페이스나 PostgreSQL 클라이언트를 사용해야 합니다.');
    console.log('');
    console.log('다음 단계를 따라주세요:');
    console.log('1. Supabase 대시보드에 로그인: ' + supabaseUrl.replace('https://', 'https://app.supabase.com/project/'));
    console.log('2. SQL Editor로 이동');
    console.log('3. 백업 파일의 내용을 복사하여 붙여넣기');
    console.log('4. 또는 PostgreSQL 클라이언트 사용:');
    console.log('');
    console.log('   psql -h <host> -U postgres -d postgres -f db_cluster-04-08-2025@01-16-39.backup');
    console.log('');
    console.log('Supabase 데이터베이스 연결 정보는 다음 경로에서 확인:');
    console.log('Supabase Dashboard → Settings → Database → Connection string');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

restoreDatabase();
