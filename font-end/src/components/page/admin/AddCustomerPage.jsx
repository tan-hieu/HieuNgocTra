import {
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  Save,
  Info,
  CheckCircle2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export function AddCustomerPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="admin-font pb-24 min-h-screen bg-[#F9F8F3] -mx-4 md:-mx-8 px-4 md:px-8 pt-8">
      {/* Breadcrumbs */}
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

      {/* Header */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-[#3D5245]">
          Thêm khách hàng mới
        </h2>
        <p className="text-secondary/60 mt-4 max-w-3xl leading-relaxed text-sm">
          Khởi tạo hồ sơ khách hàng mới cho hệ thống Trà Việt Cao Cấp. Vui lòng
          cung cấp thông tin chính xác để tối ưu hóa trải nghiệm chăm sóc khách
          hàng.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Form */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] p-12 space-y-12"
          >
            {/* Section 01: Thông tin cá nhân */}
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
                    placeholder="090 123 4567"
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
                  placeholder="Số nhà, tên đường, phường/xã..."
                  className="w-full px-6 py-4 bg-[#F3F3F3] rounded-2xl border-none text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 font-medium text-[#3D5245] transition-all resize-none placeholder:text-secondary/30"
                />
              </div>
            </div>

            <div className="h-px bg-secondary/5" />

            {/* Section 02: Bảo mật tài khoản */}
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
                      placeholder="••••••••"
                      className="w-full px-6 py-4 bg-[#F3F3F3] rounded-2xl border-none text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 font-medium text-[#3D5245] transition-all placeholder:text-secondary/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-secondary/30 hover:text-[#3D5245] transition-colors"
                    >
                      <Eye size={18} />
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
                      placeholder="••••••••"
                      className="w-full px-6 py-4 bg-[#F3F3F3] rounded-2xl border-none text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 font-medium text-[#3D5245] transition-all placeholder:text-secondary/30"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-secondary/30 hover:text-[#3D5245] transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-6 pt-6">
              <button
                onClick={() => navigate("/admin/customers")}
                className="px-8 py-4 text-sm font-bold text-secondary/60 hover:text-[#3D5245] transition-colors"
              >
                Hủy
              </button>
              <button className="flex items-center gap-3 px-12 py-4 bg-[#3D5245] text-white font-bold rounded-2xl shadow-xl shadow-[#3D5245]/20 hover:bg-[#2D3E34] transition-all text-sm">
                <Save size={18} />
                Lưu thông tin
              </button>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Info */}
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
                "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa và số.",
                "Số điện thoại sẽ được dùng để xác minh OTP khi thanh toán.",
                "Email là duy nhất, không thể trùng lặp trong hệ thống.",
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
            transition={{ delay: 0.2 }}
            className="relative h-72 rounded-[2.5rem] overflow-hidden group shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800"
              alt="Tea Experience"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3D5245]/90 via-[#3D5245]/40 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-normal mb-3">
                Artisanal Experience
              </p>
              <h4 className="text-2xl font-bold text-white leading-tight">
                Kết nối khách hàng với tinh hoa trà Việt.
              </h4>
            </div>
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
