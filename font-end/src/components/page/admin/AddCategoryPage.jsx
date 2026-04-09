import {
  FolderTree,
  Save,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Plus,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = "http://localhost:8080/api/admin/categories";

const initialForm = {
  name: "",
  description: "",
  status: "active",
};

function toApiStatus(status) {
  return status === "inactive" ? "INACTIVE" : "ACTIVE";
}

export function AddCategoryPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [notice, setNotice] = useState(null);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 2800);
    return () => clearTimeout(t);
  }, [notice]);

  const validateRequired = () => {
    const missing = [];
    if (!form.name.trim()) missing.push("Tên danh mục");
    if (!form.description.trim()) missing.push("Mô tả");
    if (!imageFile) missing.push("Ảnh đại diện");

    if (missing.length > 0) {
      setNotice({
        type: "error",
        text: "Vui lòng nhập đủ: " + missing.join(", ") + ".",
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateRequired()) return;

    setIsSubmitting(true);
    setNotice(null);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        status: toApiStatus(form.status),
      };

      const formData = new FormData();
      formData.append(
        "category",
        new Blob([JSON.stringify(payload)], { type: "application/json" }),
      );
      formData.append("image", imageFile);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: token ? { Authorization: "Bearer " + token } : undefined,
        body: formData,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || data?.details || "Lỗi " + res.status);
      }

      setNotice({ type: "success", text: "Lưu danh mục thành công." });
      setTimeout(() => navigate("/admin/categories"), 900);
    } catch (err) {
      setNotice({
        type: "error",
        text: err?.message || "Có lỗi khi lưu danh mục.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {notice && (
        <motion.div
          className="fixed top-5 right-5 z-[120]"
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
        >
          <div
            className={
              "rounded-xl border px-4 py-3 text-sm font-medium flex items-center gap-2 shadow-lg " +
              (notice.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-rose-50 border-rose-200 text-rose-700")
            }
          >
            {notice.type === "success" ? (
              <CheckCircle2 size={16} />
            ) : (
              <XCircle size={16} />
            )}
            <span>{notice.text}</span>
          </div>
        </motion.div>
      )}

      <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em]">
        <Link
          to="/admin/categories"
          className="text-secondary/30 hover:text-[#3D5245] transition-colors"
        >
          Danh mục
        </Link>
        <ChevronRight size={12} className="text-secondary/20" />
        <span className="text-[#3D5245]">Thêm mới</span>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div>
          <h2 className="text-4xl font-serif font-bold text-[#3D5245]">
            Thêm danh mục mới
          </h2>
          <p className="text-secondary/60 mt-2 font-serif italic">
            Bắt buộc nhập đủ thông tin trước khi lưu
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
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 sm:px-10 py-3 bg-[#3D5245] text-white font-bold rounded-xl shadow-lg shadow-[#3D5245]/20 hover:bg-[#2D3E34] transition-all text-sm disabled:opacity-60"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {isSubmitting ? "Đang lưu..." : "Lưu danh mục"}
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
                  Các mục có dấu * là bắt buộc
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-1">
                Tên danh mục *
              </label>
              <input
                type="text"
                placeholder="VD: Trà Xanh Đặc Sản"
                value={form.name}
                onChange={(e) => onChange("name", e.target.value)}
                className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-[#F9F8F3] rounded-[1.5rem] border-none text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 font-medium text-[#3D5245] transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-1">
                Mô tả *
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => onChange("description", e.target.value)}
                placeholder="Mô tả ngắn cho danh mục..."
                className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-[#F9F8F3] rounded-[1.5rem] border-none text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 font-medium text-[#3D5245] transition-all resize-none"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-1">
                Trạng thái hiển thị
              </label>

              <div className="relative">
                <select
                  value={form.status}
                  onChange={(e) => onChange("status", e.target.value)}
                  className="w-full h-12 pl-6 pr-12 py-0 bg-[#F9F8F3] rounded-[1.5rem] border-none text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 font-medium text-[#3D5245] appearance-none transition-all cursor-pointer"
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Tạm ngưng</option>
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-secondary/60"
                />
              </div>
            </div>
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
                Không nhập thiếu Tên, Mô tả hoặc Ảnh đại diện.
              </li>
              <li className="flex gap-3 text-sm text-white/70 leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 shrink-0" />
                Slug do backend tự sinh, không cần nhập tay.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-sm border border-secondary/5">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-[#3D5245]" size={20} />
              <h4 className="font-bold text-[#3D5245]">
                Ảnh đại diện danh mục *
              </h4>
            </div>

            <label className="aspect-video rounded-2xl bg-[#F9F8F3] flex items-center justify-center border-2 border-dashed border-secondary/10 group cursor-pointer hover:border-[#3D5245]/30 transition-all overflow-hidden">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Plus
                    size={24}
                    className="mx-auto mb-2 text-secondary/30 group-hover:text-[#3D5245] transition-colors"
                  />
                  <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">
                    Tải lên ảnh đại diện
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onImageChange}
              />
            </label>

            <p className="text-[10px] text-secondary/40 mt-4 leading-relaxed text-center italic">
              Ảnh sẽ được upload qua backend và lưu URL vào Cloudinary.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
