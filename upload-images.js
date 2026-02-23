const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.development.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function uploadImages() {
  try {
    console.log('🖼️  Supabase Storage에 이미지 업로드 시작...\n');
    
    const backupImgDir = './backupImg';
    const bucketName = 'products';
    
    // backupImg 폴더의 모든 파일 목록 가져오기
    const files = fs.readdirSync(backupImgDir);
    const imageFiles = files.filter(file => 
      file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
    );
    
    console.log(`📦 ${imageFiles.length}개의 이미지 파일을 발견했습니다.\n`);
    
    // products 버킷이 있는지 확인
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ 버킷 목록 조회 실패:', bucketsError.message);
      process.exit(1);
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log('❌ products 버킷이 존재하지 않습니다.');
      console.log('\n📝 다음 단계를 따라 버킷을 생성해주세요:');
      console.log('=' .repeat(70));
      console.log('\n1. Supabase Dashboard 열기:');
      console.log(`   https://supabase.com/dashboard/project/pwbwnsbkqaqmwfpnixlo/storage/buckets`);
      console.log('\n2. "New bucket" 버튼 클릭');
      console.log('\n3. 버킷 정보 입력:');
      console.log('   - Name: products');
      console.log('   - Public bucket: ✅ 체크 (중요!)');
      console.log('   - File size limit: 5MB');
      console.log('\n4. "Create bucket" 클릭');
      console.log('\n5. 버킷 생성 후 이 스크립트를 다시 실행:');
      console.log('   node upload-images.js');
      console.log('\n' + '=' .repeat(70));
      process.exit(1);
    } else {
      console.log('✅ products 버킷이 이미 존재합니다.\n');
    }
    
    // 각 이미지 파일 업로드
    let successCount = 0;
    let errorCount = 0;
    
    console.log('🚀 이미지 업로드 시작...\n');
    
    for (let i = 0; i < imageFiles.length; i++) {
      const fileName = imageFiles[i];
      const filePath = path.join(backupImgDir, fileName);
      const fileBuffer = fs.readFileSync(filePath);
      
      try {
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, fileBuffer, {
            contentType: 'image/png',
            upsert: true // 기존 파일이 있으면 덮어쓰기
          });
        
        if (error) {
          throw error;
        }
        
        successCount++;
        console.log(`   ✅ [${i + 1}/${imageFiles.length}] ${fileName}`);
        
        // 업로드된 이미지의 Public URL 표시
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName);
        
        if (i === 0) {
          console.log(`      → ${publicUrl}\n`);
        }
        
      } catch (error) {
        errorCount++;
        console.log(`   ❌ [${i + 1}/${imageFiles.length}] ${fileName}`);
        console.log(`      오류: ${error.message}\n`);
      }
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ 이미지 업로드 완료!');
    console.log(`   성공: ${successCount}개`);
    console.log(`   실패: ${errorCount}개`);
    console.log('='.repeat(70));
    
    if (successCount > 0) {
      console.log('\n📍 업로드된 이미지 URL 형식:');
      console.log(`   ${supabaseUrl}/storage/v1/object/public/products/파일명.png`);
      console.log('\n💡 데이터베이스의 image_url 컬럼을 이 형식으로 업데이트해야 합니다!');
    }
    
  } catch (error) {
    console.error('\n❌ 업로드 중 오류 발생:', error.message);
    process.exit(1);
  }
}

uploadImages();
