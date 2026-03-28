import { useState } from "react";
import {
  ArrowRight,
  Leaf,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Facebook,
  HelpCircle,
  Globe,
} from "lucide-react";
// eslint-disable-next-line
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };

  const handleGoRegister = () => {
    navigate("/register");
  };

  const handleGoReset = () => {
    navigate("/reset");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = "Email không được để trống";
      isValid = false;
    } else {
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!gmailRegex.test(email.trim())) {
        newErrors.email = "Email phải đúng định dạng @gmail.com";
        isValid = false;
      }
    }

    if (!password.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // để gửi cookie/session
        body: JSON.stringify({ email, password }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {}

      console.log("login status:", res.status);
      console.log("login body:", data);

      if (!res.ok) {
        setLoginError(data.message || `Đăng nhập thất bại (mã ${res.status})`);
        return;
      }

      const loggedInUser = data?.user ?? data;

      if (onLoginSuccess && loggedInUser) {
        onLoginSuccess(loggedInUser);
      }

      // Điều hướng theo role: nếu ADMIN thì vào /admin
      if (loggedInUser && loggedInUser.roleName === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setLoginError("Lỗi kết nối server");
    }
  };

  const handleGoogleLogin = () => {
    console.log("🔵 Google login button clicked");
    // Redirect tới Spring Security OAuth2 endpoint
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center pt-32 pb-20 px-4 overflow-hidden">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 scale-110 blur-[8px]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBXyBh4Q-STad1AT3cMlwhgN_a0hJ2OCsKhEQ5hiSOQ5Blz6F51PM2oVYkYHgEn5Oi7M8iLM7JSX2eANYlOT4pu8frwObunWh2JmngZ7sdC40601vvRcv6b1s0JVIRaijyxEIHRgAEaLhdgARGOsNTrQqZoHLxJaE-6b6aNh8H4w-a_NqTyyjv7LIbaJwDpj27VRAxcE-cw2m4XL6sQBCbJwryyLrKiqQqoVU07xz2UUN246k21nzuo2nx246NSq-2vibUszK_FlbTD')",
        }}
      />

      {/* Glassmorphism Container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[540px] bg-white/10 backdrop-blur-[30px] rounded-[4rem] p-12 md:p-16 border border-white/20 shadow-[0_32px_64px_rgba(0,0,0,0.3)] text-center"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center border border-white/25 shadow-inner">
            <Leaf className="w-8 h-8 text-white fill-white/80" />
          </div>
        </div>

        {/* Titles */}
        <h3 className="text-white/80 font-bold tracking-[0.4em] text-[10px] md:text-xs mb-3 uppercase">
          Trà Việt Cao Cấp
        </h3>
        <h2 className="text-white text-3xl md:text-5xl font-bold mb-5 tracking-tight">
          Đăng Nhập
        </h2>
        <p className="text-gold/90 italic text-xs md:text-base mb-10 max-w-[280px] mx-auto leading-relaxed">
          Chào mừng bạn quay trở lại với không gian trà Việt
        </p>

        {/* Form */}
        <form className="space-y-7 text-left" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-white/70 text-[11px] font-bold ml-1 uppercase tracking-wider">
              Email hoặc Tên đăng nhập
            </label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white/60 transition-colors" />
              <input
                type="text"
                placeholder="dtanhieu123@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-white/5 border border-white/15 rounded-2xl py-5 pl-14 pr-5 text-white placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all text-sm ${
                  errors.email
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                    : ""
                }`}
              />
            </div>
          </div>

          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}

          <div className="space-y-1">
            <label className="text-white/70 text-[11px] font-bold ml-1 uppercase tracking-wider">
              Mật khẩu
            </label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white/60 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-white/5 border border-white/15 rounded-2xl py-5 pl-14 pr-14 text-white placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all text-sm ${
                  errors.password
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold">
            <label className="flex items-center gap-2 text-white/60 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="peer w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-gold focus:ring-0 transition-all appearance-none border"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 pointer-events-none">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <span className="group-hover:text-white transition-colors">
                Ghi nhớ tôi
              </span>
            </label>
            <button
              type="button"
              onClick={handleGoReset}
              className="text-white/60 hover:text-gold transition-colors"
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-primary font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-gold hover:text-white transition-all shadow-xl group text-base"
          >
            Đăng Nhập
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {loginError && (
            <p className="text-red-400 text-xs mt-3 text-center">
              {loginError}
            </p>
          )}
        </form>

        {/* Divider */}
        <div className="my-6">
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold">
            <span className="h-px flex-1 bg-white/15" />
            <span>Hoặc tiếp tục với</span>
            <span className="h-px flex-1 bg-white/15" />
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-5 mb-8">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white py-4 rounded-2xl hover:bg-white/15 transition-all font-bold text-xs"
            aria-label="Đăng nhập bằng Google"
          >
            {/* Google icon như bản gốc */}
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>

          <button className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white py-4 rounded-2xl hover:bg-white/15 transition-all font-bold text-xs">
            <Facebook className="w-4 h-4 fill-white" />
            Facebook
          </button>
        </div>

        {/* Footer Link */}
        <p className="text-white/60 text-sm mb-4">
          Chưa có tài khoản?{" "}
          <button
            onClick={handleGoRegister}
            className="text-white font-bold hover:text-gold transition-colors border-b border-transparent hover:border-white/80 pb-[1px]"
          >
            Đăng ký ngay
          </button>
        </p>

        {/* Nút quay về trang chủ */}
        <button
          onClick={handleBackHome}
          className="text-white/70 text-xs hover:text-white mb-6 border-b border-transparent hover:border-white/70 pb-[1px]"
        >
          ← Quay lại trang chủ
        </button>
      </motion.div>
    </section>
  );
}
