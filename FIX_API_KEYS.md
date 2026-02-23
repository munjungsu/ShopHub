# 🔑 Supabase API Keys 업데이트 필요!

## 문제
환경 변수의 ANON_KEY가 이전 프로젝트 것입니다:
- URL: `pwbwnsbkqaqmwfpnixlo` ✅
- ANON_KEY: `jmstywcxcnytauawjbzy` ❌ (다른 프로젝트!)

## 해결 방법

### 1단계: Supabase 프로젝트 설정으로 이동
```
https://supabase.com/dashboard/project/pwbwnsbkqaqmwfpnixlo/settings/api
```

### 2단계: API Keys 복사

다음 키들을 찾아서 복사:
1. **Project URL** (anon key 위에 표시)
2. **anon public** key
3. **service_role** key (Show 클릭 필요)

### 3단계: .env.development.local 파일 업데이트

```bash
NEXT_PUBLIC_SUPABASE_URL=여기에-Project-URL-붙여넣기
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에-anon-key-붙여넣기
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=여기에-service-role-key-붙여넣기
```

### 4단계: 개발 서버 재시작

```powershell
# 개발 서버 중지 (Ctrl+C)
# 다시 시작
pnpm dev
```

---

## 💡 왜 이미지가 안 보였을까?

Supabase 클라이언트가 잘못된 ANON_KEY로 인증을 시도하여:
- ❌ Storage 버킷에 접근 실패
- ❌ 이미지 URL 생성 실패
- ❌ 브라우저에서 이미지 로드 실패

올바른 키로 업데이트하면 모든 것이 정상 작동합니다!

---

## 🔍 확인 방법

키를 업데이트한 후:
1. 브라우저 개발자 도구 열기 (F12)
2. Console 탭에서 오류 확인
3. Network 탭에서 이미지 요청 상태 확인
