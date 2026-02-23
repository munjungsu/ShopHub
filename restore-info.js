const fs = require('fs');
const https = require('https');
const url = require('url');

// .env 파일에서 직접 읽기
const envContent = fs.readFileSync('.env.development.local', 'utf8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const supabaseKey = envContent.match(/NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];

console.log('🔄 Supabase 데이터베이스 복원 시작...\n');
console.log('📍 Supabase URL:', supabaseUrl);
console.log('');

// 백업 파일 읽기
const backupFile = 'db_cluster-04-08-2025@01-16-39.backup';
const sqlContent = fs.readFileSync(backupFile, 'utf8');

console.log(`📦 백업 파일 읽기 완료: ${(sqlContent.length / 1024).toFixed(2)} KB`);
console.log('');

// SQL 문을 분리하고 정리
const lines = sqlContent.split('\n');
let currentStatement = '';
const statements = [];

for (const line of lines) {
  const trimmedLine = line.trim();
  
  // 주석이나 빈 줄 건너뛰기
  if (trimmedLine.startsWith('--') || trimmedLine.length === 0) {
    continue;
  }
  
  currentStatement += line + '\n';
  
  // 세미콜론으로 끝나면 하나의 문장 완성
  if (trimmedLine.endsWith(';')) {
    statements.push(currentStatement.trim());
    currentStatement = '';
  }
}

console.log(`📝 ${statements.length}개의 SQL 문을 발견했습니다.\n`);

// Supabase는 REST API를 통한 직접 SQL 실행을 지원하지 않으므로
// PostgreSQL 연결이 필요합니다.

console.log('⚠️  Supabase 복원 방법:\n');
console.log('='.repeat(70));
console.log('\n방법 1: Supabase Dashboard 사용 (추천)');
console.log('-'.repeat(70));
console.log('1. ' + supabaseUrl.replace('https://', 'https://supabase.com/dashboard/project/'));
console.log('2. 좌측 메뉴에서 "SQL Editor" 클릭');
console.log('3. 새 쿼리 생성');
console.log('4. 아래 파일 내용을 복사하여 붙여넣기:');
console.log('   ㄴ db_cluster-04-08-2025@01-16-39.backup');
console.log('5. "Run" 버튼 클릭하여 실행');
console.log('');

console.log('\n방법 2: psql 명령줄 도구 사용');
console.log('-'.repeat(70));
console.log('1. Supabase Dashboard → Settings → Database');
console.log('2. "Connection string" 섹션에서 "Direct connection" 선택');
console.log('3. Connection string 복사');
console.log('4. 다음 명령 실행:');
console.log('');
console.log('   psql "<connection-string>" -f db_cluster-04-08-2025@01-16-39.backup');
console.log('');

console.log('\n방법 3: TablePlus 같은 GUI 도구 사용');
console.log('-'.repeat(70));
console.log('1. TablePlus 또는 DBeaver 같은 PostgreSQL 클라이언트 설치');
console.log('2. Supabase 연결 정보 입력');
console.log('3. SQL 파일 Import 기능 사용');
console.log('');

console.log('='.repeat(70));
console.log('\n💡 TIP: 가장 쉬운 방법은 Supabase Dashboard의 SQL Editor입니다!');
console.log('');

// 백업 파일의 주요 내용 미리보기
console.log('\n📄 백업 파일 미리보기 (처음 20줄):');
console.log('-'.repeat(70));
const previewLines = sqlContent.split('\n').slice(0, 20);
previewLines.forEach(line => console.log(line));
console.log('...');
console.log('-'.repeat(70));
