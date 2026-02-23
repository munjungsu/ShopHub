const { sql } = require('@vercel/postgres');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.development.local' });

console.log('🔐 테스트 사용자 비밀번호 업데이트 중...\n');

async function updateTestUser() {
  try {
    const email = 'user@nextmail.com';
    const plainPassword = '123456'; // 테스트용 간단한 비밀번호
    
    // bcrypt로 비밀번호 해시
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    console.log('이메일:', email);
    console.log('비밀번호:', plainPassword);
    console.log('해시된 비밀번호:', hashedPassword);
    console.log('');
    
    // 사용자 업데이트
    await sql`
      UPDATE users 
      SET password = ${hashedPassword}
      WHERE email = ${email};
    `;
    
    console.log('✅ 비밀번호 업데이트 완료!');
    console.log('');
    console.log('💡 로그인 테스트:');
    console.log('   이메일: user@nextmail.com');
    console.log('   비밀번호: 123456');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  }
}

updateTestUser();
