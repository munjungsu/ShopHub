import HeroSection from '../components/HeroSection/HeroSection';
import ProductSection from '../components/ProductSection/ProductSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProductSection />
      
      {/* 개발자 도구 섹션 */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">개발자 도구</h2>
          <div className="flex justify-center space-x-4 flex-wrap gap-4">
            <a 
              href="/supabase-setup" 
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Supabase 설정 가이드
            </a>
            <a 
              href="/env-test" 
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              환경변수 테스트
            </a>
            <a 
              href="/test-env" 
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              연결 테스트
            </a>
            <a 
              href="/image-upload" 
              className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              이미지 업로드 테스트
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
