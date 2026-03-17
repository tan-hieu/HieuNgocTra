import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Leaf,
} from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleGoLogin = () => {
    navigate("/login");
  };

  return (
    <section
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center pt-32 pb-20 py-12 px-4 relative font-sans"
      style={{
        backgroundImage:
          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB2Mbg57kanYa9iiY7TrBu6Sunxoc1OYzkQIjz1sfGe0CRaAu_ts-iAqt-VbatpJEY_qowSThpfhsKqwpY4A9JDLXbVlG0UkP5SxKtHWhmlngzSjLnuUXjYTKpa44IMHxlwXru3h4a0QUizkni5fNrUEEK9BN08h71J4eTocWxY9OgwvR-UouTpdtokxk_1TCz8TjNh-aKw8uj--j3qjDnciEXqUBDvEUtqTeYbgkUcgVoMVSrMRAfzC0rNykh5kOcB0VPw3a-0dhIt')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl rounded-[2.5rem] p-8 md:p-12 backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-white/10 border border-white/20">
            <Leaf className="w-8 h-8 text-[#C9A66B]" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-white font-bold tracking-wide mb-2">
            Đăng ký thành viên
          </h1>
          <p className="text-[#C9A66B] text-xs md:text-sm font-medium tracking-[0.2em] uppercase">
            Trà Việt Cao Cấp — Tuyệt Tác Nghệ Thuật
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Họ và tên */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium px-1">
                Họ và tên
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5 group-focus-within:text-white transition-colors" />
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-white/10 bg-white/10 focus:bg-white/15 focus:ring-1 focus:ring-[#C9A66B] focus:border-[#C9A66B] transition-all text-white placeholder-white/40 outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium px-1">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5 group-focus-within:text-white transition-colors" />
                <input
                  type="email"
                  placeholder="example@tea.vn"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-white/10 bg-white/10 focus:bg-white/15 focus:ring-1 focus:ring-[#C9A66B] focus:border-[#C9A66B] transition-all text-white placeholder-white/40 outline-none"
                />
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium px-1">
                Số điện thoại
              </label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5 group-focus-within:text-white transition-colors" />
                <input
                  type="tel"
                  placeholder="090x xxx xxx"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-white/10 bg-white/10 focus:bg-white/15 focus:ring-1 focus:ring-[#C9A66B] focus:border-[#C9A66B] transition-all text-white placeholder-white/40 outline-none"
                />
              </div>
            </div>

            {/* Ngày sinh */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium px-1">
                Ngày sinh
              </label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5 group-focus-within:text-white transition-colors" />
                <input
                  type="text"
                  placeholder="Ngày / Tháng / Năm"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-white/10 bg-white/10 focus:bg-white/15 focus:ring-1 focus:ring-[#C9A66B] focus:border-[#C9A66B] transition-all text-white placeholder-white/40 outline-none"
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium px-1">
                Mật khẩu
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5 group-focus-within:text-white transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-white/10 bg-white/10 focus:bg-white/15 focus:ring-1 focus:ring-[#C9A66B] focus:border-[#C9A66B] transition-all text-white placeholder-white/40 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium px-1">
                Xác nhận mật khẩu
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5 group-focus-within:text-white transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-white/10 bg-white/10 focus:bg-white/15 focus:ring-1 focus:ring-[#C9A66B] focus:border-[#C9A66B] transition-all text-white placeholder-white/40 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="terms"
              className="rounded border-white/30 bg-white/10 text-[#4E6B50] focus:ring-[#4E6B50] h-4 w-4 cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="text-xs text-white/80 cursor-pointer"
            >
              Tôi đồng ý với các{" "}
              <span className="text-[#C9A66B] underline">
                Điều khoản &amp; Chính sách
              </span>{" "}
              bảo mật
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-white text-[#4E6B50] font-bold py-4 rounded-2xl hover:bg-[#C9A66B] hover:text-white transition-all shadow-xl flex items-center justify-center gap-2 group active:scale-[0.98] tracking-widest uppercase"
          >
            <span>Đăng ký ngay</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Divider */}
        <div className="my-6">
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold">
            <span className="h-px flex-1 bg-white/15" />
            <span>Hoặc tiếp tục với</span>
            <span className="h-px flex-1 bg-white/15" />
          </div>
        </div>

        {/* Social */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-3 py-3 rounded-2xl border border-white/10 bg-white/10 hover:bg-white/20 transition-all text-white group">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-sm font-medium">Google</span>
          </button>
          <button className="flex items-center justify-center gap-3 py-3 rounded-2xl border border-white/10 bg-white/10 hover:bg-white/20 transition-all text-white group">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="text-sm font-medium">Facebook</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            Đã có tài khoản?
            <button
              type="button"
              onClick={handleGoLogin}
              className="ml-1 text-[#C9A66B] font-medium hover:text-[#C9A66B]/80 transition-colors"
            >
              Quay về Đăng nhập
            </button>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
