const fs = require('fs');

console.log('🔍 Supabase 환경 변수 확인 중...\n');

const envContent = fs.readFileSync('.env.development.local', 'utf8');

const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const anonKey = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();
const serviceKey = envContent.match(/NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim();

console.log('📋 현재 설정:');
console.log('=' .repeat(70));
console.log(`URL: ${supabaseUrl}`);
console.log(`ANON_KEY: ${anonKey?.substring(0, 50)}...`);
console.log(`SERVICE_KEY: ${serviceKey?.substring(0, 50)}...`);
console.log('=' .repeat(70));
console.log('');

// URL에서 프로젝트 ID 추출
const urlProjectId = supabaseUrl?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
console.log(`📍 URL의 프로젝트 ID: ${urlProjectId}`);

// JWT에서 프로젝트 ID 추출 (ANON_KEY)
try {
  const anonPayload = JSON.parse(Buffer.from(anonKey.split('.')[1], 'base64').toString());
  console.log(`📍 ANON_KEY의 프로젝트 ID: ${anonPayload.ref}`);
  
  if (urlProjectId !== anonPayload.ref) {
    console.log('\n❌ 오류: URL과 ANON_KEY의 프로젝트 ID가 일치하지 않습니다!');
    console.log('=' .repeat(70));
    console.log('\n🔧 해결 방법:');
    console.log(`1. https://supabase.com/dashboard/project/${urlProjectId}/settings/api`);
    console.log('2. 올바른 anon 및 service_role 키를 복사');
    console.log('3. .env.development.local 파일에 업데이트');
    console.log('\n❗ 중요: anon 키의 ref 값이 URL의 프로젝트 ID와 같아야 합니다!');
    console.log(`   예상: ${urlProjectId}`);
    console.log(`   실제: ${anonPayload.ref}`);
    console.log('=' .repeat(70));
  } else {
    console.log('\n✅ URL과 ANON_KEY가 일치합니다!');
  }
} catch (error) {
  console.log('\n⚠️  ANON_KEY 파싱 실패:', error.message);
}

// JWT에서 프로젝트 ID 추출 (SERVICE_KEY)
try {
  const servicePayload = JSON.parse(Buffer.from(serviceKey.split('.')[1], 'base64').toString());
  console.log(`📍 SERVICE_KEY의 프로젝트 ID: ${servicePayload.ref}`);
  
  if (urlProjectId !== servicePayload.ref) {
    console.log('\n❌ 오류: URL과 SERVICE_KEY의 프로젝트 ID가 일치하지 않습니다!');
  } else {
    console.log('✅ URL과 SERVICE_KEY가 일치합니다!');
  }
} catch (error) {
  console.log('\n⚠️  SERVICE_KEY 파싱 실패:', error.message);
}

console.log('\n💡 다음 단계:');
console.log('1. 위의 URL로 이동하여 올바른 API 키 복사');
console.log('2. .env.development.local 파일 업데이트');
console.log('3. 개발 서버 재시작: pnpm dev');
