import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Truck, CreditCard, ShieldCheck, Award } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearCart, getCart } from "../../../utils/cart";

const parsePrice = (price) => {
  if (typeof price === "number") return price;
  if (!price) return 0;
  const digits = String(price).replace(/[^\d]/g, "");
  return parseInt(digits || "0", 10);
};

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("vi-VN") + "đ";
};

const normalizeCheckoutItem = (item) => {
  return {
    id: item && item.id,
    name: (item && item.name) || "Sản phẩm trà",
    image: (item && item.image) || "https://picsum.photos/seed/tea1/200/200",
    weight: (item && item.weight) || "",
    quantity: Math.max(1, Number((item && item.quantity) || 1)),
    price: parsePrice(item && item.price),
  };
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loadingNguoiDung, setLoadingNguoiDung] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [thongTinGiaoHang, setThongTinGiaoHang] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

  const [checkoutItems, setCheckoutItems] = useState([]);

  const isBuyNow = !!(location.state && location.state.buyNowItem);

  useEffect(() => {
    const buyNowItem = location.state && location.state.buyNowItem;

    if (buyNowItem) {
      setCheckoutItems([normalizeCheckoutItem(buyNowItem)]);
      return;
    }

    const cart = getCart();
    setCheckoutItems(cart.map(normalizeCheckoutItem));
  }, [location.state]);

  useEffect(() => {
    let daHuy = false;

    async function taiThongTinNguoiDung() {
      setLoadingNguoiDung(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/auth/me", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(token ? { Authorization: "Bearer " + token } : {}),
          },
        });

        if (!res.ok) {
          throw new Error("Không lấy được thông tin người dùng");
        }

        const data = await res.json().catch(function () {
          return {};
        });

        const user = data && data.user ? data.user : data;

        if (!daHuy) {
          setThongTinGiaoHang((prev) => ({
            ...prev,
            fullName: (user && user.fullName) || "",
            phone: (user && user.phone) || "",
            email: (user && user.email) || "",
            address: (user && user.address) || "",
          }));
        }
      } catch (err) {
        if (!daHuy) {
          console.warn("Không tự động điền được thông tin người dùng:", err);
        }
      } finally {
        if (!daHuy) setLoadingNguoiDung(false);
      }
    }

    taiThongTinNguoiDung();

    return () => {
      daHuy = true;
    };
  }, []);

  const tamTinh = useMemo(() => {
    return checkoutItems.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0,
    );
  }, [checkoutItems]);

  const tongCong = tamTinh;

  const capNhatThongTin = (field, value) => {
    setThongTinGiaoHang((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmOrder = async () => {
    setErrorMsg("");

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMsg("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
      return;
    }

    if (!thongTinGiaoHang.fullName.trim()) {
      setErrorMsg("Vui lòng nhập họ và tên người nhận.");
      return;
    }
    if (!thongTinGiaoHang.phone.trim()) {
      setErrorMsg("Vui lòng nhập số điện thoại.");
      return;
    }
    if (!thongTinGiaoHang.address.trim()) {
      setErrorMsg("Vui lòng nhập địa chỉ giao hàng.");
      return;
    }
    if (checkoutItems.length === 0) {
      setErrorMsg("Không có sản phẩm để thanh toán.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        receiverName: thongTinGiaoHang.fullName.trim(),
        receiverPhone: thongTinGiaoHang.phone.trim(),
        shippingAddress: thongTinGiaoHang.address.trim(),
        note: thongTinGiaoHang.note.trim(),
        paymentMethod: paymentMethod,
        items: checkoutItems.map((item) => ({
          productId: item.id,
          quantity: Number(item.quantity || 1),
        })),
      };

      const res = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(function () {
        return {};
      });

      if (!res.ok) {
        throw new Error(
          (data && data.message) || "Đặt hàng thất bại. Vui lòng thử lại.",
        );
      }

      if (!isBuyNow) {
        clearCart();
      }

      navigate("/payment-success", {
        state: {
          orderSummary: {
            orderCode: data.orderCode || "",
            createdAt: data.createdAt || new Date().toISOString(),
            total: Number(data.totalAmount || tongCong),
            status: data.orderStatus || "PENDING",
            paymentMethod: data.paymentMethod || paymentMethod,
          },
        },
      });
      window.scrollTo(0, 0);
    } catch (err) {
      setErrorMsg((err && err.message) || "Có lỗi xảy ra khi đặt hàng.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 md:px-10 mt-16">
        <h1 className="text-4xl font-bold mb-10">THANH TOÁN</h1>

        {!!errorMsg && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-10">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Truck className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">Thông tin giao hàng</h3>
              </div>

              {loadingNguoiDung && (
                <div className="mb-4 rounded-lg bg-primary/5 px-4 py-3 text-sm text-slate-600">
                  Đang tải thông tin người dùng...
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập họ và tên người nhận"
                    value={thongTinGiaoHang.fullName}
                    onChange={(e) =>
                      capNhatThongTin("fullName", e.target.value)
                    }
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
                    value={thongTinGiaoHang.phone}
                    onChange={(e) => capNhatThongTin("phone", e.target.value)}
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
                    value={thongTinGiaoHang.email}
                    onChange={(e) => capNhatThongTin("email", e.target.value)}
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
                    value={thongTinGiaoHang.address}
                    onChange={(e) => capNhatThongTin("address", e.target.value)}
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
                    value={thongTinGiaoHang.note}
                    onChange={(e) => capNhatThongTin("note", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">Phương thức thanh toán</h3>
              </div>
              <div className="space-y-3">
                {[
                  {
                    id: "COD",
                    title: "Thanh toán khi nhận hàng (COD)",
                    desc: "Thanh toán bằng tiền mặt khi shipper giao hàng",
                    icon: "💵",
                  },
                  {
                    id: "BANK_TRANSFER",
                    title: "Chuyển khoản ngân hàng",
                    desc: "Chuyển khoản qua ứng dụng ngân hàng hoặc ATM",
                    icon: "🏦",
                  },
                  {
                    id: "WALLET",
                    title: "Ví điện tử (Momo, ZaloPay)",
                    desc: "Thanh toán nhanh qua mã QR",
                    icon: "📱",
                  },
                ].map((method) => (
                  <label
                    key={method.id}
                    className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-primary/30 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
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

          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h3>

              <div className="space-y-6 mb-6 pb-6 border-b border-slate-100">
                {checkoutItems.length === 0 && (
                  <div className="text-sm text-slate-500">
                    Chưa có sản phẩm để thanh toán.
                  </div>
                )}

                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-bg-light flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm line-clamp-2">
                          {item.name}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {item.weight || "Sản phẩm trà"}
                        </p>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-xs italic text-slate-500">
                          Số lượng: {item.quantity}
                        </span>
                        <span className="font-bold">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(tamTinh)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Phí vận chuyển</span>
                  <span className="text-primary font-medium">Miễn phí</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-slate-100">
                  <span>Tổng cộng</span>
                  <span className="text-primary">
                    {formatCurrency(tongCong)}
                  </span>
                </div>
              </div>

              <motion.button
                onClick={handleConfirmOrder}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={checkoutItems.length === 0 || submitting}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold tracking-wider hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐẶT HÀNG"}
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
