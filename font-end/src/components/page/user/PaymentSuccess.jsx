// eslint-disable-next-line
import { motion } from "motion/react";
import { CheckCircle2, Leaf, Receipt, ShoppingCart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("vi-VN") + "đ";
};

const formatDate = (iso) => {
  if (!iso) return "--";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "--";
  return d.toLocaleDateString("vi-VN");
};

const statusLabel = (status) => {
  const s = String(status || "").toUpperCase();
  if (s === "PENDING") return "Đang xử lý";
  if (s === "CONFIRMED") return "Đã xác nhận";
  if (s === "PREPARING") return "Đang chuẩn bị";
  if (s === "SHIPPING") return "Đang giao";
  if (s === "DELIVERED") return "Hoàn tất";
  if (s === "CANCELLED") return "Đã hủy";
  return "Đang xử lý";
};

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const summary = (location.state && location.state.orderSummary) || {};
  const orderCode = summary.orderCode || "#---";
  const createdAt = summary.createdAt || new Date().toISOString();
  const total = summary.total || 0;
  const status = summary.status || "PENDING";

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 mt-16 relative overflow-hidden">
        <div className="absolute inset-0 tea-pattern pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-tea-green/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-tea-gold/5 rounded-full blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full bg-white/60 backdrop-blur-sm border border-tea-dark/5 p-8 md:p-12 rounded-3xl shadow-xl shadow-tea-dark/5 text-center relative z-10"
        >
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
            Cảm ơn bạn đã tin tưởng lựa chọn Trà Việt Cao Cấp. Đơn hàng đã được
            ghi nhận.
          </p>

          <div className="bg-tea-bg/50 rounded-2xl p-6 md:p-8 border border-tea-dark/5 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="flex flex-col items-start border-b md:border-b-0 md:border-r border-tea-dark/10 pb-4 md:pb-0">
                <span className="text-xs uppercase tracking-widest text-tea-dark font-bold mb-1">
                  Mã đơn hàng
                </span>
                <span className="text-tea-dark font-semibold text-lg">
                  {orderCode}
                </span>
              </div>
              <div className="flex flex-col items-start border-b md:border-b-0 pb-4 md:pb-0">
                <span className="text-xs uppercase tracking-widest text-tea-dark font-bold mb-1">
                  Ngày đặt
                </span>
                <span className="text-tea-dark font-semibold text-lg">
                  {formatDate(createdAt)}
                </span>
              </div>
              <div className="flex flex-col items-start border-b md:border-b-0 md:border-r border-tea-dark/10 pb-4 md:pb-0 pt-2 md:pt-4">
                <span className="text-xs uppercase tracking-widest text-tea-dark font-bold mb-1">
                  Tổng thanh toán
                </span>
                <span className="text-tea-gold font-bold text-xl">
                  {formatCurrency(total)}
                </span>
              </div>
              <div className="flex flex-col items-start pt-2 md:pt-4">
                <span className="text-xs uppercase tracking-widest text-tea-dark font-bold mb-1">
                  Trạng thái
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-tea-green animate-pulse"></span>
                  <span className="text-tea-dark font-semibold text-lg">
                    {statusLabel(status)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                navigate("/profile?tab=orders");
                window.scrollTo(0, 0);
              }}
              className="px-8 py-4 bg-tea-dark hover:bg-tea-dark/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-tea-dark/20 flex items-center justify-center gap-2 group"
            >
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
