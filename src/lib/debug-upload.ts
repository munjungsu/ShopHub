import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder_key'
);

// 서비스 롤 키를 사용하는 클라이언트 (RLS 우회)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl!, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// 환경변수 확인 함수
export function checkEnvironmentVariables() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('🔍 환경변수 확인:');
  console.log('SUPABASE_URL:', supabaseUrl ? '설정됨' : '설정되지 않음');
  console.log('SUPABASE_KEY:', supabaseKey ? '설정됨' : '설정되지 않음');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '설정됨' : '설정되지 않음');
  
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('SUPABASE_URL');
  if (!supabaseKey) missingVars.push('SUPABASE_KEY');
  
  if (missingVars.length > 0) {
    return {
      success: false,
      error: 'Supabase 환경변수가 설정되지 않았습니다.',
      message: `다음 환경변수가 누락되었습니다: ${missingVars.join(', ')}`,
      details: {
        supabaseUrl: supabaseUrl ? '설정됨' : '설정되지 않음',
        supabaseKey: supabaseKey ? '설정됨' : '설정되지 않음',
        supabaseServiceKey: supabaseServiceKey ? '설정됨' : '설정되지 않음'
      },
      missingVariables: missingVars
    };
  }
  
  return {
    success: true,
    message: '환경변수가 정상적으로 설정되었습니다.',
    details: {
      supabaseUrl: '설정됨',
      supabaseKey: '설정됨',
      supabaseServiceKey: supabaseServiceKey ? '설정됨' : '설정되지 않음'
    },
    hasServiceKey: !!supabaseServiceKey
  };
}

// Supabase 연결 테스트
export async function testSupabaseConnection() {
  try {
    console.log('🔍 Supabase 연결 테스트 시작...');
    console.log('📋 환경변수 상태:');
    console.log('- SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '설정됨' : '설정되지 않음');
    console.log('- SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '설정됨' : '설정되지 않음');
    console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ? '설정됨' : '설정되지 않음');
    
    // 1. 기본 연결 테스트
    console.log('🔗 기본 연결 테스트 중...');
    const { data, error } = await supabase.from('_dummy_table_').select('*').limit(1);
    
    console.log('📊 연결 테스트 결과:', { data, error });
    
    if (error) {
      console.log('❌ 연결 오류 발생:', error);
      
      // 오류 코드별 상세 분석
      if (error.code === 'PGRST116') {
        // 테이블이 존재하지 않는 것은 정상 (연결은 성공)
        console.log('✅ Supabase 연결 성공 (테이블이 존재하지 않는 것은 정상)');
        return {
          success: true,
          message: 'Supabase 연결이 정상입니다.',
          details: '테이블이 존재하지 않는 것은 정상적인 응답입니다.'
        };
      } else if (error.code === 'PGRST301') {
        return {
          success: false,
          error: '인증 실패 - API 키를 확인해주세요.',
          details: error.message,
          code: error.code
        };
      } else if (error.code === 'PGRST302') {
        return {
          success: false,
          error: '권한 없음 - RLS 정책을 확인해주세요.',
          details: error.message,
          code: error.code
        };
      } else if (error.message.includes('fetch')) {
        return {
          success: false,
          error: '네트워크 오류 - URL을 확인해주세요.',
          details: error.message,
          code: error.code
        };
      } else {
        return {
          success: false,
          error: `연결 오류: ${error.message}`,
          details: error.message,
          code: error.code
        };
      }
    }
    
    return {
      success: true,
      message: 'Supabase 연결이 정상입니다.',
      details: '테이블 조회가 성공했습니다.'
    };
    
  } catch (error) {
    console.error('❌ Supabase 연결 테스트 중 예외 발생:', error);
    
    // 예외 타입별 분석
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: '네트워크 오류 - URL이 올바른지 확인해주세요.',
        details: error.message,
        type: 'NetworkError'
      };
    } else if (error instanceof Error) {
      return {
        success: false,
        error: `연결 오류: ${error.message}`,
        details: error.message,
        type: 'Error'
      };
    } else {
      return {
        success: false,
        error: '알 수 없는 오류가 발생했습니다.',
        details: String(error),
        type: 'Unknown'
      };
    }
  }
}

// Storage 버킷 생성 (서비스 롤 키 사용)
export async function createStorageBucket(bucketName: string = 'images') {
  try {
    console.log(`🔧 Storage 버킷 생성: ${bucketName}`);
    
    // 서비스 롤 키가 있으면 사용, 없으면 일반 키 사용
    const client = supabaseAdmin || supabase;
    
    const { data, error } = await client.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 52428800 // 50MB
    });
    
    if (error) {
      // 이미 존재하는 경우
      if (error.message.includes('already exists')) {
        console.log(`✅ ${bucketName} 버킷이 이미 존재합니다.`);
        return {
          success: true,
          message: `${bucketName} 버킷이 이미 존재합니다.`,
          bucketExists: true
        };
      }
      throw error;
    }
    
    console.log(`✅ ${bucketName} 버킷 생성 성공:`, data);
    
    return {
      success: true,
      message: `${bucketName} 버킷이 성공적으로 생성되었습니다.`,
      bucketExists: true,
      data
    };
    
  } catch (error) {
    console.error(`❌ Storage 버킷 생성 실패:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
}

// Storage 버킷 확인
export async function checkStorageBucket(bucketName: string = 'images') {
  try {
    console.log(`🔍 Storage 버킷 확인: ${bucketName}`);
    
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      throw error;
    }
    
    const bucketExists = data.some(bucket => bucket.name === bucketName);
    
    console.log('📋 사용 가능한 버킷:', data.map(b => b.name));
    console.log(`${bucketName} 버킷 존재:`, bucketExists);
    
    return {
      success: true,
      bucketExists,
      availableBuckets: data.map(b => b.name),
      message: bucketExists 
        ? `${bucketName} 버킷이 존재합니다.`
        : `${bucketName} 버킷이 존재하지 않습니다.`
    };
    
  } catch (error) {
    console.error('❌ Storage 버킷 확인 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
}

// 모든 Storage 버킷에서 이미지 찾기
export async function findImagesInAllBuckets() {
  try {
    console.log('🔍 모든 Storage 버킷에서 이미지 검색...');
    
    // 1. 모든 버킷 목록 가져오기
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      throw bucketsError;
    }
    
    console.log('📋 사용 가능한 버킷:', buckets.map(b => b.name));
    
    if (buckets.length === 0) {
      return {
        success: true,
        totalBuckets: 0,
        availableBuckets: [],
        totalImages: 0,
        images: [],
        message: 'Storage 버킷이 존재하지 않습니다. 먼저 버킷을 생성해주세요.'
      };
    }
    
    const allImages = [];
    
    // 2. 각 버킷에서 이미지 검색
    for (const bucket of buckets) {
      try {
        console.log(`🔍 ${bucket.name} 버킷에서 이미지 검색 중...`);
        
        const { data: files, error: filesError } = await supabase.storage
          .from(bucket.name)
          .list('', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' }
          });
        
        if (filesError) {
          console.log(`⚠️ ${bucket.name} 버킷 접근 오류:`, filesError);
          continue;
        }
        
        // 이미지 파일만 필터링
        const imageFiles = files.filter(file => {
          const ext = file.name.toLowerCase().split('.').pop();
          return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
        });
        
        // 각 이미지의 공개 URL 생성
        const imagesWithUrls = imageFiles.map(file => {
          const { data: { publicUrl } } = supabase.storage
            .from(bucket.name)
            .getPublicUrl(file.name);
          
          return {
            bucketName: bucket.name,
            name: file.name,
            size: file.metadata?.size || 0,
            lastModified: file.updated_at,
            url: publicUrl,
            path: file.name
          };
        });
        
        allImages.push(...imagesWithUrls);
        console.log(`✅ ${bucket.name} 버킷에서 ${imagesWithUrls.length}개 이미지 발견`);
        
      } catch (bucketError) {
        console.log(`❌ ${bucket.name} 버킷 처리 오류:`, bucketError);
      }
    }
    
    console.log(`🖼️ 총 ${allImages.length}개의 이미지 발견`);
    
    return {
      success: true,
      totalBuckets: buckets.length,
      availableBuckets: buckets.map(b => b.name),
      totalImages: allImages.length,
      images: allImages,
      message: `${buckets.length}개 버킷에서 총 ${allImages.length}개의 이미지를 찾았습니다.`
    };
    
  } catch (error) {
    console.error('❌ 모든 버킷에서 이미지 검색 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
}

// Storage에서 이미지 목록 조회 (특정 버킷)
export async function listStorageImages(bucketName: string = 'images') {
  try {
    console.log(`🔍 Storage 이미지 목록 조회: ${bucketName}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });
    
    if (error) {
      throw error;
    }
    
    console.log(`📋 ${bucketName} 버킷의 파일 목록:`, data);
    
    // 이미지 파일만 필터링 (확장자 기준)
    const imageFiles = data.filter(file => {
      const ext = file.name.toLowerCase().split('.').pop();
      return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
    });
    
    // 각 이미지의 공개 URL 생성
    const imagesWithUrls = imageFiles.map(file => {
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(file.name);
      
      return {
        name: file.name,
        size: file.metadata?.size || 0,
        lastModified: file.updated_at,
        url: publicUrl,
        path: file.name
      };
    });
    
    console.log(`🖼️ 이미지 파일 ${imagesWithUrls.length}개 발견`);
    
    return {
      success: true,
      bucketName,
      totalFiles: data.length,
      imageFiles: imagesWithUrls.length,
      images: imagesWithUrls,
      message: `${bucketName} 버킷에서 ${imagesWithUrls.length}개의 이미지를 찾았습니다.`
    };
    
  } catch (error) {
    console.error('❌ Storage 이미지 목록 조회 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
}

// 간단한 파일 업로드 테스트
export async function testFileUpload() {
  try {
    console.log('🔍 파일 업로드 테스트 시작...');
    
    // 먼저 사용 가능한 버킷 확인
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      throw bucketsError;
    }
    
    // 첫 번째 버킷 사용 (또는 'images' 버킷이 있으면 사용)
    const targetBucket = buckets.find(b => b.name === 'images') || buckets[0];
    
    if (!targetBucket) {
      throw new Error('사용 가능한 버킷이 없습니다.');
    }
    
    console.log(`📤 ${targetBucket.name} 버킷에 테스트 파일 업로드...`);
    
    // 간단한 텍스트 파일 생성
    const testContent = 'This is a test file for upload testing.';
    const testFile = new File([testContent], 'test.txt', { type: 'text/plain' });
    
    const { data, error } = await supabase.storage
      .from(targetBucket.name)
      .upload(`test-${Date.now()}.txt`, testFile);
    
    if (error) {
      throw error;
    }
    
    console.log('✅ 파일 업로드 테스트 성공:', data);
    
    // 업로드된 파일 삭제
    await supabase.storage
      .from(targetBucket.name)
      .remove([data.path]);
    
    console.log('🗑️ 테스트 파일 삭제 완료');
    
    return {
      success: true,
      message: `파일 업로드 테스트가 성공했습니다. (${targetBucket.name} 버킷 사용)`,
      data
    };
    
  } catch (error) {
    console.error('❌ 파일 업로드 테스트 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
}

// Supabase Storage 연결 테스트
export async function testStorageConnection() {
  try {
    console.log('🔍 Supabase Storage 연결 테스트 시작...');
    
    // 1. Storage 버킷 목록 조회 테스트
    console.log('📦 Storage 버킷 목록 조회 중...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    console.log('📊 Storage 테스트 결과:', { buckets, bucketsError });
    
    if (bucketsError) {
      console.log('❌ Storage 연결 오류:', bucketsError);
      
      if (bucketsError.message.includes('JWT')) {
        return {
          success: false,
          error: 'Storage 인증 실패 - API 키를 확인해주세요.',
          details: bucketsError.message,
          code: (bucketsError as any).statusCode
        };
      } else if (bucketsError.message.includes('fetch')) {
        return {
          success: false,
          error: 'Storage 네트워크 오류 - URL을 확인해주세요.',
          details: bucketsError.message,
          code: (bucketsError as any).statusCode
        };
      } else {
        return {
          success: false,
          error: `Storage 연결 오류: ${bucketsError.message}`,
          details: bucketsError.message,
          code: (bucketsError as any).statusCode
        };
      }
    }
    
    console.log('✅ Storage 연결 성공');
    console.log('📋 사용 가능한 버킷:', buckets?.map(b => b.name) || []);
    
    return {
      success: true,
      message: 'Supabase Storage 연결이 정상입니다.',
      details: `${buckets?.length || 0}개의 버킷이 있습니다.`,
      buckets: buckets?.map(b => b.name) || []
    };
    
  } catch (error) {
    console.error('❌ Storage 연결 테스트 중 예외 발생:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Storage 네트워크 오류 - URL이 올바른지 확인해주세요.',
        details: error.message,
        type: 'NetworkError'
      };
    } else if (error instanceof Error) {
      return {
        success: false,
        error: `Storage 연결 오류: ${error.message}`,
        details: error.message,
        type: 'Error'
      };
    } else {
      return {
        success: false,
        error: 'Storage 알 수 없는 오류가 발생했습니다.',
        details: String(error),
        type: 'Unknown'
      };
    }
  }
} 