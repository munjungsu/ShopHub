import ProductCardSkeleton from '@/components/ProductCardSkeleton/ProductCardSkeleton';
import styles from './page.module.scss';

interface ProductListSkeletonProps {
  count?: number;
}

export default function ProductListSkeleton({ count = 8 }: ProductListSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={`skeleton-${index}`} />
      ))}
    </>
  );
}

export function CategoryListSkeleton() {
  return (
    <>
      <div className={styles.categorySkeleton}></div>
      <div className={styles.categorySkeleton}></div>
      <div className={styles.categorySkeleton}></div>
      <div className={styles.categorySkeleton}></div>
    </>
  );
}

export function FiltersSkeleton() {
  return (
    <div className={styles.filters}>
      <div className={styles.search}>
        <div className={styles.searchSkeleton}></div>
      </div>
      <div className={styles.categories}>
        <CategoryListSkeleton />
      </div>
    </div>
  );
}
