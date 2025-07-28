'use client';

import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      category: product.category,
    });
    
    // 시각적 피드백을 위한 지연
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };
  return (
    <div className={`${styles.productCard} card`}>
      <div className={styles.imageContainer}>
        <img src={product.image_url} alt={product.name} className={styles.image} />
        
        <button 
          className={`${styles.wishlistBtn} ${isWishlisted ? styles.active : ''}`}
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      
      <div className={styles.content}>
        <div className={styles.category}>{product.category}</div>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        
        <div className={styles.priceContainer}>
          <span className={styles.price}>{
            new Intl.NumberFormat('ko-KR', {
              style: 'currency',
              currency: 'KRW',
              maximumFractionDigits: 0,
            }).format(Math.floor(product.price))
          }</span>
        </div>
        
        <button 
          className={`${styles.addToCartBtn} btn btn--primary`}
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? '추가 중...' : '장바구니에 추가'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 