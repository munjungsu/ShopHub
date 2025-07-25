'use server';

import { getAllTables, getTableData } from './db';
import { testDatabaseConnection } from './db-test';
import { 
  checkEnvironmentVariables, 
  testSupabaseConnection, 
  checkStorageBucket, 
  testFileUpload,
  listStorageImages,
  findImagesInAllBuckets,
  createStorageBucket
} from './debug-upload';
import { signIn } from '../../auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false, // 자동 리다이렉트 비활성화
    });
    // 성공 시 undefined 반환 (오류 없음)
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
export async function logAllTables() {
  try {
    console.log('🚀 서버 액션: 모든 테이블 조회 시작');
    
    const tables = await getAllTables();
    
    console.log('✅ 서버 액션: 모든 테이블 조회 완료');
    console.log('📊 조회된 테이블:', tables);
    
    return {
      success: true,
      tables: tables,
      message: '모든 테이블이 성공적으로 조회되었습니다.'
    };
  } catch (error) {
    console.error('❌ 서버 액션 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
}

export async function logTableData(tableName: string) {
  try {
    console.log(`🚀 서버 액션: ${tableName} 테이블 데이터 조회 시작`);
    
    const data = await getTableData(tableName);
    
    console.log(`✅ 서버 액션: ${tableName} 테이블 데이터 조회 완료`);
    
    return {
      success: true,
      tableName: tableName,
      data: data,
      message: `${tableName} 테이블 데이터가 성공적으로 조회되었습니다.`
    };
  } catch (error) {
    console.error(`❌ 서버 액션 오류 (${tableName}):`, error);
    return {
      success: false,
      tableName: tableName,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
}

export async function testConnection() {
  try {
    console.log('🔍 서버 액션: 데이터베이스 연결 테스트 시작');
    
    const result = await testDatabaseConnection();
    
    console.log('✅ 서버 액션: 데이터베이스 연결 테스트 완료');
    
    return result;
  } catch (error) {
    console.error('❌ 서버 액션: 데이터베이스 연결 테스트 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
}

// Supabase 디버깅 함수들
export async function debugSupabase() {
  try {
    console.log('🔍 서버 액션: Supabase 디버깅 시작');
    
    const results = {
      envCheck: checkEnvironmentVariables(),
      connection: await testSupabaseConnection(),
      storage: await checkStorageBucket(),
      upload: await testFileUpload()
    };
    
    console.log('✅ 서버 액션: Supabase 디버깅 완료');
    
    return {
      success: true,
      results,
      message: 'Supabase 디버깅이 완료되었습니다.'
    };
  } catch (error) {
    console.error('❌ 서버 액션: Supabase 디버깅 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
}

export async function checkSupabaseEnv() {
  return checkEnvironmentVariables();
}

export async function testSupabaseConn() {
  return await testSupabaseConnection();
}

export async function checkStorage() {
  return await checkStorageBucket();
}

export async function testUpload() {
  return await testFileUpload();
}

export async function listImages() {
  return await listStorageImages();
}

export async function findAllImages() {
  return await findImagesInAllBuckets();
}

export async function createBucket() {
  return await createStorageBucket();
} 