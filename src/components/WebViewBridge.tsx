'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function WebViewBridge() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // WebView 환경 감지
    const isWebView = typeof window !== 'undefined' && 
      (!!(window as any).ReactNativeWebView || navigator.userAgent.includes('wv'));

    if (!isWebView || !(window as any).ReactNativeWebView) {
      return;
    }

    // 세션 상태가 변경될 때마다 RN으로 전달
    if (status === 'authenticated' && session) {
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
    } else if (status === 'unauthenticated') {
      const message = {
        type: 'SESSION_UPDATE',
        status: 'unauthenticated',
        timestamp: Date.now(),
      };

      (window as any).ReactNativeWebView.postMessage(JSON.stringify(message));
      console.log('🔄 Logout sent to React Native');
    }
  }, [session, status]);

  // UI를 렌더링하지 않음
  return null;
}
