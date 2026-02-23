import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

// 환경변수 검증
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
  console.error('SUPABASE_URL:', supabaseUrl ? '설정됨' : '설정되지 않음');
  console.error('SUPABASE_KEY:', supabaseAnonKey ? '설정됨' : '설정되지 않음');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '설정됨' : '설정되지 않음');
  console.error('📝 .env.local 파일에 Supabase 환경변수를 설정해주세요.');
}

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

// 이미지 업로드 함수
export async function uploadImage(file: File, bucketName: string = 'images') {
  try {
    // 서비스 롤 키가 있으면 사용, 없으면 일반 키 사용
    const client = supabaseAdmin || supabase;
    
    // 파일 확장자 확인
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Supabase Storage에 파일 업로드
    const { error } = await client.storage
      .from(bucketName)
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    // 업로드된 파일의 공개 URL 생성
    const { data: { publicUrl } } = client.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
      path: filePath,
      fileName: fileName
    };

  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
}

// 이미지 삭제 함수
export async function deleteImage(filePath: string, bucketName: string = 'images') {
  try {
    // 서비스 롤 키가 있으면 사용, 없으면 일반 키 사용
    const client = supabaseAdmin || supabase;
    
    const { error } = await client.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: '이미지가 성공적으로 삭제되었습니다.'
    };

  } catch (error) {
    console.error('이미지 삭제 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
} 