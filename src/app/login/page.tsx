"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
import { authenticate } from '../../lib/actions';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // TODO: 실제 로그인 로직 연동
  //   if (!email || !password) {
  //     setError('이메일과 비밀번호를 입력하세요.');
  //     return;
  //   }
  //   setError('');
  //   alert('로그인 시도: ' + email);
  // };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h1>로그인</h1>
      <form action={formAction}>
        <div style={{ marginBottom: 16 }}>
          <label>이메일<br />
            <input type="email" value={email} id="email"
                name="email" onChange={e => setEmail(e.target.value)} style={{ width: '100%' }} required />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>비밀번호<br />
            <input type="password" value={password} id="password"
                name="password" onChange={e => setPassword(e.target.value)} style={{ width: '100%' }} required />
          </label>
        </div>
        {errorMessage && <div style={{ color: 'red', marginBottom: 12 }}>{errorMessage}</div>}
        <button type="submit" style={{ width: '100%' }} disabled={isPending}>
          {isPending ? '로그인 중...' : '로그인'}
        </button>
      </form>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <span>계정이 없으신가요? </span>
        <Link href="/signup">회원가입</Link>
      </div>
    </div>
  );
} 