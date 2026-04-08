import {
  FolderTree,
  Plus,
  Search,
  Edit3,
  Trash2,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Package,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "admin_categories_v1";

const defaultCategories = [
  {
    id: "1",
    name: "Trà Xanh Thái Nguyên",
    description: "Các loại trà xanh đặc sản từ vùng Tân Cương, Thái Nguyên.",
    productCount: 24,
    status: "active",
    slug: "tra-xanh-thai-nguyen",
    displayOrder: 1,
  },
  {
    id: "2",
    name: "Trà Ô Long",
    description: "Trà Ô Long cao cấp từ Lâm Đồng, hương vị thanh khiết.",
    productCount: 18,
    status: "active",
    slug: "tra-o-long",
    displayOrder: 2,
  },
  {
    id: "3",
    name: "Trà Đen (Hồng Trà)",
    description:
      "Trà đen lên men hoàn toàn, phù hợp pha trà sữa hoặc thưởng thức nóng.",
    productCount: 12,
    status: "active",
    slug: "tra-den",
    displayOrder: 3,
  },
  {
    id: "4",
    name: "Trà Ướp Hoa",
    description: "Trà xanh ướp hương hoa tự nhiên: Nhài, Sen, Ngâu.",
    productCount: 15,
    status: "active",
    slug: "tra-uop-hoa",
    displayOrder: 4,
  },
  {
    id: "5",
    name: "Trà Phổ Nhĩ",
    description: "Trà lên men lâu năm, hương vị trầm mặc, cổ điển.",
    productCount: 8,
    status: "inactive",
    slug: "tra-pho-nhi",
    displayOrder: 5,
  },
];

function readCategories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultCategories;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultCategories;
    return parsed;
  } catch {
    return defaultCategories;
  }
}

function writeCategories(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loaded = readCategories()
      .slice()
      .sort(function (a, b) {
        const ao = Number(a.displayOrder || 0);
        const bo = Number(b.displayOrder || 0);
        return ao - bo;
      });
    setCategories(loaded);
  }, []);

  const filteredCategories = useMemo(() => {
    const kw = searchTerm.trim().toLowerCase();
    if (!kw) return categories;

    return categories.filter(function (cat) {
      return (
        String(cat.name || "")
          .toLowerCase()
          .includes(kw) ||
        String(cat.slug || "")
          .toLowerCase()
          .includes(kw) ||
        String(cat.description || "")
          .toLowerCase()
          .includes(kw)
      );
    });
  }, [categories, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / itemsPerPage),
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const totalCategory = categories.length;
  const activeCategory = categories.filter(function (c) {
    return c.status === "active";
  }).length;
  const totalProducts = categories.reduce(function (sum, c) {
    return sum + Number(c.productCount || 0);
  }, 0);

  const handleDelete = (id, name) => {
    const ok = window.confirm('Bạn có chắc muốn xóa danh mục "' + name + '"?');
    if (!ok) return;

    const next = categories.filter(function (c) {
      return c.id !== id;
    });
    setCategories(next);
    writeCategories(next);
  };

  return (
    <div className="pb-24 min-h-screen bg-[#F9F8F3] -mx-4 md:-mx-8 px-4 md:px-8 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-serif font-bold text-[#3D5245] tracking-tight">
            Quản lý Danh mục
          </h2>
          <p className="text-secondary/60 mt-2 font-serif italic">
            Phân loại tinh hoa trà theo từng nhóm đặc trưng
          </p>
        </div>

        <Link
          to="/admin/categories/add"
          className="flex items-center gap-2 px-6 py-3 bg-[#3D5245] text-white font-bold rounded-xl shadow-lg shadow-[#3D5245]/20 hover:bg-[#2D3E34] transition-all text-sm"
        >
          <Plus size={18} />
          Thêm danh mục mới
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          {
            label: "TỔNG DANH MỤC",
            value: totalCategory,
            icon: FolderTree,
            color: "text-[#3D5245]",
          },
          {
            label: "DANH MỤC HOẠT ĐỘNG",
            value: activeCategory,
            icon: CheckCircle2,
            color: "text-emerald-600",
          },
          {
            label: "SẢN PHẨM PHÂN LOẠI",
            value: totalProducts,
            icon: Package,
            color: "text-amber-600",
          },
        ].map(function (stat, idx) {
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="p-6 rounded-[2rem] bg-white border border-secondary/5 shadow-sm flex flex-col justify-between h-36"
            >
              <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">
                {stat.label}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-serif font-bold text-[#3D5245]">
                  {stat.value}
                </span>
                <div
                  className={
                    "p-3 rounded-2xl bg-surface-container-low/50 " + stat.color
                  }
                >
                  <stat.icon size={20} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-end mb-8">
        <div className="relative w-full md:w-96">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30"
          />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-secondary/10 text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 transition-all font-serif"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9F8F3]/50 border-b border-secondary/5">
                <th className="px-8 py-6 text-[10px] font-bold text-secondary/40 uppercase tracking-widest">
                  Tên danh mục
                </th>
                <th className="px-8 py-6 text-[10px] font-bold text-secondary/40 uppercase tracking-widest text-center">
                  Sản phẩm
                </th>
                <th className="px-8 py-6 text-[10px] font-bold text-secondary/40 uppercase tracking-widest text-center">
                  Trạng thái
                </th>
                <th className="px-8 py-6 text-[10px] font-bold text-secondary/40 uppercase tracking-widest text-right">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-secondary/5">
              {paginatedCategories.map(function (cat) {
                return (
                  <tr
                    key={cat.id}
                    className="hover:bg-[#F9F8F3]/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#E8F0E9] flex items-center justify-center text-[#3D5245] font-bold text-xs">
                          {String(cat.name || "").charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#3D5245]">
                            {cat.name}
                          </p>
                          <p className="text-[10px] text-secondary/40 font-medium tracking-wider uppercase">
                            /{cat.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6 text-center">
                      <span className="text-sm font-bold text-[#3D5245] bg-secondary/5 px-3 py-1 rounded-lg">
                        {Number(cat.productCount || 0)}
                      </span>
                    </td>

                    <td className="px-8 py-6 text-center">
                      <span
                        className={
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider " +
                          (cat.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700")
                        }
                      >
                        {cat.status === "active" ? "Hoạt động" : "Tạm dừng"}
                      </span>
                    </td>

                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={"/admin/categories/add?id=" + cat.id}
                          className="p-2 text-secondary/30 hover:text-[#3D5245] hover:bg-[#E8F0E9] rounded-xl transition-all"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-2 text-secondary/30 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedCategories.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-8 py-12 text-center text-secondary/50 font-medium"
                  >
                    Không có danh mục phù hợp với từ khóa tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 border-t border-secondary/5 flex justify-between items-center bg-[#F9F8F3]/20">
          <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">
            Hiển thị{" "}
            <span className="text-[#3D5245]">
              {filteredCategories.length === 0 ? 0 : startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, filteredCategories.length)}
            </span>{" "}
            trên{" "}
            <span className="text-[#3D5245]">{filteredCategories.length}</span>{" "}
            danh mục
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentPage(function (p) {
                  return Math.max(1, p - 1);
                })
              }
              className="p-2 text-secondary/30 hover:text-[#3D5245] transition-colors disabled:opacity-40"
              disabled={safePage === 1}
            >
              <ChevronLeft size={16} />
            </button>

            {[...Array(totalPages)].map(function (_, idx) {
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={
                    "w-8 h-8 rounded-lg text-xs font-bold transition-all " +
                    (safePage === idx + 1
                      ? "bg-[#3D5245] text-white shadow-md"
                      : "text-secondary/60 hover:bg-secondary/5")
                  }
                >
                  {idx + 1}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage(function (p) {
                  return Math.min(totalPages, p + 1);
                })
              }
              className="p-2 text-secondary/30 hover:text-[#3D5245] transition-colors disabled:opacity-40"
              disabled={safePage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
