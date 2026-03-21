// eslint-disable-next-line
import { motion } from "motion/react";

import { useNavigate } from "react-router-dom";
import {
  Leaf,
  Mail,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Globe,
} from "lucide-react";

export default function App() {
  const navigate = useNavigate();

  const handleBackLogin = () => {
    navigate("/login");
  };

  const handleGoOTP = () => {
    navigate("/otp");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans pt-32 pb-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://plus.unsplash.com/premium_photo-1692049124070-87d5ddfea09a?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Tea Plantation"
          className="w-full h-full object-cover scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Main Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[540px] p-10 sm:p-16 mx-4 bg-white/10 backdrop-blur-[25px] border border-white/20 rounded-[40px] shadow-2xl overflow-hidden"
      >
        {/* Subtle inner gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

        <div className="relative z-20 flex flex-col items-center">
          {/* Logo */}
          <motion.div>
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center border border-white/25 shadow-inner">
                <Leaf className="w-8 h-8 text-white fill-white/80" />
              </div>
            </div>
          </motion.div>

          {/* Header Section */}
          <div className="text-center space-y-3 mb-12">
            <h2 className="font-serif text-white text-[13px] tracking-[0.4em] uppercase opacity-80 font-medium">
              Trà Việt Cao Cấp
            </h2>
            <h1 className="font-serif text-white text-4xl sm:text-5xl font-bold tracking-tight">
              Khôi phục mật khẩu
            </h1>
            <p className="font-body-serif italic text-[#C9A66B] text-lg sm:text-xl leading-relaxed max-w-[340px] mx-auto opacity-90">
              Vui lòng nhập email để nhận hướng dẫn khôi phục tài khoản của bạn.
            </p>
          </div>

          {/* Form */}
          <form
            className="w-full space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-white/80 text-sm font-medium ml-1"
              >
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-white/40 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  type="email"
                  id="email"
                  placeholder="yourname@example.com"
                  className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-black/30 transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleGoOTP}
              className="w-full bg-white text-[#4E6B50] font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#C9A66B] hover:text-white transition-all duration-300 shadow-lg group active:scale-[0.98]"
            >
              <span>Gửi yêu cầu</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Back Link */}
          <div className="mt-8">
            <button
              onClick={handleBackLogin}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Quay lại đăng nhập
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
