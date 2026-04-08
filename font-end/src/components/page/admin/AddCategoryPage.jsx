import {
  FolderTree,
  Save,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Plus,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";

const STORAGE_KEY = "admin_categories_v1";

const defaultCategories = [
  {
    id: "1",
    name: "Trà Xanh Thái Nguyên",
    description: "Các loại trà xanh đặc sản từ vùng Tân Cương, Thái Nguyên.",
    productCount: 24,
    status: "active",
    slug: "tra-xanh-thai-nguyen",
    displayOrder: 1,
  },
  {
    id: "2",
    name: "Trà Ô Long",
    description: "Trà Ô Long cao cấp từ Lâm Đồng, hương vị thanh khiết.",
    productCount: 18,
    status: "active",
    slug: "tra-o-long",
    displayOrder: 2,
  },
  {
    id: "3",
    name: "Trà Đen (Hồng Trà)",
    description:
      "Trà đen lên men hoàn toàn, phù hợp pha trà sữa hoặc thưởng thức nóng.",
    productCount: 12,
    status: "active",
    slug: "tra-den",
    displayOrder: 3,
  },
  {
    id: "4",
    name: "Trà Ướp Hoa",
    description: "Trà xanh ướp hương hoa tự nhiên: Nhài, Sen, Ngâu.",
    productCount: 15,
    status: "active",
    slug: "tra-uop-hoa",
    displayOrder: 4,
  },
  {
    id: "5",
    name: "Trà Phổ Nhĩ",
    description: "Trà lên men lâu năm, hương vị trầm mặc, cổ điển.",
    productCount: 8,
    status: "inactive",
    slug: "tra-pho-nhi",
    displayOrder: 5,
  },
];

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function readCategories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultCategories;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultCategories;
    return parsed;
  } catch {
    return defaultCategories;
  }
}

function writeCategories(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function AddCategoryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const editId = searchParams.get("id");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const all = readCategories();
    if (!editId) {
      const nextOrder = all.length + 1;
      setDisplayOrder(nextOrder);
      return;
    }

    const found = all.find(function (c) {
      return c.id === editId;
    });

    if (!found) {
      navigate("/admin/categories");
      return;
    }

    setName(found.name || "");
    setSlug(found.slug || "");
    setDescription(found.description || "");
    setStatus(found.status || "active");
    setDisplayOrder(Number(found.displayOrder || 0));
  }, [editId, navigate]);

  const handleSave = () => {
    const cleanName = name.trim();
    const cleanSlug = slugify(slug.trim() || cleanName);

    if (!cleanName) {
      setErrorMsg("Tên danh mục không được để trống.");
      return;
    }

    if (!cleanSlug) {
      setErrorMsg("Slug không hợp lệ.");
      return;
    }

    const all = readCategories();

    const duplicated = all.some(function (c) {
      if (editId && c.id === editId) return false;
      return String(c.slug || "").toLowerCase() === cleanSlug.toLowerCase();
    });

    if (duplicated) {
      setErrorMsg("Slug đã tồn tại. Vui lòng nhập slug khác.");
      return;
    }

    if (editId) {
      const next = all.map(function (c) {
        if (c.id !== editId) return c;
        return {
          ...c,
          name: cleanName,
          slug: cleanSlug,
          description: description.trim(),
          status: status,
          displayOrder: Number(displayOrder || 0),
        };
      });
      writeCategories(next);
    } else {
      const next = [
        {
          id: String(Date.now()),
          name: cleanName,
          slug: cleanSlug,
          description: description.trim(),
          status: status,
          displayOrder: Number(displayOrder || 0),
          productCount: 0,
        },
      ].concat(all);
      writeCategories(next);
    }

    navigate("/admin/categories");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em]">
        <Link
          to="/admin/categories"
          className="text-secondary/30 hover:text-[#3D5245] transition-colors"
        >
          Danh mục
        </Link>
        <ChevronRight size={12} className="text-secondary/20" />
        <span className="text-[#3D5245]">
          {editId ? "Chỉnh sửa" : "Thêm mới"}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div>
          <h2 className="text-4xl font-serif font-bold text-[#3D5245]">
            {editId ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </h2>
          <p className="text-secondary/60 mt-2 font-serif italic">
            Khởi tạo nhóm sản phẩm mới cho bộ sưu tập trà
          </p>
        </div>
        <div className="flex gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/admin/categories")}
            className="px-6 sm:px-8 py-3 text-sm font-bold text-secondary/60 hover:text-[#3D5245] transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 sm:px-10 py-3 bg-[#3D5245] text-white font-bold rounded-xl shadow-lg shadow-[#3D5245]/20 hover:bg-[#2D3E34] transition-all text-sm"
          >
            <Save size={18} />
            {editId ? "Lưu thay đổi" : "Lưu danh mục"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 xl:p-12 shadow-sm border border-secondary/5 space-y-10">
            <div className="flex items-center gap-4 pb-6 border-b border-secondary/5">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F0E9] flex items-center justify-center text-[#3D5245]">
                <FolderTree size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#3D5245]">
                  Thông tin cơ bản
                </h3>
                <p className="text-xs text-secondary/40 font-medium">
                  Cung cấp các thông tin định danh cho danh mục
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-1">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  placeholder="VD: Trà Xanh Đặc Sản"
                  value={name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setName(val);
                    if (!slug.trim()) {
                      setSlug(slugify(val));
                    }
                  }}
                  className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-[#F9F8F3] rounded-[1.5rem] border-none text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 font-medium text-[#3D5245] transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-1">
                  Đường dẫn (Slug)
                </label>
                <input
                  type="text"
                  placeholder="tra-xanh-dac-san"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-[#F9F8F3] rounded-[1.5rem] border-none text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 font-medium text-[#3D5245] transition-all"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-1">
                Mô tả
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả ngắn cho danh mục..."
                className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-[#F9F8F3] rounded-[1.5rem] border-none text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 font-medium text-[#3D5245] transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-1">
                  Trạng thái hiển thị
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-[#F9F8F3] rounded-[1.5rem] border-none text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 font-medium text-[#3D5245] appearance-none transition-all cursor-pointer"
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Tạm ngưng</option>
                </select>
              </div>

              {/* <div className="space-y-3">
                <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-1">
                  Thứ tự hiển thị
                </label>
                <input
                  type="number"
                  min={0}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-[#F9F8F3] rounded-[1.5rem] border-none text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 font-medium text-[#3D5245] transition-all"
                />
              </div> */}
            </div>

            {errorMsg && (
              <p className="text-sm font-semibold text-rose-600">{errorMsg}</p>
            )}
          </div>
        </div>

        <div className="xl:col-span-4 space-y-8">
          <div className="bg-[#3D5245] rounded-[2.5rem] p-8 sm:p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-all duration-700" />
            <ShieldCheck className="mb-6 opacity-50" size={32} />
            <h4 className="text-xl font-bold mb-4">Lưu ý phân loại</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-white/70 leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 shrink-0" />
                Tên danh mục nên ngắn gọn, súc tích và phản ánh đúng nhóm sản
                phẩm.
              </li>
              <li className="flex gap-3 text-sm text-white/70 leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 shrink-0" />
                Đường dẫn (Slug) dùng cho SEO, nên viết không dấu và nối bằng
                dấu gạch ngang.
              </li>
              <li className="flex gap-3 text-sm text-white/70 leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 shrink-0" />
                Thứ tự hiển thị giúp sắp xếp danh mục trên trang chủ hoặc menu.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-sm border border-secondary/5">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-[#3D5245]" size={20} />
              <h4 className="font-bold text-[#3D5245]">Gợi ý hình ảnh</h4>
            </div>
            <div className="aspect-video rounded-2xl bg-[#F9F8F3] flex items-center justify-center border-2 border-dashed border-secondary/10 group cursor-pointer hover:border-[#3D5245]/30 transition-all">
              <div className="text-center">
                <Plus
                  size={24}
                  className="mx-auto mb-2 text-secondary/30 group-hover:text-[#3D5245] transition-colors"
                />
                <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">
                  Tải lên ảnh đại diện
                </p>
              </div>
            </div>
            <p className="text-[10px] text-secondary/40 mt-4 leading-relaxed text-center italic">
              Ảnh đại diện giúp khách hàng nhận diện nhóm sản phẩm trực quan
              hơn.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
