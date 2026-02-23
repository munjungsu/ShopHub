import { sql } from '@vercel/postgres';

export async function getAllTables() {
  try {
    // PostgreSQL에서 모든 테이블 정보를 가져오는 쿼리
    const result = await sql`
      SELECT 
        table_name,
        table_schema
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log('=== 모든 테이블 목록 ===');
    console.log('총 테이블 수:', result.rows.length);
    
    for (const table of result.rows) {
      console.log(`테이블: ${table.table_name} (스키마: ${table.table_schema})`);
      
      // 각 테이블의 컬럼 정보도 가져오기
      const columnsResult = await sql`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns 
        WHERE table_name = ${table.table_name}
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `;
      
      console.log(`  컬럼 정보:`);
      columnsResult.rows.forEach(column => {
        console.log(`    - ${column.column_name}: ${column.data_type} (nullable: ${column.is_nullable})`);
      });
      
      // 각 테이블의 데이터 수도 확인 (동적 쿼리 대신 조건부 처리)
      try {
        let countResult;
        switch (table.table_name) {
          case 'customers':
            countResult = await sql`SELECT COUNT(*) as count FROM customers;`;
            break;
          case 'users':
            countResult = await sql`SELECT COUNT(*) as count FROM users;`;
            break;
          case 'products':
            countResult = await sql`SELECT COUNT(*) as count FROM products;`;
            break;
          case 'orders':
            countResult = await sql`SELECT COUNT(*) as count FROM orders;`;
            break;
          default:
            console.log(`  데이터 수: 알 수 없는 테이블 (${table.table_name})`);
            continue;
        }
        console.log(`  데이터 수: ${countResult.rows[0].count}개`);
      } catch (countError) {
        console.log(`  데이터 수 조회 실패: ${countError}`);
      }
      
      console.log('---');
    }
    
    return result.rows;
  } catch (error) {
    console.error('데이터베이스 테이블 조회 중 오류:', error);
    throw error;
  }
}

export async function getTableData(tableName: string) {
  try {
    let result;
    
    // 테이블 이름에 따라 안전한 쿼리 실행
    switch (tableName.toLowerCase()) {
      case 'customers':
        result = await sql`SELECT * FROM customers LIMIT 10;`;
        break;
      case 'users':
        result = await sql`SELECT * FROM users LIMIT 10;`;
        break;
      case 'products':
        result = await sql`SELECT * FROM products LIMIT 10;`;
        break;
      case 'orders':
        result = await sql`SELECT * FROM orders LIMIT 10;`;
        break;
      default:
        throw new Error(`알 수 없는 테이블: ${tableName}`);
    }
    
    console.log(`=== ${tableName} 테이블 데이터 (최대 10개) ===`);
    console.log(result.rows);
    return result.rows;
  } catch (error) {
    console.error(`${tableName} 테이블 데이터 조회 중 오류:`, error);
    throw error;
  }
} 