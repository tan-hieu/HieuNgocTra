import {
  FolderTree,
  Plus,
  Search,
  Edit3,
  Trash2,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  X,
  ChevronDown,
  Loader2,
  XCircle,
  ImagePlus,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const itemsPerPage = 5;
const API_URL = "http://localhost:8080/api/admin/categories";

const emptyForm = {
  name: "",
  description: "",
  status: "active",
};

function fromApiStatus(status) {
  return String(status || "").toUpperCase() === "INACTIVE"
    ? "inactive"
    : "active";
}

function toApiStatus(status) {
  return status === "inactive" ? "INACTIVE" : "ACTIVE";
}

function normalizeCategory(item) {
  return {
    id: item?.id,
    name: item?.name || "",
    slug: item?.slug || "",
    description: item?.description || "",
    imageUrl: item?.imageUrl || "",
    status: fromApiStatus(item?.status),
  };
}

export function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [resultPopup, setResultPopup] = useState(null);

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL, {
        headers: token ? { Authorization: "Bearer " + token } : undefined,
      });

      const data = await res.json().catch(() => []);
      if (!res.ok) {
        throw new Error(data?.message || "Lỗi " + res.status);
      }

      const list = Array.isArray(data) ? data.map(normalizeCategory) : [];
      setCategories(list);
    } catch (err) {
      setResultPopup({
        type: "error",
        title: "Lỗi tải dữ liệu",
        message: err?.message || "Không tải được danh mục.",
      });
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const kw = searchTerm.trim().toLowerCase();
    if (!kw) return categories;

    return categories.filter((cat) => {
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
  const activeCategory = categories.filter((c) => c.status === "active").length;

  const openEditModal = (cat) => {
    setEditingId(String(cat.id));
    setForm({
      name: String(cat.name || ""),
      description: String(cat.description || ""),
      status: String(cat.status || "active"),
    });
    setExistingImageUrl(String(cat.imageUrl || ""));
    setEditImageFile(null);
    setEditImagePreview(String(cat.imageUrl || ""));
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingId("");
    setForm(emptyForm);
    setExistingImageUrl("");
    setEditImageFile(null);
    setEditImagePreview(null);
  };

  const onChangeEditImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const handleSaveEdit = async () => {
    const cleanName = form.name.trim();
    const cleanDesc = form.description.trim();

    if (!cleanName || !cleanDesc) {
      setResultPopup({
        type: "error",
        title: "Dữ liệu chưa hợp lệ",
        message: "Vui lòng nhập đủ Tên danh mục và Mô tả.",
      });
      return;
    }

    if (!existingImageUrl && !editImageFile) {
      setResultPopup({
        type: "error",
        title: "Thiếu ảnh đại diện",
        message: "Danh mục này chưa có ảnh, vui lòng chọn ảnh trước khi lưu.",
      });
      return;
    }

    setIsSavingEdit(true);
    try {
      const payload = {
        name: cleanName,
        description: cleanDesc,
        status: toApiStatus(form.status),
      };

      const formData = new FormData();
      formData.append(
        "category",
        new Blob([JSON.stringify(payload)], { type: "application/json" }),
      );
      if (editImageFile) {
        formData.append("image", editImageFile);
      }

      const res = await fetch(API_URL + "/" + editingId, {
        method: "PUT",
        headers: token ? { Authorization: "Bearer " + token } : undefined,
        body: formData,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || "Lỗi " + res.status);

      const updated = normalizeCategory(data);
      setCategories((prev) =>
        prev.map((c) => (String(c.id) === String(updated.id) ? updated : c)),
      );
      closeEditModal();

      setResultPopup({
        type: "success",
        title: "Cập nhật thành công",
        message: "Danh mục đã được cập nhật.",
      });
    } catch (err) {
      setResultPopup({
        type: "error",
        title: "Cập nhật thất bại",
        message: err?.message || "Có lỗi khi cập nhật danh mục.",
      });
    } finally {
      setIsSavingEdit(false);
    }
  };

  const openDeletePopup = (id, name) => {
    setConfirmDelete({ id, name });
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    const { id, name } = confirmDelete;
    setDeletingId(id);

    try {
      const res = await fetch(API_URL + "/" + id, {
        method: "DELETE",
        headers: token ? { Authorization: "Bearer " + token } : undefined,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || "Lỗi " + res.status);

      setCategories((prev) => prev.filter((c) => c.id !== id));
      setResultPopup({
        type: "success",
        title: "Xóa thành công",
        message: 'Đã xóa danh mục "' + name + '".',
      });
    } catch (err) {
      setResultPopup({
        type: "error",
        title: "Xóa thất bại",
        message: err?.message || "Có lỗi khi xóa danh mục.",
      });
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
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
        ].map((stat, idx) => (
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
        ))}
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
                  Trạng thái
                </th>
                <th className="px-8 py-6 text-[10px] font-bold text-secondary/40 uppercase tracking-widest text-right">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-secondary/5">
              {isLoading && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-8 py-12 text-center text-secondary/50 font-medium"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Đang tải dữ liệu...
                    </span>
                  </td>
                </tr>
              )}

              {!isLoading &&
                paginatedCategories.map((cat) => (
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
                        <button
                          type="button"
                          onClick={() => openEditModal(cat)}
                          className="p-2 text-secondary/30 hover:text-[#3D5245] hover:bg-[#E8F0E9] rounded-xl transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeletePopup(cat.id, cat.name)}
                          disabled={deletingId === cat.id}
                          className="p-2 text-secondary/30 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-60"
                        >
                          {deletingId === cat.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!isLoading && paginatedCategories.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
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
                setCurrentPage((p) => {
                  return Math.max(1, p - 1);
                })
              }
              className="p-2 text-secondary/30 hover:text-[#3D5245] transition-colors disabled:opacity-40"
              disabled={safePage === 1}
            >
              <ChevronLeft size={16} />
            </button>

            {[...Array(totalPages)].map((_, idx) => (
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
            ))}

            <button
              onClick={() =>
                setCurrentPage((p) => {
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

      {isEditOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 p-3 sm:p-6 flex items-center justify-center"
          onClick={closeEditModal}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-secondary/10 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-secondary/10 flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-bold text-[#3D5245] leading-none">
                Chỉnh sửa danh mục
              </h3>
              <button
                type="button"
                onClick={closeEditModal}
                className="p-2 rounded-xl text-secondary/50 hover:text-[#3D5245] hover:bg-secondary/5"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 sm:px-8 py-5 sm:py-6 space-y-5 overflow-y-auto">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">
                  Tên danh mục *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full h-12 px-5 bg-[#F9F8F3] rounded-2xl border border-secondary/10 text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">
                  Mô tả *
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-5 py-3 bg-[#F9F8F3] rounded-2xl border border-secondary/10 text-sm outline-none focus:ring-2 focus:ring-[#3D5245]/10 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">
                  Ảnh đại diện
                </label>

                <label className="block aspect-video rounded-2xl bg-[#F9F8F3] border-2 border-dashed border-secondary/10 hover:border-[#3D5245]/30 overflow-hidden cursor-pointer">
                  {editImagePreview ? (
                    <img
                      src={editImagePreview}
                      alt="category-preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center gap-2 text-secondary/50 text-sm font-medium">
                      <ImagePlus size={18} />
                      Chọn ảnh mới
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onChangeEditImage}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">
                  Trạng thái
                </label>

                <div className="relative">
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, status: e.target.value }))
                    }
                    className="w-full h-12 pl-5 pr-12 py-0 bg-[#F9F8F3] rounded-2xl border border-secondary/10 text-sm text-[#3D5245] outline-none focus:ring-2 focus:ring-[#3D5245]/10 appearance-none"
                  >
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Tạm ngưng</option>
                  </select>

                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-secondary/60"
                  />
                </div>
              </div>
            </div>

            <div className="px-5 sm:px-8 py-4 border-t border-secondary/10 bg-[#F9F8F3]/40 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeEditModal}
                className="h-11 px-5 rounded-xl text-secondary/70 hover:text-[#3D5245]"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSavingEdit}
                className="h-11 px-6 rounded-xl bg-[#3D5245] text-white font-bold hover:bg-[#2D3E34] disabled:opacity-60 inline-flex items-center gap-2"
              >
                {isSavingEdit && <Loader2 size={16} className="animate-spin" />}
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 p-4 flex items-center justify-center"
          onClick={() => {
            if (deletingId === confirmDelete.id) return;
            setConfirmDelete(null);
          }}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-secondary/10 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-xl font-bold text-[#3D5245]">Xác nhận xóa</h4>
            <p className="mt-3 text-sm text-secondary/70">
              Bạn có chắc muốn xóa danh mục "{confirmDelete.name}"?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="h-11 px-5 rounded-xl text-secondary/70 hover:text-[#3D5245]"
                onClick={() => setConfirmDelete(null)}
                disabled={deletingId === confirmDelete.id}
              >
                Hủy
              </button>
              <button
                className="h-11 px-6 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 inline-flex items-center gap-2"
                onClick={handleDelete}
                disabled={deletingId === confirmDelete.id}
              >
                {deletingId === confirmDelete.id && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {resultPopup && (
        <div className="fixed inset-0 z-[70] bg-black/30 p-4 flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-secondary/10 p-6">
            <div className="flex items-center gap-2">
              {resultPopup.type === "success" ? (
                <CheckCircle2 size={20} className="text-emerald-600" />
              ) : (
                <XCircle size={20} className="text-rose-600" />
              )}
              <h4 className="text-xl font-bold text-[#3D5245]">
                {resultPopup.title}
              </h4>
            </div>
            <p className="mt-3 text-sm text-secondary/70">
              {resultPopup.message}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                className="h-11 px-6 rounded-xl bg-[#3D5245] text-white font-bold hover:bg-[#2D3E34]"
                onClick={() => setResultPopup(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
