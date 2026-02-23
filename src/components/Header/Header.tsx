'use client'
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import styles from './Header.module.scss';

const Header = () => {
  const { data: session, status } = useSession();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [webViewSession, setWebViewSession] = useState<any>(null);
  const [isWebView, setIsWebView] = useState(false);

  // WebView 환경 감지 및 localStorage 세션 확인
  useEffect(() => {
    const checkWebView = typeof window !== 'undefined' && 
      (!!(window as any).ReactNativeWebView || navigator.userAgent.includes('wv'));
    
    setIsWebView(checkWebView);

    if (checkWebView) {
      // localStorage에서 세션 읽기
      const storedSession = localStorage.getItem('webview_session');
      if (storedSession) {
        try {
          const parsed = JSON.parse(storedSession);
          setWebViewSession(parsed);
          console.log('📱 WebView 세션 로드:', parsed);
        } catch (error) {
          console.error('세션 파싱 오류:', error);
        }
      }

      // 커스텀 이벤트 리스너 (로그아웃용)
      const handleSessionChange = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail?.type === 'logout') {
          setWebViewSession(null);
          console.log('🔄 세션 상태 업데이트: 로그아웃');
        } else if (customEvent.detail?.session) {
          setWebViewSession(customEvent.detail.session);
          console.log('🔄 세션 상태 업데이트:', customEvent.detail.session);
        }
      };

      window.addEventListener('webview_session_change', handleSessionChange);

      // storage 이벤트 리스너 (다른 탭에서 변경 감지)
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'webview_session') {
          if (e.newValue) {
            try {
              const parsed = JSON.parse(e.newValue);
              setWebViewSession(parsed);
              console.log('📱 WebView 세션 업데이트:', parsed);
            } catch (error) {
              console.error('세션 파싱 오류:', error);
            }
          } else {
            setWebViewSession(null);
          }
        }
      };

      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('webview_session_change', handleSessionChange);
      };
    }
  }, []);

  // WebView 환경에서 사용할 세션 (localStorage 우선)
  const activeSession = isWebView && webViewSession ? webViewSession : session;
  const activeStatus = isWebView && webViewSession ? 'authenticated' : status;

  console.log('세션 상태:', activeStatus);
  console.log('세션 데이터:', activeSession);
  console.log('WebView 모드:', isWebView);

  const handleSignOut = async () => {
    if (isWebView) {
      // WebView 환경에서 로그아웃
      localStorage.removeItem('webview_session');
      
      // 커스텀 이벤트 발송으로 즉시 UI 업데이트
      const event = new CustomEvent('webview_session_change', {
        detail: { type: 'logout' }
      });
      window.dispatchEvent(event);
      
      if ((window as any).ReactNativeWebView) {
        (window as any).ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'LOGOUT',
            timestamp: Date.now(),
          })
        );
        console.log('🚪 Logout message sent to React Native');
      }
      
      // 잠시 후 리다이렉트 (UI 업데이트 확인용)
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    } else {
      // 일반 브라우저 로그아웃
      await signOut({ callbackUrl: '/login' });
    }
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
            {activeStatus === 'loading' ? (
              <span className={styles.authBtn}>로딩중...</span>
            ) : activeSession?.user ? (
              <div className={styles.userSection}>
                {(activeSession.user as any).role === 'admin' && (
                  <Link href="/admin/products" className={styles.adminBtn}>
                    관리자
                  </Link>
                )}
                <span className={styles.userName}>
                  {activeSession.user.name || activeSession.user.email}
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