'use client'
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import styles from './Header.module.scss';

const Header = () => {
  const { data: session, status } = useSession();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  console.log('세션 상태:', status);
  console.log('세션 데이터:', session);

  const handleSignOut = async () => {
    // WebView 환경 체크
    const isWebView = typeof window !== 'undefined' && 
      (!!(window as any).ReactNativeWebView || navigator.userAgent.includes('wv'));

    if (isWebView && (window as any).ReactNativeWebView) {
      // React Native로 로그아웃 알림
      (window as any).ReactNativeWebView.postMessage(
        JSON.stringify({
          type: 'LOGOUT',
          timestamp: Date.now(),
        })
      );
      console.log('🚪 Logout message sent to React Native');
    }

    await signOut({ callbackUrl: '/login' });
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className="container">
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            <h1>ShopHub</h1>
          </Link>
          
          <div className={`${styles.menu} ${isMenuOpen ? styles.active : ''}`}>
            <Link href="/" className={styles.menuItem} onClick={closeMenu}>홈</Link>
            <Link href="/products" className={styles.menuItem} onClick={closeMenu}>제품</Link>
            <Link href="/categories" className={styles.menuItem} onClick={closeMenu}>카테고리</Link>
            <Link href="/about" className={styles.menuItem} onClick={closeMenu}>회사소개</Link>
            <Link href="/contact" className={styles.menuItem} onClick={closeMenu}>연락처</Link>
          </div>
          
          <div className={styles.actions}>
            <button className={styles.searchBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
            <Link href="/my-page" className={styles.cartBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {totalItems > 0 && <span className={styles.cartCount}>{totalItems}</span>}
            </Link>
            {status === 'loading' ? (
              <span className={styles.authBtn}>로딩중...</span>
            ) : session?.user ? (
              <div className={styles.userSection}>
                {(session.user as any).role === 'admin' && (
                  <Link href="/admin/products" className={styles.adminBtn}>
                    관리자
                  </Link>
                )}
                <span className={styles.userName}>
                  {session.user.name || session.user.email}
                </span>
                <button className={styles.logoutBtn} onClick={handleSignOut}>
                  로그아웃
                </button>
              </div>
            ) : (
              <Link href="/login" className={styles.loginBtn}>로그인</Link>
            )}
            <button 
              className={styles.mobileMenuBtn}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 