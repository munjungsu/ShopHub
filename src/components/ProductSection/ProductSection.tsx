'use client';

import Link from 'next/link';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductSection.module.scss';

// 샘플 제품 데이터
const sampleProducts = [
  {
    id: 1,
    name: '프리미엄 무선 이어폰',
    description: '고품질 무선 이어폰으로 노이즈 캔슬링과 프리미엄 사운드 품질을 제공합니다.',
    price: 89000,
    originalPrice: 120000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: '전자제품',
    rating: 4.5,
    reviewCount: 128,
    isSale: true
  },
  {
    id: 2,
    name: '스마트 워치 프로',
    description: '심박수 모니터링과 GPS 기능을 갖춘 고급 스마트워치로 피트니스 목표를 추적하세요.',
    price: 250000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2099&q=80',
    category: '웨어러블',
    rating: 4.8,
    reviewCount: 89,
    isNew: true
  },
  {
    id: 3,
    name: '노트북 스탠드',
    description: '편안한 작업을 위한 조절 가능한 노트북 스탠드로 목과 어깨의 피로를 줄여줍니다.',
    price: 45000,
    originalPrice: 60000,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2067&q=80',
    category: '액세서리',
    rating: 4.2,
    reviewCount: 56,
    isSale: true
  },
  {
    id: 4,
    name: '블루투스 스피커',
    description: '강력한 사운드와 긴 배터리 수명을 제공하는 휴대용 블루투스 스피커입니다.',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2031&q=80',
    category: '오디오',
    rating: 4.6,
    reviewCount: 203
  },
  {
    id: 5,
    name: '게이밍 마우스',
    description: '정밀한 센서와 커스터마이징 가능한 버튼으로 게이밍 성능을 극대화합니다.',
    price: 75000,
    originalPrice: 95000,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2067&q=80',
    category: '게이밍',
    rating: 4.7,
    reviewCount: 167,
    isSale: true
  },
  {
    id: 6,
    name: '무선 충전기',
    description: '모든 Qi 지원 기기와 호환되는 빠른 무선 충전 패드입니다.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: '충전기',
    rating: 4.3,
    reviewCount: 94,
    isNew: true
  }
];

const ProductSection = () => {
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
          {sampleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
        
        <div className={styles.viewMore}>
          <Link href="/products" className={`${styles.viewMoreBtn} btn btn--outline`}>
            더 많은 제품 보기
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductSection; 