import { Search, ShoppingBag, Leaf } from "lucide-react";
import "./Header.css";
import logo from "../../../assets/logo/android-icon-144x144.png";

export default function Header({
  isScrolled,
  handleLogoClick,
  handleLoginClick,
}) {
  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "px-6 lg:px-16 py-3 bg-background-light/95 backdrop-blur-md shadow-md border-b border-primary/5"
          : "px-6 lg:px-16 py-4 bg-gradient-to-b from-black/40 via-black/20 to-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6 lg:gap-8">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-transparent border-none p-0"
          >
            <img
              src={logo}
              alt="Hiếu Ngọc Trà"
              className="w-9 h-9 rounded-full object-cover"
            />
            <h2
              className={`text-xl font-bold tracking-tight font-display transition-colors ${
                isScrolled
                  ? "text-primary"
                  : "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
              }`}
            >
              Trà Việt Cao Cấp
            </h2>
          </button>
          <nav className="hidden md:flex items-center gap-8">
            {["Sản phẩm", "Câu chuyện", "Nguồn gốc", "Liên hệ"].map((item) => (
              <a
                key={item}
                href="#"
                className={`text-sm font-bold transition-colors hover:text-gold ${
                  isScrolled ? "text-primary" : "text-white"
                }`}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 lg:gap-4">
          <div
            className={`hidden lg:flex items-center rounded-full px-4 py-1.5 border text-sm transition-all ${
              isScrolled
                ? "bg-primary/5 border-primary/10"
                : "bg-white/10 border-white/20 backdrop-blur-sm"
            }`}
          >
            <Search
              className={`w-4 h-4 mr-2 ${
                isScrolled ? "text-primary/60" : "text-white/60"
              }`}
            />
            <input
              type="text"
              placeholder="Tìm kiếm trà..."
              className={`bg-transparent border-none focus:ring-0 text-sm w-44 lg:w-56 placeholder:transition-colors ${
                isScrolled
                  ? "text-primary placeholder:text-primary/50"
                  : "text-white placeholder:text-white/50"
              }`}
            />
          </div>

          <button
            className={`p-2.5 rounded-full transition-colors relative ${
              isScrolled
                ? "hover:bg-primary/10 text-primary"
                : "hover:bg-white/10 text-white"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </button>

          <button
            onClick={handleLoginClick}
            className={`px-5 py-1.5 rounded-full font-bold text-sm transition-all border ${
              isScrolled
                ? "border-primary text-primary hover:bg-primary hover:text-white"
                : "border-white text-white hover:bg-white hover:text-primary"
            }`}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </header>
  );
}
