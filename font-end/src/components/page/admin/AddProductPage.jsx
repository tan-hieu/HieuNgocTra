import {
  ChevronRight,
  Save,
  Send,
  Image as ImageIcon,
  Plus,
  X,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageTool,
  Info,
  FileText,
  DollarSign,
  Tag,
  Quote,
  BookOpen,
  Wind,
  Coffee,
  ShieldCheck,
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

const ORIGINS_API = "http://localhost:8080/api/admin/origins";
const CATEGORIES_API = "http://localhost:8080/api/admin/categories";

function normalizeApiStatus(status) {
  return String(status || "").toUpperCase();
}

export function AddProductPage() {
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");

  const [origin, setOrigin] = useState("");
  const [category, setCategory] = useState("");

  const [originOptions, setOriginOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  const [shortDesc, setShortDesc] = useState("");
  const [story, setStory] = useState("");
  const [taste, setTaste] = useState("");
  const [brewing, setBrewing] = useState("");
  const [storage, setStorage] = useState("");
  const [visual, setVisual] = useState("");
  const [aroma, setAroma] = useState("");
  const [tasteProfile, setTasteProfile] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [stock, setStock] = useState("");
  const [isGenerating, setIsGenerating] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [previewMainImage, setPreviewMainImage] = useState(null);
  const [extraImages, setExtraImages] = useState([null, null, null, null]);
  const [previewExtraImages, setPreviewExtraImages] = useState([
    null,
    null,
    null,
    null,
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [notice, setNotice] = useState(null);
  // notice = { type: "success" | "error" | "info", title: string, message: string }

  const showNotice = (type, title, message) => {
    setNotice({ type, title, message });
  };

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2800);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchOptions = async () => {
      setIsLoadingOptions(true);
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
          .map((o) => ({
            id: o.id,
            value: [o.name, o.region].filter(Boolean).join(", "),
            label: [o.name, o.region].filter(Boolean).join(", "),
          }));

        const categories = (Array.isArray(categoryData) ? categoryData : [])
          .filter((c) => normalizeApiStatus(c?.status) === "ACTIVE")
          .map((c) => ({
            id: c.id,
            value: c.name || "",
            label: c.name || "",
          }));

        setOriginOptions(origins);
        setCategoryOptions(categories);

        if (!origin && origins.length > 0) {
          setOrigin(origins[0].value);
        }
        if (!category && categories.length > 0) {
          setCategory(categories[0].value);
        }
      } catch (err) {
        console.error("Load options error:", err);
        showNotice(
          "error",
          "Tải dữ liệu thất bại",
          err?.message || "Không tải được dữ liệu xuất xứ/danh mục",
        );
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  const generateAIContent = async (section) => {
    setIsGenerating(section);
    try {
      showNotice(
        "info",
        "Thông báo",
        "Tính năng AI sẽ được kết nối qua backend sau.",
      );
    } catch (error) {
      console.error("AI Generation Error (stub):", error);
      showNotice("error", "Lỗi AI", "Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsGenerating(null);
    }
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setMainImage(file);
    setPreviewMainImage(URL.createObjectURL(file));
  };

  const handleExtraImageChangeAt = (index) => (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setExtraImages((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });

    setPreviewExtraImages((prev) => {
      const next = [...prev];
      next[index] = URL.createObjectURL(file);
      return next;
    });
  };

  const handlePublish = async () => {
    const missingFields = getMissingFields();

    if (missingFields.length > 0) {
      showNotice(
        "error",
        "Thiếu thông tin",
        "Vui lòng nhập đầy đủ: " + missingFields.join(", "),
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      const productPayload = {
        productName,
        origin,
        category,
        shortDesc,
        story,
        taste,
        brewing,
        storage,
        visual,
        aroma,
        tasteProfile,
        price: price.toString(),
        weight: weight.toString(),
        stock: stock ? parseInt(stock, 10) : 0,
      };

      const formData = new FormData();
      formData.append(
        "product",
        new Blob([JSON.stringify(productPayload)], {
          type: "application/json",
        }),
      );

      if (mainImage) formData.append("mainImage", mainImage);
      extraImages.forEach((file) => {
        if (file) formData.append("extraImages", file);
      });

      const res = await fetch("http://localhost:8080/api/admin/products", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const detail = errData?.details ? ` - ${errData.details}` : "";
        throw new Error(
          errData?.message
            ? `${errData.message}${detail}`
            : `Lỗi ${res.status}`,
        );
      }

      showNotice("success", "Thành công", "Tạo sản phẩm thành công!");
      setTimeout(() => navigate("/admin/products"), 650);
    } catch (err) {
      showNotice(
        "error",
        "Tạo sản phẩm thất bại",
        err?.message || "Có lỗi xảy ra khi tạo sản phẩm.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMissingFields = () => {
    const missing = [];

    if (!productName.trim()) missing.push("Tên sản phẩm");
    if (!origin.trim()) missing.push("Xuất xứ");
    if (!category.trim()) missing.push("Danh mục");
    if (!weight.toString().trim()) missing.push("Trọng lượng");
    if (!price.toString().trim()) missing.push("Giá bán");
    if (!stock.toString().trim()) missing.push("Tồn kho");

    if (!shortDesc.trim()) missing.push("Mô tả ngắn");
    if (!story.trim()) missing.push("Câu chuyện sản phẩm");
    if (!taste.trim()) missing.push("Hương vị");
    if (!brewing.trim()) missing.push("Nghệ thuật pha trà");
    if (!storage.trim()) missing.push("Bảo quản");
    if (!visual.trim()) missing.push("Mô tả ngoại quan");
    if (!aroma.trim()) missing.push("Hương thơm");
    if (!tasteProfile.trim()) missing.push("Taste profile");

    // Ảnh đại diện bắt buộc
    if (!mainImage) missing.push("Ảnh đại diện");

    // Ảnh phụ là tùy chọn (0-4 ảnh)
    return missing;
  };

  return (
    <div className="admin-font max-w-7xl mx-auto pb-24 px-4">
      <AnimatePresence>
        {notice && (
          <motion.div
            key="notice"
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed top-5 right-5 z-[120]"
          >
            <div
              className={
                "min-w-[320px] max-w-[420px] rounded-2xl border px-4 py-3 shadow-xl backdrop-blur " +
                (notice.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : notice.type === "error"
                    ? "bg-rose-50 border-rose-200 text-rose-700"
                    : "bg-blue-50 border-blue-200 text-blue-700")
              }
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  {notice.type === "success" ? (
                    <CheckCircle2 size={18} />
                  ) : notice.type === "error" ? (
                    <XCircle size={18} />
                  ) : (
                    <Info size={18} />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-bold text-sm">{notice.title}</p>
                  <p className="text-sm mt-0.5">{notice.message}</p>
                </div>

                <button
                  onClick={() => setNotice(null)}
                  className="shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-primary/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-secondary/40 uppercase mb-2">
            <RouterLink
              to="/products"
              className="hover:text-primary transition-colors"
            >
              Sản phẩm
            </RouterLink>
            <ChevronRight size={10} />
            <span className="text-primary">Thêm mới</span>
          </div>
          <h2 className="text-4xl font-bold text-primary">
            Kiến tạo Sản phẩm mới
          </h2>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => generateAIContent("all")}
            disabled={isGenerating !== null}
            className="flex-1 md:flex-none px-6 py-3 bg-primary/10 text-primary border-2 border-primary/20 font-bold rounded-2xl hover:bg-primary/20 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating === "all" ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Sparkles size={18} />
            )}
            Tự động soạn thảo tất cả
          </button>
          <button className="flex-1 md:flex-none px-6 py-3 bg-white border-2 border-primary/10 text-primary font-bold rounded-2xl hover:bg-primary/5 transition-all text-sm">
            Lưu nháp
          </button>
          <button
            onClick={handlePublish}
            disabled={isSubmitting || isGenerating !== null}
            className="flex-1 md:flex-none px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:bg-primary/90 transition-all text-sm disabled:opacity-60"
          >
            <Send size={18} />
            {isSubmitting ? "Đang lưu..." : "Xuất bản"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                <Info size={24} />
              </div>
              <h3 className="text-xl font-bold text-primary">
                Thông tin cơ bản
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-secondary/40 uppercase mb-2 ml-1">
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ví dụ: Trà Đinh Nõn Thượng Hạng"
                  className="w-full px-6 py-4 bg-surface-container-low/40 rounded-2xl border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all text-xl font-bold text-primary placeholder:text-secondary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-secondary/40 uppercase mb-2 ml-1">
                  Xuất xứ
                </label>
                <div className="relative">
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    disabled={isLoadingOptions || originOptions.length === 0}
                    className="w-full px-6 py-4 bg-surface-container-low/40 rounded-2xl border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-medium appearance-none cursor-pointer text-secondary outline-none disabled:opacity-60"
                  >
                    {isLoadingOptions && <option>Đang tải xuất xứ...</option>}
                    {!isLoadingOptions && originOptions.length === 0 && (
                      <option>Không có xuất xứ khả dụng</option>
                    )}
                    {!isLoadingOptions &&
                      originOptions.map((o) => (
                        <option key={o.id} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                  </select>
                  <ChevronRight
                    size={14}
                    className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-secondary/30 pointer-events-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-secondary/40 uppercase mb-2 ml-1">
                  Danh mục
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={isLoadingOptions || categoryOptions.length === 0}
                    className="w-full px-6 py-4 bg-surface-container-low/40 rounded-2xl border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-medium appearance-none cursor-pointer text-secondary outline-none disabled:opacity-60"
                  >
                    {isLoadingOptions && <option>Đang tải danh mục...</option>}
                    {!isLoadingOptions && categoryOptions.length === 0 && (
                      <option>Không có danh mục khả dụng</option>
                    )}
                    {!isLoadingOptions &&
                      categoryOptions.map((c) => (
                        <option key={c.id} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                  </select>
                  <ChevronRight
                    size={14}
                    className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-secondary/30 pointer-events-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-secondary/40 uppercase mb-2 ml-1">
                  Trọng lượng (gam)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="200"
                    className="w-full px-6 py-4 bg-surface-container-low/40 rounded-2xl border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-primary outline-none"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-secondary/30 uppercase">
                    GAM
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-secondary/40 uppercase mb-2 ml-1">
                  Giá bán (VNĐ)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    className="w-full px-6 py-4 bg-surface-container-low/40 rounded-2xl border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-primary outline-none"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-secondary/30 uppercase">
                    VNĐ
                  </span>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-secondary/40 uppercase mb-2 ml-1">
                  Tồn kho
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  className="w-full px-6 py-4 bg-surface-container-low/40 rounded-2xl border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-primary outline-none"
                />
              </div>
            </div>
          </section>

          <div className="space-y-8">
            {[
              {
                id: "shortDesc",
                label: "Mô tả ngắn",
                title: "Lời dẫn dắt",
                icon: <Quote size={20} />,
                value: shortDesc,
                setValue: setShortDesc,
              },
              {
                id: "story",
                label: "Câu chuyện sản phẩm",
                title: `Tinh hoa ${productName || "..."}`,
                icon: <BookOpen size={20} />,
                value: story,
                setValue: setStory,
              },
              {
                id: "taste",
                label: "Hương vị & Cảm nhận",
                title: "Hương vị & Cảm nhận",
                icon: <Wind size={20} />,
                value: taste,
                setValue: setTaste,
              },
              {
                id: "brewing",
                label: "Nghệ thuật pha trà",
                title: "Nghệ thuật pha trà",
                icon: <Coffee size={20} />,
                value: brewing,
                setValue: setBrewing,
              },
              {
                id: "storage",
                label: "Bảo quản",
                title: "Bảo quản tinh túy",
                icon: <ShieldCheck size={20} />,
                value: storage,
                setValue: setStorage,
              },
              {
                id: "visual",
                label: "Mô tả ngoại quan",
                title: "Màu sắc & hình thái lá trà",
                icon: <ImageTool size={20} />,
                value: visual,
                setValue: setVisual,
              },
              {
                id: "aroma",
                label: "Hương thơm",
                title: "Tầng hương chủ đạo",
                icon: <Sparkles size={20} />,
                value: aroma,
                setValue: setAroma,
              },
              {
                id: "tasteProfile",
                label: "Taste profile",
                title: "Hậu vị & độ chát/ngọt",
                icon: <Tag size={20} />,
                value: tasteProfile,
                setValue: setTasteProfile,
              },
            ].map((section) => (
              <section
                key={section.id}
                className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                      {section.icon}
                    </div>
                    <h3 className="text-lg font-bold text-primary">
                      {section.label}
                    </h3>
                  </div>
                  <button
                    onClick={() => generateAIContent(section.id)}
                    disabled={isGenerating !== null}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-[10px] font-bold hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/10 active:scale-95"
                  >
                    {isGenerating === section.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Sparkles size={12} />
                    )}
                    Viết bằng AI
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
                    <p className="text-[9px] font-bold text-primary/40 uppercase mb-1.5">
                      Tiêu đề hiển thị
                    </p>
                    <p className="font-bold text-xl text-primary">
                      {section.title}
                    </p>
                  </div>
                  <textarea
                    rows={section.id === "shortDesc" ? 3 : 5}
                    value={section.value}
                    onChange={(e) => section.setValue(e.target.value)}
                    placeholder="Nhập nội dung hoặc dùng AI để tự động soạn thảo..."
                    className="w-full px-6 py-5 bg-surface-container-low/30 rounded-2xl border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-medium text-sm leading-relaxed resize-none text-secondary outline-none"
                  ></textarea>
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                  <ImageIcon size={24} />
                </div>
                <h3 className="text-xl font-bold text-primary">
                  Hình ảnh sản phẩm
                </h3>
              </div>

              <div className="space-y-6">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleMainImageChange}
                  />
                  <div className="aspect-square bg-surface-container-low/50 rounded-[2.5rem] border-2 border-dashed border-primary/20 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-all group relative overflow-hidden shadow-inner">
                    {previewMainImage ? (
                      <img
                        src={previewMainImage}
                        alt="Main preview"
                        className="w-full h-full object-cover rounded-[2.5rem]"
                      />
                    ) : (
                      <div className="flex flex-col items-center group-hover:scale-110 transition-transform duration-700">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary/40 group-hover:bg-primary/20 transition-colors">
                          <Plus size={32} />
                        </div>
                        <span className="text-xs font-bold text-primary/60 uppercase">
                          Ảnh đại diện
                        </span>
                        <p className="text-[10px] text-secondary/30 mt-2 font-bold">
                          Kéo thả hoặc click để tải lên
                        </p>
                      </div>
                    )}
                  </div>
                </label>

                <div>
                  <label className="block text-[10px] font-bold text-secondary/40 uppercase mb-2 ml-1">
                    Ảnh phụ (tối đa 4 ảnh tuỳ ý)
                  </label>

                  <div className="grid grid-cols-4 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <label
                        key={i}
                        className="aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-primary/10 flex items-center justify-center cursor-pointer bg-surface-container-low/30"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleExtraImageChangeAt(i)}
                        />
                        {previewExtraImages[i] ? (
                          <img
                            src={previewExtraImages[i]}
                            alt={`Extra ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Plus size={16} className="text-primary/30" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                  <div className="flex gap-3">
                    <Info
                      size={16}
                      className="text-primary/40 shrink-0 mt-0.5"
                    />
                    <p className="text-[11px] text-secondary/60 font-medium leading-relaxed">
                      Sử dụng ảnh có độ phân giải cao (tối thiểu 1000x1000px) để
                      khách hàng có thể nhìn rõ từng búp trà và màu sắc nước
                      trà.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-primary p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20">
              <h4 className="text-lg font-bold mb-4">Mẹo nhỏ</h4>
              <p className="text-sm opacity-80 leading-relaxed mb-6">
                Tên sản phẩm càng chi tiết, AI càng có thể viết nội dung hấp dẫn
                và sát với thực tế hơn. Đừng quên chọn đúng Xuất xứ để làm nổi
                bật giá trị vùng miền.
              </p>
              <div className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl border border-white/10">
                <Sparkles size={20} />
                <span className="text-xs font-bold uppercase">
                  AI đã sẵn sàng hỗ trợ bạn
                </span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
