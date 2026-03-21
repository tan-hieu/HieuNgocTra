import { useState } from "react";

const categories = [
  { label: "Tất cả", checked: true },
  { label: "Trà Xanh", checked: false },
  { label: "Trà Đen", checked: false },
  { label: "Ô Long", checked: false },
  { label: "Thảo Mộc", checked: false },
];

const origins = ["Lâm Đồng", "Thái Nguyên", "Hà Giang", "Yên Bái", "Phú Thọ"];

export default function FilterSidebar() {
  const [priceRange, setPriceRange] = useState(50);

  return (
    <aside className="w-full lg:w-[280px] xl:w-[300px] shrink-0 self-start lg:sticky lg:top-24 h-fit">
      <div className="rounded-3xl border border-primary/10 bg-white/80 backdrop-blur-sm p-5 sm:p-6 shadow-sm space-y-8">
        <section>
          <h3 className="text-xl sm:text-2xl text-primary font-bold font-display mb-5">
            Danh mục
          </h3>

          <div className="space-y-3.5">
            {categories.map((cat) => (
              <label
                key={cat.label}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  defaultChecked={cat.checked}
                  className="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary"
                />
                <span
                  className={`text-[15px] transition-colors ${
                    cat.checked
                      ? "text-primary font-semibold"
                      : "text-slate-600 group-hover:text-primary"
                  }`}
                >
                  {cat.label}
                </span>
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl sm:text-2xl text-primary font-bold font-display mb-5">
            Khoảng giá
          </h3>

          <div className="rounded-2xl bg-[#faf6ef] border border-primary/10 p-4">
            <div className="relative flex items-center h-6">
              <div className="absolute w-full h-1.5 bg-primary/15 rounded-full"></div>

              <div
                className="absolute h-1.5 bg-primary rounded-full"
                style={{ width: `${priceRange}%` }}
              ></div>

              <input
                type="range"
                min="0"
                max="100"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="absolute w-full appearance-none bg-transparent cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:w-5
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-primary
                  [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-white
                  [&::-webkit-slider-thumb]:shadow-md"
              />
            </div>

            <div className="flex justify-between mt-5 gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Từ
                </span>
                <span className="text-sm font-bold text-primary mt-1">0đ</span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Đến
                </span>
                <span className="text-sm font-bold text-primary mt-1">
                  2.000.000đ+
                </span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl sm:text-2xl text-primary font-bold font-display mb-5">
            Xuất xứ
          </h3>

          <div className="space-y-3.5">
            {origins.map((origin) => (
              <label
                key={origin}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary"
                />
                <span className="text-[15px] text-slate-600 transition-colors group-hover:text-primary">
                  {origin}
                </span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
