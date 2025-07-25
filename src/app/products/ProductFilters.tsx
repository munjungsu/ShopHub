'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.scss';

interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  totalProducts: number;
  currentPage: number;
  productsPerPage: number;
  initialSearchTerm?: string;
  onlyPagination?: boolean;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  totalProducts,
  currentPage,
  productsPerPage,
  initialSearchTerm = '',
  onlyPagination = false
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const updateURL = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '1') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const newURL = params.toString() ? `?${params.toString()}` : '/products';
    router.replace(newURL);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // 디바운스 적용
    setTimeout(() => {
      updateURL({ 
        search: value || undefined, 
        page: undefined // 검색 시 페이지 리셋
      });
    }, 300);
  };

  const handleCategoryChange = (category: string) => {
    updateURL({ 
      category: category === 'all' ? undefined : category,
      page: undefined // 카테고리 변경 시 페이지 리셋
    });
  };

  const handlePageChange = (pageNumber: number) => {
    updateURL({ page: pageNumber === 1 ? undefined : pageNumber.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {!onlyPagination && (
        <div className={styles.filters}>
          <div className={styles.search}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className={styles.categories}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.categoryBtn} ${selectedCategory === category ? styles.active : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 페이지네이션 - onlyPagination이 true일 때만 표시 */}
      {onlyPagination && totalProducts > productsPerPage && (
        <div className={styles.pagination}>
          {Array.from({ length: Math.ceil(totalProducts / productsPerPage) }).map((_, index) => (
            <button
              key={index + 1}
              className={`${styles.pageBtn} ${currentPage === index + 1 ? styles.active : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
