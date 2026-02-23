const fs = require('fs');

console.log('🔄 백업 파일을 Supabase SQL Editor용으로 변환 중...\n');

const backupFile = 'db_cluster-04-08-2025@01-16-39.backup';
const outputFile = 'supabase-restore.sql';

try {
  const content = fs.readFileSync(backupFile, 'utf8');
  const lines = content.split('\n');
  
  const cleanedLines = [];
  let skipUntilSemicolon = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // psql 메타커맨드 제거
    if (trimmed.startsWith('\\')) {
      console.log(`제거: ${trimmed}`);
      skipUntilSemicolon = true;
      continue;
    }
    
    // SET 명령어 중 일부 제거
    if (trimmed.startsWith('SET default_transaction_read_only') ||
        trimmed.startsWith('SET client_encoding') ||
        trimmed.startsWith('SET standard_conforming_strings')) {
      continue;
    }
    
    // Supabase 기본 역할 생성 명령 제거
    if (trimmed.match(/^CREATE ROLE (anon|authenticated|authenticator|service_role|supabase_admin|dashboard_user|postgres)/i)) {
      console.log(`건너뜀: ${trimmed.substring(0, 50)}...`);
      skipUntilSemicolon = true;
      continue;
    }
    
    // ALTER ROLE 명령 제거
    if (trimmed.match(/^ALTER ROLE (anon|authenticated|authenticator|service_role|supabase_admin|dashboard_user|postgres)/i)) {
      console.log(`건너뜀: ${trimmed.substring(0, 50)}...`);
      skipUntilSemicolon = true;
      continue;
    }
    
    // GRANT 명령 중 문제가 될 수 있는 것들 제거
    if (trimmed.match(/^GRANT .* TO (anon|authenticated|authenticator|service_role|supabase_admin|dashboard_user|postgres)/i)) {
      skipUntilSemicolon = true;
      continue;
    }
    
    // 세미콜론을 만나면 스킵 모드 해제
    if (skipUntilSemicolon && trimmed.endsWith(';')) {
      skipUntilSemicolon = false;
      continue;
    }
    
    if (skipUntilSemicolon) {
      continue;
    }
    
    // 빈 줄이 아니거나 의미 있는 주석이면 추가
    if (trimmed.length > 0 || line.startsWith('--')) {
      cleanedLines.push(line);
    }
  }
  
  const cleanedContent = cleanedLines.join('\n');
  fs.writeFileSync(outputFile, cleanedContent, 'utf8');
  
  console.log('\n' + '='.repeat(70));
  console.log('✅ 변환 완료!');
  console.log('='.repeat(70));
  console.log(`입력 파일: ${backupFile} (${(content.length / 1024).toFixed(2)} KB)`);
  console.log(`출력 파일: ${outputFile} (${(cleanedContent.length / 1024).toFixed(2)} KB)`);
  console.log('='.repeat(70));
  console.log('\n📋 다음 단계:');
  console.log('1. Supabase SQL Editor 열기:');
  console.log('   https://supabase.com/dashboard/project/pwbwnsbkqaqmwfpnixlo/sql/new');
  console.log('\n2. supabase-restore.sql 파일을 열어서 전체 복사');
  console.log('\n3. SQL Editor에 붙여넣고 RUN 실행');
  console.log('\n💡 TIP: 오류가 발생하면 무시하고 Table Editor에서 테이블이 생성되었는지 확인하세요!');
  
} catch (error) {
  console.error('❌ 오류 발생:', error.message);
  process.exit(1);
}
