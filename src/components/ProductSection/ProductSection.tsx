'use client';

import { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import ProductCardSkeleton from '../ProductCardSkeleton/ProductCardSkeleton';
import styles from './ProductSection.module.scss';

// 제품 데이터 타입 정의
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

// 샘플 제품 데이터
const sampleProducts: Product[] = [
  {
    id: 1,
    name: '프리미엄 무선 이어폰',
    description: '고품질 무선 이어폰으로 노이즈 캔슬링과 프리미엄 사운드 품질을 제공합니다.',
    price: 89000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: '전자제품',
  },
  {
    id: 2,
    name: '스마트 워치 프로',
    description: '심박수 모니터링과 GPS 기능을 갖춘 고급 스마트워치로 피트니스 목표를 추적하세요.',
    price: 250000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2099&q=80',
    category: '웨어러블',
  },
  {
    id: 3,
    name: '노트북 스탠드',
    description: '편안한 작업을 위한 조절 가능한 노트북 스탠드로 목과 어깨의 피로를 줄여줍니다.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2067&q=80',
    category: '액세서리',
  },
  {
    id: 4,
    name: '블루투스 스피커',
    description: '강력한 사운드와 긴 배터리 수명을 제공하는 휴대용 블루투스 스피커입니다.',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2031&q=80',
    category: '오디오',
  },
  {
    id: 5,
    name: '게이밍 마우스',
    description: '정밀한 센서와 커스터마이징 가능한 버튼으로 게이밍 성능을 극대화합니다.',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2067&q=80',
    category: '게이밍',
  },
  {
    id: 6,
    name: '무선 충전기',
    description: '모든 Qi 지원 기기와 호환되는 빠른 무선 충전 패드입니다.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: '충전기',
  }
];

const ProductSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 데이터 로딩 시뮬레이션 (실제로는 API 호출)
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        // 실제 API 호출 시뮬레이션 (2초 딜레이)
        await new Promise(resolve => setTimeout(resolve, 2000));
        setProducts(sampleProducts);
      } catch (error) {
        console.error('제품 데이터 로딩 중 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className={styles.productSection}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>인기 제품</h2>
          <p className={styles.subtitle}>
            고객들이 가장 많이 찾는 프리미엄 제품들을 만나보세요
          </p>
        </div>
        
        <div className={`${styles.productGrid} grid grid--3`}>
          {isLoading ? (
            // 로딩 중일 때 스켈레톤 카드 6개 표시
            Array.from({ length: 6 }, (_, index) => (
              <ProductCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : products.length > 0 ? (
            // 데이터 로딩 완료 후 실제 제품 카드 표시
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))
          ) : (
            // 데이터가 없을 때
            <div className={styles.emptyState}>
              <p>제품 데이터를 불러올 수 없습니다.</p>
            </div>
          )}
        </div>
        
        <div className={styles.viewMore}>
          <button 
            className={`${styles.viewMoreBtn} btn btn--outline ${isLoading ? styles.disabled : ''}`}
            disabled={isLoading}
          >
            {isLoading ? '로딩 중...' : '더 많은 제품 보기'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductSection; 