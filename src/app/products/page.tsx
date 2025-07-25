import { Suspense } from 'react';
import styles from './page.module.scss';
import ServerProductList, { getProductCategories, getFilteredProductCount } from './ServerProductList';
import ProductFilters from './ProductFilters';
import ProductListSkeleton, { FiltersSkeleton } from './ProductListSkeleton';

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const searchTerm = params.search || '';
  const selectedCategory = params.category || 'all';
  const currentPage = parseInt(params.page || '1');
  const productsPerPage = 8;

  // 서버에서 카테고리 목록과 총 제품 수 가져오기
  const categories = await getProductCategories();
  const totalProducts = await getFilteredProductCount(searchTerm, selectedCategory);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Our Products</h1>
        
        {/* 필터 컴포넌트 (클라이언트) */}
        <ProductFilters
          categories={categories}
          selectedCategory={selectedCategory}
          totalProducts={totalProducts}
          currentPage={currentPage}
          productsPerPage={productsPerPage}
          initialSearchTerm={searchTerm}
        />

        {/* 제품 목록 (서버) */}
        <div className={styles.productsGrid}>
          <Suspense 
            key={`${searchTerm}-${selectedCategory}-${currentPage}`}
            fallback={<ProductListSkeleton count={productsPerPage} />}
          >
            <ServerProductList
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              currentPage={currentPage}
              productsPerPage={productsPerPage}
            />
          </Suspense>
        </div>

        {/* 페이지네이션을 제품 목록 아래에 배치 */}
        <ProductFilters
          categories={categories}
          selectedCategory={selectedCategory}
          totalProducts={totalProducts}
          currentPage={currentPage}
          productsPerPage={productsPerPage}
          initialSearchTerm={searchTerm}
          onlyPagination={true}
        />
      </div>
    </main>
  );
} 