'use client'
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Header.module.scss';
const Header = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  console.log(session)
  React.useEffect(()=>{

  }, [session])
  return (
    <header className={styles.header}>
      <div className="container">
        <nav className={styles.nav}>
          <div className={styles.logo}>
            <h1>ShopHub</h1>
          </div>
          
          <div className={`${styles.menu} ${isMenuOpen ? styles.active : ''}`}>
            <Link href="/" className={styles.menuItem}>홈</Link>
            <Link href="/products" className={styles.menuItem}>제품</Link>
            <Link href="/categories" className={styles.menuItem}>카테고리</Link>
            <Link href="/about" className={styles.menuItem}>회사소개</Link>
            <Link href="/contact" className={styles.menuItem}>연락처</Link>
          </div>
          
          <div className={styles.actions}>
            <button className={styles.searchBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
            <button className={styles.cartBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className={styles.cartCount}>0</span>
            </button>
            {session?.user ? (
              <button className={styles.authBtn} onClick={()=>signOut({ callbackUrl: '/login' })}>로그아웃</button>
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