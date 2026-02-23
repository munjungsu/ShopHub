# ✅ Supabase 데이터베이스 간단 복원 가이드

## 🎯 추천 방법: SQL Editor 사용 (5분이면 완료!)

### 1단계: SQL Editor 열기
브라우저에서 다음 링크로 이동:
```
https://supabase.com/dashboard/project/pwbwnsbkqaqmwfpnixlo/sql/new
```

### 2단계: 백업 파일 내용 복사
1. `db_cluster-04-08-2025@01-16-39.backup` 파일을 VS Code나 메모장으로 열기
2. 전체 선택: `Ctrl + A`
3. 복사: `Ctrl + C`

### 3단계: SQL Editor에 붙여넣고 실행
1. SQL Editor에 붙여넣기: `Ctrl + V`
2. 우측 하단의 **RUN** 버튼 클릭

### 4단계: 오류 무시하고 완료 확인
다음 오류는 정상이므로 무시하세요:
- ✅ `role "anon" already exists`
- ✅ `role "authenticated" already exists`  
- ✅ `permission denied`

중요한 것은 **테이블과 데이터가 생성**되는 것입니다!

### 5단계: 테이블 확인
좌측 메뉴 → **Table Editor**에서 다음 테이블 확인:
- `products` 테이블
- `users` 테이블
- 기타 테이블들

---

## 🖼️ 이미지 파일 업로드

데이터베이스 복원 완료 후:

```powershell
node upload-images.js
```

---

## 🔧 만약 SQL Editor가 느리거나 오류가 많다면

### 방법 A: 테이블만 먼저 생성

백업 파일에서 다음 부분만 찾아서 실행:

1. **products 테이블 생성 부분 찾기** (Ctrl+F로 검색: `CREATE TABLE public.products`)
2. **해당 CREATE TABLE 문만 복사하여 실행**
3. **INSERT 또는 COPY 문 찾아서 실행**

### 방법 B: 주요 테이블만 수동으로 생성

```sql
-- products 테이블 생성
CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- users 테이블 생성
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

그 다음 백업 파일에서 **COPY** 또는 **INSERT** 문만 찾아서 데이터 입력

---

## ⚠️ 문제 해결

### "getaddrinfo ENOTFOUND" 오류
- 프로그래밍 방식 연결이 실패하는 경우입니다
- **해결책**: SQL Editor 사용 (웹 브라우저에서 직접)

### 프로젝트 ID 불일치
현재 환경 변수 확인 필요:
- URL: `https://pwbwnsbkqaqmwfpnixlo.supabase.co`
- 프로젝트 ID: `pwbwnsbkqaqmwfpnixlo`

환경 변수 업데이트가 필요할 수 있습니다.

---

## 💡 핵심 TIP

**데이터베이스 복원은 SQL Editor로, 이미지는 스크립트로!**

1. ✅ 데이터베이스: Supabase SQL Editor 사용 (가장 안정적)
2. ✅ 이미지: `node upload-images.js` 사용 (자동화)

---

## 📞 추가 도움이 필요하다면

1. 어떤 테이블이 필요한지 알려주세요
2. 백업 파일에서 해당 부분만 추출해드립니다
3. 단계별로 실행 가이드를 제공합니다
