const { sql } = require('@vercel/postgres');
const fs = require('fs');
require('dotenv').config({ path: '.env.development.local' });

console.log('🔄 Vercel Postgres의 이미지 URL 업데이트 중...\n');

const OLD_SUPABASE_URL = 'https://jmstywcxcnytauawjbzy.supabase.co';
const NEW_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

async function updateImageUrls() {
  try {
    console.log(`이전 URL: ${OLD_SUPABASE_URL}`);
    console.log(`새 URL: ${NEW_SUPABASE_URL}\n`);
    
    // backupImg 폴더의 파일 목록
    const backupImgDir = './backupImg';
    const files = fs.readdirSync(backupImgDir);
    const imageFiles = files.filter(file => 
      file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
    ).sort();
    
    console.log(`📦 ${imageFiles.length}개의 이미지 파일 발견\n`);
    
    // products 테이블의 제품 가져오기
    const products = await sql`SELECT * FROM products ORDER BY id;`;
    
    console.log(`📦 ${products.rows.length}개의 제품 발견\n`);
    console.log('=' .repeat(70));
    console.log('업데이트 중...');
    console.log('=' .repeat(70));
    console.log('');
    
    // 각 제품에 새 이미지 URL 할당
    for (let i = 0; i < products.rows.length && i < imageFiles.length; i++) {
      const product = products.rows[i];
      const imageFile = imageFiles[i];
      const newImageUrl = `${NEW_SUPABASE_URL}/storage/v1/object/public/products/${imageFile}`;
      
      await sql`
        UPDATE products 
        SET image_url = ${newImageUrl}
        WHERE id = ${product.id};
      `;
      
      console.log(`✅ ${product.name}`);
      console.log(`   이전: ${product.image_url}`);
      console.log(`   이후: ${newImageUrl}`);
      console.log('');
    }
    
    console.log('=' .repeat(70));
    console.log('✅ 업데이트 완료!');
    console.log('=' .repeat(70));
    console.log('\n💡 다음 단계:');
    console.log('1. 브라우저에서 http://localhost:3001/products 접속');
    console.log('2. 이미지가 표시되는지 확인');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  }
}

updateImageUrls();
