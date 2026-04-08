import {
  MapPin,
  Save,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Globe,
  Plus,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const initialForm = {
  name: "",
  region: "",
  status: "active",
  description: "",
};

function toApiStatus(status) {
  return status === "inactive" ? "INACTIVE" : "ACTIVE";
}

export function AddOriginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [notice, setNotice] = useState(null); // { type: "success" | "error", text: string }

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errorMsg) setErrorMsg("");
  };

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setNotice(null);

    const name = form.name.trim();
    const region = form.region.trim();

    if (!name) {
      setErrorMsg("Tên vùng xuất xứ không được để trống.");
      setNotice({
        type: "error",
        text: "Tên vùng xuất xứ không được để trống.",
      });
      return;
    }
    if (!region) {
      setErrorMsg("Tỉnh thành không được để trống.");
      setNotice({ type: "error", text: "Tỉnh thành không được để trống." });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      const payload = {
        name,
        region,
        description: form.description.trim(),
        status: toApiStatus(form.status),
      };

      const formData = new FormData();
      formData.append(
        "origin",
        new Blob([JSON.stringify(payload)], { type: "application/json" }),
      );

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("http://localhost:8080/api/admin/origins", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.message || data?.details || `Lỗi ${res.status}`;
        setErrorMsg(msg);
        setNotice({ type: "error", text: msg });
        return;
      }

      setErrorMsg("");
      setNotice({ type: "success", text: "Lưu vùng xuất xứ thành công." });

      setTimeout(() => {
        navigate("/admin/origins");
      }, 900);
    } catch (err) {
      const msg = err?.message || "Có lỗi xảy ra khi lưu vùng xuất xứ.";
      setErrorMsg(msg);
      setNotice({ type: "error", text: msg });
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
        <div
          className={
            "rounded-xl border px-4 py-3 text-sm font-medium flex items-center gap-2 " +
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
      )}

      <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em]">
        <Link
          to="/admin/origins"
          className="text-secondary/30 hover:text-[#3D5245] transition-colors"
        >
          Xuất xứ
        </Link>
        <ChevronRight size={12} className="text-secondary/20" />
        <span className="text-[#3D5245]">Thêm mới</span>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div>
          <h2 className="text-4xl font-serif font-bold text-[#3D5245]">
            Thêm vùng xuất xứ mới
          </h2>
          <p className="text-secondary/60 mt-2 font-serif italic">
            Ghi dấu những vùng đất khai sinh ra tinh hoa trà Việt
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/admin/origins")}
            className="px-8 py-3 text-sm font-bold text-secondary/60 hover:text-[#3D5245] transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-10 py-3 bg-[#3D5245] text-white font-bold rounded-xl shadow-lg shadow-[#3D5245]/20 hover:bg-[#2D3E34] transition-all text-sm disabled:opacity-60"
          >
            <Save size={18} />
            {isSubmitting ? "Đang lưu..." : "Lưu vùng xuất xứ"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 xl:p-12 shadow-sm border border-secondary/5 space-y-10">
            <div className="flex items-center gap-4 pb-6 border-b border-secondary/5">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F0E9] flex items-center justify-center text-[#3D5245]">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#3D5245]">
                  Thông tin địa lý
                </h3>
                <p className="text-xs text-secondary/40 font-medium">
                  Xác định vị trí và đặc điểm vùng nguyên liệu
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-1">
                  Tên vùng xuất xứ
                </label>
                <input
                  type="text"
                  placeholder="VD: Tân Cương"
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  className="w-full px-8 py-5 bg-[#F9F8F3] rounded-[1.5rem] border-none text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 font-medium text-[#3D5245] transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-1">
                  Tỉnh thành
                </label>
                <input
                  type="text"
                  placeholder="VD: Thái Nguyên"
                  value={form.region}
                  onChange={(e) => onChange("region", e.target.value)}
                  className="w-full px-8 py-5 bg-[#F9F8F3] rounded-[1.5rem] border-none text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 font-medium text-[#3D5245] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-1">
                  Trạng thái hoạt động
                </label>
                <select
                  value={form.status}
                  onChange={(e) => onChange("status", e.target.value)}
                  className="w-full px-8 py-5 bg-[#F9F8F3] rounded-[1.5rem] border-none text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 font-medium text-[#3D5245] appearance-none transition-all cursor-pointer"
                >
                  <option value="active">Đang khai thác</option>
                  <option value="inactive">Tạm ngưng</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-1">
                Mô tả (Tùy chọn)
              </label>
              <textarea
                rows={4}
                placeholder="Mô tả đặc điểm thổ nhưỡng, khí hậu, chất trà..."
                value={form.description}
                onChange={(e) => onChange("description", e.target.value)}
                className="w-full px-8 py-5 bg-[#F9F8F3] rounded-[1.5rem] border-none text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 font-medium text-[#3D5245] transition-all resize-none"
              />
            </div>

            {errorMsg && (
              <p className="text-sm font-semibold text-rose-600">{errorMsg}</p>
            )}
          </div>
        </div>

        <div className="xl:col-span-4 space-y-8">
          <div className="bg-[#3D5245] rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-all duration-700" />
            <Globe className="mb-6 opacity-50" size={32} />
            <h4 className="text-xl font-bold mb-4">Lưu ý vùng nguyên liệu</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-white/70 leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 shrink-0" />
                Mỗi vùng xuất xứ có đặc điểm thổ nhưỡng riêng biệt tạo nên hương
                vị trà đặc thù.
              </li>
              <li className="flex gap-3 text-sm text-white/70 leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 shrink-0" />
                Thông tin mô tả chi tiết giúp khách hàng tin tưởng hơn về nguồn
                gốc sản phẩm.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-secondary/5">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-[#3D5245]" size={20} />
              <h4 className="font-bold text-[#3D5245]">Hình ảnh vùng trà</h4>
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
                    Tải lên ảnh phong cảnh
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
              Ảnh sẽ được upload lên Cloudinary, backend lưu URL vào CSDL.
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-secondary/5">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-[#3D5245]" size={18} />
              <h4 className="font-bold text-[#3D5245] text-sm">
                Gợi ý nhập liệu
              </h4>
            </div>
            <p className="text-xs text-secondary/50 leading-relaxed">
              Nên dùng tên vùng + tỉnh thành đúng chuẩn để dễ tìm kiếm, ví dụ:
              Tân Cương - Thái Nguyên.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
