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

    const checkSession = () => {
      if (checkWebView) {
        const storedSession = localStorage.getItem('webview_session');
        if (storedSession) {
          try {
            const parsed = JSON.parse(storedSession);
            setWebViewSession(parsed);
            console.log('📱 WebView 세션 로드:', parsed);
          } catch (error) {
            console.error('세션 파싱 오류:', error);
            setWebViewSession(null);
          }
        } else {
          setWebViewSession(null);
          console.log('📱 WebView 세션 없음');
        }
      }
    };

    // 초기 세션 체크
    checkSession();

    if (checkWebView) {
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

      // storage 이벤트 리스너
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'webview_session') {
          if (e.newValue) {
            try {
              const parsed = JSON.parse(e.newValue);
              setWebViewSession(parsed);
              console.log('📱 WebView 세션 업데이트 (storage):', parsed);
            } catch (error) {
              console.error('세션 파싱 오류:', error);
              setWebViewSession(null);
            }
          } else {
            setWebViewSession(null);
            console.log('📱 WebView 세션 삭제 (storage)');
          }
        }
      };

      // focus 이벤트로 페이지 재진입 시 세션 재확인
      const handleFocus = () => {
        checkSession();
      };

      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('focus', handleFocus);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('webview_session_change', handleSessionChange);
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, []);

  // WebView 환경에서 사용할 세션
  // WebView에서는 localStorage의 webViewSession만 사용 (NextAuth 세션 무시)
  const activeSession = isWebView ? webViewSession : session;
  const activeStatus = isWebView 
    ? (webViewSession ? 'authenticated' : 'unauthenticated') 
    : status;

  console.log('세션 상태:', activeStatus);
  console.log('세션 데이터:', activeSession);
  console.log('WebView 모드:', isWebView);
  console.log('webViewSession:', webViewSession);

  const handleSignOut = async () => {
    if (isWebView) {
      // WebView 환경에서 로그아웃
      console.log('🚪 WebView 로그아웃 시작');
      
      // 1. 로그아웃 플래그 설정 (WebViewBridge가 세션 저장하지 않도록)
      localStorage.setItem('webview_logout_flag', 'true');
      
      // 2. localStorage 세션 삭제
      localStorage.removeItem('webview_session');
      console.log('🗑️ localStorage 삭제 완료');
      
      // 3. React Native로 알림
      if ((window as any).ReactNativeWebView) {
        (window as any).ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'LOGOUT',
            timestamp: Date.now(),
          })
        );
        console.log('📤 RN으로 로그아웃 메시지 전송');
      }
      
      // 4. NextAuth 로그아웃 (쿠키 정리)
      await signOut({ redirect: false });
      console.log('✅ NextAuth 로그아웃 완료');
      
      // 5. 로그인 페이지로 즉시 이동 (상태 업데이트 없이 바로 리다이렉트)
      window.location.href = '/login';
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