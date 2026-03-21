// eslint-disable-next-line
import { motion } from "motion/react";
import { CheckCircle2, Leaf, Receipt, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 mt-16 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 tea-pattern pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-tea-green/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-tea-gold/5 rounded-full blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full bg-white/60 backdrop-blur-sm border border-tea-dark/5 p-8 md:p-12 rounded-3xl shadow-xl shadow-tea-dark/5 text-center relative z-10"
        >
          {/* Success Icon */}
          <div className="mb-8 relative inline-block">
            <div className="w-24 h-24 bg-tea-green/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-tea-green/20">
              <CheckCircle2 className="w-12 h-12 text-tea-dark" />
            </div>
            <div className="absolute -right-4 top-0 text-tea-gold">
              <Leaf className="w-8 h-8 animate-pulse" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif text-tea-dark mb-4">
            Đặt hàng thành công!
          </h1>
          <p className="text-slate-600 text-lg mb-10 max-w-md mx-auto">
            Cảm ơn bạn đã tin tưởng lựa chọn Trà Việt Cao Cấp. Chúc bạn có những
            phút giây thưởng trà an nhiên.
          </p>

          {/* Banner Image */}
          <div className="w-full h-48 rounded-2xl overflow-hidden mb-10 shadow-inner">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_uqZu5L4E32KiRsSnIIPv6ZhRCBPeCLGtitYTcbHS9wC-IiiaTWjDC7lu-BMU2pSGEOzzDR1l4fx98cvGVxJourkDf2ffj991cNuTO_nzHjDeh1BUBs1KfSX1Jo1UeUbL1XRgIJxS9il1QyHibCRHS5CHsFEMq1FNZyOsD-dMniXvIEgbsZLkVxR0-PNZzmtvEwLvWVvz6Vwp4x8ya59tMTVkvmE0UfHBZSrOQusJPDHsK6l3OJn5wbwC8WbDUKJlwY0Bw_M4zWAr"
              alt="Premium Green Tea"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Order Info Box */}
          <div className="bg-tea-bg/50 rounded-2xl p-6 md:p-8 border border-tea-dark/5 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="flex flex-col items-start border-b md:border-b-0 md:border-r border-tea-dark/10 pb-4 md:pb-0">
                <span className="text-xs uppercase tracking-widest text-tea-dark font-bold mb-1">
                  Mã đơn hàng
                </span>
                <span className="text-tea-dark font-semibold text-lg">
                  #TVCC-12345
                </span>
              </div>
              <div className="flex flex-col items-start border-b md:border-b-0 pb-4 md:pb-0">
                <span className="text-xs uppercase tracking-widest text-tea-dark font-bold mb-1">
                  Ngày đặt
                </span>
                <span className="text-tea-dark font-semibold text-lg">
                  24/05/2024
                </span>
              </div>
              <div className="flex flex-col items-start border-b md:border-b-0 md:border-r border-tea-dark/10 pb-4 md:pb-0 pt-2 md:pt-4">
                <span className="text-xs uppercase tracking-widest text-tea-dark font-bold mb-1">
                  Tổng thanh toán
                </span>
                <span className="text-tea-gold font-bold text-xl">
                  1.250.000đ
                </span>
              </div>
              <div className="flex flex-col items-start pt-2 md:pt-4">
                <span className="text-xs uppercase tracking-widest text-tea-dark font-bold mb-1">
                  Trạng thái
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-tea-green animate-pulse"></span>
                  <span className="text-tea-dark font-semibold text-lg">
                    Đang xử lý
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-tea-dark hover:bg-tea-dark/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-tea-dark/20 flex items-center justify-center gap-2 group">
              <Receipt className="w-5 h-5" />
              Xem đơn hàng của tôi
            </button>
            <button
              onClick={() => {
                navigate("/products");
                window.scrollTo(0, 0);
              }}
              className="px-8 py-4 bg-tea-dark hover:bg-tea-dark/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-tea-dark/20 flex items-center justify-center gap-2 group"
            >
              <ShoppingCart className="w-5 h-5" />
              Tiếp tục mua hàng
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
