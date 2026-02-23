"use client";

import { useState, useRef, useEffect } from "react";
import { 
  uploadImageAndSaveToDB, 
  getImagesFromDB,
  deleteProductFromDB,
  updateProductInDB 
} from "@/lib/image-actions";
import styles from "./page.module.scss";

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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null as File | null,
    existingImageUrl: "",
  });
  const [editPreviewUrl, setEditPreviewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

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

  // 제품 삭제 핸들러
  const handleDelete = async (productId: number, productName: string) => {
    if (!confirm(`"${productName}" 제품을 삭제하시겠습니까?`)) return;
    
    setLoading(true);
    const res = await deleteProductFromDB(productId);
    if (res.success) {
      alert(res.message);
      loadProducts();
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  // 수정 모드 시작
  const startEdit = (product: any) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: null,
      existingImageUrl: product.image_url,
    });
    setEditPreviewUrl(product.image_url);
  };

  // 수정 모드 취소
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      name: "",
      description: "",
      price: "",
      category: "",
      image: null,
      existingImageUrl: "",
    });
    setEditPreviewUrl("");
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };

  // 수정 폼 입력 핸들러
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // 수정 파일 선택 핸들러
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditForm((prev) => ({ ...prev, image: file }));
    if (file) setEditPreviewUrl(URL.createObjectURL(file));
    else setEditPreviewUrl(editForm.existingImageUrl);
  };

  // 제품 수정 저장
  const handleUpdate = async (productId: number) => {
    if (!editForm.name || !editForm.price) {
      alert("제품명과 가격은 필수입니다.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", editForm.name);
    formData.append("description", editForm.description);
    formData.append("price", editForm.price);
    formData.append("category", editForm.category);
    formData.append("existingImageUrl", editForm.existingImageUrl);
    if (editForm.image) {
      formData.append("image", editForm.image);
    }

    const res = await updateProductInDB(productId, formData);
    if (res.success) {
      alert(res.message);
      cancelEdit();
      loadProducts();
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>제품 관리</h1>
        <p className={styles.subtitle}>제품을 등록하고 관리할 수 있습니다</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.formSection}>
        <h2 className={styles.formTitle}>제품 등록</h2>
        
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>제품명</label>
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              className={styles.input}
              placeholder="제품명을 입력하세요"
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>가격</label>
            <input 
              name="price" 
              type="number" 
              min="0" 
              step="0.01" 
              value={form.price} 
              onChange={handleChange} 
              className={styles.input}
              placeholder="가격을 입력하세요"
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>카테고리</label>
            <input 
              name="category" 
              value={form.category} 
              onChange={handleChange} 
              className={styles.input}
              placeholder="예: 전자제품, 의류, 도서 등"
              required 
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>설명</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              className={styles.textarea}
              placeholder="제품 설명을 입력하세요"
              required
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>제품 사진</label>
            <input 
              ref={fileInputRef} 
              name="image" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className={styles.fileInput}
              required 
            />
            {previewUrl && (
              <div className={styles.preview}>
                <img src={previewUrl} alt="미리보기" />
              </div>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton} 
          disabled={loading}
        >
          {loading ? "등록 중..." : "제품 등록"}
        </button>

        {result && (
          <div className={`${styles.message} ${result.success ? styles.success : styles.error}`}>
            {result.message || result.error}
          </div>
        )}
      </form>

      <div className={styles.productsSection}>
        <h2 className={styles.sectionTitle}>등록된 제품 목록</h2>
        
        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : products.length === 0 ? (
          <div className={styles.emptyState}>
            <p>등록된 제품이 없습니다.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>사진</th>
                  <th>제품명</th>
                  <th>설명</th>
                  <th>가격</th>
                  <th>카테고리</th>
                  <th>등록일</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  editingId === p.id ? (
                    // 수정 모드
                    <tr key={p.id} className={styles.editRow}>
                      <td>
                        <div className={styles.editImageWrapper}>
                          <img 
                            src={editPreviewUrl || p.image_url} 
                            alt={p.name} 
                            className={styles.productImage} 
                          />
                          <input
                            type="file"
                            accept="image/*"
                            ref={editFileInputRef}
                            onChange={handleEditFileChange}
                            className={styles.fileInput}
                          />
                        </div>
                      </td>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          className={styles.editInput}
                          required
                        />
                      </td>
                      <td>
                        <textarea
                          name="description"
                          value={editForm.description}
                          onChange={handleEditChange}
                          className={styles.editTextarea}
                          rows={2}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="price"
                          value={editForm.price}
                          onChange={handleEditChange}
                          className={styles.editInput}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="category"
                          value={editForm.category}
                          onChange={handleEditChange}
                          className={styles.editInput}
                        />
                      </td>
                      <td>{new Date(p.created_at).toLocaleString()}</td>
                      <td>
                        <div className={styles.actions}>
                          <button 
                            className={styles.saveBtn} 
                            onClick={() => handleUpdate(p.id)}
                            disabled={loading}
                          >
                            저장
                          </button>
                          <button 
                            className={styles.cancelBtn} 
                            onClick={cancelEdit}
                            disabled={loading}
                          >
                            취소
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // 일반 모드
                    <tr key={p.id}>
                      <td>
                        <img src={p.image_url} alt={p.name} className={styles.productImage} />
                      </td>
                      <td>{p.name}</td>
                      <td>{p.description}</td>
                      <td>
                        {new Intl.NumberFormat('ko-KR', {
                          style: 'currency',
                          currency: 'KRW',
                          maximumFractionDigits: 0,
                        }).format(p.price)}
                      </td>
                      <td>{p.category}</td>
                      <td>{new Date(p.created_at).toLocaleString()}</td>
                      <td>
                        <div className={styles.actions}>
                          <button 
                            className={styles.editBtn} 
                            onClick={() => startEdit(p)}
                            disabled={loading}
                          >
                            수정
                          </button>
                          <button 
                            className={styles.deleteBtn} 
                            onClick={() => handleDelete(p.id, p.name)}
                            disabled={loading}
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 