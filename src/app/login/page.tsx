"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { authenticate } from '../../lib/actions';
export default function LoginPage() {
  const searchParams = useSearchParams();
  const { update } = useSession();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [errorMessage, formAction, isPending] = useActionState(
    async (prevState: string | undefined, formData: FormData) => {
      const result = await authenticate(prevState, formData);
      if (!result) {
        // 로그인 성공 표시
        localStorage.setItem('login-success', 'true');
        // 세션 업데이트
        await update();
        // 약간의 지연 후 리다이렉트 (세션 업데이트 시간 확보)
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 200);
      }
      return result;
    },
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
            <input type="email" value={email}  id="email"
                type="email"
                name="email" onChange={e => setEmail(e.target.value)} style={{ width: '100%' }} required />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>비밀번호<br />
            <input type="password" value={password}  id="password"
                type="password"
                name="password" onChange={e => setPassword(e.target.value)} style={{ width: '100%' }} required />
          </label>
        </div>
        {errorMessage && (
          <div style={{ color: 'red', marginBottom: 12 }}>
            {errorMessage}
          </div>
        )}
        <button type="submit" disabled={isPending} style={{ width: '100%' }}>
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