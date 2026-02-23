const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.development.local' });

console.log('🔍 Vercel Postgres 데이터베이스 확인 중...\n');

async function checkDatabase() {
  try {
    // 1. 테이블 목록 확인
    console.log('=' .repeat(70));
    console.log('1️⃣ 테이블 목록');
    console.log('=' .repeat(70));
    
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log(`✅ ${tables.rows.length}개의 테이블 발견:\n`);
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    console.log('');
    
    // 2. users 테이블 확인
    console.log('=' .repeat(70));
    console.log('2️⃣ users 테이블 확인');
    console.log('=' .repeat(70));
    
    try {
      const users = await sql`SELECT * FROM users LIMIT 5;`;
      console.log(`✅ ${users.rows.length}개의 사용자 발견:\n`);
      users.rows.forEach(user => {
        console.log(`   이름: ${user.name}`);
        console.log(`   이메일: ${user.email}`);
        console.log(`   ID: ${user.id}`);
        console.log('');
      });
    } catch (error) {
      console.log('❌ users 테이블이 없습니다!');
      console.log('   테이블을 생성해야 합니다.\n');
    }
    
    // 3. products 테이블 확인
    console.log('=' .repeat(70));
    console.log('3️⃣ products 테이블 확인');
    console.log('=' .repeat(70));
    
    try {
      const products = await sql`SELECT * FROM products LIMIT 5;`;
      console.log(`✅ ${products.rows.length}개의 제품 발견:\n`);
      products.rows.forEach(product => {
        console.log(`   제품: ${product.name}`);
        console.log(`   가격: ${product.price}`);
        console.log(`   이미지: ${product.image_url}`);
        console.log('');
      });
    } catch (error) {
      console.log('❌ products 테이블이 없습니다!');
      console.log('   테이블을 생성해야 합니다.\n');
    }
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  }
}

checkDatabase();
