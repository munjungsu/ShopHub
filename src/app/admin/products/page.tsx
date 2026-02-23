"use client";

import { useState, useRef, useEffect } from "react";
import { uploadImageAndSaveToDB, getImagesFromDB } from "@/lib/image-actions";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 제품 목록 불러오기
  const loadProducts = async () => {
    setLoading(true);
    const res = await getImagesFromDB("products");
    if (res.success) setProducts(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // 폼 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, image: file }));
    if (file) setPreviewUrl(URL.createObjectURL(file));
    else setPreviewUrl("");
  };

  // 제품 등록 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) return alert("이미지 파일을 선택하세요.");
    setLoading(true);
    const formData = new FormData();
    formData.append("image", form.image);
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);
    const res = await uploadImageAndSaveToDB(formData, "products");
    setResult(res);
    if (res.success) {
      setForm({ name: "", description: "", price: "", category: "", image: null });
      setPreviewUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      loadProducts();
    }
    setLoading(false);
  };

  // TODO: 제품 수정/삭제 핸들러 구현 필요

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
      <h1>제품 관리 (관리자)</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32, border: "1px solid #eee", padding: 16, borderRadius: 8 }}>
        <h2>제품 등록</h2>
        <div style={{ marginBottom: 12 }}>
          <label>제품명<br /><input name="name" value={form.name} onChange={handleChange} required style={{ width: "100%" }} /></label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>설명<br /><textarea name="description" value={form.description} onChange={handleChange} required style={{ width: "100%" }} rows={2} /></label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>가격<br /><input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required style={{ width: "100%" }} /></label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>카테고리<br /><input name="category" value={form.category} onChange={handleChange} required style={{ width: "100%" }} /></label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>제품 사진<br /><input ref={fileInputRef} name="image" type="file" accept="image/*" onChange={handleFileChange} required /></label>
        </div>
        {previewUrl && <img src={previewUrl} alt="미리보기" style={{ maxWidth: 200, marginBottom: 12 }} />}
        <button type="submit" disabled={loading}>{loading ? "등록 중..." : "제품 등록"}</button>
        {result && <div style={{ marginTop: 8, color: result.success ? "green" : "red" }}>{result.message || result.error}</div>}
      </form>

      <h2>등록된 제품 목록</h2>
      {loading ? <div>로딩 중...</div> : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f8f8" }}>
              <th style={{ border: "1px solid #eee", padding: 8 }}>사진</th>
              <th style={{ border: "1px solid #eee", padding: 8 }}>제품명</th>
              <th style={{ border: "1px solid #eee", padding: 8 }}>설명</th>
              <th style={{ border: "1px solid #eee", padding: 8 }}>가격</th>
              <th style={{ border: "1px solid #eee", padding: 8 }}>카테고리</th>
              <th style={{ border: "1px solid #eee", padding: 8 }}>등록일</th>
              <th style={{ border: "1px solid #eee", padding: 8 }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ border: "1px solid #eee", padding: 8 }}><img src={p.image_url} alt={p.name} style={{ width: 60, height: 60, objectFit: "cover" }} /></td>
                <td style={{ border: "1px solid #eee", padding: 8 }}>{p.name}</td>
                <td style={{ border: "1px solid #eee", padding: 8 }}>{p.description}</td>
                <td style={{ border: "1px solid #eee", padding: 8 }}>{
                  new Intl.NumberFormat('ko-KR', {
                    style: 'currency',
                    currency: 'KRW',
                    maximumFractionDigits: 0,
                  }).format(p.price)
                }</td>
                <td style={{ border: "1px solid #eee", padding: 8 }}>{p.category}</td>
                <td style={{ border: "1px solid #eee", padding: 8 }}>{new Date(p.created_at).toLocaleString()}</td>
                <td style={{ border: "1px solid #eee", padding: 8 }}>
                  {/* TODO: 수정/삭제 버튼 구현 */}
                  <button style={{ marginRight: 8 }} disabled>수정</button>
                  <button style={{ color: "red" }} disabled>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 