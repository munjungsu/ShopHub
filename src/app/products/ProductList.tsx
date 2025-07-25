'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton/ProductCardSkeleton';
import { getImagesFromDB } from '@/lib/image-actions';
import styles from './page.module.scss';

interface ProductListProps {
  searchTerm: string;
  selectedCategory: string;
  currentPage: number;
  productsPerPage: number;
  onProductsLoad?: (totalCount: number) => void;
}

export default function ProductList({ 
  searchTerm, 
  selectedCategory, 
  currentPage, 
  productsPerPage,
  onProductsLoad 
}: ProductListProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const res = await getImagesFromDB('products');
        const productData = res.success ? res.data || [] : [];
        setProducts(productData);
      } catch (error) {
        console.error('제품 로딩 오류:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // 검색 및 필터링된 제품 목록
  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 현재 페이지의 제품 목록
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // 총 제품 수를 부모 컴포넌트에 전달
  useEffect(() => {
    if (onProductsLoad && !isLoading) {
      onProductsLoad(filteredProducts.length);
    }
  }, [filteredProducts.length, onProductsLoad, isLoading]);

  // 로딩 중일 때 스켈레톤 표시
  if (isLoading) {
    return (
      <>
        {Array.from({ length: productsPerPage }, (_, index) => (
          <ProductCardSkeleton key={`skeleton-${index}`} />
        ))}
      </>
    );
  }

  if (currentProducts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>제품을 찾을 수 없습니다</h3>
        <p>검색어나 카테고리를 변경해보세요.</p>
      </div>
    );
  }

  return (
    <>
      {currentProducts.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
}
