import {
  ShoppingBag,
  Search,
  User,
  Leaf,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  Truck,
  Globe,
  Share2,
  PlayCircle,
} from "lucide-react";
// eslint-disable-next-line
import { motion } from "motion/react";
import { useState } from "react";
import RelatedProducts from "../../layout/relatedProducts/RelatedProducts";
import { useNavigate } from "react-router-dom";

const RECOMMENDED_PRODUCTS = [
  {
    id: 1,
    name: "Trà Oolong Đặc Sản",
    price: "850.000đ",
    image: "https://picsum.photos/seed/tea1/400/400",
  },
  {
    id: 2,
    name: "Ấm Tử Sa Nghi Hưng",
    price: "2.450.000đ",
    image: "https://picsum.photos/seed/pot1/400/400",
  },
  {
    id: 3,
    name: "Trà Nõn Tôm Thái Nguyên",
    price: "650.000đ",
    image: "https://picsum.photos/seed/tea2/400/400",
  },
  {
    id: 4,
    name: "Trà Hoa Cúc Tiến Vua",
    price: "420.000đ",
    image: "https://picsum.photos/seed/flower/400/400",
  },
];

const relatedProducts = [
  {
    id: 1,
    category: "Trà Xanh",
    name: "Trà Thái Nguyên Đặc Sản",
    price: "450.000₫",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCAqoQlk4W1CbRUYus0QnF2eFhaOLAxSDJfPgMQJQm56p0xADbukjyqiyWaz0vHzpt2bdd_L09RZOKLafH04zajTj69yY24eAVsdeDljJpopYa7Q6CKQMYLG9WO4D60oKQX4fxrfZf6T5k30IGvLTGyG3BCmgzawGAV32Z1WLEySZmLS6aUe3lnDKiEXAE95CnKl1TnJlCkoGovk9tKRiO2UxXNDBxVtMVwB_S1Ya0dH_MRUGRrPYIulIIYAqN6VkRbn84CDACjK4DO",
  },
  {
    id: 2,
    category: "Trà Ô Long",
    name: "Trà Ô Long Thuần Chủng",
    price: "850.000₫",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBt3SE2AeHJWMKeXmdQvZmy853DoR-qpxUgYslEDhjWTYkLGRpT2_DJdWXHJknqA26RDEfGzqHVARIwvNg8OZqE49HLVTXmkWkfmK0CBOHltikLN60pypBKlurzkGiZYKz2aMIrPTrwV5XEqj-_dPEkfLOTn1gE6yWaQqcZ390Pf9nhun9LxPFexiQlWtydtTol2AI796ztbc_O7n8Vs4tx6f5eq5ONn8illoEcq5MO7oRJz1MIpt7fL2EH-9V95jV3Ts7msND-VbzG",
  },
  {
    id: 3,
    category: "Trà Ướp Hoa",
    name: "Trà Sen Tây Hồ Cao Cấp",
    price: "2.500.000₫",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAG3U4uq1_0zVWqkkKkncnSwqqg0om___r-WwAkZ8bSsWb3GdavC6OHAcxuSuGEmFhuP8Eiluh2AYIQG81gzRBbvbiYEPy90a_8yYWdAsdmbM05VzcD1HoFvdHdGoUr1zL-eWgIiCbqr_fjGBblLoI7EHISy2Y4ovzf4EuIIC5DDVEYpmiAS5DhFUYOvESgtsqmI-ftdXvNF4XwHm6M5CsiXQXV34cvSwJMT052nfH2PjqHpc7pqpgPsp9dfyYDX7JBTHxoRip6Nv5G",
    badge: "Bán chạy",
  },
  {
    id: 4,
    category: "Hồng Trà",
    name: "Hồng Trà Cổ Thụ",
    price: "950.000₫",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuACgp70KaKbN4p65rhbiXhaut8vmz27do4l2y1SrWVajXrU7hiZb8uNZXSyhAn4jwRyL9bBi7X9-bLry70ajteSbE2trGGZRZMwUvvbMu3e3pqyFD5Vkhr6mHwdo_oFqJwszltxAHr6GIsSCVVOPVCgn5AJ5bTbrEFS_AycNn5NdqYFJgYNiK2vmrRC9UxD0CpkaAqUAu3XhU0OOw2Z7PDEjkYzfV0CsPQm6RcbbTdifqRkjqyeDTqNrYZV2XFRjdaB7OF5kYEHPeJ6",
  },
];

export default function Cart() {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const handleCheckout = () => {
    navigate("/checkout");
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 mt-10">
        {/* Page Title */}
        <div className="mb-10">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-primary mb-2 tracking-tight">
            Giỏ hàng của bạn
          </h2>
          <div className="h-1 w-24 bg-accent rounded-full"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items List */}
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
                    <tr className="group">
                      <td className="px-6 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-24 h-24 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                            <img
                              src="https://picsum.photos/seed/tea-leaves/200/200"
                              alt="Trà Shan Tuyết"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <h3
                              className="font-serif text-lg font-bold text-slate-800 group-hover:text-primary transition-colors tracking-tight"
                              style={{
                                fontFamily:
                                  '"Lora", system-ui, "Segoe UI", sans-serif',
                              }}
                            >
                              Trà Shan Tuyết Cổ Thụ
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                              Hộp thiếc cao cấp 200g
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-8 text-center hidden md:table-cell">
                        <span className="text-slate-600 font-medium">
                          1.200.000đ
                        </span>
                      </td>
                      <td className="px-6 py-8">
                        <div className="flex items-center justify-center">
                          <div className="flex items-center border border-primary/20 rounded-lg overflow-hidden bg-bg-light/30">
                            <button
                              onClick={() =>
                                setQuantity(Math.max(1, quantity - 1))
                              }
                              className="p-2 hover:bg-primary/10 text-primary transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center text-sm font-bold">
                              {quantity}
                            </span>
                            <button
                              onClick={() => setQuantity(quantity + 1)}
                              className="p-2 hover:bg-primary/10 text-primary transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-8 text-right">
                        <span className="text-primary font-bold text-lg">
                          {(1200000 * quantity).toLocaleString("vi-VN")}đ
                        </span>
                      </td>
                      <td className="px-6 py-8 text-center">
                        <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
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

          {/* Order Summary Sidebar */}
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
                    {(1200000 * quantity).toLocaleString("vi-VN")}đ
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
                        {(1200000 * quantity).toLocaleString("vi-VN")}đ
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

        {/* sản phẩm liên quan */}
        <RelatedProducts products={relatedProducts} />
      </main>
    </div>
  );
}
