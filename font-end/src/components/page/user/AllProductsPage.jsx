import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
// eslint-disable-next-line
import { motion } from "motion/react";
import FilterSidebar from "../../layout/filterSidebar/FilterSidebar";
import { addToCart } from "../../../utils/cart";

const ANH_SAN_PHAM_MAC_DINH =
  "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=1200&q=80";

const KICH_THUOC_TRANG = 12;

const dinhDangTien = (gia) => {
  const so = Number(gia || 0);
  if (!Number.isFinite(so)) return "0đ";
  return so.toLocaleString("vi-VN") + "đ";
};

export default function AllProductsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryQuery = (searchParams.get("category") || "").trim();

  const [toast, setToast] = useState({ open: false, message: "" });
  const [dangTaiSanPham, setDangTaiSanPham] = useState(true);
  const [loiTaiSanPham, setLoiTaiSanPham] = useState("");
  const [sanPhamList, setSanPhamList] = useState([]);
  const [sapXep, setSapXep] = useState("moi-nhat");
  const [trang, setTrang] = useState(1);

  useEffect(() => {
    let daHuy = false;

    async function taiSanPham() {
      setDangTaiSanPham(true);
      setLoiTaiSanPham("");
      try {
        const url = categoryQuery
          ? `http://localhost:8080/api/products?category=${encodeURIComponent(categoryQuery)}`
          : "http://localhost:8080/api/products";

        const res = await fetch(url, {
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error(`Lỗi tải sản phẩm: ${res.status}`);

        const data = await res.json();
        const list = Array.isArray(data) ? data : [];

        const chuanHoa = list.map((sp) => ({
          id: sp.id,
          name: sp.name || "Sản phẩm trà",
          origin: sp.origin || "Việt Nam",
          weight: sp.weight || "N/A",
          price: Number(sp.price || 0),
          hienThiGia: dinhDangTien(sp.price),
          image: sp.mainImageUrl || sp.imageUrl || ANH_SAN_PHAM_MAC_DINH,
          desc:
            sp.shortDescription ||
            `Dòng ${sp.categoryName || "trà đặc sản"} với hương vị cân bằng.`,
        }));

        if (!daHuy) {
          setSanPhamList(chuanHoa);
          setTrang(1);
        }
      } catch (err) {
        if (!daHuy) {
          setLoiTaiSanPham(err.message || "Có lỗi khi tải sản phẩm.");
          setSanPhamList([]);
        }
      } finally {
        if (!daHuy) setDangTaiSanPham(false);
      }
    }

    taiSanPham();

    return () => {
      daHuy = true;
    };
  }, [categoryQuery]);

  const dsDaSapXep = useMemo(() => {
    const copy = [...sanPhamList];
    if (sapXep === "gia-thap-den-cao") {
      copy.sort((a, b) => a.price - b.price);
    } else if (sapXep === "gia-cao-den-thap") {
      copy.sort((a, b) => b.price - a.price);
    }
    return copy;
  }, [sanPhamList, sapXep]);

  const tongTrang = Math.max(
    1,
    Math.ceil(dsDaSapXep.length / KICH_THUOC_TRANG),
  );
  const trangHienTai = Math.min(trang, tongTrang);

  const dsHienThi = useMemo(() => {
    const batDau = (trangHienTai - 1) * KICH_THUOC_TRANG;
    return dsDaSapXep.slice(batDau, batDau + KICH_THUOC_TRANG);
  }, [dsDaSapXep, trangHienTai]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);

    setToast({
      open: true,
      message: `${product.name} đã được thêm vào giỏ hàng`,
    });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f7f1e7] text-slate-800">
      <section className="relative w-full h-[260px] sm:h-[300px] md:h-[340px] lg:h-[380px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              "linear-gradient(rgba(17,24,39,0.42), rgba(17,24,39,0.55)), url('https://plus.unsplash.com/premium_photo-1674406481284-43eba097a291?q=80&w=1600&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="mb-3 text-[11px] sm:text-xs uppercase tracking-[0.35em] text-white/80 font-semibold">
              Bộ sưu tập trà Việt
            </p>
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold font-display drop-shadow-2xl">
              Tất cả sản phẩm
            </h1>
            <p className="text-white/90 mt-3 text-sm sm:text-base md:text-lg italic">
              Dữ liệu sản phẩm thật từ hệ thống
            </p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10 py-10 lg:py-14 overflow-visible">
        <div className="flex flex-col lg:flex-row items-start gap-8 xl:gap-10 overflow-visible">
          <FilterSidebar />

          <section className="flex-1 min-w-0">
            <div className="bg-white/70 backdrop-blur-sm border border-primary/10 rounded-2xl px-5 py-4 mb-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <p className="text-sm text-slate-600">
                  Hiển thị{" "}
                  <span className="font-bold text-primary">
                    {dsHienThi.length}
                  </span>{" "}
                  trên{" "}
                  <span className="font-bold text-slate-800">
                    {dsDaSapXep.length}
                  </span>{" "}
                  sản phẩm
                </p>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Sắp xếp
                  </span>
                  <select
                    value={sapXep}
                    onChange={(e) => {
                      setSapXep(e.target.value);
                      setTrang(1);
                    }}
                    className="rounded-xl border border-primary/15 bg-white px-4 py-2.5 text-sm font-semibold text-primary outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="moi-nhat">Mới nhất</option>
                    <option value="gia-thap-den-cao">Giá: Thấp đến Cao</option>
                    <option value="gia-cao-den-thap">Giá: Cao đến Thấp</option>
                  </select>
                </div>
              </div>
            </div>

            {dangTaiSanPham && (
              <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-primary/10 bg-white p-3 sm:p-4"
                  >
                    <div className="aspect-[4/4.3] rounded-xl bg-slate-200 animate-pulse mb-4" />
                    <div className="h-3 bg-slate-200 rounded animate-pulse mb-2" />
                    <div className="h-4 bg-slate-200 rounded animate-pulse mb-2" />
                    <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
                  </div>
                ))}
              </div>
            )}

            {!dangTaiSanPham && loiTaiSanPham && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-red-700">
                {loiTaiSanPham}
              </div>
            )}

            {!dangTaiSanPham && !loiTaiSanPham && dsHienThi.length === 0 && (
              <div className="rounded-2xl border border-primary/10 bg-white px-6 py-8 text-center text-slate-600">
                Không có sản phẩm phù hợp.
              </div>
            )}

            {!dangTaiSanPham && !loiTaiSanPham && dsHienThi.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
                {dsHienThi.map((product, index) => (
                  <motion.article
                    key={product.id}
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="group cursor-pointer rounded-2xl border border-primary/10 bg-white p-3 sm:p-4 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.03 }}
                    whileHover={{ y: -6 }}
                  >
                    <div className="relative aspect-[4/4.3] rounded-xl overflow-hidden mb-4 bg-[#f3ede2]">
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = ANH_SAN_PHAM_MAC_DINH;
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex h-[150px] flex-col">
                      <p className="min-h-[30px] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a7b56] line-clamp-2">
                        {product.origin} • {product.weight}
                      </p>

                      <h3 className="mt-1 min-h-[56px] font-display text-[15px] sm:text-lg font-semibold leading-snug text-slate-800 group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>

                      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                        <span className="text-lg sm:text-xl font-bold text-primary">
                          {product.hienThiGia}
                        </span>

                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="h-10 w-10 shrink-0 rounded-xl border border-primary/10 bg-[#faf7f2] text-primary flex items-center justify-center shadow-sm transition-all hover:bg-primary hover:text-white hover:scale-105"
                        >
                          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}

            <div className="mt-12 sm:mt-14 flex justify-center items-center gap-2">
              <button
                onClick={() => setTrang((p) => Math.max(1, p - 1))}
                disabled={trangHienTai <= 1}
                className="h-10 w-10 rounded-xl border border-primary/10 bg-white text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button className="h-10 min-w-10 px-3 rounded-xl bg-primary text-white font-bold shadow-sm">
                {trangHienTai}
              </button>

              <button
                onClick={() => setTrang((p) => Math.min(tongTrang, p + 1))}
                disabled={trangHienTai >= tongTrang}
                className="h-10 w-10 rounded-xl border border-primary/10 bg-white text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        </div>
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
