'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthRedirect() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    // 로그인 후 리다이렉트된 경우 세션 강제 업데이트
    const hasRedirected = sessionStorage.getItem('auth-redirect');
    if (hasRedirected && status === 'unauthenticated') {
      sessionStorage.removeItem('auth-redirect');
      update().then(() => {
        router.refresh();
      });
    }
  }, [status, update, router]);

  return { session, status };
}
