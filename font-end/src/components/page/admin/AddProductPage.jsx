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
} from "lucide-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export function AddProductPage() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [origin, setOrigin] = useState("Hà Giang, Việt Nam");
  const [category, setCategory] = useState("Trà Shan Tuyết");
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

  // TẠM THỜI: chưa gọi AI, chỉ giữ stub để sau này gọi backend
  const generateAIContent = async (section) => {
    setIsGenerating(section);
    try {
      alert("Tính năng AI sẽ được kết nối qua backend sau.");
    } catch (error) {
      console.error("AI Generation Error (stub):", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="admin-font max-w-7xl mx-auto pb-24 px-4">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-primary/10 pb-6">
        <div>
          {/* breadcrumb */}
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
          <button className="flex-1 md:flex-none px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:bg-primary/90 transition-all text-sm">
            <Send size={18} />
            Xuất bản
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Form Content (7/12) */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Basic Info */}
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
                    className="w-full px-6 py-4 bg-surface-container-low/40 rounded-2xl border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-medium appearance-none cursor-pointer text-secondary outline-none"
                  >
                    <option>Hà Giang, Việt Nam</option>
                    <option>Mộc Châu, Việt Nam</option>
                    <option>Thái Nguyên, Việt Nam</option>
                    <option>Bảo Lộc, Việt Nam</option>
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
                    className="w-full px-6 py-4 bg-surface-container-low/40 rounded-2xl border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-medium appearance-none cursor-pointer text-secondary outline-none"
                  >
                    <option>Trà Shan Tuyết</option>
                    <option>Trà Ô Long</option>
                    <option>Trà Xanh</option>
                    <option>Trà Đen</option>
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

          {/* 2. AI Content Sections */}
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
                id: "art",
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

        {/* Right Column - Images (5/12) */}
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
                {/* Main Image */}
                <div className="aspect-square bg-surface-container-low/50 rounded-[2.5rem] border-2 border-dashed border-primary/20 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-all group relative overflow-hidden shadow-inner">
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
                </div>

                {/* Small Images Grid */}
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-surface-container-low/30 rounded-2xl border-2 border-dashed border-primary/10 flex flex-col items-center justify-center text-primary/30 hover:bg-primary/5 transition-all cursor-pointer group"
                    >
                      <Plus
                        size={16}
                        className="group-hover:scale-110 transition-transform"
                      />
                    </div>
                  ))}
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

            {/* Quick Preview Card */}
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
