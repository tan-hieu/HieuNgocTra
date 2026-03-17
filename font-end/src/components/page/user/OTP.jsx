import { useState, useRef } from "react";
import { Leaf, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function OTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // chuyển sang ô tiếp theo nếu đã nhập
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];
    pasteData.forEach((char, i) => {
      if (!isNaN(Number(char))) {
        newOtp[i] = char;
      }
    });
    setOtp(newOtp);

    const nextIndex = Math.min(pasteData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleBackLogin = () => {
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDa14p0XhdiyYr2eoe7xShH5wtQKjYYiXYZ3GYh6aUonGT2Qng17HQY9KtCHVY1rXGR_z0rJmUDFyjsjOE_L8xJhPiqQq7zX-SZYTSmcFfrUvwNsFkAvrHqOaMK6b4txWhf_o1hFAzB58yNN8FHWBD76mB8rpQsGh1AYaeuuntQhNc4wKvWKuhJEXGV4m02ooqFTBX6EtFdi0xyZDOJgDc00C4FRgsz4z0iQWBauP5nW_0-WNwKG-0Z-Qsil7cWyXzwHSn_wYGhs-uK')",
        }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[420px] px-4"
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex flex-col items-center gap-3 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex justify-center mb-2"
            >
              <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center border border-white/25 shadow-inner">
                <Leaf className="w-8 h-8 text-white fill-white/80" />
              </div>
            </motion.div>

            <h1 className="text-white text-3xl md:text-4xl font-serif font-bold leading-tight tracking-tight">
              Xác thực mã OTP
            </h1>

            <p className="text-white/80 text-sm md:text-base font-normal leading-relaxed max-w-[300px]">
              Một mã xác thực gồm 6 chữ số đã được gửi đến email của bạn. Vui
              lòng nhập mã để tiếp tục.
            </p>
          </div>

          {/* OTP Input Section */}
          <div className="flex justify-center py-1">
            <div className="flex gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-9 h-11 sm:w-11 sm:h-13 text-center rounded-lg bg-white border-0 text-[#4E6B50] text-lg font-bold focus:ring-2 focus:ring-[#ec5b13] focus:outline-none shadow-lg transition-all"
                />
              ))}
            </div>
          </div>

          {/* CTA Button Section */}
          <div className="flex flex-col gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-primary font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-gold hover:text-white transition-all shadow-xl group text-base"
            >
              <span className="uppercase tracking-widest">Xác nhận</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>

          {/* Footer Links Section */}
          <div className="flex flex-col items-center gap-3 text-xs md:text-sm font-medium">
            <div className="text-white/70">
              Bạn chưa nhận được mã?
              <button className="text-white hover:underline ml-1 underline-offset-4 decoration-[#ec5b13]/50 cursor-pointer">
                Gửi lại mã
              </button>
            </div>

            <button
              onClick={handleBackLogin}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Quay lại đăng nhập
            </button>
          </div>
        </div>

        {/* Bottom Branding */}
        <div className="mt-6 flex justify-center text-white/50 text-[9px] tracking-[0.2em] uppercase font-medium">
          Premium Tea Experience © 2024
        </div>
      </motion.div>
    </div>
  );
}
