import { Leaf, Facebook, Instagram, Youtube } from "lucide-react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="bg-primary text-white pt-20 pb-10 px-4 md:px-10 border-t-4 border-gold">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-white/10 pb-16">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <Leaf className="w-6 h-6 fill-white" />
            <h2 className="text-xl font-bold tracking-tight font-display">
              Trà Việt Cao Cấp
            </h2>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            Chuyên cung cấp các dòng trà Shan Tuyết cổ thụ thượng hạng từ vùng
            núi cao Tây Bắc Việt Nam.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6 uppercase tracking-wider text-sm">
            Sản phẩm
          </h4>
          <ul className="space-y-4 text-white/70 text-sm">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Trà Xanh Cổ Thụ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Trà Ô Long Đặc Sản
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Bạch Trà Tuyết
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Trà Phổ Nhĩ Việt
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Bộ Trà Cụ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 uppercase tracking-wider text-sm">
            Về chúng tôi
          </h4>
          <ul className="space-y-4 text-white/70 text-sm">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Câu chuyện thương hiệu
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Nguồn gốc vùng nguyên liệu
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Kiến thức về trà
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Điều khoản dịch vụ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 uppercase tracking-wider text-sm">
            Đăng ký bản tin
          </h4>
          <p className="text-white/70 text-sm mb-4">
            Nhận thông báo về các vụ trà mới nhất và ưu đãi đặc quyền.
          </p>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email của bạn"
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm focus:ring-accent focus:border-accent"
            />
            <button className="bg-accent hover:bg-accent/90 text-white rounded-xl py-2.5 font-bold text-sm transition-colors">
              Đăng ký ngay
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center text-white/50 text-xs gap-4">
        <p>© 2026 Trà Việt Cao Cấp. Tất cả quyền được bảo lưu.</p>
        <div className="flex flex-col md:flex-row gap-2 md:gap-8 text-center md:text-right">
          <span>Cơ sở sản xuất: Xã Chế Cu Nha, Mù Cang Chải, Yên Bái</span>
          <span>
            Showroom: Khối phố 7A, phường Điện Bàn Đông, thị xã Điện Bàn, tỉnh
            Quảng Nam
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
