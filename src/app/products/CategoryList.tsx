'use client';

import { useEffect, useState } from 'react';
import { getImagesFromDB } from '@/lib/image-actions';
import styles from './page.module.scss';

interface CategoryListProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryList({ selectedCategory, onCategoryChange }: CategoryListProps) {
  const [categories, setCategories] = useState<string[]>(['all']);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const res = await getImagesFromDB('products');
        const products = res.success ? res.data || [] : [];
        const uniqueCategories = ['all', ...new Set(products.map((product: any) => product.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('카테고리 로딩 오류:', error);
        setCategories(['all']);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <>
        <div className={styles.categorySkeleton}></div>
        <div className={styles.categorySkeleton}></div>
        <div className={styles.categorySkeleton}></div>
        <div className={styles.categorySkeleton}></div>
      </>
    );
  }

  return (
    <>
      {categories.map((category) => (
        <button
          key={category}
          className={`${styles.categoryBtn} ${selectedCategory === category ? styles.active : ''}`}
          onClick={() => onCategoryChange(category)}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </>
  );
}
