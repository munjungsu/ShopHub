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
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';

// 회원가입 스키마 정의
const SignupFormSchema = z.object({
  email: z.string().email({ message: '올바른 이메일 형식이 아닙니다.' }),
  password: z.string().min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword'],
});

export type SignupFormState = {
  errors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string;
  success?: boolean;
};

export async function register(
  prevState: SignupFormState | undefined,
  formData: FormData,
): Promise<SignupFormState> {
  // 1. 폼 데이터 검증
  const validatedFields = SignupFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  // 검증 실패 시
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '입력한 정보를 확인해주세요.',
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // 2. 이메일 중복 확인
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.rows.length > 0) {
      return {
        message: '이미 등록된 이메일입니다.',
      };
    }

    // 3. 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. 사용자 데이터베이스에 저장
    const result = await sql`
      INSERT INTO users (email, password, name)
      VALUES (${email}, ${hashedPassword}, ${email.split('@')[0]})
      RETURNING id, email, name
    `;

    console.log('✅ 회원가입 성공:', result.rows[0]);

    // 5. 회원가입 성공 후 자동 로그인
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
      message: '회원가입이 성공했습니다.',
    };

  } catch (error) {
    console.error('❌ 회원가입 오류:', error);
    return {
      message: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const result = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });

    if (result?.error) {
      return 'Invalid credentials.';
    }

    return 'success';
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