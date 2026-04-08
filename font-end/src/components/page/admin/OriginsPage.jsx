import {
  MapPin,
  Plus,
  Search,
  Edit3,
  Trash2,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Save,
  X,
  Loader2,
  XCircle,
} from "lucide-react";
// eslint-disable-next-line
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const itemsPerPage = 5;

const emptyEditForm = {
  id: "",
  name: "",
  region: "",
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

function normalizeOrigin(item) {
  return {
    id: item?.id,
    name: item?.name || "",
    region: item?.region || "",
    description: item?.description || "",
    status: fromApiStatus(item?.status),
    imageUrl: item?.imageUrl || "",
  };
}

export function OriginsPage() {
  const navigate = useNavigate();

  const [origins, setOrigins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState(null); // { type: "success" | "error", text: string }

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  // confirmDelete = { id, name } | null

  const token = localStorage.getItem("token");

  const fetchOrigins = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/admin/origins", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const data = await res.json().catch(() => []);
      if (!res.ok) {
        throw new Error(data?.message || `Lỗi ${res.status}`);
      }

      const list = Array.isArray(data) ? data.map(normalizeOrigin) : [];
      setOrigins(list);
    } catch (err) {
      setNotice({
        type: "error",
        text: err?.message || "Không tải được danh sách xuất xứ.",
      });
      setOrigins([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrigins();
  }, []);

  const filteredOrigins = useMemo(() => {
    const kw = searchTerm.trim().toLowerCase();
    if (!kw) return origins;

    return origins.filter((origin) => {
      return (
        String(origin.name || "")
          .toLowerCase()
          .includes(kw) ||
        String(origin.region || "")
          .toLowerCase()
          .includes(kw) ||
        String(origin.description || "")
          .toLowerCase()
          .includes(kw)
      );
    });
  }, [origins, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrigins.length / itemsPerPage),
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedOrigins = filteredOrigins.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const totalOrigins = origins.length;
  const activeOrigins = origins.filter((o) => o.status === "active").length;

  const openEditModal = (origin) => {
    setEditForm({
      id: origin.id,
      name: origin.name || "",
      region: origin.region || "",
      description: origin.description || "",
      status: origin.status || "active",
    });
    setErrorMsg("");
    setIsEditOpen(true);
  };

  const handleDelete = async (id, name) => {
    const ok = window.confirm(`Bạn có chắc muốn xóa vùng "${name}"?`);
    if (!ok) return;

    setDeletingId(id);
    setNotice(null);

    try {
      const res = await fetch(`http://localhost:8080/api/admin/origins/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || `Lỗi ${res.status}`);
      }

      setOrigins((prev) => prev.filter((o) => o.id !== id));
      setNotice({ type: "success", text: "Xóa xuất xứ thành công." });
    } catch (err) {
      setNotice({
        type: "error",
        text: err?.message || "Có lỗi xảy ra khi xóa xuất xứ.",
      });
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const handleSaveEdit = async () => {
    const name = editForm.name.trim();
    const region = editForm.region.trim();

    if (!name) {
      setErrorMsg("Tên vùng xuất xứ không được để trống.");
      return;
    }
    if (!region) {
      setErrorMsg("Tỉnh thành không được để trống.");
      return;
    }

    setIsSavingEdit(true);
    setNotice(null);

    try {
      const payload = {
        name,
        region,
        description: editForm.description.trim(),
        status: toApiStatus(editForm.status),
      };

      const formData = new FormData();
      formData.append(
        "origin",
        new Blob([JSON.stringify(payload)], { type: "application/json" }),
      );

      const res = await fetch(
        `http://localhost:8080/api/admin/origins/${editForm.id}`,
        {
          method: "PUT",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: formData,
        },
      );

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || `Lỗi ${res.status}`);
      }

      const updated = normalizeOrigin(data);
      setOrigins((prev) =>
        prev.map((o) => (o.id === updated.id ? updated : o)),
      );
      setIsEditOpen(false);
      setEditForm(emptyEditForm);
      setErrorMsg("");
      setNotice({ type: "success", text: "Cập nhật xuất xứ thành công." });
    } catch (err) {
      setErrorMsg(err?.message || "Có lỗi xảy ra khi cập nhật.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const performDelete = async (id, name) => {
    setDeletingId(id);
    setNotice(null);

    try {
      const res = await fetch(`http://localhost:8080/api/admin/origins/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || `Lỗi ${res.status}`);

      setOrigins((prev) => prev.filter((o) => o.id !== id));
      setNotice({ type: "success", text: `Đã xóa vùng ${name}.` });
    } catch (err) {
      setNotice({ type: "error", text: err?.message || "Có lỗi khi xóa." });
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(t);
  }, [notice]);

  return (
    <div className="pb-24 min-h-screen bg-[#F9F8F3] -mx-4 md:-mx-8 px-4 md:px-8 pt-8">
      {notice && (
        <motion.div
          className="fixed top-5 right-5 z-[120]"
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
        >
          <div
            className={
              "rounded-xl border px-4 py-3 text-sm font-medium flex items-center gap-2 shadow-lg " +
              (notice.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-rose-50 border-rose-200 text-rose-700")
            }
          >
            {notice.type === "success" ? (
              <CheckCircle2 size={16} />
            ) : (
              <XCircle size={16} />
            )}
            <span>{notice.text}</span>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-serif font-bold text-[#3D5245] tracking-tight">
            Quản lý Xuất xứ
          </h2>
          <p className="text-secondary/60 mt-2 font-serif italic">
            Ghi dấu những vùng đất khai sinh ra tinh hoa trà Việt
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/origins/add")}
          className="flex items-center gap-2 px-6 py-3 bg-[#3D5245] text-white font-bold rounded-xl shadow-lg shadow-[#3D5245]/20 hover:bg-[#2D3E34] transition-all text-sm"
        >
          <Plus size={18} />
          Thêm vùng xuất xứ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {[
          {
            label: "TỔNG VÙNG TRÀ",
            value: totalOrigins,
            icon: MapPin,
            color: "text-[#3D5245]",
          },
          {
            label: "VÙNG TRÀ ĐANG HOẠT ĐỘNG",
            value: activeOrigins,
            icon: CheckCircle2,
            color: "text-indigo-600",
          },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
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
            placeholder="Tìm kiếm vùng, tỉnh thành..."
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
                  Vùng xuất xứ
                </th>
                <th className="px-8 py-6 text-[10px] font-bold text-secondary/40 uppercase tracking-widest">
                  Tỉnh thành
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
                    colSpan={4}
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
                paginatedOrigins.map((origin) => (
                  <tr
                    key={origin.id}
                    className="hover:bg-[#F9F8F3]/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#E8F0E9] flex items-center justify-center text-[#3D5245] font-bold text-xs uppercase">
                          {String(origin.name || "").substring(0, 2)}
                        </div>
                        <p className="text-sm font-bold text-[#3D5245]">
                          {origin.name}
                        </p>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-secondary/60 bg-secondary/5 px-2 py-1 rounded-md">
                        {origin.region}
                      </span>
                    </td>

                    <td className="px-8 py-6 text-center">
                      <span
                        className={
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider " +
                          (origin.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700")
                        }
                      >
                        {origin.status === "active" ? "Hoạt động" : "Tạm dừng"}
                      </span>
                    </td>

                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(origin)}
                          className="p-2 text-secondary/30 hover:text-[#3D5245] hover:bg-[#E8F0E9] rounded-xl transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            setConfirmDelete({
                              id: origin.id,
                              name: origin.name,
                            })
                          }
                          disabled={deletingId === origin.id}
                          className="p-2 text-secondary/30 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-50"
                        >
                          {deletingId === origin.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!isLoading && paginatedOrigins.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-8 py-12 text-center text-secondary/50 font-medium"
                  >
                    Không có vùng xuất xứ phù hợp với từ khóa tìm kiếm.
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
              {filteredOrigins.length === 0 ? 0 : startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, filteredOrigins.length)}
            </span>{" "}
            trên{" "}
            <span className="text-[#3D5245]">{filteredOrigins.length}</span>{" "}
            vùng xuất xứ
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 text-secondary/30 hover:text-[#3D5245] transition-colors disabled:opacity-40"
              disabled={safePage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isEditOpen && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/30 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEditOpen(false)}
          >
            <motion.div
              className="w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 shadow-2xl"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-serif font-bold text-[#3D5245]">
                  Chỉnh sửa vùng xuất xứ
                </h3>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="p-2 rounded-xl hover:bg-secondary/10 text-secondary/60"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-1">
                    Tên vùng xuất xứ
                  </label>
                  <input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-secondary/15 outline-none focus:ring-2 focus:ring-[#3D5245]/10"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-1">
                    Tỉnh thành
                  </label>
                  <input
                    value={editForm.region}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, region: e.target.value }))
                    }
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-secondary/15 outline-none focus:ring-2 focus:ring-[#3D5245]/10"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-1">
                    Trạng thái
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, status: e.target.value }))
                    }
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-secondary/15 outline-none focus:ring-2 focus:ring-[#3D5245]/10"
                  >
                    <option value="active">Đang khai thác</option>
                    <option value="inactive">Tạm ngưng</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-1">
                  Mô tả
                </label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, description: e.target.value }))
                  }
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-secondary/15 outline-none focus:ring-2 focus:ring-[#3D5245]/10 resize-none"
                />
              </div>

              {errorMsg && (
                <p className="mt-3 text-sm text-rose-600 font-medium">
                  {errorMsg}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-secondary/20 text-secondary/70 hover:bg-secondary/5"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSavingEdit}
                  className="px-5 py-2.5 rounded-xl bg-[#3D5245] text-white font-semibold flex items-center gap-2 hover:bg-[#2D3E34] disabled:opacity-60"
                >
                  {isSavingEdit ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Lưu thay đổi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 z-[110] bg-black/35 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-lg font-bold text-[#3D5245] mb-2">
                Xác nhận xóa
              </h4>
              <p className="text-sm text-secondary/70 mb-6">
                Bạn có chắc muốn xóa vùng xuất xứ "{confirmDelete.name}" không?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 rounded-lg border border-secondary/20 text-secondary/70 hover:bg-secondary/5"
                >
                  Không
                </button>
                <button
                  onClick={() =>
                    performDelete(confirmDelete.id, confirmDelete.name)
                  }
                  className="px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700"
                >
                  Có, xóa
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
