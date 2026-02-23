'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function WebViewBridge() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // WebView 환경 감지
    const isWebView = typeof window !== 'undefined' && 
      (!!(window as any).ReactNativeWebView || navigator.userAgent.includes('wv'));

    if (!isWebView) {
      return;
    }

    // 세션 상태가 변경될 때마다 처리
    if (status === 'authenticated' && session) {
      // 로그아웃 플래그 확인
      const logoutFlag = localStorage.getItem('webview_logout_flag');
      if (logoutFlag === 'true') {
        console.log('🚫 로그아웃 중이므로 세션 저장 무시');
        return;
      }

      // localStorage에 세션 저장
      localStorage.setItem('webview_session', JSON.stringify(session));
      console.log('💾 WebView 세션 저장 (자동):', session);

      // 커스텀 이벤트 발송으로 Header 즉시 업데이트
      const event = new CustomEvent('webview_session_change', {
        detail: { type: 'session_update', session }
      });
      window.dispatchEvent(event);

      // React Native로 전달
      if ((window as any).ReactNativeWebView) {
        const message = {
          type: 'SESSION_UPDATE',
          status: 'authenticated',
          session: {
            user: session.user,
            expires: session.expires,
          },
          timestamp: Date.now(),
        };

        (window as any).ReactNativeWebView.postMessage(JSON.stringify(message));
        console.log('🔄 Session sent to React Native:', message);
      }
    } else if (status === 'unauthenticated') {
      // localStorage에서 세션 제거
      localStorage.removeItem('webview_session');
      console.log('🗑️ WebView 세션 제거');

      // 커스텀 이벤트 발송
      const event = new CustomEvent('webview_session_change', {
        detail: { type: 'logout' }
      });
      window.dispatchEvent(event);

      // React Native로 전달
      if ((window as any).ReactNativeWebView) {
        const message = {
          type: 'SESSION_UPDATE',
          status: 'unauthenticated',
          timestamp: Date.now(),
        };

        (window as any).ReactNativeWebView.postMessage(JSON.stringify(message));
        console.log('🔄 Logout sent to React Native');
      }
    }
  }, [session, status]);

  // UI를 렌더링하지 않음
  return null;
}
