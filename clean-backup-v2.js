const fs = require('fs');

console.log('🔄 백업 파일을 Supabase용으로 정밀 변환 중...\n');

const backupFile = 'db_cluster-04-08-2025@01-16-39.backup';
const outputFile = 'supabase-clean.sql';

try {
  const content = fs.readFileSync(backupFile, 'utf8');
  const lines = content.split('\n');
  
  const cleanedLines = [];
  let inCopyBlock = false;
  let skipBlock = false;
  let currentSchema = '';
  let currentTable = '';
  
  // Supabase가 관리하는 스키마/테이블 (건너뛰기)
  const skipSchemas = ['auth', 'storage', 'realtime', 'supabase_functions', 'pg_catalog', 'information_schema'];
  const skipTables = ['audit_log_entries', 'schema_migrations', 'buckets', 'objects', 'migrations'];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // 스키마 감지
    if (trimmed.startsWith('CREATE SCHEMA')) {
      const match = trimmed.match(/CREATE SCHEMA (\w+)/);
      if (match) {
        currentSchema = match[1];
      }
    }
    
    // 테이블 감지
    if (trimmed.startsWith('CREATE TABLE')) {
      const match = trimmed.match(/CREATE TABLE ([\w.]+)/);
      if (match) {
        const fullTableName = match[1];
        const parts = fullTableName.split('.');
        if (parts.length === 2) {
          currentSchema = parts[0];
          currentTable = parts[1];
        }
      }
    }
    
    // COPY 문 시작 감지
    if (trimmed.startsWith('COPY ')) {
      const match = trimmed.match(/COPY ([\w.]+)/);
      if (match) {
        const fullTableName = match[1];
        const parts = fullTableName.split('.');
        const schema = parts.length === 2 ? parts[0] : 'public';
        const table = parts.length === 2 ? parts[1] : parts[0];
        
        // 건너뛸 스키마나 테이블인지 확인
        if (skipSchemas.includes(schema) || skipTables.includes(table)) {
          console.log(`건너뜀: COPY ${fullTableName}`);
          skipBlock = true;
          inCopyBlock = true;
          continue;
        }
        
        inCopyBlock = true;
        skipBlock = false;
      }
    }
    
    // COPY 블록 종료 감지 (\. 또는 빈 줄 후 .)
    if (inCopyBlock && trimmed === '\\.') {
      inCopyBlock = false;
      skipBlock = false;
      continue;
    }
    
    // 건너뛰기 대상이면 제외
    if (skipBlock) {
      continue;
    }
    
    // psql 메타커맨드 제거
    if (trimmed.startsWith('\\')) {
      console.log(`제거: ${trimmed}`);
      continue;
    }
    
    // SET 명령어 중 일부 제거
    if (trimmed.startsWith('SET default_transaction_read_only') ||
        trimmed.startsWith('SET client_encoding') ||
        trimmed.startsWith('SET standard_conforming_strings')) {
      continue;
    }
    
    // Supabase 기본 역할 관련 명령 제거
    if (trimmed.match(/^(CREATE|ALTER|GRANT|REVOKE) .*(anon|authenticated|authenticator|service_role|supabase_admin|dashboard_user|postgres|supabase_storage_admin|supabase_auth_admin)/i)) {
      continue;
    }
    
    // auth, storage, realtime 스키마 생성 제거
    if (trimmed.match(/^CREATE SCHEMA (auth|storage|realtime|supabase_functions)/i)) {
      console.log(`건너뜀: ${trimmed}`);
      continue;
    }
    
    // extensions 관련 (Supabase가 관리)
    if (trimmed.match(/^(CREATE|ALTER|COMMENT ON) EXTENSION/i)) {
      continue;
    }
    
    // public 스키마가 아닌 테이블 생성 건너뛰기
    if (trimmed.startsWith('CREATE TABLE') && !trimmed.includes('public.')) {
      const match = trimmed.match(/CREATE TABLE ([\w.]+)/);
      if (match) {
        const fullTableName = match[1];
        const schema = fullTableName.split('.')[0];
        if (skipSchemas.includes(schema)) {
          console.log(`건너뜀: ${trimmed.substring(0, 60)}...`);
          skipBlock = true;
          continue;
        }
      }
    }
    
    // 의미 있는 내용만 추가
    if (trimmed.length > 0 || line.startsWith('--')) {
      cleanedLines.push(line);
    }
  }
  
  const cleanedContent = cleanedLines.join('\n');
  fs.writeFileSync(outputFile, cleanedContent, 'utf8');
  
  console.log('\n' + '='.repeat(70));
  console.log('✅ 정밀 변환 완료!');
  console.log('='.repeat(70));
  console.log(`입력 파일: ${backupFile} (${(content.length / 1024).toFixed(2)} KB)`);
  console.log(`출력 파일: ${outputFile} (${(cleanedContent.length / 1024).toFixed(2)} KB)`);
  console.log('='.repeat(70));
  console.log('\n📋 다음 단계:');
  console.log('1. Supabase SQL Editor 열기:');
  console.log('   https://supabase.com/dashboard/project/pwbwnsbkqaqmwfpnixlo/sql/new');
  console.log('\n2. supabase-clean.sql 파일을 열어서 전체 복사');
  console.log('\n3. SQL Editor에 붙여넣고 RUN 실행');
  console.log('\n💡 이번에는 auth, storage 관련 테이블을 모두 제외했습니다!');
  
} catch (error) {
  console.error('❌ 오류 발생:', error.message);
  process.exit(1);
}
