'use client';

import Link from 'next/link';
import styles from './HeroSection.module.scss';

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>
              최고의 제품을<br />
              <span className={styles.highlight}>합리적인 가격</span>으로
            </h1>
            <p className={styles.subtitle}>
              다양한 카테고리의 프리미엄 제품들을 만나보세요. 
              품질과 가격 모두 만족하는 쇼핑 경험을 제공합니다.
            </p>
            <div className={styles.actions}>
              <Link href="/products">
                <button className={`${styles.ctaBtn} btn btn--primary`}>
                  제품 둘러보기
                </button>
              </Link>
              <button className={`${styles.secondaryBtn} btn btn--outline`}>
                특가 상품 보기
              </button>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>10K+</span>
                <span className={styles.statLabel}>고객 만족</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>500+</span>
                <span className={styles.statLabel}>제품 종류</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>24/7</span>
                <span className={styles.statLabel}>고객 지원</span>
              </div>
            </div>
          </div>
          <div className={styles.imageContainer}>
            <div className={styles.mainImage}>
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Premium Products" 
              />
            </div>
            <div className={styles.floatingCard}>
              <div className={styles.cardContent}>
                <div className={styles.cardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4"></path>
                    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"></path>
                  </svg>
                </div>
                <div className={styles.cardText}>
                  <span className={styles.cardTitle}>무료 배송</span>
                  <span className={styles.cardSubtitle}>5만원 이상 구매시</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 