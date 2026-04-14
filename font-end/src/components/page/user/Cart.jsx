import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import RelatedProducts from "../../layout/relatedProducts/RelatedProducts";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  updateCartItemQuantity,
  removeFromCart,
} from "../../../utils/cart";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [xacNhanXoaId, setXacNhanXoaId] = useState(null);
  const [thongBao, setThongBao] = useState({ open: false, message: "" });

  const hopThoaiRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  useEffect(() => {
    if (xacNhanXoaId === null) return;

    const handleClickOutside = (event) => {
      if (hopThoaiRef.current && !hopThoaiRef.current.contains(event.target)) {
        setXacNhanXoaId(null);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setXacNhanXoaId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [xacNhanXoaId]);

  useEffect(() => {
    if (!thongBao.open) return;
    const timer = setTimeout(() => {
      setThongBao((prev) => ({ ...prev, open: false }));
    }, 2000);

    return () => clearTimeout(timer);
  }, [thongBao.open]);

  const reloadCart = () => setCartItems(getCart());

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const handleCheckout = () => {
    navigate("/checkout");
    window.scrollTo(0, 0);
  };

  const parsePrice = (price) => {
    if (typeof price === "number") return price;
    if (!price) return 0;
    const digits = String(price).replace(/[^\d]/g, "");
    return parseInt(digits || "0", 10);
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN") + "đ";
  };

  const handleIncrease = (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    updateCartItemQuantity(id, (item.quantity || 1) + 1);
    reloadCart();
  };

  const handleDecrease = (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    if ((item.quantity || 1) <= 1) {
      setXacNhanXoaId(id);
      return;
    }
    updateCartItemQuantity(id, item.quantity - 1);
    reloadCart();
  };

  const moXacNhanXoa = (id) => {
    setXacNhanXoaId(id);
  };

  const xacNhanXoaSanPham = () => {
    if (xacNhanXoaId == null) return;

    const tenSanPham =
      cartItems.find((item) => item.id === xacNhanXoaId)?.name || "Sản phẩm";

    removeFromCart(xacNhanXoaId);
    reloadCart();
    setXacNhanXoaId(null);

    setThongBao({
      open: true,
      message: `Đã xóa "${tenSanPham}" khỏi giỏ hàng`,
    });
  };

  const subTotal = cartItems.reduce(
    (sum, item) => sum + parsePrice(item.price) * (item.quantity || 1),
    0,
  );

  const sanPhamLienQuan = cartItems.slice(0, 4).map((item) => ({
    id: item.id,
    category: "Từ giỏ hàng",
    name: item.name,
    price: formatCurrency(parsePrice(item.price)),
    image: item.image || "https://picsum.photos/seed/tea-leaves/400/400",
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 mt-10">
        <div className="mb-10">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-primary mb-2 tracking-tight">
            Giỏ hàng của bạn
          </h2>
          <div className="h-1 w-24 bg-accent rounded-full"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-primary/5">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
                      <th className="px-6 py-5 text-left">Sản phẩm</th>
                      <th className="px-6 py-5 text-center hidden md:table-cell">
                        Giá
                      </th>
                      <th className="px-6 py-5 text-center">Số lượng</th>
                      <th className="px-6 py-5 text-right">Tổng cộng</th>
                      <th className="px-6 py-5 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {cartItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-12 text-center text-slate-500"
                        >
                          Giỏ hàng trống
                        </td>
                      </tr>
                    ) : (
                      cartItems.map((item) => (
                        <tr key={item.id} className="group">
                          <td className="px-6 py-8">
                            <div className="flex items-center gap-6">
                              <div className="w-24 h-24 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                <img
                                  src={
                                    item.image ||
                                    "https://picsum.photos/seed/tea-leaves/200/200"
                                  }
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div>
                                <h3
                                  className="font-serif text-lg font-bold text-slate-800 group-hover:text-primary transition-colors tracking-tight line-clamp-3 leading-snug max-w-[260px]"
                                  style={{
                                    fontFamily:
                                      '"Lora", system-ui, "Segoe UI", sans-serif',
                                  }}
                                  title={item.name}
                                >
                                  {item.name}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                  Sản phẩm
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-8 text-center hidden md:table-cell">
                            <span className="text-slate-600 font-medium">
                              {formatCurrency(parsePrice(item.price))}
                            </span>
                          </td>

                          <td className="px-6 py-8">
                            <div className="flex items-center justify-center">
                              <div className="flex items-center border border-primary/20 rounded-lg overflow-hidden bg-bg-light/30">
                                <button
                                  onClick={() => handleDecrease(item.id)}
                                  className="p-2 hover:bg-primary/10 text-primary transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-10 text-center text-sm font-bold">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleIncrease(item.id)}
                                  className="p-2 hover:bg-primary/10 text-primary transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-8 text-right">
                            <span className="text-primary font-bold text-lg">
                              {formatCurrency(
                                parsePrice(item.price) * (item.quantity || 1),
                              )}
                            </span>
                          </td>

                          <td className="px-6 py-8 text-center">
                            <button
                              onClick={() => moXacNhanXoa(item.id)}
                              className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleContinueShopping}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Tiếp tục mua hàng
              </button>
            </div>
          </div>

          <aside className="w-full lg:w-[400px]">
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-primary/5 border border-primary/5 sticky top-32">
              <h2
                className="text-xl lg:text-2xl font-semibold text-primary mb-6 tracking-normal"
                style={{
                  fontFamily: '"Lora", system-ui, "Segoe UI", sans-serif',
                }}
              >
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Tạm tính</span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(subTotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-primary">Miễn phí</span>
                </div>

                <div className="pt-6 border-t border-primary/10">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-slate-900">
                      Tổng cộng
                    </span>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                        (Đã bao gồm VAT)
                      </p>
                      <span className="text-3xl font-bold text-primary">
                        {formatCurrency(subTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  Tiến hành thanh toán
                  <CreditCard className="w-5 h-5" />
                </button>

                <div className="pt-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <ShieldCheck className="w-5 h-5 text-gold" />
                    Cam kết trà Shan Tuyết cổ thụ 100% nguyên chất
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <Truck className="w-5 h-5 text-gold" />
                    Giao hàng nhanh toàn quốc từ 2-4 ngày
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <RelatedProducts products={sanPhamLienQuan} />
      </main>

      {xacNhanXoaId !== null && (
        <div className="fixed inset-0 z-[100] bg-black/35 flex items-center justify-center px-4">
          <div
            ref={hopThoaiRef}
            className="w-full max-w-md rounded-2xl bg-white border border-primary/10 shadow-2xl p-6"
          >
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Xác nhận xóa sản phẩm
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng không?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setXacNhanXoaId(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={xacNhanXoaSanPham}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {thongBao.open && (
        <div className="fixed top-6 right-6 z-[110]">
          <div className="bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
            {thongBao.message}
          </div>
        </div>
      )}
    </div>
  );
}
