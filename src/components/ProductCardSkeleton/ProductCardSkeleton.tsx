'use client';

import styles from './ProductCardSkeleton.module.scss';

const ProductCardSkeleton = () => {
  return (
    <div className={`${styles.skeletonCard} card`}>
      <div className={styles.imageContainer}>
        <div className={styles.skeletonImage}></div>
        <div className={styles.skeletonWishlistBtn}></div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.skeletonCategory}></div>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonDescription}>
          <div className={styles.skeletonLine}></div>
          <div className={styles.skeletonLine}></div>
        </div>
        
        <div className={styles.skeletonPrice}></div>
        <div className={styles.skeletonButton}></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
