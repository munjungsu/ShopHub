"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
import { authenticate } from '../../lib/actions';
import { useSession } from 'next-auth/react';
import styles from './page.module.scss';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { data: session } = useSession();
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  // 컴포넌트 마운트 시 로그아웃 플래그만 제거 (세션 체크는 WebViewBridge에 위임)
  useEffect(() => {
    const logoutFlag = localStorage.getItem('webview_logout_flag');
    if (logoutFlag === 'true') {
      console.log('🔄 로그인 페이지에서 로그아웃 플래그 발견, 즉시 제거');
      localStorage.removeItem('webview_logout_flag');
      console.log('✅ 로그아웃 플래그 제거 완료');
    }
  }, []);

  // 로그인 성공 시 리다이렉트 (세션 저장은 WebViewBridge에 위임)
  useEffect(() => {
    if (errorMessage === 'success') {
      console.log('✅ 로그인 성공, 홈으로 이동');
      // WebViewBridge가 세션을 감지하고 localStorage에 저장할 시간 확보
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
  }, [errorMessage]);

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.title}>로그인</h1>
      <form action={formAction} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            이메일
          </label>
          <input 
            type="email" 
            value={email} 
            id="email"
            name="email" 
            onChange={e => setEmail(e.target.value)} 
            className={styles.input}
            placeholder="이메일을 입력하세요"
            required 
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            비밀번호
          </label>
          <input 
            type="password" 
            value={password} 
            id="password"
            name="password" 
            onChange={e => setPassword(e.target.value)} 
            className={styles.input}
            placeholder="비밀번호를 입력하세요"
            required 
          />
        </div>
        {errorMessage && errorMessage !== 'success' && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}
        <button type="submit" className={styles.submitButton} disabled={isPending}>
          {isPending ? '로그인 중...' : '로그인'}
        </button>
      </form>
      <div className={styles.footer}>
        <span>계정이 없으신가요?</span>
        <Link href="/signup" className={styles.signupLink}>회원가입</Link>
      </div>
    </div>
  );
}