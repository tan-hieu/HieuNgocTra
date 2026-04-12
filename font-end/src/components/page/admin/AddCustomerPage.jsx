import {
  ChevronRight,
  Eye,
  EyeOff,
  Save,
  Info,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = "http://localhost:8080/api/admin/customers";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  password: "",
  confirmPassword: "",
};

export function AddCustomerPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 2600);
    return () => clearTimeout(t);
  }, [notice]);

  const validate = () => {
    const missing = [];
    if (!form.fullName.trim()) missing.push("Họ tên");
    if (!form.email.trim()) missing.push("Email");
    if (!form.password.trim()) missing.push("Mật khẩu");
    if (!form.confirmPassword.trim()) missing.push("Xác nhận mật khẩu");

    if (missing.length > 0) {
      setNotice({
        type: "error",
        text: "Vui lòng nhập đủ: " + missing.join(", ") + ".",
      });
      return false;
    }

    if (form.password.length < 6) {
      setNotice({
        type: "error",
        text: "Mật khẩu phải có ít nhất 6 ký tự.",
      });
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setNotice({
        type: "error",
        text: "Mật khẩu xác nhận không khớp.",
      });
      return false;
    }

    const phone = form.phone.trim();
    if (!/^0\d{9}$/.test(phone)) {
      setNotice({
        type: "error",
        text: "Số điện thoại phải gồm 10 số và bắt đầu bằng số 0.",
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    setNotice(null);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(), // có thể rỗng
        address: form.address.trim(), // có thể rỗng
        password: form.password,
        status: "ACTIVE",
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: "Bearer " + token } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || data?.details || "Lỗi " + res.status);
      }

      setNotice({
        type: "success",
        text: "Tạo khách hàng thành công.",
      });

      setTimeout(() => navigate("/admin/customers"), 900);
    } catch (err) {
      setNotice({
        type: "error",
        text: err?.message || "Có lỗi khi tạo khách hàng.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-12">
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

      <nav className="flex items-center gap-2 text-[10px] font-bold text-secondary/40 uppercase tracking-normal mb-8">
        <Link
          to="/admin/customers"
          className="hover:text-[#3D5245] transition-colors"
        >
          Khách hàng
        </Link>
        <ChevronRight size={10} className="text-secondary/20" />
        <span className="text-[#3D5245]">Thêm mới</span>
      </nav>

      <div className="mb-12">
        <h2 className="text-4xl font-bold text-[#3D5245]">
          Thêm khách hàng mới
        </h2>
        <p className="text-secondary/60 mt-4 max-w-3xl leading-relaxed text-sm">
          Khởi tạo hồ sơ khách hàng mới cho hệ thống Trà Việt Cao Cấp. Địa chỉ
          có thể để trống.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] p-12 space-y-12"
          >
            <div className="space-y-10">
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 rounded-xl bg-[#E8F0E9] flex items-center justify-center text-[#3D5245] font-bold text-xs">
                  01
                </div>
                <h3 className="text-xl font-bold text-[#3D5245]">
                  Thông tin cá nhân
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal ml-1">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => onChange("fullName", e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-6 py-4 bg-[#F3F3F3] rounded-2xl border-none text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 font-medium text-[#3D5245] transition-all placeholder:text-secondary/30"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal ml-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      onChange(
                        "phone",
                        e.target.value.replace(/\D/g, "").slice(0, 10),
                      )
                    }
                    inputMode="numeric"
                    maxLength={10}
                    pattern="0[0-9]{9}"
                    placeholder="0901234567"
                    className="w-full px-6 py-4 bg-[#F3F3F3] rounded-2xl border-none text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 font-medium text-[#3D5245] transition-all placeholder:text-secondary/30"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal ml-1">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  placeholder="example@traviet.com"
                  className="w-full px-6 py-4 bg-[#F3F3F3] rounded-2xl border-none text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 font-medium text-[#3D5245] transition-all placeholder:text-secondary/30"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal ml-1">
                  Địa chỉ
                </label>
                <textarea
                  rows={4}
                  value={form.address}
                  onChange={(e) => onChange("address", e.target.value)}
                  placeholder="Số nhà, tên đường, phường/xã... (có thể để trống)"
                  className="w-full px-6 py-4 bg-[#F3F3F3] rounded-2xl border-none text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 font-medium text-[#3D5245] transition-all resize-none placeholder:text-secondary/30"
                />
              </div>
            </div>

            <div className="h-px bg-secondary/5" />

            <div className="space-y-10">
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 rounded-xl bg-[#E8F0E9] flex items-center justify-center text-[#3D5245] font-bold text-xs">
                  02
                </div>
                <h3 className="text-xl font-bold text-[#3D5245]">
                  Bảo mật tài khoản
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal ml-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => onChange("password", e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-6 py-4 bg-[#F3F3F3] rounded-2xl border-none text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 font-medium text-[#3D5245] transition-all placeholder:text-secondary/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-secondary/30 hover:text-[#3D5245] transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal ml-1">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) =>
                        onChange("confirmPassword", e.target.value)
                      }
                      placeholder="••••••••"
                      className="w-full px-6 py-4 bg-[#F3F3F3] rounded-2xl border-none text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 font-medium text-[#3D5245] transition-all placeholder:text-secondary/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-secondary/30 hover:text-[#3D5245] transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-6 pt-6">
              <button
                onClick={() => navigate("/admin/customers")}
                className="px-8 py-4 text-sm font-bold text-secondary/60 hover:text-[#3D5245] transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="flex items-center gap-3 px-12 py-4 bg-[#3D5245] text-white font-bold rounded-2xl shadow-xl shadow-[#3D5245]/20 hover:bg-[#2D3E34] transition-all text-sm disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isSubmitting ? "Đang lưu..." : "Lưu thông tin"}
              </button>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#FDFCF9] rounded-[2.5rem] border border-secondary/5 p-10 space-y-8"
          >
            <h4 className="text-xl font-bold text-[#3D5245]">Lưu ý bảo mật</h4>
            <ul className="space-y-5">
              {[
                "Mật khẩu được mã hóa ở backend bằng Spring Security PasswordEncoder.",
                "Số điện thoại có thể trống, nhưng nếu nhập thì không được trùng.",
                "Email là duy nhất trong hệ thống.",
              ].map((note, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-4 text-xs text-secondary/70 leading-relaxed"
                >
                  <CheckCircle2
                    size={18}
                    className="text-[#3D5245] shrink-0 mt-0.5"
                  />
                  {note}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] p-10 space-y-8"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal">
                Tổng quan nhóm
              </h4>
              <div className="w-6 h-6 rounded-full bg-secondary/5 flex items-center justify-center">
                <Info size={14} className="text-secondary/30" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#3D5245]">
                  Hạng thành viên mới
                </span>
                <span className="px-4 py-1.5 bg-[#F5E6C4] text-[#8B6E3F] text-[10px] font-bold rounded-full uppercase tracking-normal">
                  Standard
                </span>
              </div>
              <div className="h-2 w-full bg-secondary/5 rounded-full overflow-hidden">
                <div className="h-full w-1/4 bg-[#3D5245] rounded-full" />
              </div>
              <p className="text-[10px] text-secondary/40 italic leading-relaxed">
                Khách hàng sẽ được kích hoạt ngay sau khi lưu thông tin thành
                công.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
