import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Minus,
  Plus,
  Thermometer,
  Timer,
  Droplets,
  Brain,
  Wind,
  Utensils,
} from "lucide-react";
// eslint-disable-next-line
import { motion } from "motion/react";
import RelatedProducts from "../../layout/relatedProducts/RelatedProducts";

// DÙNG CÙNG DATA VỚI AllProductsPage (có thể copy nguyên mảng qua đây)
const products = [
  {
    id: 1,
    name: "Trà Đinh Nõn Thượng Hạng",
    origin: "Thái Nguyên",
    weight: "100g",
    price: "450.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCAqoQlk4W1CbRUYus0QnF2eFhaOLAxSDJfPgMQJQm56p0xADbukjyqiyWaz0vHzpt2bdd_L09RZOKLafH04zajTj69yY24eAVsdeDljJpopYa7Q6CKQMYLG9WO4D60oKQX4fxrfZf6T5k30IGvLTGyG3BCmgzawGAV32Z1WLEySZmLS6aUe3lnDKiEXAE95CnKl1TnJlCkoGovk9tKRiO2UxXNDBxVtMVwB_S1Ya0dH_MRUGRrPYIulIIYAqN6VkRbn84CDACjK4DO",
  },
  {
    id: 2,
    name: "Trà Ô Long Thuần Chủng",
    origin: "Hà Nội",
    weight: "200g",
    price: "850.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBt3SE2AeHJWMKeXmdQvZmy853DoR-qpxUgYslEDhjWTYkLGRpT2_DJdWXHJknqA26RDEfGzqHVARIwvNg8OZqE49HLVTXmkWkfmK0CBOHltikLN60pypBKlurzkGiZYKz2aMIrPTrwV5XEqj-_dPEkfLOTn1gE6yWaQqcZ390Pf9nhun9LxPFexiQlWtydtTol2AI796ztbc_O7n8Vs4tx6f5eq5ONn8illoEcq5MO7oRJz1MIpt7fL2EH-9V95jV3Ts7msND-VbzG",
  },
  {
    id: 3,
    name: "Trà Sen Tây Hồ Cao Cấp",
    origin: "Tây Hồ",
    weight: "300g",
    price: "2.500.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAG3U4uq1_0zVWqkkKkncnSwqqg0om___r-WwAkZ8bSsWb3GdavC6OHAcxuSuGEmFhuP8Eiluh2AYIQG81gzRBbvbiYEPy90a_8yYWdAsdmbM05VzcD1HoFvdHdGoUr1zL-eWgIiCbqr_fjGBblLoI7EHISy2Y4ovzf4EuIIC5DDVEYpmiAS5DhFUYOvESgtsqmI-ftdXvNF4XwHm6M5CsiXQXV34cvSwJMT052nfH2PjqHpc7pqpgPsp9dfyYDX7JBTHxoRip6Nv5G",
    badge: "Bán chạy",
  },
  {
    id: 4,
    name: "Hồng Trà Cổ Thụ",
    origin: "Hà Giang",
    weight: "100g",
    price: "950.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuACgp70KaKbN4p65rhbiXhaut8vmz27do4l2y1SrWVajXrU7hiZb8uNZXSyhAn4jwRyL9bBi7X9-bLry70ajteSbE2trGGZRZMwUvvbMu3e3pqyFD5Vkhr6mHwdo_oFqJwszltxAHr6GIsSCVVOPVCgn5AJ5bTbrEFS_AycNn5NdqYFJgYNiK2vmrRC9UxD0CpkaAqUAu3XhU0OOw2Z7PDEjkYzfV0CsPQm6RcbbTdifqRkjqyeDTqNrYZV2XFRjdaB7OF5kYEHPeJ6",
  },
];

export default function ProductDetailPage() {
  const { productId } = useParams();
  const product =
    products.find((p) => p.id === Number(productId)) || products[0];

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("story");

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

  return (
    <div className="min-h-screen bg-cream selection:bg-primary/20 pt-24 pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left: Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="aspect-[4/5] rounded-xl overflow-hidden bg-[#F7F2E8] group"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <div className="grid grid-cols-4 gap-4">
              {[
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCZWkifbyApzD9PJkSC3rprG2K2ZRpE2DQ9bXl5nhsQFSsJmELO8vToKO9vqBnCOUBYtlAdK1fNNvqMTpzT6ooG0ZZ9uF0JGwlKBnBWqTUlwTxDiQfVrfzqV_5iPrIqRTkPtIORObJCN-qzyPPzTFM2NF9oQNEYTWihhZPyTrJaMKbZ-eVU1MvZMz6hZ6FSKEEJPlG_oOdAiJnYeAD_Ybyuw6oHuLj3MQYIpQGKGCumFFRXu775b1sH4BUlleSvphAGX88XEJMg6w_A",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAzU1uGEvRf1UUTZSTqXfIKT_iat3iIhdPr_8rg8gexfCGpfD8SOaZ22tbPwCpNhgrDQUGnNFu3LNMPj5OJoHtvqZXtbqDKs9luXRqwGlawqIlLwwgFRWotk6RJP7ic0QRS2U6N_b8kUK-xsfi6P3iuTqD8Dpux7Cej_7V6JnwvFjUwyhAJuGBIl3L96Tap7Yno_8vNL-2yE7QfxzgRZvekcKAjQf7sFX9zpf6ZiVDOXQPB9elJEiZOBGfhg-COcfGfbOtjlLfx4nJg",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCQx-E-FDZhiiNdQGaDjhQL8Nf-jIXSGCq96LrbELwtPhx-qezSlf4Y7I5y2vsQH-H9L8U54Xzjoz4OnDKdjayqPLhsgJVXBXZ5KD49AjgDYxv_vlWuykL9DCqkIRKt-ZNDT-QrDmf96D9V-hL5srsBiGSYs7oNGjqRTQVM_L8ZWSTlfg2EzfaRnsuu2KSoMe6F2iVQeoiuicHzZzmU1zvnzw8VNpxQlGXA9IZ0kTdU2IIOvrcOLto00HHu8BntlAeKJaRjoVbvdoHG",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBB4Rae-DANo-IJYA7ab6K0LSJJKtLA_0tZY0f9BRlS9pmOLHd54cYZsUm4oyI8pvTodqym89d56T5wn8ekQSdismriMuau6r1rqgCsMXe2OOai9rB1594PZKmoG3jdcgYZyJbSfVuA56VwN_RfDAztow2V_8vl7ZTVC8LTye9RnRoZEWudtyADq6brY6gKLDPmYbXWbXpqYsM01iDjsJkYnhtwKWLB_t6eCPE6J4Newjhf7pm-hLVn4SpOdpmhWUG9kgmzB_y1Ys_p",
              ].map((img, i) => (
                <button
                  key={i}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    i === 0
                      ? "border-primary"
                      : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <span className="text-gold font-sans text-sm font-bold tracking-widest uppercase mb-2 block">
                Sản phẩm đặc tuyển
              </span>
              <h1 className="text-4xl font-bold text-primary font-display mb-2">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-accent font-body italic">
                {product.price}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-8 py-6 border-y border-primary/10 text-sm mb-6 font-sans">
              {[
                { label: "Mã sản phẩm", value: "ST-2024" },
                { label: "Danh mục", value: "Trà Shan Tuyết" },
                { label: "Trọng lượng", value: "200g" },
                { label: "Xuất xứ", value: "Hà Giang, VN" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between border-b border-primary/5 pb-2"
                >
                  <span className="text-slate-500">{item.label}:</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}

              <div className="flex justify-between items-center py-2 col-span-2">
                <span className="text-slate-500">Trạng thái:</span>
                <span className="bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Còn hàng
                </span>
              </div>
            </div>

            <p className="text-slate-600 mb-8 leading-relaxed italic font-body text-lg">
              "Được thu hái từ những gốc trà cổ thụ hàng trăm năm tuổi trên đỉnh
              Tây Côn Lĩnh hùng vĩ, Trà Shan Tuyết Cổ Thụ mang trong mình tinh
              hoa của đất trời, với lớp lông tơ trắng như tuyết bao phủ búp trà
              non."
            </p>

            {/* Actions */}
            <div className="space-y-6 mt-auto">
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-primary/20 rounded-lg overflow-hidden h-14 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-full flex items-center justify-center hover:bg-primary/5 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-12 text-center border-none focus:ring-0 font-sans font-bold h-full"
                  />

                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-full flex items-center justify-center hover:bg-primary/5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 italic font-sans">
                  Miễn phí vận chuyển cho đơn hàng từ 2.000.000₫
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="h-14 border-2 border-primary text-primary font-bold uppercase tracking-widest rounded-xl hover:bg-primary/5 transition-colors font-sans">
                  Thêm vào giỏ hàng
                </button>

                <button className="h-14 bg-accent text-white font-bold uppercase tracking-widest rounded-xl hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all active:scale-[0.98] font-sans">
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info Tabs */}
        <section className="py-16 border-t border-primary/10">
          <div className="flex flex-wrap gap-8 border-b border-primary/5 mb-10 overflow-x-auto">
            {[
              { id: "story", label: "Câu chuyện sản phẩm" },
              { id: "taste", label: "Hương vị & Cảm nhận" },
              { id: "guide", label: "Hướng dẫn pha trà" },
              { id: "storage", label: "Bảo quản" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 border-b-2 transition-all font-display text-lg ${
                  activeTab === tab.id
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-slate-500 hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-6">
              <h3 className="text-3xl font-bold text-slate-900 mb-4 font-display">
                Tinh hoa từ đỉnh Tây Côn Lĩnh
              </h3>

              <p className="text-slate-600 leading-loose font-body">
                Trà Shan Tuyết Cổ Thụ là loại trà đặc sản của vùng núi cao phía
                Bắc Việt Nam. Những cây trà sống ở độ cao trên 1500m so với mực
                nước biển, quanh năm mây mù bao phủ, nhiệt độ chênh lệch ngày
                đêm lớn. Chính điều kiện khắc nghiệt này đã tạo nên hương vị đậm
                đà, tinh tế và đầy chiều sâu cho từng búp trà.
              </p>

              <p className="text-slate-600 leading-loose font-body">
                Mỗi búp trà được hái thủ công bởi những người dân tộc bản địa
                theo quy chuẩn "1 tôm 2 lá", sau đó được chế biến theo phương
                thức bí truyền để giữ trọn vẹn lớp lông tơ trắng mịn đặc trưng -
                nguồn gốc của cái tên "Shan Tuyết".
              </p>

              <div className="grid grid-cols-3 gap-6 pt-8">
                {[
                  {
                    icon: Thermometer,
                    label: "Nhiệt độ",
                    value: "85°C - 90°C",
                  },
                  { icon: Timer, label: "Thời gian", value: "30 - 45 giây" },
                  { icon: Droplets, label: "Lượng trà", value: "5g / 150ml" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="text-center p-6 bg-[#F7F2E8] rounded-2xl border border-primary/5"
                  >
                    <item.icon className="w-8 h-8 mx-auto text-gold mb-3" />
                    <h4 className="font-sans text-[10px] uppercase font-bold tracking-widest text-primary mb-1">
                      {item.label}
                    </h4>
                    <p className="text-lg font-bold font-sans">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary text-white p-8 rounded-2xl h-fit">
              <h3 className="text-2xl font-bold mb-6 italic text-gold font-display">
                Profile Hương Vị
              </h3>

              <ul className="space-y-6 font-sans">
                {[
                  {
                    icon: Brain,
                    label: "Cảm quan",
                    desc: "Nước trà vàng óng như mật ong, trong trẻo.",
                  },
                  {
                    icon: Wind,
                    label: "Hương thơm",
                    desc: "Mùi cỏ khô, thoảng hương hoa rừng và gỗ mục.",
                  },
                  {
                    icon: Utensils,
                    label: "Vị trà",
                    desc: "Tiền vị chát thanh, hậu vị ngọt sâu lắng, kéo dài.",
                  },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <item.icon className="w-5 h-5 text-gold shrink-0 mt-1" />
                    <div>
                      <h5 className="font-bold text-sm uppercase tracking-wider mb-1">
                        {item.label}
                      </h5>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <RelatedProducts products={relatedProducts} />
      </main>
    </div>
  );
}
