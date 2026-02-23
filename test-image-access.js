const https = require('https');

const imageUrl = 'https://pwbwnsbkqaqmwfpnixlo.supabase.co/storage/v1/object/public/products/0.033328358567790595.png';

console.log('🔍 이미지 URL 접근 테스트...\n');
console.log('URL:', imageUrl);
console.log('');

https.get(imageUrl, (res) => {
  console.log('상태 코드:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  console.log('');
  
  if (res.statusCode === 200) {
    console.log('✅ 이미지 접근 성공!');
    console.log('   이미지가 정상적으로 표시되어야 합니다.');
  } else if (res.statusCode === 400) {
    console.log('❌ 버킷을 찾을 수 없습니다 (400 Bad Request)');
    console.log('');
    console.log('해결 방법:');
    console.log('1. Supabase Dashboard → Storage로 이동');
    console.log('2. "products" 버킷이 존재하는지 확인');
    console.log('3. 버킷이 없다면 새로 생성');
    console.log('4. 버킷 설정에서 "Public bucket" 옵션 활성화');
  } else if (res.statusCode === 404) {
    console.log('❌ 파일을 찾을 수 없습니다 (404 Not Found)');
    console.log('');
    console.log('해결 방법:');
    console.log('1. Supabase Dashboard → Storage → products 버킷으로 이동');
    console.log('2. 파일이 업로드되어 있는지 확인');
    console.log('3. 파일명이 일치하는지 확인');
  } else {
    console.log(`❌ 예상치 못한 상태: ${res.statusCode}`);
  }
}).on('error', (err) => {
  console.error('❌ 요청 실패:', err.message);
});
