import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envVars = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseServiceKey: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      timestamp: new Date().toISOString()
    };

    console.log('🔍 서버 사이드 환경변수 확인:', {
      supabaseUrl: envVars.supabaseUrl ? '설정됨' : '설정되지 않음',
      supabaseKey: envVars.supabaseKey ? '설정됨' : '설정되지 않음',
      supabaseServiceKey: envVars.supabaseServiceKey ? '설정됨' : '설정되지 않음',
      nodeEnv: envVars.nodeEnv,
      vercelEnv: envVars.vercelEnv
    });

    return NextResponse.json(envVars);
  } catch (error) {
    console.error('❌ 환경변수 확인 중 오류:', error);
    return NextResponse.json(
      {
        error: '환경변수 확인 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
} 