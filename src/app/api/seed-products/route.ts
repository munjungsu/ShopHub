import { NextResponse } from 'next/server';
import { insertSampleProducts } from '@/lib/db';

export async function POST() {
  try {
    await insertSampleProducts();
    return NextResponse.json({ 
      success: true, 
      message: '샘플 제품 데이터가 성공적으로 삽입되었습니다.' 
    });
  } catch (error) {
    console.error('샘플 데이터 삽입 실패:', error);
    return NextResponse.json({ 
      success: false, 
      error: '샘플 데이터 삽입 중 오류가 발생했습니다.' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: '샘플 데이터를 삽입하려면 POST 요청을 사용하세요.' 
  });
}
