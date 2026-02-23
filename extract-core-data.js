const fs = require('fs');

console.log('🔄 핵심 데이터만 추출 중...\n');

const backupFile = 'db_cluster-04-08-2025@01-16-39.backup';
const outputFile = 'supabase-final.sql';

try {
  const content = fs.readFileSync(backupFile, 'utf8');
  const lines = content.split('\n');
  
  const cleanedLines = [];
  let captureMode = false;
  let inCopyBlock = false;
  let skipCopyBlock = false;
  let blockBuffer = [];
  
  console.log('📦 public 스키마의 테이블과 데이터만 추출합니다...\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // COPY 블록 종료
    if (inCopyBlock && (trimmed === '\\.' || trimmed === '')) {
      if (!skipCopyBlock && blockBuffer.length > 0) {
        cleanedLines.push(...blockBuffer);
        cleanedLines.push('');
      }
      inCopyBlock = false;
      skipCopyBlock = false;
      blockBuffer = [];
      continue;
    }
    
    // COPY 블록 내부
    if (inCopyBlock) {
      if (!skipCopyBlock) {
        blockBuffer.push(line);
      }
      continue;
    }
    
    // COPY 문 시작
    if (trimmed.startsWith('COPY ')) {
      const match = trimmed.match(/COPY ([\w.]+)/);
      if (match) {
        const tableName = match[1];
        
        // public 스키마만 허용
        if (tableName.startsWith('public.') || !tableName.includes('.')) {
          const cleanTableName = tableName.replace('public.', '');
          console.log(`✅ 데이터 추출: ${cleanTableName}`);
          
          // COPY를 INSERT로 변환하기 위한 준비
          blockBuffer = [];
          inCopyBlock = true;
          skipCopyBlock = false;
          
          // COPY 문 그대로 추가 (Supabase는 COPY도 지원)
          cleanedLines.push(line);
        } else {
          console.log(`⏭️  건너뜀: ${tableName}`);
          inCopyBlock = true;
          skipCopyBlock = true;
        }
      }
      continue;
    }
    
    // CREATE TABLE public.*
    if (trimmed.startsWith('CREATE TABLE public.')) {
      captureMode = true;
      const match = trimmed.match(/CREATE TABLE public\.([\w]+)/);
      if (match) {
        console.log(`✅ 테이블 생성: ${match[1]}`);
      }
      cleanedLines.push(line);
      continue;
    }
    
    // CREATE TABLE이 끝났는지 확인 (세미콜론)
    if (captureMode && trimmed.endsWith(');')) {
      captureMode = false;
      cleanedLines.push(line);
      cleanedLines.push('');
      continue;
    }
    
    // CREATE INDEX, CREATE SEQUENCE 등 public 스키마만
    if ((trimmed.startsWith('CREATE INDEX') || 
         trimmed.startsWith('CREATE SEQUENCE') ||
         trimmed.startsWith('CREATE UNIQUE INDEX') ||
         trimmed.startsWith('ALTER TABLE public.') ||
         trimmed.startsWith('ALTER SEQUENCE public.')) && 
        trimmed.includes('public.')) {
      cleanedLines.push(line);
      continue;
    }
    
    // 테이블 생성 중이면 모든 라인 포함
    if (captureMode) {
      cleanedLines.push(line);
      continue;
    }
    
    // 주석 유지
    if (trimmed.startsWith('--') && 
        (trimmed.includes('public') || trimmed.includes('TABLE DATA'))) {
      cleanedLines.push(line);
      continue;
    }
  }
  
  // 시작 부분에 주석 추가
  const finalContent = `-- Supabase 복원용 SQL
-- 생성일: ${new Date().toISOString()}
-- 소스: ${backupFile}

-- public 스키마만 포함
-- auth, storage, realtime 스키마 제외

${cleanedLines.join('\n')}`;
  
  fs.writeFileSync(outputFile, finalContent, 'utf8');
  
  console.log('\n' + '='.repeat(70));
  console.log('✅ 최종 추출 완료!');
  console.log('='.repeat(70));
  console.log(`입력 파일: ${backupFile} (${(content.length / 1024).toFixed(2)} KB)`);
  console.log(`출력 파일: ${outputFile} (${(finalContent.length / 1024).toFixed(2)} KB)`);
  console.log('='.repeat(70));
  console.log('\n📋 다음 단계:');
  console.log('1. Supabase SQL Editor 열기:');
  console.log('   https://supabase.com/dashboard/project/pwbwnsbkqaqmwfpnixlo/sql/new');
  console.log('\n2. supabase-final.sql 파일을 열어서 전체 복사');
  console.log('\n3. SQL Editor에 붙여넣고 RUN 실행');
  console.log('\n✨ 이번 파일은 public 스키마의 핵심 데이터만 포함합니다!');
  
} catch (error) {
  console.error('❌ 오류 발생:', error.message);
  console.error(error.stack);
  process.exit(1);
}
