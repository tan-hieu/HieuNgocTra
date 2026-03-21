import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line
import { motion } from "motion/react";
import FilterSidebar from "../../layout/filterSidebar/FilterSidebar";

const products = [
  {
    id: 1,
    name: "Trà Đinh Nõn Thượng Hạng",
    origin: "Thái Nguyên",
    weight: "100g",
    price: "450.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWRLF7ZNIOsKMfpXyuXA8OMorptslGbBWdMIAFqosPycfRw27w6EYYpK2XTGTgfda7OeBvZQiV8DFyMFp6Iwx-BgGLqX_tWs1H3itHP7geU7gX8L2M5gVjLgzker_ebfhJAVWxMoV2fBjUMRmFJ_Go3yMgUg5GESaWNWdzQfP_MAW13Q_7EdVFfRpKCRd-qtIm0AAuYR5xWFHOuGmdS1UhVgyKU6cchM_9GHJOvMh-cnKKB8hX2oWq7AXMN-RUhoEGsiILY-dedApq",
  },
  {
    id: 2,
    name: "Trà Shan Tuyết Cổ Thụ",
    origin: "Hà Giang",
    weight: "200g",
    price: "720.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBG-FnPRhU1KfhTbiL2ZyRJVkvanuXuJHbThFNmttH1XTHqPRYxGCK-kwY9qhn6est5KS5pFPBo7TR9PjFiFMjPZpTaoCeu5tshIkcm9jeUh7YaHnY8fJ_XLC_J3AviAH59uDGrVcD3z6bustmqzz4dcvKH_tH3mqQ2aSQ6VeLKo7mGR9GQI-NxG0PexHScVmc8FucXChyX8_0zP-U_0gZfljhZX3W98STeZW4ApO9ES4gMBFJx08a0g2YYr_trVlYAlMgEW8yiFxqp",
  },
  {
    id: 3,
    name: "Trà Ô Long Kim Tuyên",
    origin: "Lâm Đồng",
    weight: "150g",
    price: "380.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCh3GgrWx4aeb_LefC4BlCSxGptMi5SfkZQMeTwc7y0Sg2ko0HmL06LWoP0DnsoI6AHwK0V36ta3qgElJA8bELVuzJtVGEWxu-JV9j63Qbj68JopeJXuIJWIcOPyhtjYyZC8zAu_u5cFKmOpR1WgXIhF_xSbcn9RTkbGULV_DPSgGhbETM_PYPGW_XmBJe5DMDiHf9pgpw7tWISvr8PJhdrO5G0knswDoav8SLjUxlGvbtmAz2iK3kdOrvLxUPBm_MfJt4a5Piupx0f",
  },
  {
    id: 4,
    name: "Trà Cúc Chi Tiến Vua",
    origin: "Đà Lạt",
    weight: "50g",
    price: "290.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB0bMQQK2DhZiVTDYMbZnp6Q35nvzMgBalmQeqDRStYp67S_qAJY17sJZOS1XD0cNZMsWhWbJcJ3stMCw5Oo73V7sEBHp1Oi0SE6rYefAJnZ1GQinQhD6PzZW0egTycH_ZF9Gzi8oQje_J8M9zJKiXpSwNLEHCbhR6NsC6Nqlna_6iM3I-cwF-1M3KDX5BXu6uUBg9_Z3NqUyt1KyeiSAhgDIq1eSCQsc-kECqEmXGyKyqzhgj21byp6MjoPjuZkaSMPMeFm32TYJTH",
  },
  {
    id: 5,
    name: "Hồng Trà Cổ Thụ",
    origin: "Phú Thọ",
    weight: "250g",
    price: "550.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDZlh-atO26v9DIbpBMflR5KMmWGzRG92vXGETTGsCcu0k6c1eVf7OxpH0ZbP1N4L2Tkkj2bcHFndR5I1RY3cQJZYxPJhf0sREQj68X0rpWF9m3WouJJaDC6seWNlQYW3xm6oBUNdFr_qy9hZFlhDI4PLUY-_DZj4R9lcIfcDCQpZR2jStNjRHHyG5S8YubhqG2YulIo0HDvc37G_F4UOioivfh3953Y_7kuu1Zsc7MTVDwldqhf2dcYNZjITu9gR6v9upAFiM-68AN",
  },
  {
    id: 6,
    name: "Trà Nõn Tôm Đặc Sản",
    origin: "Tuyên Quang",
    weight: "100g",
    price: "320.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBZvT_PQQtGizLsr1y1BWkNrTumBzp4W6xQZKNFsINmB1NjwCdg2fpNkG_uBxwirqAjzDDsHybw43zYZ4rT3muzA1Bv3wySxc-ldsy3w1dtT8jZmtmpVayZa7xH4mDlah2mG5qdItzmHjIwsfIQ7X0kor27ywySa2U1_TaApA9-i7GjWzTC26qcYvfqstKCbEJCBIszMRgmncY4iWLsBTFrmMKvDxRckUAit2TGa0iADvOX6CKmscI23h_gDlFjWzrtbBgpXr2RIK5K",
  },
  {
    id: 7,
    name: "Trà Xanh Thái Nguyên",
    origin: "Thái Nguyên",
    weight: "200g",
    price: "180.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWRLF7ZNIOsKMfpXyuXA8OMorptslGbBWdMIAFqosPycfRw27w6EYYpK2XTGTgfda7OeBvZQiV8DFyMFp6Iwx-BgGLqX_tWs1H3itHP7geU7gX8L2M5gVjLgzker_ebfhJAVWxMoV2fBjUMRmFJ_Go3yMgUg5GESaWNWdzQfP_MAW13Q_7EdVFfRpKCRd-qtIm0AAuYR5xWFHOuGmdS1UhVgyKU6cchM_9GHJOvMh-cnKKB8hX2oWq7AXMN-RUhoEGsiILY-dedApq",
  },
  {
    id: 8,
    name: "Trà San Tuyết Hà Giang",
    origin: "Hà Giang",
    weight: "100g",
    price: "350.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBG-FnPRhU1KfhTbiL2ZyRJVkvanuXuJHbThFNmttH1XTHqPRYxGCK-kwY9qhn6est5KS5pFPBo7TR9PjFiFMjPZpTaoCeu5tshIkcm9jeUh7YaHnY8fJ_XLC_J3AviAH59uDGrVcD3z6bustmqzz4dcvKH_tH3mqQ2aSQ6VeLKo7mGR9GQI-NxG0PexHScVmc8FucXChyX8_0zP-U_0gZfljhZX3W98STeZW4ApO9ES4gMBFJx08a0g2YYr_trVlYAlMgEW8yiFxqp",
  },
  {
    id: 9,
    name: "Trà Ô Long Cao Cấp",
    origin: "Lâm Đồng",
    weight: "250g",
    price: "520.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCh3GgrWx4aeb_LefC4BlCSxGptMi5SfkZQMeTwc7y0Sg2ko0HmL06LWoP0DnsoI6AHwK0V36ta3qgElJA8bELVuzJtVGEWxu-JV9j63Qbj68JopeJXuIJWIcOPyhtjYyZC8zAu_u5cFKmOpR1WgXIhF_xSbcn9RTkbGULV_DPSgGhbETM_PYPGW_XmBJe5DMDiHf9pgpw7tWISvr8PJhdrO5G0knswDoav8SLjUxlGvbtmAz2iK3kdOrvLxUPBm_MfJt4a5Piupx0f",
  },
  {
    id: 10,
    name: "Trà Hoa Cúc Vàng",
    origin: "Đà Lạt",
    weight: "100g",
    price: "150.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB0bMQQK2DhZiVTDYMbZnp6Q35nvzMgBalmQeqDRStYp67S_qAJY17sJZOS1XD0cNZMsWhWbJcJ3stMCw5Oo73V7sEBHp1Oi0SE6rYefAJnZ1GQinQhD6PzZW0egTycH_ZF9Gzi8oQje_J8M9zJKiXpSwNLEHCbhR6NsC6Nqlna_6iM3I-cwF-1M3KDX5BXu6uUBg9_Z3NqUyt1KyeiSAhgDIq1eSCQsc-kECqEmXGyKyqzhgj21byp6MjoPjuZkaSMPMeFm32TYJTH",
  },
  {
    id: 11,
    name: "Hồng Trà Đặc Biệt",
    origin: "Phú Thọ",
    weight: "500g",
    price: "850.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDZlh-atO26v9DIbpBMflR5KMmWGzRG92vXGETTGsCcu0k6c1eVf7OxpH0ZbP1N4L2Tkkj2bcHFndR5I1RY3cQJZYxPJhf0sREQj68X0rpWF9m3WouJJaDC6seWNlQYW3xm6oBUNdFr_qy9hZFlhDI4PLUY-_DZj4R9lcIfcDCQpZR2jStNjRHHyG5S8YubhqG2YulIo0HDvc37G_F4UOioivfh3953Y_7kuu1Zsc7MTVDwldqhf2dcYNZjITu9gR6v9upAFiM-68AN",
  },
  {
    id: 12,
    name: "Trà Nõn Tôm Thượng Hạng",
    origin: "Tuyên Quang",
    weight: "200g",
    price: "640.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBZvT_PQQtGizLsr1y1BWkNrTumBzp4W6xQZKNFsINmB1NjwCdg2fpNkG_uBxwirqAjzDDsHybw43zYZ4rT3muzA1Bv3wySxc-ldsy3w1dtT8jZmtmpVayZa7xH4mDlah2mG5qdItzmHjIwsfIQ7X0kor27ywySa2U1_TaApA9-i7GjWzTC26qcYvfqstKCbEJCBIszMRgmncY4iWLsBTFrmMKvDxRckUAit2TGa0iADvOX6CKmscI23h_gDlFjWzrtbBgpXr2RIK5K",
  },
];

export default function AllProductsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7f1e7] text-slate-800">
      {/* Hero Banner */}
      <section className="relative w-full h-[260px] sm:h-[300px] md:h-[340px] lg:h-[380px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: `linear-gradient(rgba(17,24,39,0.42), rgba(17,24,39,0.55)), url('https://plus.unsplash.com/premium_photo-1674406481284-43eba097a291?q=80&w=1600&auto=format&fit=crop')`,
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
              Tinh hoa từ những búp trà xanh mướt
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10 py-10 lg:py-14 overflow-visible">
        <div className="flex flex-col lg:flex-row items-start gap-8 xl:gap-10 overflow-visible">
          <FilterSidebar />

          <section className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="bg-white/70 backdrop-blur-sm border border-primary/10 rounded-2xl px-5 py-4 mb-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <p className="text-sm text-slate-600">
                  Hiển thị <span className="font-bold text-primary">12</span>{" "}
                  trên <span className="font-bold text-slate-800">48</span> sản
                  phẩm
                </p>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Sắp xếp
                  </span>
                  <select className="rounded-xl border border-primary/15 bg-white px-4 py-2.5 text-sm font-semibold text-primary outline-none focus:ring-2 focus:ring-primary/20">
                    <option>Mới nhất</option>
                    <option>Giá: Thấp đến Cao</option>
                    <option>Giá: Cao đến Thấp</option>
                    <option>Bán chạy nhất</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
              {products.map((product, index) => (
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
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a7b56]">
                      {product.origin} • {product.weight}
                    </p>

                    <h3 className="font-display text-[15px] sm:text-lg font-semibold leading-snug text-slate-800 group-hover:text-primary transition-colors min-h-[44px] sm:min-h-[56px]">
                      {product.name}
                    </h3>

                    <div className="pt-2 flex items-center justify-between gap-3">
                      <span className="text-lg sm:text-xl font-bold text-primary">
                        {product.price}
                      </span>

                      <button className="h-10 w-10 shrink-0 rounded-xl border border-primary/10 bg-[#faf7f2] text-primary flex items-center justify-center shadow-sm transition-all hover:bg-primary hover:text-white hover:scale-105">
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 sm:mt-14 flex justify-center items-center gap-2">
              <button className="h-10 w-10 rounded-xl border border-primary/10 bg-white text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm">
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button className="h-10 w-10 rounded-xl bg-primary text-white font-bold shadow-sm">
                1
              </button>

              <button className="h-10 w-10 rounded-xl border border-primary/10 bg-white text-primary hover:bg-primary/5 transition-colors shadow-sm">
                2
              </button>

              <button className="h-10 w-10 rounded-xl border border-primary/10 bg-white text-primary hover:bg-primary/5 transition-colors shadow-sm">
                3
              </button>

              <span className="px-1 text-slate-400">...</span>

              <button className="h-10 w-10 rounded-xl border border-primary/10 bg-white text-primary hover:bg-primary/5 transition-colors shadow-sm">
                8
              </button>

              <button className="h-10 w-10 rounded-xl border border-primary/10 bg-white text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
