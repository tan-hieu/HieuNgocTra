import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Minus,
  Plus,
  Thermometer,
  Timer,
  Droplets,
  Wind,
  Utensils,
  Coffee,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import RelatedProducts from "../../layout/relatedProducts/RelatedProducts";
import { addToCart } from "../../../utils/cart";

const ANH_MAC_DINH =
  "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=1200&q=80";

const dinhDangTien = (gia) => {
  const so = Number(gia || 0);
  if (!Number.isFinite(so)) return "0đ";
  return so.toLocaleString("vi-VN") + "đ";
};

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("story");
  const [toast, setToast] = useState({ open: false, message: "" });

  const [dangTai, setDangTai] = useState(true);
  const [loiTai, setLoiTai] = useState("");
  const [duLieuSanPham, setDuLieuSanPham] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [anhDangXem, setAnhDangXem] = useState(ANH_MAC_DINH);

  useEffect(() => {
    let daHuy = false;

    async function taiChiTiet() {
      setDangTai(true);
      setLoiTai("");
      try {
        const res = await fetch(
          `http://localhost:8080/api/products/${productId}`,
          { headers: { Accept: "application/json" } },
        );

        if (!res.ok) {
          throw new Error(`Không lấy được chi tiết sản phẩm (${res.status})`);
        }

        const data = await res.json();

        const mainImage = data.mainImageUrl || ANH_MAC_DINH;
        const extraImages = Array.isArray(data.extraImageUrls)
          ? data.extraImageUrls
          : [];
        const gallery = [mainImage, ...extraImages].filter(Boolean);

        const sanPham = {
          id: data.id,
          productCode: data.productCode || "",
          name: data.productName || "Sản phẩm trà",
          category: data.category || "Chưa phân loại",
          origin: data.origin || "Việt Nam",
          weight: data.weight || "N/A",
          priceNumber: Number(data.price || 0),
          priceDisplay: dinhDangTien(data.price),
          image: mainImage,
          gallery,
          stock: Number(data.stock || 0),
          status: data.status || "INACTIVE",
          shortDescription: data.shortDescription || "",
          story: data.story || "",
          taste: data.taste || "",
          brewing: data.brewing || "",
          storage: data.storage || "",
          visual: data.visual || "",
          aroma: data.aroma || "",
          tasteProfile: data.tasteProfile || "",
        };

        if (!daHuy) {
          setDuLieuSanPham(sanPham);
          setAnhDangXem(sanPham.image);
        }

        const resRelated = await fetch(
          `http://localhost:8080/api/products?category=${encodeURIComponent(sanPham.category)}`,
          { headers: { Accept: "application/json" } },
        );

        if (resRelated.ok) {
          const raw = await resRelated.json();
          const list = Array.isArray(raw) ? raw : [];
          const related = list
            .filter((item) => Number(item.id) !== Number(sanPham.id))
            .slice(0, 4)
            .map((item) => ({
              id: item.id,
              category: item.categoryName || "Trà",
              name: item.name || "Sản phẩm trà",
              price: dinhDangTien(item.price),
              image: item.mainImageUrl || item.imageUrl || ANH_MAC_DINH,
            }));

          if (!daHuy) setRelatedProducts(related);
        } else if (!daHuy) {
          setRelatedProducts([]);
        }
      } catch (err) {
        if (!daHuy) {
          setLoiTai(err.message || "Có lỗi khi tải dữ liệu.");
          setDuLieuSanPham(null);
          setRelatedProducts([]);
        }
      } finally {
        if (!daHuy) setDangTai(false);
      }
    }

    taiChiTiet();

    return () => {
      daHuy = true;
    };
  }, [productId]);

  const handleAddToCart = () => {
    if (!duLieuSanPham) return;

    const payload = {
      id: duLieuSanPham.id,
      name: duLieuSanPham.name,
      price: duLieuSanPham.priceDisplay,
      image: duLieuSanPham.image,
      weight: duLieuSanPham.weight,
      origin: duLieuSanPham.origin,
    };

    addToCart(payload, quantity);

    setToast({
      open: true,
      message: `${duLieuSanPham.name} (x${quantity}) đã được thêm vào giỏ hàng`,
    });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 2000);
  };

  const handleMuaNgay = () => {
    if (!duLieuSanPham) return;

    const sanPhamMuaNgay = {
      id: duLieuSanPham.id,
      name: duLieuSanPham.name,
      price: duLieuSanPham.priceNumber,
      image: duLieuSanPham.image,
      weight: duLieuSanPham.weight,
      origin: duLieuSanPham.origin,
      quantity,
    };

    navigate("/checkout", {
      state: {
        source: "buy-now",
        buyNowItem: sanPhamMuaNgay,
      },
    });
    window.scrollTo(0, 0);
  };

  const TABS = [
    { id: "story", label: "Câu chuyện sản phẩm" },
    { id: "flavor", label: "Hương vị & Cảm nhận" },
    { id: "brewing", label: "Nghệ thuật pha trà" },
    { id: "storage", label: "Bảo quản" },
  ];

  const noiDungTab = useMemo(() => {
    if (!duLieuSanPham) return { tieuDe: "", noiDung: [] };

    if (activeTab === "story") {
      return {
        tieuDe: "Tinh hoa từ vùng nguyên liệu",
        noiDung: [
          duLieuSanPham.story ||
            duLieuSanPham.shortDescription ||
            "Chưa có mô tả chi tiết.",
        ],
      };
    }

    if (activeTab === "flavor") {
      return {
        tieuDe: "Hương vị & Cảm nhận",
        noiDung: [
          duLieuSanPham.taste || "Chưa có dữ liệu cảm nhận hương vị.",
          duLieuSanPham.aroma || "",
          duLieuSanPham.tasteProfile || "",
        ].filter(Boolean),
      };
    }

    if (activeTab === "brewing") {
      return {
        tieuDe: "Nghệ thuật pha trà",
        noiDung: [duLieuSanPham.brewing || "Chưa có hướng dẫn pha trà."],
      };
    }

    return {
      tieuDe: "Bảo quản tinh túy",
      noiDung: [duLieuSanPham.storage || "Chưa có hướng dẫn bảo quản."],
    };
  }, [activeTab, duLieuSanPham]);

  if (dangTai) {
    return (
      <div className="min-h-screen bg-cream pt-24 pb-12">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="rounded-3xl bg-white border border-primary/10 p-10 text-center text-slate-600">
            Đang tải chi tiết sản phẩm...
          </div>
        </main>
      </div>
    );
  }

  if (!duLieuSanPham || loiTai) {
    return (
      <div className="min-h-screen bg-cream pt-24 pb-12">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="rounded-3xl bg-red-50 border border-red-200 p-10 text-center text-red-700">
            {loiTai || "Không tìm thấy sản phẩm."}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream selection:bg-primary/20 pt-24 pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="aspect-[4/5] rounded-xl overflow-hidden bg-[#F7F2E8] group"
            >
              <img
                src={anhDangXem}
                alt={duLieuSanPham.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = ANH_MAC_DINH;
                }}
              />
            </motion.div>

            <div className="grid grid-cols-4 gap-4">
              {(duLieuSanPham.gallery.length
                ? duLieuSanPham.gallery
                : [ANH_MAC_DINH]
              )
                .slice(0, 4)
                .map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setAnhDangXem(img)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      anhDangXem === img
                        ? "border-primary"
                        : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = ANH_MAC_DINH;
                      }}
                    />
                  </button>
                ))}
            </div>
          </div>

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
                {duLieuSanPham.name}
              </h1>
              <p className="text-3xl font-bold text-accent font-body italic">
                {duLieuSanPham.priceDisplay}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-8 py-6 border-y border-primary/10 text-sm mb-6 font-sans">
              {[
                {
                  label: "Mã sản phẩm",
                  value: duLieuSanPham.productCode || "N/A",
                },
                { label: "Danh mục", value: duLieuSanPham.category },
                { label: "Trọng lượng", value: duLieuSanPham.weight },
                { label: "Xuất xứ", value: duLieuSanPham.origin },
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
                  {duLieuSanPham.stock > 0 ? "Còn hàng" : "Hết hàng"}
                </span>
              </div>
            </div>

            <p className="text-slate-600 mb-8 leading-relaxed italic font-body text-lg">
              {duLieuSanPham.shortDescription ||
                "Chưa có mô tả ngắn cho sản phẩm này."}
            </p>

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
                    min={1}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(1, parseInt(e.target.value || "1", 10)),
                      )
                    }
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
                <button
                  onClick={handleAddToCart}
                  className="h-14 border-2 border-primary text-primary font-bold uppercase tracking-widest rounded-xl hover:bg-primary/5 transition-colors font-sans"
                >
                  Thêm vào giỏ hàng
                </button>

                <button
                  onClick={handleMuaNgay}
                  disabled={duLieuSanPham.stock <= 0}
                  className="h-14 bg-accent text-white font-bold uppercase tracking-widest rounded-xl hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all active:scale-[0.98] font-sans disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>

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
                  <h3 className="text-4xl font-display font-bold mb-8">
                    {noiDungTab.tieuDe}
                  </h3>
                  {noiDungTab.noiDung.map((doan, idx) => (
                    <p
                      key={idx}
                      className="text-lg text-slate-600 font-body leading-loose"
                    >
                      {doan}
                    </p>
                  ))}
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
                    desc: duLieuSanPham.visual || "Chưa có dữ liệu cảm quan.",
                  },
                  {
                    icon: Wind,
                    title: "Hương thơm",
                    desc: duLieuSanPham.aroma || "Chưa có dữ liệu hương thơm.",
                  },
                  {
                    icon: Utensils,
                    title: "Vị trà",
                    desc:
                      duLieuSanPham.tasteProfile ||
                      duLieuSanPham.taste ||
                      "Chưa có dữ liệu vị trà.",
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

        <RelatedProducts products={relatedProducts} />
      </main>

      {toast.open && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-primary text-white px-4 py-2 rounded-lg shadow-lg text-sm">
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
