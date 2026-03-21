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
  Coffee,
} from "lucide-react";
// eslint-disable-next-line
import { motion, AnimatePresence } from "motion/react";
import RelatedProducts from "../../layout/relatedProducts/RelatedProducts";

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

  const TABS = [
    { id: "story", label: "Câu chuyện sản phẩm" },
    { id: "flavor", label: "Hương vị & Cảm nhận" },
    { id: "brewing", label: "Nghệ thuật pha trà" },
    { id: "storage", label: "Bảo quản" },
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

        {/* Tabs Section */}
        <section className="py-24 border-t border-primary/10">
          <div className="flex flex-wrap gap-12 border-b border-primary/10 mb-16 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-6 text-lg font-display font-medium transition-all relative ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-primary/40 hover:text-primary"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div className="lg:col-span-2 space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {activeTab === "story" && (
                    <>
                      <h3 className="text-4xl font-display font-bold mb-8">
                        Tinh hoa từ đỉnh Tây Côn Lĩnh
                      </h3>
                      <p className="text-lg text-slate-600 mb-6 font-body leading-loose">
                        Trà Shan Tuyết Cổ Thụ là loại trà đặc sản của vùng núi
                        cao phía Bắc Việt Nam. Những cây trà sống ở độ cao trên
                        1500m so với mực nước biển, quanh năm mây mù bao phủ,
                        nhiệt độ chênh lệch ngày đêm lớn. Chính điều kiện khắc
                        nghiệt này đã tạo nên hương vị đậm đà, tinh tế và đầy
                        chiều sâu cho từng búp trà.
                      </p>
                      <p className="text-lg text-slate-600 font-body leading-loose">
                        Mỗi búp trà được hái thủ công bởi những người dân tộc
                        bản địa theo quy chuẩn "1 tôm 2 lá", sau đó được chế
                        biến theo phương thức bí truyền để giữ trọn vẹn lớp lông
                        tơ trắng mịn đặc trưng - nguồn gốc của cái tên "Shan
                        Tuyết".
                      </p>
                    </>
                  )}

                  {activeTab === "flavor" && (
                    <>
                      <h3 className="text-4xl font-display font-bold mb-8">
                        Hương vị &amp; Cảm nhận
                      </h3>
                      <p className="text-lg text-slate-600 mb-6 font-body leading-loose">
                        Khi pha, nước trà có màu vàng óng như mật ong rừng,
                        trong trẻo không gợn đục. Hương thơm của trà là sự hòa
                        quyện giữa mùi cỏ khô ngậm sương, thoảng hương hoa rừng
                        và chút trầm mặc của gỗ mục.
                      </p>
                      <p className="text-lg text-slate-600 font-body leading-loose">
                        Vị trà bắt đầu bằng một chút chát thanh tao nơi đầu
                        lưỡi, nhanh chóng tan đi để nhường chỗ cho hậu vị ngọt
                        sâu lắng, kéo dài mãi trong cổ họng. Đây là trải nghiệm
                        thưởng trà đầy tĩnh lặng và thư thái.
                      </p>
                    </>
                  )}

                  {activeTab === "brewing" && (
                    <>
                      <h3 className="text-4xl font-display font-bold mb-8">
                        Nghệ thuật pha trà
                      </h3>
                      <p className="text-lg text-slate-600 mb-6 font-body leading-loose">
                        Để thưởng thức trọn vẹn hương vị của trà Shan Tuyết Cổ
                        Thụ, việc pha trà cần sự tỉ mỉ và thấu hiểu. Sử dụng
                        nước tinh khiết đun sôi và để nguội bớt là chìa khóa để
                        không làm "cháy" búp trà non.
                      </p>
                      <ul className="list-disc pl-6 space-y-4 text-slate-600 text-lg font-body">
                        <li>Tráng ấm chén bằng nước sôi để giữ nhiệt.</li>
                        <li>Cho khoảng 5g trà vào ấm 150ml.</li>
                        <li>Rót nước nóng khoảng 85-90°C vào ấm.</li>
                        <li>
                          Ủ trà trong khoảng 30-45 giây tùy khẩu vị đậm nhạt.
                        </li>
                        <li>Rót trà ra tống rồi chia đều ra các chén quân.</li>
                      </ul>
                    </>
                  )}

                  {activeTab === "storage" && (
                    <>
                      <h3 className="text-4xl font-display font-bold mb-8">
                        Bảo quản tinh túy
                      </h3>
                      <p className="text-lg text-slate-600 mb-6 font-body leading-loose">
                        Trà Shan Tuyết rất nhạy cảm với ánh sáng và độ ẩm. Bảo
                        quản đúng cách sẽ giúp trà giữ được hương vị thơm ngon
                        trong thời gian dài.
                      </p>
                      <ul className="list-disc pl-6 space-y-4 text-slate-600 text-lg font-body">
                        <li>Đựng trà trong hũ gốm, sứ hoặc thiếc kín hơi.</li>
                        <li>
                          Để trà ở nơi khô ráo, thoáng mát, tránh ánh nắng trực
                          tiếp.
                        </li>
                        <li>
                          Tránh để trà gần các vật dụng có mùi mạnh như nước
                          hoa, gia vị.
                        </li>
                        <li>
                          Nên chia nhỏ trà để sử dụng dần, hạn chế mở túi trà
                          quá nhiều lần.
                        </li>
                      </ul>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="grid grid-cols-3 gap-6 pt-12">
                {[
                  {
                    icon: Thermometer,
                    label: "Nhiệt độ",
                    value: "85°C - 90°C",
                  },
                  { icon: Timer, label: "Thời gian", value: "30 - 45 giây" },
                  { icon: Droplets, label: "Lượng trà", value: "5g / 150ml" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[#F7F2E8] p-8 rounded-3xl border border-primary/5 flex flex-col items-center text-center group hover:bg-white transition-all duration-500 hover:shadow-xl hover:shadow-primary/10"
                  >
                    <stat.icon className="w-8 h-8 text-gold mb-4 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 mb-2">
                      {stat.label}
                    </span>
                    <span className="text-xl font-bold text-primary">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <aside className="bg-primary text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 blur-3xl" />
              <h3 className="text-2xl font-display font-bold mb-10 italic text-gold">
                Profile Hương Vị
              </h3>
              <ul className="space-y-10">
                {[
                  {
                    icon: Coffee,
                    title: "Cảm quan",
                    desc: "Nước trà vàng óng như mật ong, trong trẻo.",
                  },
                  {
                    icon: Wind,
                    title: "Hương thơm",
                    desc: "Mùi cỏ khô, thoảng hương hoa rừng và gỗ mục.",
                  },
                  {
                    icon: Utensils,
                    title: "Vị trà",
                    desc: "Tiền vị chát thanh, hậu vị ngọt sâu lắng, kéo dài.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-6 group">
                    <div className="p-3 bg-white/10 rounded-xl group-hover:bg-accent transition-colors">
                      <item.icon className="w-6 h-6 text-gold group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <h5 className="font-sans font-bold text-xs uppercase tracking-widest mb-2 text-gold">
                        {item.title}
                      </h5>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        {/* sản phẩm liên quan */}
        <RelatedProducts products={relatedProducts} />
      </main>
    </div>
  );
}
