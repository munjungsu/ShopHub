import ProductCard from '@/components/ProductCard/ProductCard';
import { getImagesFromDB } from '@/lib/image-actions';

interface ServerProductListProps {
  searchTerm: string;
  selectedCategory: string;
  currentPage: number;
  productsPerPage: number;
}

export default async function ServerProductList({ 
  searchTerm, 
  selectedCategory, 
  currentPage, 
  productsPerPage 
}: ServerProductListProps) {
  // 서버에서 데이터 페칭
  const res = await getImagesFromDB('products');
  const products = res.success ? res.data || [] : [];

  // 검색 및 필터링된 제품 목록
  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 현재 페이지의 제품 목록
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  if (currentProducts.length === 0) {
    return (
      <div style={{ 
        gridColumn: '1 / -1', 
        textAlign: 'center', 
        padding: '4rem 2rem', 
        color: '#6b7280' 
      }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#374151' }}>
          제품을 찾을 수 없습니다
        </h3>
        <p style={{ fontSize: '1rem', margin: 0 }}>
          검색어나 카테고리를 변경해보세요.
        </p>
      </div>
    );
  }

  return (
    <>
      {currentProducts.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
}

// 카테고리 목록을 가져오는 서버 컴포넌트
export async function getProductCategories() {
  const res = await getImagesFromDB('products');
  const products = res.success ? res.data || [] : [];
  return ['all', ...new Set(products.map((product: any) => product.category))];
}

// 총 제품 수를 가져오는 서버 컴포넌트
export async function getFilteredProductCount(searchTerm: string, selectedCategory: string) {
  const res = await getImagesFromDB('products');
  const products = res.success ? res.data || [] : [];
  
  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  return filteredProducts.length;
}
