import {
  ArrowRight,
  Plus,
  Leaf,
  Hand,
  Flower2,
  Star,
  Calendar,
} from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden pt-28">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBXyBh4Q-STad1AT3cMlwhgN_a0hJ2OCsKhEQ5hiSOQ5Blz6F51PM2oVYkYHgEn5Oi7M8iLM7JSX2eANYlOT4pu8frwObunWh2JmngZ7sdC40601vvRcv6b1s0JVIRaijyxEIHRgAEaLhdgARGOsNTrQqZoHLxJaE-6b6aNh8H4w-a_NqTyyjv7LIbaJwDpj27VRAxcE-cw2m4XL6sQBCbJwryyLrKiqQqoVU07xz2UUN246k21nzuo2nx246NSq-2vibUszK_FlbTD')`,
          }}
        ></div>
        <div className="relative z-10 text-center px-4 max-w-5xl mt-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-gold font-bold tracking-[0.3em] uppercase mb-6 text-sm md:text-base bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm"
          >
            Tinh Hoa Từ Đại Ngàn
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] mb-8 font-display drop-shadow-2xl"
          >
            Trà Shan Tuyết <br /> Cổ Thụ Mù Cang Chải
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/90 text-lg md:text-2xl font-light mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Hành trình từ những đỉnh núi sương mù đến tách trà thuần khiết, mang
            trọn hương vị của đất trời và thời gian.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <button className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-xl">
              Khám phá bộ sưu tập
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-xl font-bold transition-all">
              Tìm hiểu nguồn gốc
            </button>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2 font-display">
                Danh Mục Tuyển Chọn
              </h2>
              <div className="w-20 h-1 bg-gold"></div>
            </div>
            <a
              href="#"
              className="text-accent font-bold hover:underline flex items-center gap-1"
            >
              Xem tất cả
            </a>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Trà Xanh",
                color: "primary",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB20yKKyrc0mcgFCNN2qqWnNk9ewAHUmpcKSoefqt9I-epWZJt9_pIdC0j2div__Dj2bEB56q3bzubglDI0VY-iT9t5sMlOAJ64VtEom2aK016dukydEwNGhZEdwM3a3AcMixDTU_jtbwnawarAlSTIC7W4SV5sBe7Ebbdhi79o8_pWPlAE--u5gCzxd_y1GjLfeFWub6yX1BidlJBk7mhAphPsGH51hbL0shH1PO39S51eglwxiYK1uG99xoYc8cY5cceGRfchiLMC",
              },
              {
                name: "Trà Ô Long",
                color: "accent",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDA-b11VkIqcnxigg2ScOurghnJlvzAff3ExVDm_PkHOKIuWG1eQnsp7bnMN7QmD8DwrJ1cn3yPrBgZXMDuWeqGQlicpPvqsP_h06h62XkLlp9uf_WpXWa82tE97wNav7seMp1XD5u3mk2PV-pfZS5-Ny3lr52VTDvrW7LknpzSS-ALOVuNyAZp9wE53KcGiZVzbAtYpZw9tua11GMbjI8ptucoanUxdioYvZL_EJ-z2sMiRvYuFkAIeLz8IuGoKpEU_9v3kWRc-YVy",
              },
              {
                name: "Trà Đen",
                color: "slate-900",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuApuxQ1j-LD5Ws7RnkKaMItUBxy5v2cSCzRvi5e99DnbDqeX2GUUo0fb_EMd88hDhn-0WAYRbImlBRf6UrWKTMt-sT0yhSxjP-pIBfNQpYHbZWlIg0zglFfKAKJkyhsyOQ6O7hxcoMStIyarozflrf5ic0OCFjcKpxx6WhUwxDDYAwtM-Dw4YqZUZDT4WscP0cpJaTEPr4GHFFf5eUTdklalIYV3IRI4BuZl1t_eMrgjVuL1PoalQP2FbbY34AlMOJBbNXA1M_v1AIO",
              },
              {
                name: "Trà Thảo Mộc",
                color: "gold",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2cgwAV-VOh0vopBgbF2vjSrO_cey32M1ohQFwYQwvQQSl6mZbsyujvRCJKvBBoVGEFmox1pZjC62D4HJxdlJxq0dO17UyHHr5yihWBJxUrsMS_x227vW_arTp_UfrUcDVwBaMeKt0v6TTrervwtVOjg1nmO6zS6_P-FvQMNV9EfPhV7DlCTytbe-EEg32sNRWuK0HDulzIomu2n3R-B5Qre7_YGnRd2-nW5Lvx5yx4mPlpc46qxHUx49w6n9o3KUTfE51bhu5VuI6",
              },
            ].map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl mb-4">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-${cat.color}/80 to-transparent flex items-end p-6`}
                  >
                    <h3 className="text-white font-bold text-xl font-display">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-24 px-4 md:px-10 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-16"
          >
            <div className="text-left">
              <span className="text-accent font-bold uppercase tracking-widest text-sm">
                Khám phá trà
              </span>
              <h2 className="text-4xl font-bold text-primary mt-2 font-display">
                Danh Sách Sản Phẩm
              </h2>
            </div>
            <a href="#" className="text-accent font-bold hover:underline mb-1">
              Xem tất cả
            </a>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                name: "Trà Shan Tuyết 500 Năm",
                price: "850.000đ",
                desc: "Thu hái từ những cây chè cổ thụ trên đỉnh núi Mù Cang Chải cao 1800m.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIdBtWBa498CTLMjdVFGDBDpfPIk7BUMDgwqRen-2N3ji6nVG5GqSekmkG7bluYWpfzl8e6JWq_f2Nlz7ZV80m0gs6s9kRy3Tg5yv9ODv_AdSN8JXHyHdYywmecqGLE5Hm_tfdYEMtHdGaTLQoPCPjdZq0aFgVPMaHMHhjNecOBa5q7SzZtGFgazMjYYbu1DjvK939NU-nOdZHIteXotAOavhTmjrTXCkHTa3V17lRmAA660nUNE51e1QB9vhDPA8gNyPIbMsLv8Ny",
              },
              {
                name: "Lục Trà Ướp Hoa Bưởi",
                price: "420.000đ",
                desc: "Sự kết hợp tinh tế giữa trà xanh cổ thụ và hương hoa bưởi tháng Ba.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoo-0D2scTorD5LtA2S_JMDNyVmWUbHUoQkRK5FU73J8G0igaKWMxZl2knUE4L5qtek3zMn7TNCrjnpdSTKHZq9puEUR_-yFqYZxg4TN9ArdKZSgyA3nYF_Ifmv4ESQLWTOHeUd6sJ3Ont7FSm61_jHymAL5ZvpCszopLHNVkO5tiDDQjF3udzuTzWwLqASJEQSi0xhf9jfuOHS6K730P9s-swSrti9fBnS-9O2n5XYbeHB8U3ieGvxVwmMRhz_ps0H6EslSzIYJIt",
              },
              {
                name: "Bạch Trà Ngậm Sương",
                price: "1.250.000đ",
                desc: "Chỉ hái một búp duy nhất còn phủ lớp lông tơ trắng như tuyết.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAi8w7hJXR9feDBzKvnBjnpb_m16T6L-ETqKL9unwwSjGPsgVJuTTPTRr71mzAJBFxYSkZR2u0f4UZ-0G76FqlYzcMEGP3ZkjYRJsk0ASzTTx61rfSsxPRpxHdEfK37_nBl8168NCl2KVs4gs2v7kcV0994FV9OgnUVjK6zFL9yYj7xC7zKAmSz_tg9wNEYsCDAyXP4O-oF_sWiidbImQ3VAyhg6vzmzgXq68bmpj0bgZzvq3x8H4IRfsRYk0dkaNf6crS1ghb3cdVF",
              },
              {
                name: "Hồng Trà Cổ Thụ",
                price: "680.000đ",
                desc: "Trà được lên men tự nhiên, mang hương thơm trái cây chín và vị ngọt mật ong.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuApuxQ1j-LD5Ws7RnkKaMItUBxy5v2cSCzRvi5e99DnbDqeX2GUUo0fb_EMd88hDhn-0WAYRbImlBRf6UrWKTMt-sT0yhSxjP-pIBfNQpYHbZWlIg0zglFfKAKJkyhsyOQ6O7hxcoMStIyarozflrf5ic0OCFjcKpxx6WhUwxDDYAwtM-Dw4YqZUZDT4WscP0cpJaTEPr4GHFFf5eUTdklalIYV3IRI4BuZl1t_eMrgjVuL1PoalQP2FbbY34AlMOJBbNXA1M_v1AIO",
              },
            ].map((product, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-primary/5 group"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2 font-display line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-slate-500 text-xs mb-4 line-clamp-2">
                    {product.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-black text-lg">
                      {product.price}
                    </span>
                    <button className="bg-primary/5 hover:bg-primary text-primary hover:text-white p-2 rounded-xl transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4 md:px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDA7x81-XHgFGI3TN_hIXh1-BTie5fFBuu4hHFxkZRXefm1EM_MZsNYjNNMvte3CrXfbGSLqiiArR1k-zcqDO03tyDzm1Awuy86X-oa6TUSB9PvgvXj9B5nieVmwB39Q-UXrz5PrbF39tZJlJz4vqRA-sW7UPOHrann9ew6l5HLAtq2Wk-9n5XXB6l_Gmyo_GcJlj2Z0uoTURaB7YdEcVP2-vSsazIKG6wGk5SB6aAJZE7SF__VFveGxjtCL-l7LSRyuWCqMNY_rDZN"
                alt="Thu hoạch trà"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -bottom-8 -right-8 bg-gold p-8 rounded-3xl hidden lg:block shadow-xl"
            >
              <span className="text-4xl font-black text-white">100%</span>
              <p className="text-white/80 font-bold uppercase tracking-wider text-sm">
                Hữu cơ tự nhiên
              </p>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-primary mb-8 leading-tight font-display">
              Vì sao lựa chọn Trà Việt của chúng tôi?
            </h2>
            <div className="space-y-8">
              {[
                {
                  icon: <Leaf className="w-6 h-6" />,
                  title: "Nguồn gốc thuần khiết",
                  desc: "Trà được thu hái từ những cây chè cổ thụ hàng trăm năm tuổi tại vùng núi cao phía Bắc.",
                },
                {
                  icon: <Hand className="w-6 h-6" />,
                  title: "Chế tác thủ công",
                  desc: "Quy trình sao trà được thực hiện hoàn toàn thủ công bởi các nghệ nhân trà lâu đời.",
                },
                {
                  icon: <Flower2 className="w-6 h-6" />,
                  title: "Chất lượng thượng hạng",
                  desc: "Cam kết không hóa chất, không hương liệu nhân tạo, bảo tồn trọn vẹn dược tính của trà.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: `linear-gradient(rgba(29, 41, 30, 0.9), rgba(29, 41, 30, 0.9)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBXyBh4Q-STad1AT3cMlwhgN_a0hJ2OCsKhEQ5hiSOQ5Blz6F51PM2oVYkYHgEn5Oi7M8iLM7JSX2eANYlOT4pu8frwObunWh2JmngZ7sdC40601vvRcv6b1s0JVIRaijyxEIHRgAEaLhdgARGOsNTrQqZoHLxJaE-6b6aNh8H4w-a_NqTyyjv7LIbaJwDpj27VRAxcE-cw2m4XL6sQBCbJwryyLrKiqQqoVU07xz2UUN246k21nzuo2nx246NSq-2vibUszK_FlbTD')`,
            }}
          ></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-primary-dark/40 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl"
            >
              <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
                Nghệ thuật trà đạo
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight font-display">
                Trải nghiệm <br />
                Thưởng Trà
              </h2>
              <p className="text-white/70 text-sm md:text-base font-light mb-8 leading-relaxed max-w-md">
                Khám phá không gian tĩnh lặng nơi tâm hồn hòa quyện cùng hương
                vị trà Shan Tuyết cổ thụ. Chúng tôi không chỉ mang đến sản phẩm,
                mà còn là một lối sống thanh tao, giúp bạn tìm lại sự cân bằng
                giữa nhịp sống hối hả.
              </p>
              <div className="flex flex-wrap gap-6 items-center">
                <button className="inline-flex items-center gap-2 bg-primary-dark hover:bg-primary text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg text-sm">
                  Đăng ký tham gia <Calendar className="w-4 h-4" />
                </button>
                <button className="inline-flex items-center gap-2 text-white/80 font-bold hover:text-gold transition-colors text-sm">
                  Tìm hiểu thêm <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1, ease: "backOut" }}
              className="relative flex justify-center"
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 border border-gold/20 rounded-full scale-110 animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute inset-0 border border-gold/10 rounded-full scale-125"></div>
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-gold/50 shadow-[0_0_50px_rgba(179,139,77,0.2)]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDA-b11VkIqcnxigg2ScOurghnJlvzAff3ExVDm_PkHOKIuWG1eQnsp7bnMN7QmD8DwrJ1cn3yPrBgZXMDuWeqGQlicpPvqsP_h06h62XkLlp9uf_WpXWa82tE97wNav7seMp1XD5u3mk2PV-pfZS5-Ny3lr52VTDvrW7LknpzSS-ALOVuNyAZp9wE53KcGiZVzbAtYpZw9tua11GMbjI8ptucoanUxdioYvZL_EJ-z2sMiRvYuFkAIeLz8IuGoKpEU_9v3kWRc-YVy"
                    alt="Tea ceremony"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="relative py-32 overflow-hidden bg-[#EAE7E0]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI9AD2mefyIPdIDffYYbt3lF04H6vWKoQ45KUtWynUwZnIfS2H5lR15yd6LA2LGn3E6qEg1lguQXU124rjz80Yx25ADs1jme3gi954_4RWnl0Fbgt9aXYukPh4KoVZPntK2mzexS19s2DezeTuWQJg2Pp8Cv3s8hlzYV0waGAtSrnyF955260nwowUkoYqyk49bK46ZvC7UCXR-GQDQszHBkYrTsE3hKf9nlrJ4_dYAV_Y3o9GFG7TaY_9fnTWR5oNXozlovpBEk_Z"
            alt="Village background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-20 sepia-[0.3] contrast-[1.1]"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-accent mb-12 font-display tracking-wide"
          >
            Câu Chuyện Của Đất & Người
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-white p-12 md:p-24 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 relative"
          >
            <p className="text-lg md:text-xl font-medium italic text-primary/70 leading-relaxed mb-12 font-body">
              "Giữa mây ngàn Mù Cang Chải, những cây chè cổ thụ vẫn lặng lẽ đứng
              đó qua bao đời người. Chúng tôi không chỉ bán trà, chúng tôi gửi
              gắm vào đó cả hơi thở của đại ngàn và tâm huyết của những người
              dân bản địa."
            </p>
            <div className="flex items-center justify-center gap-10">
              <div className="w-20 h-[1px] bg-gold/40"></div>
              <span className="font-bold text-accent uppercase tracking-[0.6em] text-[10px] md:text-xs">
                Người sáng lập
              </span>
              <div className="w-20 h-[1px] bg-gold/40"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* User Reviews */}
      <section className="py-24 px-4 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-16 font-display"
          >
            Cảm nhận từ khách hàng
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Trần Hoàng",
                role: "Nhà sưu tầm trà",
                text: '"Hương vị trà thật sự khác biệt. Vị chát thanh và hậu vị ngọt sâu rất lâu. Tôi chưa từng thử loại trà nào tinh khiết đến vậy."',
                initials: "TH",
              },
              {
                name: "Mai Lan",
                role: "Doanh nhân",
                text: '"Bao bì quá đẹp và sang trọng, rất phù hợp để làm quà tặng. Tôi đã mua biếu đối tác và họ đánh giá rất cao."',
                initials: "ML",
              },
              {
                name: "Quốc Anh",
                role: "Kỹ sư",
                text: '"Dịch vụ khách hàng chu đáo, tư vấn rất kỹ về cách pha trà đúng điệu. Sẽ còn ủng hộ shop lâu dài."',
                initials: "QA",
              },
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-background-light rounded-3xl border border-primary/5 italic shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex text-gold mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6">{review.text}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {review.initials}
                  </div>
                  <div>
                    <h5 className="font-bold not-italic">{review.name}</h5>
                    <span className="text-xs text-slate-500 uppercase not-italic">
                      {review.role}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
