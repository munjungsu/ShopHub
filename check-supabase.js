const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.development.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Supabase 연결 및 데이터 확인 중...\n');

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabase() {
  try {
    console.log('=' .repeat(70));
    console.log('1️⃣ Storage 버킷 확인');
    console.log('=' .repeat(70));
    
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.log('❌ 버킷 조회 실패:', bucketsError.message);
    } else {
      console.log(`✅ 총 ${buckets.length}개의 버킷 발견:`);
      buckets.forEach(bucket => {
        console.log(`   - ${bucket.name} (public: ${bucket.public})`);
      });
      
      // products 버킷 확인
      const productsBucket = buckets.find(b => b.name === 'products');
      if (productsBucket) {
        console.log('\n✅ products 버킷 존재');
        console.log(`   Public: ${productsBucket.public}`);
        
        // 버킷 내 파일 확인
        const { data: files, error: filesError } = await supabase.storage
          .from('products')
          .list();
        
        if (filesError) {
          console.log('❌ 파일 목록 조회 실패:', filesError.message);
        } else {
          console.log(`✅ products 버킷에 ${files.length}개 파일:`);
          files.slice(0, 5).forEach(file => {
            console.log(`   - ${file.name}`);
          });
          
          if (files.length > 5) {
            console.log(`   ... 외 ${files.length - 5}개`);
          }
          
          // 샘플 이미지 URL 생성
          if (files.length > 0) {
            const { data } = supabase.storage
              .from('products')
              .getPublicUrl(files[0].name);
            
            console.log('\n📷 샘플 이미지 URL:');
            console.log(`   ${data.publicUrl}`);
          }
        }
      } else {
        console.log('\n❌ products 버킷이 없습니다!');
        console.log('   Supabase Dashboard에서 버킷을 생성하세요.');
      }
    }
    
    console.log('\n' + '=' .repeat(70));
    console.log('2️⃣ products 테이블 확인');
    console.log('=' .repeat(70));
    
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, image_url')
      .limit(5);
    
    if (productsError) {
      console.log('❌ products 테이블 조회 실패:', productsError.message);
      console.log('\n💡 해결 방법:');
      console.log('   1. Supabase SQL Editor에서 init-database.sql 실행');
      console.log('   2. products 테이블이 생성되었는지 확인');
    } else if (!products || products.length === 0) {
      console.log('⚠️  products 테이블이 비어있습니다.');
      console.log('\n💡 해결 방법:');
      console.log('   init-database.sql을 실행하여 샘플 데이터를 추가하세요.');
    } else {
      console.log(`✅ ${products.length}개의 제품 발견:`);
      products.forEach(product => {
        console.log(`\n   제품: ${product.name}`);
        console.log(`   ID: ${product.id}`);
        console.log(`   이미지 URL: ${product.image_url || '❌ 없음'}`);
      });
    }
    
    console.log('\n' + '=' .repeat(70));
    console.log('3️⃣ 진단 요약');
    console.log('=' .repeat(70));
    
    const issues = [];
    
    if (!productsBucket) {
      issues.push('❌ products 버킷이 없습니다');
    } else if (!productsBucket.public) {
      issues.push('❌ products 버킷이 Public이 아닙니다');
    }
    
    if (productsError) {
      issues.push('❌ products 테이블이 없거나 접근 불가');
    } else if (!products || products.length === 0) {
      issues.push('⚠️  products 테이블이 비어있습니다');
    } else {
      const noImageProducts = products.filter(p => !p.image_url);
      if (noImageProducts.length > 0) {
        issues.push(`⚠️  ${noImageProducts.length}개 제품에 이미지 URL이 없습니다`);
      }
      
      const wrongUrlProducts = products.filter(p => 
        p.image_url && !p.image_url.includes(supabaseUrl)
      );
      if (wrongUrlProducts.length > 0) {
        issues.push(`⚠️  ${wrongUrlProducts.length}개 제품의 이미지 URL이 잘못되었습니다`);
      }
    }
    
    if (issues.length === 0) {
      console.log('✅ 모든 항목이 정상입니다!');
      console.log('\n💡 이미지가 여전히 안 보인다면:');
      console.log('   1. 브라우저 캐시 삭제 (Ctrl+Shift+Delete)');
      console.log('   2. 개발 서버 재시작 (Ctrl+C 후 pnpm dev)');
      console.log('   3. 브라우저 개발자 도구(F12) → Console 탭에서 오류 확인');
    } else {
      console.log('⚠️  발견된 문제:');
      issues.forEach(issue => console.log(`   ${issue}`));
    }
    
  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
  }
}

checkSupabase();
