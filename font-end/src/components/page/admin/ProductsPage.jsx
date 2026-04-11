import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  XCircle,
  Loader2,
  ImagePlus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link as RouterLink } from "react-router-dom";

const API_URL = "http://localhost:8080/api/admin/products";
const ORIGINS_API = "http://localhost:8080/api/admin/origins";
const CATEGORIES_API = "http://localhost:8080/api/admin/categories";
const itemsPerPage = 5;
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1544787210-28272550d795?q=80&w=200&auto=format&fit=crop";

const emptyEditForm = {
  id: "",
  productName: "",
  origin: "",
  category: "",
  shortDesc: "",
  story: "",
  taste: "",
  brewing: "",
  storage: "",
  visual: "",
  aroma: "",
  tasteProfile: "",
  price: "",
  weight: "",
  stock: "",
};

function normalizeApiStatus(status) {
  return String(status || "").toUpperCase();
}

function formatPriceVnd(value) {
  const num = Number(value || 0);
  return new Intl.NumberFormat("vi-VN").format(num) + "đ";
}

function toDisplayStatus(item) {
  const stock = Number(item?.stockQuantity || 0);
  const status = String(item?.status || "").toUpperCase();

  if (status === "OUT_OF_STOCK" || stock <= 0) return "Hết hàng";
  if (stock <= 20) return "Sắp hết";
  return "Còn hàng";
}

function normalizeProduct(item) {
  return {
    id: item?.id,
    name: item?.name || "",
    category: item?.categoryName || "",
    origin: item?.origin || "",
    weight: item?.weight || "",
    shortDescription: item?.shortDescription || "",
    price: formatPriceVnd(item?.price),
    stock: Number(item?.stockQuantity || 0),
    status: toDisplayStatus(item),
    image: item?.mainImageUrl || FALLBACK_IMAGE,
    raw: item,
  };
}

function splitParagraphs(text) {
  if (!text) return [];
  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split(/\n\s*\n/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [originOptions, setOriginOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [notice, setNotice] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState(emptyEditForm);

  const [editMainImageFile, setEditMainImageFile] = useState(null);
  const [editMainImagePreview, setEditMainImagePreview] = useState("");

  const [editExtraImageFiles, setEditExtraImageFiles] = useState([
    null,
    null,
    null,
    null,
  ]);
  const [editExtraImagePreview, setEditExtraImagePreview] = useState([
    "",
    "",
    "",
    "",
  ]);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const token = localStorage.getItem("token");

  const showNotice = (type, title, message) => {
    setNotice({ type, title, message });
  };

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 2800);
    return () => clearTimeout(t);
  }, [notice]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL, {
        headers: token ? { Authorization: "Bearer " + token } : undefined,
      });

      const data = await res.json().catch(() => []);
      if (!res.ok) throw new Error(data?.message || "Lỗi " + res.status);

      const list = Array.isArray(data) ? data.map(normalizeProduct) : [];
      setProducts(list);
    } catch (err) {
      setProducts([]);
      showNotice(
        "error",
        "Lỗi tải dữ liệu",
        err?.message || "Không tải được sản phẩm.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [originRes, categoryRes] = await Promise.all([
        fetch(ORIGINS_API, {
          headers: token ? { Authorization: "Bearer " + token } : undefined,
        }),
        fetch(CATEGORIES_API, {
          headers: token ? { Authorization: "Bearer " + token } : undefined,
        }),
      ]);

      const originData = await originRes.json().catch(() => []);
      const categoryData = await categoryRes.json().catch(() => []);

      if (!originRes.ok) {
        throw new Error(originData?.message || "Không tải được xuất xứ");
      }
      if (!categoryRes.ok) {
        throw new Error(categoryData?.message || "Không tải được danh mục");
      }

      const origins = (Array.isArray(originData) ? originData : [])
        .filter((o) => normalizeApiStatus(o?.status) === "ACTIVE")
        .map((o) => [o.name, o.region].filter(Boolean).join(", "));

      const categories = (Array.isArray(categoryData) ? categoryData : [])
        .filter((c) => normalizeApiStatus(c?.status) === "ACTIVE")
        .map((c) => c.name || "");

      setOriginOptions(origins);
      setCategoryOptions(categories);
    } catch (err) {
      showNotice(
        "error",
        "Lỗi tải dữ liệu",
        err?.message || "Không tải được danh mục/xuất xứ.",
      );
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOptions();
  }, []);

  const filteredProducts = useMemo(() => {
    const kw = searchTerm.trim().toLowerCase();
    if (!kw) return products;

    return products.filter((p) => {
      return (
        String(p.name || "")
          .toLowerCase()
          .includes(kw) ||
        String(p.category || "")
          .toLowerCase()
          .includes(kw)
      );
    });
  }, [products, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / itemsPerPage),
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const pageProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const openEditModal = async (product) => {
    setIsEditOpen(true);
    setIsEditLoading(true);
    setEditForm(emptyEditForm);
    setEditMainImageFile(null);
    setEditMainImagePreview("");
    setEditExtraImageFiles([null, null, null, null]);
    setEditExtraImagePreview(["", "", "", ""]);

    try {
      const res = await fetch(API_URL + "/" + product.id, {
        headers: token ? { Authorization: "Bearer " + token } : undefined,
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Không lấy được chi tiết sản phẩm");
      }

      const descParts = splitParagraphs(data?.rawDescription);
      const flavorParts = splitParagraphs(data?.rawFlavorNotes);

      const extraUrls = Array.isArray(data?.extraImageUrls)
        ? data.extraImageUrls
        : [];
      const extraPreview = [0, 1, 2, 3].map((i) => extraUrls[i] || "");

      setEditForm({
        id: data?.id || "",
        productName: data?.productName || "",
        origin: data?.origin || "",
        category: data?.category || "",
        shortDesc: data?.shortDesc || "",
        story: data?.story || descParts[0] || "",
        taste: data?.taste || flavorParts[0] || "",
        brewing: data?.brewing || "",
        storage: data?.storage || descParts[2] || "",
        visual: data?.visual || descParts[1] || "",
        aroma: data?.aroma || flavorParts[1] || "",
        tasteProfile: data?.tasteProfile || flavorParts[2] || "",
        price: String(data?.price ?? ""),
        weight: String(data?.weight ?? ""),
        stock: String(data?.stock ?? ""),
      });

      setEditMainImagePreview(data?.mainImageUrl || "");
      setEditExtraImagePreview(extraPreview);
    } catch (err) {
      showNotice(
        "error",
        "Mở popup sửa thất bại",
        err?.message || "Không thể lấy dữ liệu chi tiết.",
      );
      setIsEditOpen(false);
    } finally {
      setIsEditLoading(false);
    }
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
  };

  const getMissingEditFields = () => {
    const missing = [];

    if (!editForm.productName.trim()) missing.push("Tên sản phẩm");
    if (!editForm.origin.trim()) missing.push("Xuất xứ");
    if (!editForm.category.trim()) missing.push("Danh mục");
    if (!editForm.weight.toString().trim()) missing.push("Trọng lượng");
    if (!editForm.price.toString().trim()) missing.push("Giá bán");
    if (!editForm.stock.toString().trim()) missing.push("Tồn kho");

    if (!editForm.shortDesc.trim()) missing.push("Mô tả ngắn");
    if (!editForm.story.trim()) missing.push("Câu chuyện sản phẩm");
    if (!editForm.taste.trim()) missing.push("Hương vị");
    if (!editForm.brewing.trim()) missing.push("Nghệ thuật pha trà");
    if (!editForm.storage.trim()) missing.push("Bảo quản");
    if (!editForm.visual.trim()) missing.push("Mô tả ngoại quan");
    if (!editForm.aroma.trim()) missing.push("Hương thơm");
    if (!editForm.tasteProfile.trim()) missing.push("Taste profile");

    // Ảnh đại diện là bắt buộc (file mới hoặc ảnh cũ đang có)
    if (!editMainImageFile && !editMainImagePreview) {
      missing.push("Ảnh đại diện");
    }

    // Ảnh phụ là tùy chọn, không bắt buộc đủ 4 ảnh
    return missing;
  };

  const handleSaveEdit = async () => {
    const missing = getMissingEditFields();
    if (missing.length > 0) {
      showNotice(
        "error",
        "Thiếu thông tin",
        "Vui lòng nhập đầy đủ: " + missing.join(", "),
      );
      return;
    }

    setIsSavingEdit(true);
    try {
      const payload = {
        productName: editForm.productName.trim(),
        origin: editForm.origin.trim(),
        category: editForm.category.trim(),
        shortDesc: editForm.shortDesc.trim(),
        story: editForm.story.trim(),
        taste: editForm.taste.trim(),
        brewing: editForm.brewing.trim(),
        storage: editForm.storage.trim(),
        visual: editForm.visual.trim(),
        aroma: editForm.aroma.trim(),
        tasteProfile: editForm.tasteProfile.trim(),
        price: String(editForm.price),
        weight: String(editForm.weight),
        stock: parseInt(editForm.stock, 10),
      };

      const formData = new FormData();
      formData.append(
        "product",
        new Blob([JSON.stringify(payload)], { type: "application/json" }),
      );

      if (editMainImageFile) {
        formData.append("mainImage", editMainImageFile);
      }
      editExtraImageFiles.forEach((f) => {
        if (f) formData.append("extraImages", f);
      });

      const res = await fetch(API_URL + "/" + editForm.id, {
        method: "PUT",
        headers: token ? { Authorization: "Bearer " + token } : undefined,
        body: formData,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || "Lỗi " + res.status);

      showNotice("success", "Thành công", "Cập nhật sản phẩm thành công.");
      closeEditModal();
      fetchProducts();
    } catch (err) {
      showNotice(
        "error",
        "Cập nhật thất bại",
        err?.message || "Có lỗi khi cập nhật.",
      );
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const id = confirmDelete.id;

    setDeletingId(id);
    try {
      const res = await fetch(API_URL + "/" + id, {
        method: "DELETE",
        headers: token ? { Authorization: "Bearer " + token } : undefined,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || "Lỗi " + res.status);

      setProducts((prev) => prev.filter((p) => p.id !== id));
      showNotice("success", "Thành công", "Xóa sản phẩm thành công.");
      setConfirmDelete(null);
    } catch (err) {
      showNotice("error", "Xóa thất bại", err?.message || "Có lỗi khi xóa.");
    } finally {
      setDeletingId(null);
    }
  };

  const onChangeMainEditImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditMainImageFile(file);
    setEditMainImagePreview(URL.createObjectURL(file));
  };

  const onChangeExtraEditImageAt = (idx) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEditExtraImageFiles((prev) => {
      const next = [...prev];
      next[idx] = file;
      return next;
    });

    setEditExtraImagePreview((prev) => {
      const next = [...prev];
      next[idx] = URL.createObjectURL(file);
      return next;
    });
  };

  return (
    <>
      <AnimatePresence>
        {notice && (
          <motion.div
            key="notice"
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="fixed top-5 right-5 z-[180]"
          >
            <div
              className={
                "min-w-[320px] max-w-[420px] rounded-2xl border px-4 py-3 shadow-xl " +
                (notice.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-rose-50 border-rose-200 text-rose-700")
              }
            >
              <div className="flex items-start gap-3">
                {notice.type === "success" ? (
                  <CheckCircle2 size={18} className="mt-0.5" />
                ) : (
                  <XCircle size={18} className="mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-bold text-sm">{notice.title}</p>
                  <p className="text-sm">{notice.message}</p>
                </div>
                <button
                  onClick={() => setNotice(null)}
                  className="p-1 rounded-md hover:bg-black/5"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-serif font-bold text-primary tracking-tight mb-2">
            Quản lý sản phẩm
          </h2>
          <p className="text-on-surface-variant/60 font-medium">
            Danh sách các loại trà thượng hạng trong kho của bạn.
          </p>
        </div>
        <RouterLink
          to="/admin/products/add"
          className="bg-primary text-white px-6 py-3 rounded-xl font-serif font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          Thêm sản phẩm mới
        </RouterLink>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-primary-container/30 mb-8 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px] relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40"
            size={20}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-12 pr-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/20 font-medium"
          />
        </div>
        <p className="text-sm font-bold text-on-surface-variant/60">
          Hiển thị {filteredProducts.length} sản phẩm
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-primary-container/30 overflow-hidden mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50 border-bottom border-primary-container/20">
              <th className="px-8 py-5 font-serif font-bold text-primary text-sm uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-8 py-5 font-serif font-bold text-primary text-sm uppercase tracking-wider">
                Danh mục
              </th>
              <th className="px-8 py-5 font-serif font-bold text-primary text-sm uppercase tracking-wider">
                Giá bán
              </th>
              <th className="px-8 py-5 font-serif font-bold text-primary text-sm uppercase tracking-wider">
                Tồn kho
              </th>
              <th className="px-8 py-5 font-serif font-bold text-primary text-sm uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-8 py-5 font-serif font-bold text-primary text-sm uppercase tracking-wider text-right">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-primary-container/10">
            {isLoading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-8 py-8 text-center text-secondary/60"
                >
                  Đang tải dữ liệu sản phẩm...
                </td>
              </tr>
            )}

            {!isLoading && pageProducts.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-8 py-8 text-center text-secondary/60"
                >
                  Chưa có sản phẩm nào.
                </td>
              </tr>
            )}

            {!isLoading &&
              pageProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-primary-container/5 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-container overflow-hidden shadow-sm">
                        <motion.img
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="font-serif font-bold text-primary">
                          {product.name}
                        </p>
                        {!!product.shortDescription && (
                          <p className="text-xs text-secondary/50 mt-1 line-clamp-2">
                            {product.shortDescription}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-primary-container/30 text-primary rounded-full text-xs font-bold">
                      {product.category}
                    </span>
                  </td>

                  <td className="px-8 py-5 font-bold text-primary">
                    {product.price}
                  </td>

                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            product.stock > 20
                              ? "bg-primary"
                              : product.stock > 0
                                ? "bg-tertiary"
                                : "bg-error"
                          }`}
                          style={{ width: `${Math.min(product.stock, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-on-surface-variant">
                        {product.stock}
                      </span>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <span
                      className={`text-xs font-bold uppercase tracking-widest ${
                        product.status === "Còn hàng"
                          ? "text-primary"
                          : product.status === "Sắp hết"
                            ? "text-tertiary"
                            : "text-error"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2.5 bg-primary-container/20 hover:bg-primary-container/50 rounded-xl text-primary transition-colors border border-primary-container/30"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() =>
                          setConfirmDelete({
                            id: product.id,
                            name: product.name,
                          })
                        }
                        className="p-2.5 bg-error/5 hover:bg-error/10 rounded-xl text-error transition-colors border border-error/10"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center px-4">
        <p className="text-sm font-bold text-on-surface-variant/60">
          Trang {safePage} / {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={safePage === 1}
            className="p-2 rounded-xl bg-white border border-primary-container/30 text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-container/20 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                safePage === i + 1
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white border border-primary-container/30 text-primary hover:bg-primary-container/20"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={safePage === totalPages}
            className="p-2 rounded-xl bg-white border border-primary-container/30 text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-container/20 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isEditOpen && (
          <motion.div
            className="fixed inset-0 z-[160] bg-black/45 p-4 md:p-8 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEditModal}
          >
            <motion.div
              className="max-w-6xl mx-auto bg-white rounded-[2rem] shadow-2xl border border-primary/10 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 md:px-8 py-5 border-b border-primary/10 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-primary">
                  Sửa sản phẩm
                </h3>
                <button
                  onClick={closeEditModal}
                  className="p-2 rounded-xl hover:bg-surface-container-low"
                >
                  <X size={18} />
                </button>
              </div>

              {isEditLoading ? (
                <div className="p-10 text-center text-secondary/70">
                  Đang tải chi tiết sản phẩm...
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-7 p-6 md:p-8 space-y-4 border-r border-primary/10">
                    <div>
                      <label className="block text-[11px] font-bold text-secondary/50 uppercase mb-1.5 ml-1">
                        Tên sản phẩm
                      </label>
                      <input
                        value={editForm.productName}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            productName: e.target.value,
                          }))
                        }
                        placeholder="Tên sản phẩm"
                        className="w-full px-4 py-3 rounded-xl bg-surface-container-low/50 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-secondary/50 uppercase mb-1.5 ml-1">
                          Xuất xứ
                        </label>
                        <select
                          value={editForm.origin}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              origin: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 rounded-xl bg-surface-container-low/50 outline-none"
                        >
                          <option value="">Chọn xuất xứ</option>
                          {originOptions.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-secondary/50 uppercase mb-1.5 ml-1">
                          Danh mục
                        </label>
                        <select
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              category: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 rounded-xl bg-surface-container-low/50 outline-none"
                        >
                          <option value="">Chọn danh mục</option>
                          {categoryOptions.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-secondary/50 uppercase mb-1.5 ml-1">
                          Trọng lượng
                        </label>
                        <input
                          value={editForm.weight}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              weight: e.target.value,
                            }))
                          }
                          placeholder="Trọng lượng"
                          className="w-full px-4 py-3 rounded-xl bg-surface-container-low/50 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-secondary/50 uppercase mb-1.5 ml-1">
                          Giá bán
                        </label>
                        <input
                          value={editForm.price}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              price: e.target.value,
                            }))
                          }
                          placeholder="Giá bán"
                          className="w-full px-4 py-3 rounded-xl bg-surface-container-low/50 outline-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-secondary/50 uppercase mb-1.5 ml-1">
                          Tồn kho
                        </label>
                        <input
                          value={editForm.stock}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              stock: e.target.value,
                            }))
                          }
                          placeholder="Tồn kho"
                          className="w-full px-4 py-3 rounded-xl bg-surface-container-low/50 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-secondary/50 uppercase mb-1.5 ml-1">
                        Mô tả ngắn
                      </label>
                      <textarea
                        rows={3}
                        value={editForm.shortDesc}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            shortDesc: e.target.value,
                          }))
                        }
                        placeholder="Mô tả ngắn"
                        className="w-full px-4 py-3 rounded-xl bg-surface-container-low/50 outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-secondary/50 uppercase mb-1.5 ml-1">
                        Câu chuyện sản phẩm
                      </label>
                      <textarea
                        rows={3}
                        value={editForm.story}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, story: e.target.value }))
                        }
                        placeholder="Câu chuyện sản phẩm"
                        className="w-full px-4 py-3 rounded-xl bg-surface-container-low/50 outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-secondary/50 uppercase mb-1.5 ml-1">
                        Hương vị
                      </label>
                      <textarea
                        rows={3}
                        value={editForm.taste}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, taste: e.target.value }))
                        }
                        placeholder="Hương vị"
                        className="w-full px-4 py-3 rounded-xl bg-surface-container-low/50 outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-secondary/50 uppercase mb-1.5 ml-1">
                        Nghệ thuật pha trà
                      </label>
                      <textarea
                        rows={3}
                        value={editForm.brewing}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            brewing: e.target.value,
                          }))
                        }
                        placeholder="Nghệ thuật pha trà"
                        className="w-full px-4 py-3 rounded-xl bg-surface-container-low/50 outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-secondary/50 uppercase mb-1.5 ml-1">
                        Bảo quản
                      </label>
                      <textarea
                        rows={3}
                        value={editForm.storage}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            storage: e.target.value,
                          }))
                        }
                        placeholder="Bảo quản"
                        className="w-full px-4 py-3 rounded-xl bg-surface-container-low/50 outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-secondary/50 uppercase mb-1.5 ml-1">
                        Mô tả ngoại quan
                      </label>
                      <textarea
                        rows={3}
                        value={editForm.visual}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, visual: e.target.value }))
                        }
                        placeholder="Mô tả ngoại quan"
                        className="w-full px-4 py-3 rounded-xl bg-surface-container-low/50 outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-secondary/50 uppercase mb-1.5 ml-1">
                        Hương thơm
                      </label>
                      <textarea
                        rows={3}
                        value={editForm.aroma}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, aroma: e.target.value }))
                        }
                        placeholder="Hương thơm"
                        className="w-full px-4 py-3 rounded-xl bg-surface-container-low/50 outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-secondary/50 uppercase mb-1.5 ml-1">
                        Taste profile
                      </label>
                      <textarea
                        rows={3}
                        value={editForm.tasteProfile}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            tasteProfile: e.target.value,
                          }))
                        }
                        placeholder="Taste profile"
                        className="w-full px-4 py-3 rounded-xl bg-surface-container-low/50 outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-6 md:p-8 space-y-5 bg-surface-container-low/20">
                    <h4 className="text-lg font-bold text-primary">Hình ảnh</h4>

                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onChangeMainEditImage}
                      />
                      <div className="aspect-square rounded-2xl border-2 border-dashed border-primary/20 bg-white overflow-hidden flex items-center justify-center cursor-pointer">
                        {editMainImagePreview ? (
                          <img
                            src={editMainImagePreview}
                            alt="main"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center text-secondary/50">
                            <ImagePlus size={24} className="mx-auto mb-2" />
                            Ảnh đại diện
                          </div>
                        )}
                      </div>
                    </label>

                    <div className="grid grid-cols-4 gap-3">
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <label
                          key={idx}
                          className="aspect-square rounded-xl border-2 border-dashed border-primary/20 bg-white overflow-hidden flex items-center justify-center cursor-pointer"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onChangeExtraEditImageAt(idx)}
                          />
                          {editExtraImagePreview[idx] ? (
                            <img
                              src={editExtraImagePreview[idx]}
                              alt={"extra-" + idx}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Plus size={16} className="text-secondary/40" />
                          )}
                        </label>
                      ))}
                    </div>

                    <p className="text-xs text-secondary/60">
                      Ảnh đại diện là bắt buộc. Ảnh phụ là tùy chọn (có thể thêm
                      1-4 ảnh).
                    </p>
                  </div>
                </div>
              )}

              <div className="px-6 md:px-8 py-4 border-t border-primary/10 flex justify-end gap-3">
                <button
                  onClick={closeEditModal}
                  className="px-5 py-2.5 rounded-xl border border-primary/20 text-primary font-semibold"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSavingEdit}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold disabled:opacity-60 flex items-center gap-2"
                >
                  {isSavingEdit ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : null}
                  {isSavingEdit ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 z-[170] bg-black/45 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              className="w-full max-w-md bg-white rounded-2xl border border-rose-100 p-6 shadow-2xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-xl font-bold text-rose-700 mb-2">
                Xác nhận xóa
              </h4>
              <p className="text-sm text-secondary/70 mb-6">
                Bạn có chắc muốn xóa sản phẩm {confirmDelete.name} không?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2.5 rounded-xl border border-primary/20 text-primary font-semibold"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deletingId !== null}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-semibold disabled:opacity-60 flex items-center gap-2"
                >
                  {deletingId !== null ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : null}
                  {deletingId !== null ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
