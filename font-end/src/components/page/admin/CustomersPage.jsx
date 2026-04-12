import {
  Download,
  UserPlus,
  Mail,
  Phone,
  Users,
  ChevronLeft,
  ChevronRight,
  Search,
  Eye,
  X,
  ShieldCheck,
  MapPin,
  Edit3,
  Trash2,
  ChevronDown,
  Check,
  CheckCircle2,
  Lock,
  User,
  Loader2,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/api/admin/customers";
const PAGE_SIZE = 10;

function fromApiStatus(status) {
  const s = String(status || "").toUpperCase();
  if (s === "INACTIVE") return "inactive";
  if (s === "LOCKED") return "inactive";
  return "active";
}

function toApiStatus(status) {
  return status === "inactive" ? "INACTIVE" : "ACTIVE";
}

function normalizeCustomer(item) {
  const name = String(item?.fullName || "");
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

  return {
    id: String(item?.id || ""),
    name,
    email: String(item?.email || ""),
    phone: String(item?.phone || ""),
    address: String(item?.address || ""),
    initials: initials || "KH",
    status: fromApiStatus(item?.status),
    role:
      String(item?.roleName || "").toLowerCase() === "admin" ? "admin" : "user",
  };
}

export function CustomersPage() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [tempCustomer, setTempCustomer] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [notice, setNotice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const statusRef = useRef(null);
  const roleRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatusDropdownOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(t);
  }, [notice]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL, {
        headers: token ? { Authorization: "Bearer " + token } : undefined,
      });
      const data = await res.json().catch(() => []);
      if (!res.ok) throw new Error(data?.message || "Lỗi " + res.status);

      setCustomers(Array.isArray(data) ? data.map(normalizeCustomer) : []);
    } catch (err) {
      setCustomers([]);
      setNotice({
        type: "error",
        text: err?.message || "Không tải được danh sách khách hàng.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter((c) => {
      return (
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone.toLowerCase().includes(term)
      );
    });
  }, [customers, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / PAGE_SIZE),
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pagedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const activeCount = customers.filter((c) => c.status === "active").length;

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setTempCustomer({ ...customer });
    setIsEditModalOpen(true);
    setIsStatusDropdownOpen(false);
    setIsRoleDropdownOpen(false);
  };

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setIsViewModalOpen(true);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    const customer = confirmDelete;
    setDeletingId(customer.id);

    try {
      const res = await fetch(API_URL + "/" + customer.id, {
        method: "DELETE",
        headers: token ? { Authorization: "Bearer " + token } : undefined,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || "Lỗi " + res.status);

      setCustomers((prev) => prev.filter((c) => c.id !== customer.id));

      setNotice({ type: "success", text: "Xóa khách hàng thành công." });
    } catch (err) {
      setNotice({
        type: "error",
        text: err?.message || "Có lỗi khi xóa khách hàng.",
      });
    } finally {
      setDeletingId("");
      setConfirmDelete(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!tempCustomer?.name?.trim()) {
      setNotice({ type: "error", text: "Họ tên không được để trống." });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        fullName: tempCustomer.name.trim(),
        phone: tempCustomer.phone?.trim() || "",
        address: tempCustomer.address?.trim() || "",
        status: toApiStatus(tempCustomer.status),
      };

      const res = await fetch(API_URL + "/" + tempCustomer.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: "Bearer " + token } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || "Lỗi " + res.status);

      const updated = normalizeCustomer(data);
      setCustomers((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c)),
      );

      setSelectedCustomer(updated);
      setIsEditModalOpen(false);
      setNotice({ type: "success", text: "Đã lưu thay đổi." });
    } catch (err) {
      setNotice({
        type: "error",
        text: err?.message || "Có lỗi khi cập nhật khách hàng.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pb-12 relative">
      {notice && (
        <motion.div
          className="fixed top-5 right-5 z-[120]"
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
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
          <h2 className="text-4xl font-bold text-[#3D5245]">
            Quản lý Khách hàng
          </h2>
          <p className="text-secondary/60 mt-2 italic">
            Lưu giữ và tri ân những tâm hồn yêu trà
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-[#3D5245] border border-[#3D5245]/10 font-bold rounded-xl shadow-sm hover:bg-[#3D5245]/5 transition-all text-sm">
            <Download size={18} />
            Xuất báo cáo
          </button>
          <button
            onClick={() => navigate("/admin/customers/add")}
            className="flex items-center gap-2 px-6 py-3 bg-[#3D5245] text-white font-bold rounded-xl shadow-lg shadow-[#3D5245]/20 hover:bg-[#2D3E34] transition-all text-sm"
          >
            <UserPlus size={18} />
            Thêm khách hàng mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          { label: "TỔNG KHÁCH HÀNG", value: customers.length },
          { label: "KH ĐANG HOẠT ĐỘNG", value: activeCount },
          { label: "KHÁCH BỊ KHÓA", value: customers.length - activeCount },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-[2rem] border border-primary/5 shadow-sm flex flex-col justify-between h-40 bg-white"
          >
            <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">
                {stat.value}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row justify-end items-center gap-4 mb-8">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal hidden md:block">
            Hiển thị{" "}
            <span className="text-primary">
              {filteredCustomers.length === 0 ? 0 : startIndex + 1}-
              {Math.min(startIndex + PAGE_SIZE, filteredCustomers.length)}
            </span>{" "}
            trong số{" "}
            <span className="text-primary">{filteredCustomers.length}</span> kết
            quả
          </p>
          <div className="relative flex-1 lg:w-96">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40"
            />
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng theo tên, email..."
              className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-primary/10 text-sm outline-none focus:border-primary/30 transition-all"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-primary/5 shadow-sm overflow-hidden mb-10 relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/30 border-b border-primary/5">
                <th className="px-8 py-6 text-[10px] font-bold text-secondary/40 uppercase tracking-normal">
                  Khách hàng
                </th>
                <th className="px-8 py-6 text-[10px] font-bold text-secondary/40 uppercase tracking-normal">
                  Địa chỉ
                </th>
                <th className="px-8 py-6 text-[10px] font-bold text-secondary/40 uppercase tracking-normal text-center">
                  Vai trò
                </th>
                <th className="px-8 py-6 text-[10px] font-bold text-secondary/40 uppercase tracking-normal text-center">
                  Trạng thái
                </th>
                <th className="px-8 py-6 text-[10px] font-bold text-secondary/40 uppercase tracking-normal text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {isLoading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-10 text-center text-secondary/60"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Đang tải dữ liệu...
                    </span>
                  </td>
                </tr>
              )}

              {!isLoading &&
                pagedCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-primary/[0.02] transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-xs border border-primary/10">
                          {customer.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-primary truncate">
                            {customer.name}
                          </p>
                          <p className="text-[10px] text-secondary/40 font-medium truncate">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs text-secondary/60 truncate">
                        <MapPin
                          size={12}
                          className="shrink-0 text-secondary/30"
                        />
                        <span className="truncate">
                          {customer.address || "Chưa cập nhật"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {customer.role === "admin" ? (
                          <ShieldCheck size={14} className="text-indigo-500" />
                        ) : (
                          <User size={14} className="text-purple-500" />
                        )}
                        <span
                          className={`text-[10px] font-bold uppercase tracking-normal ${
                            customer.role === "admin"
                              ? "text-indigo-600"
                              : "text-purple-600"
                          }`}
                        >
                          {customer.role === "admin"
                            ? "Quản trị"
                            : "Người dùng"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-normal ${
                          customer.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {customer.status === "active"
                          ? "HOẠT ĐỘNG"
                          : "TẠM KHÓA"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleView(customer)}
                          className="p-1.5 text-secondary/40 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(customer)}
                          className="p-1.5 text-secondary/40 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          title="Chỉnh sửa"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(customer)}
                          className="p-1.5 text-secondary/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Xóa"
                          disabled={deletingId === customer.id}
                        >
                          {deletingId === customer.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!isLoading && pagedCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-12 text-center text-secondary/50"
                  >
                    Không có khách hàng phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 border-t border-primary/5 flex justify-center items-center gap-2">
          <button
            className="p-2 text-secondary/40 hover:text-primary transition-colors disabled:opacity-40"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                safePage === idx + 1
                  ? "bg-primary text-white shadow-md"
                  : "text-secondary/60 hover:bg-primary/5"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="p-2 text-secondary/40 hover:text-primary transition-colors disabled:opacity-40"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isViewModalOpen && selectedCustomer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsViewModalOpen(false)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-8 py-6 border-b border-primary/5 flex justify-between items-center bg-surface-container-low/30">
                <div>
                  <h3 className="text-2xl font-bold text-primary">
                    Chi tiết khách hàng
                  </h3>
                  <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal mt-1">
                    Mã KH: #{selectedCustomer.id.padStart(4, "0")}
                  </p>
                </div>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 hover:bg-primary/5 rounded-full text-secondary/40 hover:text-primary transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal">
                      Thông tin cá nhân
                    </h4>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-primary font-bold text-xl border border-primary/10 shrink-0">
                        {selectedCustomer.initials}
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-bold text-primary">
                          {selectedCustomer.name}
                        </p>
                        <div className="space-y-1">
                          <p className="text-xs text-secondary/60 flex items-center gap-2">
                            <Mail size={14} className="text-secondary/40" />
                            {selectedCustomer.email}
                          </p>
                          <p className="text-xs text-secondary/60 flex items-center gap-2">
                            <Phone size={14} className="text-secondary/40" />
                            {selectedCustomer.phone || "Chưa có SĐT"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal">
                      Địa chỉ liên hệ
                    </h4>
                    <div className="flex items-start gap-2 text-xs text-secondary/60 leading-relaxed bg-surface-container-low/30 p-4 rounded-2xl border border-primary/5">
                      <MapPin
                        size={16}
                        className="text-secondary/40 shrink-0 mt-0.5"
                      />
                      {selectedCustomer.address || "Chưa cập nhật"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal">
                      Trạng thái tài khoản
                    </p>
                    <span
                      className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-normal ${
                        selectedCustomer.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedCustomer.status === "active"
                        ? "Đang hoạt động"
                        : "Đã tạm khóa"}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal">
                      Vai trò hệ thống
                    </p>
                    <div className="flex items-center gap-2">
                      {selectedCustomer.role === "admin" ? (
                        <ShieldCheck size={18} className="text-indigo-500" />
                      ) : (
                        <User size={18} className="text-purple-500" />
                      )}
                      <span
                        className={`text-sm font-bold ${
                          selectedCustomer.role === "admin"
                            ? "text-indigo-600"
                            : "text-purple-600"
                        }`}
                      >
                        {selectedCustomer.role === "admin"
                          ? "Quản trị viên"
                          : "Người dùng"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 border-t border-primary/5 bg-surface-container-low/30 flex justify-end">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-8 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all text-sm"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && selectedCustomer && tempCustomer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-8 py-6 border-b border-primary/5 flex justify-between items-center bg-surface-container-low/30">
                <div>
                  <h3 className="text-2xl font-bold text-primary">
                    Chỉnh sửa khách hàng
                  </h3>
                  <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal mt-1">
                    Mã KH: #{selectedCustomer.id.padStart(4, "0")}
                  </p>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 hover:bg-primary/5 rounded-full text-secondary/40 hover:text-primary transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-48">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal">
                      Thông tin cá nhân
                    </h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal ml-1">
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          value={tempCustomer.name}
                          onChange={(e) =>
                            setTempCustomer((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 bg-surface-container-low/30 rounded-xl border border-primary/5 text-sm outline-none focus:border-primary/20 font-bold text-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal ml-1">
                          Email
                        </label>
                        <div className="w-full px-4 py-3 bg-surface-container-low/10 rounded-xl border border-primary/5 text-sm font-medium text-secondary/50 flex items-center gap-2 cursor-not-allowed">
                          <Mail size={14} className="opacity-40" />
                          {tempCustomer.email}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal ml-1">
                          Số điện thoại
                        </label>
                        <input
                          type="text"
                          value={tempCustomer.phone}
                          onChange={(e) =>
                            setTempCustomer((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 bg-surface-container-low/30 rounded-xl border border-primary/5 text-sm outline-none focus:border-primary/20 font-medium text-secondary"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal">
                      Địa chỉ liên hệ
                    </h4>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal ml-1">
                        Địa chỉ chi tiết
                      </label>
                      <textarea
                        rows={6}
                        value={tempCustomer.address}
                        onChange={(e) =>
                          setTempCustomer((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 bg-surface-container-low/30 rounded-xl border border-primary/5 text-sm outline-none focus:border-primary/20 font-medium text-secondary resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal ml-1">
                      Trạng thái tài khoản
                    </label>
                    <div className="relative" ref={statusRef}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsStatusDropdownOpen(!isStatusDropdownOpen);
                          setIsRoleDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3.5 bg-white rounded-2xl border border-primary/10 text-sm outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all font-bold text-primary flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {tempCustomer.status === "active" ? (
                            <>
                              <CheckCircle2
                                size={16}
                                className="text-emerald-500"
                              />
                              <span className="text-emerald-600">
                                Đang hoạt động
                              </span>
                            </>
                          ) : (
                            <>
                              <Lock size={16} className="text-rose-500" />
                              <span className="text-rose-600">Đã tạm khóa</span>
                            </>
                          )}
                        </div>
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-300 ${
                            isStatusDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isStatusDropdownOpen && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              y: 10,
                              scale: 0.95,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              scale: 1,
                            }}
                            exit={{
                              opacity: 0,
                              y: 10,
                              scale: 0.95,
                            }}
                            className="absolute z-[110] top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-primary/5 overflow-hidden p-1.5"
                          >
                            <button
                              onClick={() => {
                                setTempCustomer((prev) => ({
                                  ...prev,
                                  status: "active",
                                }));
                                setIsStatusDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-2.5 flex items-center justify-between rounded-xl transition-all ${
                                tempCustomer.status === "active"
                                  ? "bg-emerald-50"
                                  : "hover:bg-primary/5"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <CheckCircle2
                                  size={18}
                                  className="text-emerald-500"
                                />
                                <span
                                  className={`text-sm font-bold ${
                                    tempCustomer.status === "active"
                                      ? "text-emerald-700"
                                      : "text-secondary/60"
                                  }`}
                                >
                                  Đang hoạt động
                                </span>
                              </div>
                              {tempCustomer.status === "active" && (
                                <Check size={16} className="text-emerald-600" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setTempCustomer((prev) => ({
                                  ...prev,
                                  status: "inactive",
                                }));
                                setIsStatusDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-2.5 flex items-center justify-between rounded-xl transition-all ${
                                tempCustomer.status === "inactive"
                                  ? "bg-rose-50"
                                  : "hover:bg-primary/5"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Lock size={18} className="text-rose-500" />
                                <span
                                  className={`text-sm font-bold ${
                                    tempCustomer.status === "inactive"
                                      ? "text-rose-700"
                                      : "text-secondary/60"
                                  }`}
                                >
                                  Đã tạm khóa
                                </span>
                              </div>
                              {tempCustomer.status === "inactive" && (
                                <Check size={16} className="text-rose-600" />
                              )}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal ml-1">
                      Vai trò hệ thống
                    </label>
                    <div className="relative" ref={roleRef}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsRoleDropdownOpen(!isRoleDropdownOpen);
                          setIsStatusDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3.5 bg-white rounded-2xl border border-primary/10 text-sm outline-none transition-all font-bold text-primary flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {tempCustomer.role === "admin" ? (
                            <>
                              <ShieldCheck
                                size={16}
                                className="text-indigo-500"
                              />
                              <span className="text-indigo-600">
                                Quản trị viên
                              </span>
                            </>
                          ) : (
                            <>
                              <User size={16} className="text-purple-500" />
                              <span className="text-purple-600">
                                Người dùng
                              </span>
                            </>
                          )}
                        </div>
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-300 ${
                            isRoleDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isRoleDropdownOpen && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              y: 10,
                              scale: 0.95,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              scale: 1,
                            }}
                            exit={{
                              opacity: 0,
                              y: 10,
                              scale: 0.95,
                            }}
                            className="absolute z-[110] top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-primary/5 overflow-hidden p-1.5"
                          >
                            <button
                              onClick={() => {
                                setTempCustomer((prev) => ({
                                  ...prev,
                                  role: "user",
                                }));
                                setIsRoleDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-2.5 flex items-center justify-between rounded-xl transition-all ${
                                tempCustomer.role === "user"
                                  ? "bg-purple-50"
                                  : "hover:bg-primary/5"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <User size={18} className="text-purple-500" />
                                <span
                                  className={`text-sm font-bold ${
                                    tempCustomer.role === "user"
                                      ? "text-purple-700"
                                      : "text-secondary/60"
                                  }`}
                                >
                                  Người dùng
                                </span>
                              </div>
                              {tempCustomer.role === "user" && (
                                <Check size={16} className="text-purple-600" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setTempCustomer((prev) => ({
                                  ...prev,
                                  role: "admin",
                                }));
                                setIsRoleDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-2.5 flex items-center justify-between rounded-xl transition-all ${
                                tempCustomer.role === "admin"
                                  ? "bg-indigo-50"
                                  : "hover:bg-primary/5"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <ShieldCheck
                                  size={18}
                                  className="text-indigo-500"
                                />
                                <span
                                  className={`text-sm font-bold ${
                                    tempCustomer.role === "admin"
                                      ? "text-indigo-700"
                                      : "text-secondary/60"
                                  }`}
                                >
                                  Quản trị viên
                                </span>
                              </div>
                              {tempCustomer.role === "admin" && (
                                <Check size={16} className="text-indigo-600" />
                              )}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <p className="text-[10px] text-secondary/40 italic">
                      Vai trò chỉ hiển thị theo dữ liệu hiện tại.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 border-t border-primary/5 bg-surface-container-low/30 flex justify-end gap-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-8 py-2.5 bg-white text-primary border border-primary/10 font-bold rounded-xl hover:bg-primary/5 transition-all text-sm"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="px-8 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all text-sm inline-flex items-center gap-2 disabled:opacity-60"
                >
                  {isSaving && <Loader2 size={16} className="animate-spin" />}
                  Lưu thay đổi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(null)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-lg font-bold text-primary mb-2">
                Xác nhận xóa
              </h3>
              <p className="text-sm text-secondary/60 mb-6">
                Bạn có chắc muốn xóa{" "}
                <span className="font-bold text-red-600">
                  "{confirmDelete.name}"
                </span>{" "}
                không?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 rounded-lg border border-primary/10 text-primary hover:bg-primary/5"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="absolute right-0 bottom-0 opacity-[0.05] pointer-events-none translate-y-1/4">
        <svg width="400" height="400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,11 17,8 17,8Z" />
        </svg>
      </div>
    </div>
  );
}
