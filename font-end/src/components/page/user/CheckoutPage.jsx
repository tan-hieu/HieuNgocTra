import {
  Search,
  ShoppingBag,
  User,
  ChevronRight,
  Truck,
  CreditCard,
  ShieldCheck,
  Award,
  Leaf,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  Share2,
  PlayCircle,
} from "lucide-react";
// eslint-disable-next-line
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const handleConfirmOrder = () => {
    navigate("/payment-success");
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 md:px-10 mt-16">
        <h1 className="text-4xl font-bold mb-10">THANH TOÁN</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-10">
            {/* Shipping Info */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Truck className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">Thông tin giao hàng</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập họ và tên người nhận"
                    className="w-full bg-white border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    placeholder="0xxx xxx xxx"
                    className="w-full bg-white border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    className="w-full bg-white border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Địa chỉ giao hàng
                  </label>
                  <input
                    type="text"
                    placeholder="Số nhà, tên đường, phường/xã..."
                    className="w-full bg-white border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ghi chú đơn hàng
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ghi chú về thời gian giao hàng hoặc chỉ dẫn địa chỉ..."
                    className="w-full bg-white border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">Phương thức thanh toán</h3>
              </div>
              <div className="space-y-3">
                {[
                  {
                    id: "cod",
                    title: "Thanh toán khi nhận hàng (COD)",
                    desc: "Thanh toán bằng tiền mặt khi shipper giao hàng",
                    icon: "💵",
                  },
                  {
                    id: "bank",
                    title: "Chuyển khoản ngân hàng",
                    desc: "Chuyển khoản qua ứng dụng ngân hàng hoặc ATM",
                    icon: "🏦",
                  },
                  {
                    id: "wallet",
                    title: "Ví điện tử (Momo, ZaloPay)",
                    desc: "Thanh toán nhanh qua mã QR",
                    icon: "📱",
                  },
                ].map((method, idx) => (
                  <label
                    key={method.id}
                    className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-primary/30 transition-all group has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <input
                      type="radio"
                      name="payment"
                      defaultChecked={idx === 0}
                      className="w-5 h-5 text-primary focus:ring-primary border-slate-300"
                    />
                    <div className="text-2xl">{method.icon}</div>
                    <div>
                      <p className="font-bold text-slate-900">{method.title}</p>
                      <p className="text-xs text-slate-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h3>

              <div className="space-y-6 mb-6 pb-6 border-b border-slate-100">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-bg-light flex-shrink-0">
                    <img
                      src="https://picsum.photos/seed/tea1/200/200"
                      alt="Trà Ô Long"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm">
                        Trà Ô Long Thượng Hạng
                      </h4>
                      <p className="text-xs text-slate-500">Hộp 250g</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-xs italic text-slate-500">
                        Số lượng: 1
                      </span>
                      <span className="font-bold">450.000đ</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-bg-light flex-shrink-0">
                    <img
                      src="https://picsum.photos/seed/tea2/200/200"
                      alt="Trà Sen"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm">
                        Trà Sen Tây Hồ Truyền Thống
                      </h4>
                      <p className="text-xs text-slate-500">Hộp 100g</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-xs italic text-slate-500">
                        Số lượng: 2
                      </span>
                      <span className="font-bold">700.000đ</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Tạm tính</span>
                  <span>1.150.000đ</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Phí vận chuyển</span>
                  <span className="text-primary font-medium">Miễn phí</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-slate-100">
                  <span>Tổng cộng</span>
                  <span className="text-primary">1.150.000đ</span>
                </div>
              </div>

              <motion.button
                onClick={handleConfirmOrder}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold tracking-wider hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                XÁC NHẬN ĐẶT HÀNG
              </motion.button>

              <div className="mt-8 grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                <div className="flex flex-col items-center text-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Thanh toán bảo mật
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Award className="w-6 h-6 text-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Chất lượng đảm bảo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
