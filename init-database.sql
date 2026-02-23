-- ShopHub 데이터베이스 초기화 SQL
-- Supabase에서 실행

-- products 테이블 생성
CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- users 테이블 생성 (애플리케이션용, auth.users와 별도)
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS 정책: products는 누구나 읽을 수 있음
CREATE POLICY "products are viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

-- RLS 정책: products는 인증된 사용자만 수정 가능
CREATE POLICY "products are editable by authenticated users"
  ON public.products FOR ALL
  USING (auth.role() = 'authenticated');

-- RLS 정책: users는 자신의 데이터만 볼 수 있음
CREATE POLICY "users can view own data"
  ON public.users FOR SELECT
  USING (auth.uid()::text = id::text);

-- 샘플 데이터 삽입 (선택사항)
INSERT INTO public.products (name, description, price, category, image_url) VALUES
('프리미엄 헤드폰', '고음질 무선 헤드폰', 129000, '전자제품', 'https://pwbwnsbkqaqmwfpnixlo.supabase.co/storage/v1/object/public/products/headphones.png'),
('스마트 워치', '건강 모니터링 스마트 워치', 299000, '전자제품', 'https://pwbwnsbkqaqmwfpnixlo.supabase.co/storage/v1/object/public/products/smartwatch.png'),
('블루투스 스피커', '포터블 블루투스 스피커', 79000, '전자제품', 'https://pwbwnsbkqaqmwfpnixlo.supabase.co/storage/v1/object/public/products/speaker.png'),
('무선 이어버드', '노이즈 캔슬링 이어버드', 189000, '전자제품', 'https://pwbwnsbkqaqmwfpnixlo.supabase.co/storage/v1/object/public/products/earbuds.png'),
('게이밍 키보드', '기계식 RGB 키보드', 159000, '전자제품', 'https://pwbwnsbkqaqmwfpnixlo.supabase.co/storage/v1/object/public/products/keyboard.png');

-- 완료 메시지
SELECT 'ShopHub 데이터베이스 초기화 완료!' AS message;
