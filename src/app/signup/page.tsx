"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
import { register } from '@/lib/actions';
import { useSession } from 'next-auth/react';
import styles from './page.module.scss';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { data: session } = useSession();
  const [state, formAction, isPending] = useActionState(register, undefined);

  // 회원가입 성공 시 처리
  useEffect(() => {
    if (state?.success && session) {
      // WebView 환경 확인
      const isWebView = typeof window !== 'undefined' && 
        (!!(window as any).ReactNativeWebView || navigator.userAgent.includes('wv'));

      if (isWebView && (window as any).ReactNativeWebView) {
        // React Native로 세션 데이터 전달
        const sessionData = {
          type: 'AUTH_SUCCESS',
          session: session,
          timestamp: Date.now(),
        };
        
        (window as any).ReactNativeWebView.postMessage(JSON.stringify(sessionData));
        console.log('Session sent to React Native (Signup):', sessionData);
      }
      
      // 페이지 이동
      window.location.href = '/';
    }
  }, [state?.success, session]);

  return (
    <div className={styles.signupContainer}>
      <h1 className={styles.title}>회원가입</h1>
      <form action={formAction} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            이메일
          </label>
          <input 
            type="email" 
            id="email"
            name="email"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className={styles.input}
            placeholder="이메일을 입력하세요"
            required 
          />
          {state?.errors?.email && (
            <div className={styles.fieldError}>{state.errors.email[0]}</div>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            비밀번호
          </label>
          <input 
            type="password" 
            id="password"
            name="password"
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className={styles.input}
            placeholder="비밀번호를 입력하세요 (최소 6자)"
            required 
          />
          {state?.errors?.password && (
            <div className={styles.fieldError}>{state.errors.password[0]}</div>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>
            비밀번호 확인
          </label>
          <input 
            type="password" 
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
            className={styles.input}
            placeholder="비밀번호를 다시 입력하세요"
            required 
          />
          {state?.errors?.confirmPassword && (
            <div className={styles.fieldError}>{state.errors.confirmPassword[0]}</div>
          )}
        </div>
        {state?.message && !state?.success && (
          <div className={styles.errorMessage}>{state.message}</div>
        )}
        <button type="submit" className={styles.submitButton} disabled={isPending}>
          {isPending ? '회원가입 중...' : '회원가입'}
        </button>
      </form>
      <div className={styles.footer}>
        <span>이미 계정이 있으신가요?</span>
        <Link href="/login" className={styles.loginLink}>로그인</Link>
      </div>
    </div>
  );
}