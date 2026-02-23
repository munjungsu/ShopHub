'use client';

import { useState, useRef } from 'react';
import { uploadImageAndSaveToDB, saveImageUrlToDB, getImagesFromDB } from '@/lib/image-actions';
import styles from './page.module.scss';

export default function ImageUploadPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [_selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [tableName, setTableName] = useState('products');
  const [images, setImages] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 선택 처리
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // 미리보기 URL 생성
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // 이미지 업로드 및 DB 저장
  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      formData.append('tableName', tableName);

      const response = await uploadImageAndSaveToDB(formData, tableName);
      setResult(response);

      if (response.success) {
        // 성공 시 폼 초기화
        event.currentTarget.reset();
        setSelectedFile(null);
        setPreviewUrl('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // 이미지 목록 새로고침
        loadImages();
      }

      console.log('업로드 결과:', response);
    } catch (error) {
      console.error('업로드 오류:', error);
      setResult({ success: false, error: '업로드 중 오류가 발생했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  // 이미지 URL만 저장
  const handleSaveUrl = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const imageUrl = formData.get('imageUrl') as string;
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      const price = parseFloat(formData.get('price') as string);
      const category = formData.get('category') as string;

      const response = await saveImageUrlToDB(imageUrl, name, description, price, category, tableName);
      setResult(response);

      if (response.success) {
        event.currentTarget.reset();
        loadImages();
      }

      console.log('URL 저장 결과:', response);
    } catch (error) {
      console.error('URL 저장 오류:', error);
      setResult({ success: false, error: 'URL 저장 중 오류가 발생했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  // 이미지 목록 로드
  const loadImages = async () => {
    try {
      const response = await getImagesFromDB(tableName);
      if (response.success) {
        setImages(response.data || []);
      }
    } catch (error) {
      console.error('이미지 목록 로드 오류:', error);
    }
  };

  // 컴포넌트 마운트 시 이미지 목록 로드
  useState(() => {
    loadImages();
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>이미지 업로드 및 데이터베이스 저장</h1>
      
      <div className={styles.content}>
        {/* 테이블 선택 */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>테이블 선택</h2>
          <select
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className={styles.select}
          >
            <option value="products">Products</option>
            <option value="customers">Customers</option>
          </select>
        </div>

        {/* 이미지 업로드 폼 */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>1. 이미지 업로드 및 DB 저장</h2>
          <form onSubmit={handleUpload} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>이미지 파일:</label>
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileSelect}
                required
                className={styles.fileInput}
              />
            </div>

            {previewUrl && (
              <div className={styles.preview}>
                <img src={previewUrl} alt="미리보기" className={styles.previewImage} />
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.label}>이름:</label>
              <input
                type="text"
                name="name"
                required
                className={styles.input}
                placeholder="상품명 또는 고객명"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>설명:</label>
              <textarea
                name="description"
                required
                className={styles.textarea}
                placeholder="상품 설명 또는 이메일"
                rows={3}
              />
            </div>

            {tableName === 'products' && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label}>가격:</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    className={styles.input}
                    placeholder="가격"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>카테고리:</label>
                  <input
                    type="text"
                    name="category"
                    required
                    className={styles.input}
                    placeholder="카테고리"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`${styles.button} ${styles.primaryButton} ${loading ? styles.disabled : ''}`}
            >
              {loading ? '업로드 중...' : '이미지 업로드 및 저장'}
            </button>
          </form>
        </div>

        {/* 이미지 URL 저장 폼 */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>2. 이미지 URL만 저장</h2>
          <form onSubmit={handleSaveUrl} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>이미지 URL:</label>
              <input
                type="url"
                name="imageUrl"
                required
                className={styles.input}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>이름:</label>
              <input
                type="text"
                name="name"
                required
                className={styles.input}
                placeholder="상품명 또는 고객명"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>설명:</label>
              <textarea
                name="description"
                required
                className={styles.textarea}
                placeholder="상품 설명 또는 이메일"
                rows={3}
              />
            </div>

            {tableName === 'products' && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label}>가격:</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    className={styles.input}
                    placeholder="가격"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>카테고리:</label>
                  <input
                    type="text"
                    name="category"
                    required
                    className={styles.input}
                    placeholder="카테고리"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`${styles.button} ${styles.successButton} ${loading ? styles.disabled : ''}`}
            >
              {loading ? '저장 중...' : 'URL 저장'}
            </button>
          </form>
        </div>

        {/* 결과 표시 */}
        {result && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>결과</h2>
            <div className={styles.resultBox}>
              <pre className={styles.resultText}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* 저장된 이미지 목록 */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>저장된 이미지 목록</h2>
          <button
            onClick={loadImages}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            새로고침
          </button>
          
          <div className={styles.imageGrid}>
            {images.map((image) => (
              <div key={image.id} className={styles.imageCard}>
                <img
                  src={image.image_url}
                  alt={image.name}
                  className={styles.image}
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-image.jpg';
                  }}
                />
                <div className={styles.imageInfo}>
                  <h3>{image.name}</h3>
                  <p>{image.description}</p>
                  {image.price && <p className={styles.price}>₩{image.price.toLocaleString()}</p>}
                  {image.category && <p className={styles.category}>{image.category}</p>}
                  <p className={styles.date}>
                    {new Date(image.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {images.length === 0 && (
            <p className={styles.noData}>저장된 이미지가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
} 