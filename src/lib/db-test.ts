import { sql } from '@vercel/postgres';

export async function testDatabaseConnection() {
  try {
    console.log('🔍 데이터베이스 연결 테스트 시작...');
    
    // 1. 기본 연결 테스트
    const connectionTest = await sql`SELECT 1 as test;`;
    console.log('✅ 기본 연결 성공:', connectionTest.rows[0]);
    
    // 2. 현재 데이터베이스 정보 확인
    const dbInfo = await sql`SELECT current_database() as db_name, current_user as user;`;
    console.log('📊 데이터베이스 정보:', dbInfo.rows[0]);
    
    // 3. 모든 스키마 확인
    const schemas = await sql`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY schema_name;
    `;
    console.log('📋 사용 가능한 스키마:', schemas.rows);
    
    // 4. public 스키마의 모든 테이블 확인
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    console.log('📋 public 스키마의 테이블:', tables.rows);
    
    // 5. 각 테이블의 컬럼 정보 확인
    for (const table of tables.rows) {
      const columns = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = ${table.table_name}
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `;
      console.log(`📋 ${table.table_name} 테이블 컬럼:`, columns.rows);
    }
    
    return {
      success: true,
      message: '데이터베이스 연결 테스트 성공',
      dbInfo: dbInfo.rows[0],
      schemas: schemas.rows,
      tables: tables.rows
    };
    
  } catch (error) {
    console.error('❌ 데이터베이스 연결 테스트 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
} 