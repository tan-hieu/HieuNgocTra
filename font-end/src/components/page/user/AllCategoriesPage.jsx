import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Layers, ArrowRight, RefreshCw } from "lucide-react";

const ANH_DANH_MUC_MAC_DINH =
  "https://images.unsplash.com/photo-1523920290228-4f321a939b4c?auto=format&fit=crop&w=1600&q=80";

const LOP_PHU_MAU = [
  "from-emerald-900/80",
  "from-amber-900/80",
  "from-slate-900/80",
  "from-stone-900/80",
  "from-teal-900/80",
  "from-orange-900/80",
];

export default function AllCategoriesPage() {
  const [danhMucList, setDanhMucList] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");

  const taiDanhMuc = async () => {
    setDangTai(true);
    setLoi("");
    try {
      const res = await fetch("http://localhost:8080/api/categories", {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Không tải được danh mục, mã lỗi ${res.status}`);
      }

      const data = await res.json();
      const list = Array.isArray(data) ? data : [];

      setDanhMucList(
        list.map((item, index) => ({
          id: item.id,
          name: item.name || "Danh mục chưa đặt tên",
          slug: item.slug || "",
          description: item.description || "Chưa có mô tả cho danh mục này.",
          imageUrl: item.imageUrl || ANH_DANH_MUC_MAC_DINH,
          productCount: Number(item.productCount || 0),
          lopPhu: LOP_PHU_MAU[index % LOP_PHU_MAU.length],
        })),
      );
    } catch (e) {
      setLoi(e.message || "Có lỗi khi tải danh mục.");
      setDanhMucList([]);
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    taiDanhMuc();
  }, []);

  const thongKe = useMemo(() => {
    const tongDanhMuc = danhMucList.length;
    const tongSanPham = danhMucList.reduce((sum, c) => sum + c.productCount, 0);
    return { tongDanhMuc, tongSanPham };
  }, [danhMucList]);

  return (
    <div className="min-h-screen bg-[#f3efe7] text-slate-800">
      <section className="relative h-[300px] md:h-[360px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(17,24,39,0.55), rgba(17,24,39,0.65)), url('https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=1800&q=80')",
          }}
        />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 md:px-10 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white max-w-3xl"
          >
            <p className="uppercase tracking-[0.3em] text-xs md:text-sm text-white/80 mb-3">
              Bộ sưu tập trà
            </p>
            <h1 className="text-4xl md:text-6xl font-black font-display leading-tight">
              Tất cả danh mục
            </h1>
            <p className="mt-4 text-white/90 text-sm md:text-base">
              Khám phá toàn bộ danh mục trà theo phong cách, nguồn nguyên liệu
              và câu chuyện riêng của từng dòng trà.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-10 py-10 md:py-14">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-primary/10 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">
              Tổng danh mục
            </p>
            <p className="text-3xl font-black text-primary">
              {thongKe.tongDanhMuc}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-primary/10 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">
              Tổng sản phẩm
            </p>
            <p className="text-3xl font-black text-primary">
              {thongKe.tongSanPham}
            </p>
          </div>
          <button
            onClick={taiDanhMuc}
            className="bg-white rounded-2xl border border-primary/10 p-5 flex items-center justify-center gap-2 text-primary font-bold hover:bg-primary hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Tải lại dữ liệu
          </button>
        </section>

        {dangTai && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-3xl overflow-hidden bg-white border border-primary/10 shadow-sm"
              >
                <div className="aspect-[4/3] bg-slate-200 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
                </div>
              </div>
            ))}
          </section>
        )}

        {!dangTai && loi && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p className="font-semibold mb-2">Không thể tải danh mục</p>
            <p className="text-sm">{loi}</p>
          </section>
        )}

        {!dangTai && !loi && danhMucList.length === 0 && (
          <section className="rounded-2xl border border-primary/10 bg-white p-10 text-center">
            <Layers className="w-10 h-10 mx-auto text-primary/60 mb-3" />
            <p className="text-lg font-semibold text-primary mb-2">
              Chưa có danh mục nào
            </p>
            <p className="text-slate-500 text-sm">
              Bạn hãy thêm danh mục ở trang quản trị để dữ liệu hiển thị tại
              đây.
            </p>
          </section>
        )}

        {!dangTai && !loi && danhMucList.length > 0 && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {danhMucList.map((cat, i) => (
              <motion.article
                key={cat.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group rounded-3xl overflow-hidden border border-primary/10 bg-white shadow-sm hover:shadow-xl transition-all"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = ANH_DANH_MUC_MAC_DINH;
                    }}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${cat.lopPhu} to-transparent`}
                  />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold font-display line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs mt-1 text-white/85">
                      {cat.productCount} sản phẩm
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm text-slate-600 line-clamp-3 min-h-[60px]">
                    {cat.description}
                  </p>

                  <Link
                    to={`/products?category=${encodeURIComponent(cat.slug)}`}
                    className="mt-4 inline-flex items-center gap-2 text-primary font-bold hover:underline"
                  >
                    Xem sản phẩm <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
