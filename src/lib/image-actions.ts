'use server';

import { sql } from '@vercel/postgres';
import { uploadImage, deleteImage } from './supabase';

// 이미지 업로드 및 데이터베이스 저장
export async function uploadImageAndSaveToDB(
  formData: FormData,
  tableName: string = 'products'
) {
  try {
    console.log('🚀 이미지 업로드 및 DB 저장 시작');
    
    const file = formData.get('image') as File;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;

    if (!file) {
      throw new Error('이미지 파일이 필요합니다.');
    }

    // 1. Supabase에 이미지 업로드
    console.log('📤 Supabase에 이미지 업로드 중...');
    const uploadResult = await uploadImage(file);
    
    if (!uploadResult.success) {
      throw new Error(`이미지 업로드 실패: ${uploadResult.error}`);
    }

    console.log('✅ 이미지 업로드 성공:', uploadResult.url);

    // 2. PostgreSQL 데이터베이스에 정보 저장
    console.log('💾 데이터베이스에 정보 저장 중...');
    
    let insertResult;
    switch (tableName.toLowerCase()) {
      case 'products':
        insertResult = await sql`
          INSERT INTO products (name, description, price, category, image_url, created_at)
          VALUES (${name}, ${description}, ${price}, ${category}, ${uploadResult.url}, NOW())
          RETURNING *;
        `;
        break;
      case 'customers':
        insertResult = await sql`
          INSERT INTO customers (name, email, image_url, created_at)
          VALUES (${name}, ${description}, ${uploadResult.url}, NOW())
          RETURNING *;
        `;
        break;
      default:
        throw new Error(`지원하지 않는 테이블: ${tableName}`);
    }

    console.log('✅ 데이터베이스 저장 성공:', insertResult.rows[0]);

    return {
      success: true,
      message: '이미지 업로드 및 데이터베이스 저장이 완료되었습니다.',
      data: {
        id: insertResult.rows[0].id,
        name: name,
        imageUrl: uploadResult.url,
        imagePath: uploadResult.path,
        tableName: tableName
      }
    };

  } catch (error) {
    console.error('❌ 이미지 업로드 및 DB 저장 오류:', error);
    
    // 오류 발생 시 업로드된 이미지 삭제 시도
    try {
      const file = formData.get('image') as File;
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        await deleteImage(fileName);
        console.log('🗑️ 오류로 인한 이미지 삭제 완료');
      }
    } catch (deleteError) {
      console.error('이미지 삭제 실패:', deleteError);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
}

// 이미지 URL만 데이터베이스에 저장 (이미 업로드된 이미지의 경우)
export async function saveImageUrlToDB(
  imageUrl: string,
  name: string,
  description: string,
  price: number,
  category: string,
  tableName: string = 'products'
) {
  try {
    console.log('💾 이미지 URL을 데이터베이스에 저장 중...');
    
    let insertResult;
    switch (tableName.toLowerCase()) {
      case 'products':
        insertResult = await sql`
          INSERT INTO products (name, description, price, category, image_url, created_at)
          VALUES (${name}, ${description}, ${price}, ${category}, ${imageUrl}, NOW())
          RETURNING *;
        `;
        break;
      case 'customers':
        insertResult = await sql`
          INSERT INTO customers (name, email, image_url, created_at)
          VALUES (${name}, ${description}, ${imageUrl}, NOW())
          RETURNING *;
        `;
        break;
      default:
        throw new Error(`지원하지 않는 테이블: ${tableName}`);
    }

    console.log('✅ 데이터베이스 저장 성공:', insertResult.rows[0]);

    return {
      success: true,
      message: '이미지 URL이 데이터베이스에 저장되었습니다.',
      data: insertResult.rows[0]
    };

  } catch (error) {
    console.error('❌ 이미지 URL 저장 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
}

// 데이터베이스에서 이미지 정보 조회
export async function getImagesFromDB(tableName: string = 'products') {
  try {
    console.log(`📋 ${tableName} 테이블에서 이미지 정보 조회 중...`);
    
    let selectResult;
    switch (tableName.toLowerCase()) {
      case 'products':
        selectResult = await sql`
          SELECT id, name, description, price, category, image_url, created_at
          FROM products
          WHERE image_url IS NOT NULL
          ORDER BY created_at DESC;
        `;
        break;
      case 'customers':
        selectResult = await sql`
          SELECT id, name, email, image_url, created_at
          FROM customers
          WHERE image_url IS NOT NULL
          ORDER BY created_at DESC;
        `;
        break;
      default:
        throw new Error(`지원하지 않는 테이블: ${tableName}`);
    }

    console.log(`✅ ${tableName} 테이블 조회 완료:`, selectResult.rows.length, '개 항목');

    return {
      success: true,
      data: selectResult.rows,
      count: selectResult.rows.length
    };

  } catch (error) {
    console.error('❌ 이미지 정보 조회 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
}

// 제품 삭제
export async function deleteProductFromDB(productId: number) {
  try {
    console.log(`🗑️ 제품 삭제 중... ID: ${productId}`);
    
    // 1. 제품 정보 조회 (이미지 URL 확인용)
    const product = await sql`
      SELECT id, image_url FROM products WHERE id = ${productId}
    `;

    if (product.rows.length === 0) {
      throw new Error('제품을 찾을 수 없습니다.');
    }

    const imageUrl = product.rows[0].image_url;

    // 2. 데이터베이스에서 제품 삭제
    await sql`DELETE FROM products WHERE id = ${productId}`;
    console.log('✅ 데이터베이스에서 제품 삭제 완료');

    // 3. Supabase Storage에서 이미지 삭제 시도
    if (imageUrl) {
      try {
        // URL에서 파일 경로 추출
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        await deleteImage(fileName);
        console.log('✅ Supabase Storage에서 이미지 삭제 완료');
      } catch (storageError) {
        console.error('⚠️ 이미지 삭제 실패 (계속 진행):', storageError);
      }
    }

    return {
      success: true,
      message: '제품이 성공적으로 삭제되었습니다.'
    };

  } catch (error) {
    console.error('❌ 제품 삭제 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
}

// 제품 수정
export async function updateProductInDB(
  productId: number,
  formData: FormData
) {
  try {
    console.log(`📝 제품 수정 중... ID: ${productId}`);
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const file = formData.get('image') as File | null;

    let imageUrl = formData.get('existingImageUrl') as string;

    // 새 이미지가 있으면 업로드
    if (file && file.size > 0) {
      console.log('📤 새 이미지 업로드 중...');
      const uploadResult = await uploadImage(file);
      
      if (!uploadResult.success) {
        throw new Error(`이미지 업로드 실패: ${uploadResult.error}`);
      }

      // 기존 이미지 삭제 시도
      if (imageUrl) {
        try {
          const urlParts = imageUrl.split('/');
          const oldFileName = urlParts[urlParts.length - 1];
          await deleteImage(oldFileName);
          console.log('🗑️ 기존 이미지 삭제 완료');
        } catch (deleteError) {
          console.error('⚠️ 기존 이미지 삭제 실패 (계속 진행):', deleteError);
        }
      }

      imageUrl = uploadResult.url || imageUrl;
    }

    // 데이터베이스 업데이트
    const updateResult = await sql`
      UPDATE products
      SET name = ${name},
          description = ${description},
          price = ${price},
          category = ${category},
          image_url = ${imageUrl}
      WHERE id = ${productId}
      RETURNING *;
    `;

    console.log('✅ 제품 수정 완료:', updateResult.rows[0]);

    return {
      success: true,
      message: '제품이 성공적으로 수정되었습니다.',
      data: updateResult.rows[0]
    };

  } catch (error) {
    console.error('❌ 제품 수정 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
}