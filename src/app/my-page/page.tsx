'use client'
import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import styles from './page.module.scss';

export default function MyPage() {
  const { data: session, status } = useSession();
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart();
  const [selectedItems, setSelectedItems] = React.useState<number[]>([]);
  const [selectAll, setSelectAll] = React.useState(false);

  if (status === 'loading') {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (!session) {
    redirect('/login');
  }

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      // 선택된 아이템에서도 제거
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    } else {
      updateQuantity(id, quantity);
    }
  };

  const handleRemoveItem = (id: number) => {
    if (confirm('이 상품을 장바구니에서 제거하시겠습니까?')) {
      removeItem(id);
      // 선택된 아이템에서도 제거
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleClearCart = () => {
    if (confirm('장바구니를 모두 비우시겠습니까?')) {
      clearCart();
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        const newSelected = prev.filter(itemId => itemId !== id);
        setSelectAll(false);
        return newSelected;
      } else {
        const newSelected = [...prev, id];
        setSelectAll(newSelected.length === items.length);
        return newSelected;
      }
    });
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      alert('삭제할 상품을 선택해주세요.');
      return;
    }
    
    if (confirm(`선택한 ${selectedItems.length}개 상품을 삭제하시겠습니까?`)) {
      selectedItems.forEach(id => removeItem(id));
      setSelectedItems([]);
      setSelectAll(false);
    }
  };

  // items가 변경될 때 selectAll 상태 업데이트 및 삭제된 아이템 정리
  React.useEffect(() => {
    if (items.length === 0) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      // 현재 장바구니에 없는 아이템들을 선택 목록에서 제거
      const currentItemIds = items.map(item => item.id);
      setSelectedItems(prev => {
        const filteredSelected = prev.filter(id => currentItemIds.includes(id));
        // 전체선택 상태 업데이트
        setSelectAll(filteredSelected.length === items.length && items.length > 0);
        return filteredSelected;
      });
    }
  }, [items]);

  return (
    <div className={styles.myPage}>
      <div className="container">
        <div className={styles.header}>
          <h1>마이페이지</h1>
          <p>안녕하세요, {session.user?.email}님!</p>
        </div>

        <div className={styles.content}>
          <div className={styles.cartSection}>
            <div className={styles.cartHeader}>
              <div className={styles.cartTitle}>
                <h2>장바구니 ({totalItems}개)</h2>
              </div>
              {items.length > 0 && (
                <div className={styles.cartControls}>
                  <label className={styles.selectAllLabel}>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className={styles.selectAllCheckbox}
                    />
                    전체선택
                  </label>
                  <button 
                    onClick={handleDeleteSelected}
                    className={styles.deleteSelectedBtn}
                    disabled={selectedItems.length === 0}
                  >
                    선택삭제 ({selectedItems.length})
                  </button>
                </div>
              )}
            </div>
            
            {items.length === 0 ? (
              <div className={styles.emptyCart}>
                <p>장바구니가 비어있습니다.</p>
                <a href="/products" className={styles.shopButton}>쇼핑하러 가기</a>
              </div>
            ) : (
              <>
                <div className={styles.cartItems}>
                  {items.map((item) => (
                    <div key={item.id} className={styles.cartItem}>
                      <div className={styles.itemCheckbox}>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className={styles.checkbox}
                        />
                      </div>
                      
                      <div className={styles.itemImage}>
                        <img src={item.image_url} alt={item.name} />
                      </div>
                      
                      <div className={styles.itemDetails}>
                        <h3>{item.name}</h3>
                        <p className={styles.itemPrice}>₩{Math.floor(Number(item.price) || 0).toLocaleString()}</p>
                      </div>
                      
                      <div className={styles.quantityControls}>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className={styles.quantityBtn}
                        >
                          -
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className={styles.quantityBtn}
                        >
                          +
                        </button>
                      </div>
                      
                      <div className={styles.itemTotal}>
                        ₩{Math.floor((Number(item.price) || 0) * item.quantity).toLocaleString()}
                      </div>
                      
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className={styles.removeBtn}
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className={styles.cartSummary}>
                  <div className={styles.totalPrice}>
                    <h3>총 결제금액: ₩{Math.floor(totalPrice || 0).toLocaleString()}</h3>
                  </div>
                  <button className={styles.checkoutBtn}>주문하기</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
