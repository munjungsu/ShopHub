# Supabase 데이터베이스 복원 가이드

## 방법 1: Supabase SQL Editor 사용 (가장 간단) ⭐

### 1단계: Supabase Dashboard 접속
https://supabase.com/dashboard/project/jmstywcxcnytauawjbzy

### 2단계: SQL Editor 열기
- 좌측 메뉴에서 **SQL Editor** 클릭
- 또는 직접 링크: https://supabase.com/dashboard/project/jmstywcxcnytauawjbzy/sql/new

### 3단계: 백업 파일 내용 복사
- `db_cluster-04-08-2025@01-16-39.backup` 파일을 텍스트 편집기로 열기
- 전체 내용 복사 (Ctrl+A, Ctrl+C)

### 4단계: SQL Editor에 붙여넣기
- SQL Editor에 붙여넣기 (Ctrl+V)
- **Run** 버튼 클릭

⚠️ **주의사항:**
- 파일이 크다면 여러 번에 나누어 실행해야 할 수 있습니다
- Supabase의 기본 역할(anon, authenticated 등)과 관련된 오류는 무시해도 됩니다
- 테이블과 데이터만 복원되면 성공입니다

---

## 방법 2: Connection String으로 직접 연결

### 1단계: Connection String 확인
https://supabase.com/dashboard/project/jmstywcxcnytauawjbzy/settings/database

**Connection String 섹션에서:**
- "Connection pooling" 또는 "Direct connection" 선택
- Connection string 복사

예시:
```
postgresql://postgres.[ref]:[password]@[region].pooler.supabase.com:6543/postgres
```

### 2단계: 환경 변수 설정
PowerShell에서:
```powershell
$env:SUPABASE_CONNECTION_STRING = "복사한-connection-string"
```

### 3단계: psql 사용 (PostgreSQL 설치 필요)
```powershell
psql $env:SUPABASE_CONNECTION_STRING -f db_cluster-04-08-2025@01-16-39.backup
```

---

## 이미지 파일 복원

데이터베이스 복원 후 이미지 파일을 Supabase Storage에 업로드:

### 1단계: Storage 버킷 생성
https://supabase.com/dashboard/project/jmstywcxcnytauawjbzy/storage/buckets

- **New bucket** 클릭
- 이름: `products`
- Public bucket: ✅ 체크
- **Create bucket**

### 2단계: 이미지 업로드
- `products` 버킷 클릭
- **Upload files** 클릭
- `backupImg` 폴더의 모든 이미지 선택하여 업로드

### 3단계: Public URL 확인
업로드된 이미지 URL 형식:
```
https://jmstywcxcnytauawjbzy.supabase.co/storage/v1/object/public/products/이미지파일명.png
```

---

## 문제 해결

### 권한 오류가 발생하는 경우
일부 SQL 문은 Supabase의 기본 설정과 충돌할 수 있습니다. 다음 항목들은 건너뛰어도 됩니다:
- `CREATE ROLE` 명령
- `ALTER ROLE` 명령  
- `GRANT` 관련 명령

### 주요 테이블만 복원하기
백업 파일에서 다음 섹션만 찾아서 실행:
1. `CREATE TABLE` 문
2. `COPY` 또는 `INSERT` 문 (데이터)
3. `CREATE INDEX` 문 (선택사항)

---

## 추천 방법 순서

1. **Supabase SQL Editor 사용** (가장 쉬움)
   - 복사 & 붙여넣기만 하면 됨
   - 별도 도구 설치 불필요

2. **TablePlus 같은 GUI 도구 사용**
   - https://tableplus.com/ 다운로드
   - Supabase 연결 정보 입력
   - SQL 파일 Import

3. **psql 명령줄 도구**
   - PostgreSQL 설치 필요
   - 자동화된 복원 가능

---

💡 **TIP:** 파일이 195KB로 작으므로 SQL Editor에 직접 붙여넣는 것이 가장 빠릅니다!
