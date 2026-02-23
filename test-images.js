const https = require('https');

console.log('🔍 이미지 URL 직접 테스트 중...\n');

const testUrls = [
  'https://pwbwnsbkqaqmwfpnixlo.supabase.co/storage/v1/object/public/products/headphones.png',
  'https://pwbwnsbkqaqmwfpnixlo.supabase.co/storage/v1/object/public/products/0.033328358567790595.png'
];

function testUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({
        url,
        status: res.statusCode,
        contentType: res.headers['content-type'],
        success: res.statusCode === 200
      });
    }).on('error', (err) => {
      resolve({
        url,
        error: err.message,
        success: false
      });
    });
  });
}

async function testImages() {
  console.log('=' .repeat(70));
  console.log('이미지 URL 접근성 테스트');
  console.log('=' .repeat(70));
  console.log('');
  
  for (const url of testUrls) {
    const result = await testUrl(url);
    
    if (result.success) {
      console.log(`✅ ${result.status} - ${result.contentType}`);
      console.log(`   ${url}`);
    } else if (result.error) {
      console.log(`❌ 오류: ${result.error}`);
      console.log(`   ${url}`);
    } else {
      console.log(`❌ ${result.status}`);
      console.log(`   ${url}`);
    }
    console.log('');
  }
  
  console.log('=' .repeat(70));
  console.log('💡 다음 사항을 확인하세요:');
  console.log('=' .repeat(70));
  console.log('');
  console.log('1. Supabase Storage 확인:');
  console.log('   https://supabase.com/dashboard/project/pwbwnsbkqaqmwfpnixlo/storage/buckets');
  console.log('');
  console.log('2. products 버킷이 존재하는지 확인');
  console.log('');
  console.log('3. 버킷이 Public으로 설정되었는지 확인');
  console.log('   (버킷 클릭 → 설정 아이콘 → Public bucket 체크)');
  console.log('');
  console.log('4. backupImg 폴더의 이미지 파일들이 업로드되었는지 확인');
  console.log('');
  console.log('5. 업로드된 파일명 확인:');
  console.log('   - headphones.png (있어야 함)');
  console.log('   - 0.033328358567790595.png (backupImg의 실제 파일)');
}

testImages();
