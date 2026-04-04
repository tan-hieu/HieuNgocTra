import {
  Package,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
// eslint-disable-next-line
import { motion } from "motion/react";
import { Link as RouterLink } from "react-router-dom";

const allProducts = [
  {
    id: "SP001",
    name: "Trà Ô Long Đặc Biệt",
    category: "Trà Ô Long",
    price: "450.000đ",
    stock: 45,
    status: "Còn hàng",
    image:
      "https://images.unsplash.com/photo-1544787210-28272550d795?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "SP002",
    name: "Trà Xanh Thái Nguyên",
    category: "Trà Xanh",
    price: "280.000đ",
    stock: 120,
    status: "Còn hàng",
    image:
      "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "SP003",
    name: "Trà Sen Tây Hồ",
    category: "Trà Ướp Hoa",
    price: "850.000đ",
    stock: 12,
    status: "Sắp hết",
    image:
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "SP004",
    name: "Trà Phổ Nhĩ Chín",
    category: "Trà Phổ Nhĩ",
    price: "1.200.000đ",
    stock: 8,
    status: "Sắp hết",
    image:
      "https://images.unsplash.com/photo-1563911191470-3974e4468869?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "SP005",
    name: "Trà Lài Thượng Hạng",
    category: "Trà Ướp Hoa",
    price: "320.000đ",
    stock: 0,
    status: "Hết hàng",
    image:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "SP006",
    name: "Trà Thiết Quan Âm",
    category: "Trà Ô Long",
    price: "550.000đ",
    stock: 25,
    status: "Còn hàng",
    image:
      "https://images.unsplash.com/photo-1563911191470-3974e4468869?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "SP007",
    name: "Trà Đinh Thái Nguyên",
    category: "Trà Xanh",
    price: "1.500.000đ",
    stock: 5,
    status: "Sắp hết",
    image:
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "SP008",
    name: "Trà Shan Tuyết",
    category: "Trà Xanh",
    price: "650.000đ",
    stock: 30,
    status: "Còn hàng",
    image:
      "https://images.unsplash.com/photo-1544787210-28272550d795?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "SP009",
    name: "Trà Móc Câu",
    category: "Trà Xanh",
    price: "380.000đ",
    stock: 50,
    status: "Còn hàng",
    image:
      "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "SP010",
    name: "Trà Cổ Thụ Tà Xùa",
    category: "Trà Xanh",
    price: "950.000đ",
    stock: 15,
    status: "Sắp hết",
    image:
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "SP011",
    name: "Trà Ô Long Nhân Sâm",
    category: "Trà Ô Long",
    price: "720.000đ",
    stock: 20,
    status: "Còn hàng",
    image:
      "https://images.unsplash.com/photo-1544787210-28272550d795?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "SP012",
    name: "Trà Bửu Lộc",
    category: "Trà Ô Long",
    price: "480.000đ",
    stock: 60,
    status: "Còn hàng",
    image:
      "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?q=80&w=200&auto=format&fit=crop",
  },
];

export function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const products = allProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-serif font-bold text-primary tracking-tight mb-2">
            Quản lý sản phẩm
          </h2>
          <p className="text-on-surface-variant/60 font-medium">
            Danh sách các loại trà thượng hạng trong kho của bạn.
          </p>
        </div>
        <RouterLink
          to="/admin/products/add"
          className="bg-primary text-white px-6 py-3 rounded-xl font-serif font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          Thêm sản phẩm mới
        </RouterLink>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-primary-container/30 mb-8 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px] relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-12 pr-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/20 font-medium"
          />
        </div>
        <p className="text-sm font-bold text-on-surface-variant/60">
          Hiển thị {allProducts.length} sản phẩm
        </p>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-primary-container/30 overflow-hidden mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50 border-bottom border-primary-container/20">
              <th className="px-8 py-5 font-serif font-bold text-primary text-sm uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-8 py-5 font-serif font-bold text-primary text-sm uppercase tracking-wider">
                Danh mục
              </th>
              <th className="px-8 py-5 font-serif font-bold text-primary text-sm uppercase tracking-wider">
                Giá bán
              </th>
              <th className="px-8 py-5 font-serif font-bold text-primary text-sm uppercase tracking-wider">
                Tồn kho
              </th>
              <th className="px-8 py-5 font-serif font-bold text-primary text-sm uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-8 py-5 font-serif font-bold text-primary text-sm uppercase tracking-wider text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-container/10">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-primary-container/5 transition-colors group"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-container overflow-hidden shadow-sm">
                      <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <p className="font-serif font-bold text-primary">
                        {product.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-primary-container/30 text-primary rounded-full text-xs font-bold">
                    {product.category}
                  </span>
                </td>
                <td className="px-8 py-5 font-bold text-primary">
                  {product.price}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${product.stock > 20 ? "bg-primary" : product.stock > 0 ? "bg-tertiary" : "bg-error"}`}
                        style={{ width: `${Math.min(product.stock, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-on-surface-variant">
                      {product.stock}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`text-xs font-bold uppercase tracking-widest ${
                      product.status === "Còn hàng"
                        ? "text-primary"
                        : product.status === "Sắp hết"
                          ? "text-tertiary"
                          : "text-error"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 transition-opacity">
                    <button className="p-2.5 bg-primary-container/20 hover:bg-primary-container/50 rounded-xl text-primary transition-colors border border-primary-container/30">
                      <Edit size={18} />
                    </button>
                    <button className="p-2.5 bg-error/5 hover:bg-error/10 rounded-xl text-error transition-colors border border-error/10">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-4">
        <p className="text-sm font-bold text-on-surface-variant/60">
          Trang {currentPage} / {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-white border border-primary-container/30 text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-container/20 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                currentPage === i + 1
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white border border-primary-container/30 text-primary hover:bg-primary-container/20"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl bg-white border border-primary-container/30 text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-container/20 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
