"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 실제 회원가입 로직 연동
    if (!email || !password || !confirmPassword) {
      setError('모든 필드를 입력하세요.');
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setError('');
    alert('회원가입 시도: ' + email);
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h1>회원가입</h1>
      <form onSubmit={handleSignup}>
        <div style={{ marginBottom: 16 }}>
          <label>이메일<br />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%' }} required />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>비밀번호<br />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%' }} required />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>비밀번호 확인<br />
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ width: '100%' }} required />
          </label>
        </div>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <button type="submit" style={{ width: '100%' }}>회원가입</button>
      </form>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <span>이미 계정이 있으신가요? </span>
        <Link href="/login">로그인</Link>
      </div>
    </div>
  );
} 