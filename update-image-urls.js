const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.development.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔄 데이터베이스의 이미지 URL 업데이트 중...\n');

async function updateImageUrls() {
  try {
    // backupImg 폴더의 파일 목록
    const backupImgDir = './backupImg';
    const files = fs.readdirSync(backupImgDir);
    const imageFiles = files.filter(file => 
      file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
    ).sort();
    
    console.log(`📦 ${imageFiles.length}개의 이미지 파일 발견\n`);
    
    // products 테이블의 제품 가져오기
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('❌ 제품 조회 실패:', error.message);
      return;
    }
    
    console.log(`📦 ${products.length}개의 제품 발견\n`);
    console.log('=' .repeat(70));
    console.log('업데이트 중...');
    console.log('=' .repeat(70));
    console.log('');
    
    // 각 제품에 이미지 할당
    for (let i = 0; i < products.length && i < imageFiles.length; i++) {
      const product = products[i];
      const imageFile = imageFiles[i];
      const newImageUrl = `${supabaseUrl}/storage/v1/object/public/products/${imageFile}`;
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: newImageUrl })
        .eq('id', product.id);
      
      if (updateError) {
        console.log(`❌ ${product.name} 업데이트 실패:`, updateError.message);
      } else {
        console.log(`✅ ${product.name}`);
        console.log(`   이전: ${product.image_url}`);
        console.log(`   이후: ${newImageUrl}`);
        console.log('');
      }
    }
    
    console.log('=' .repeat(70));
    console.log('✅ 업데이트 완료!');
    console.log('=' .repeat(70));
    console.log('\n💡 다음 단계:');
    console.log('1. 브라우저 새로고침 (F5)');
    console.log('2. 이미지가 표시되는지 확인');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  }
}

updateImageUrls();
