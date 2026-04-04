import {
  Download,
  UserPlus,
  Mail,
  Phone,
  Users,
  Wallet,
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
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

const mockCustomers = [
  {
    id: "1",
    name: "Nguyễn Thị Minh Anh",
    email: "minhanh.nguyen@gmail.com",
    phone: "090 123 4567",
    address: "123 Lê Lợi, Quận 1, TP.HCM",
    initials: "MA",
    status: "active",
    role: "admin",
  },
  {
    id: "2",
    name: "Trần Hoàng Long",
    email: "long.th@outlook.com",
    phone: "098 765 4321",
    address: "456 Nguyễn Huệ, Quận 1, TP.HCM",
    initials: "HL",
    status: "active",
    role: "user",
  },
  {
    id: "3",
    name: "Lê Gia Linh",
    email: "gialinh.le@yahoo.com",
    phone: "091 111 2222",
    address: "789 Trần Hưng Đạo, Quận 5, TP.HCM",
    initials: "GL",
    status: "inactive",
    role: "user",
  },
  {
    id: "4",
    name: "Vương Đình Phúc",
    email: "phuc.vuong@artisan.vn",
    phone: "093 333 4444",
    address: "101 Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCM",
    initials: "VP",
    status: "active",
    role: "user",
  },
];

export function CustomersPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [tempCustomer, setTempCustomer] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const statusRef = useRef(null);
  const roleRef = useRef(null);

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

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      console.log("Xóa khách hàng:", id);
    }
  };

  const filteredCustomers = mockCustomers.filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term)
    );
  });

  return (
    <div className="admin-font pb-24 min-h-screen bg-[#F9F8F3] -mx-4 md:-mx-8 px-4 md:px-8 pt-8 relative">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-bold text-secondary/40 uppercase tracking-normal mb-8">
        <Link to="/" className="hover:text-[#3D5245] transition-colors">
          Hệ thống
        </Link>
        <ChevronRight size={10} className="text-secondary/20" />
        <span className="text-[#3D5245]">Khách hàng</span>
      </nav>

      {/* Header Section */}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          {
            label: "TỔNG KHÁCH HÀNG",
            value: "1,284",
            trend: "+12%",
          },
          {
            label: "TỶ LỆ GIỮ CHÂN",
            value: "78.5%",
            trend: "+3.2%",
          },
          {
            label: "CHI TIÊU TRUNG BÌNH",
            value: "1.45tr",
            sub: "VNĐ",
          },
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
              {stat.trend && (
                <span className="text-[10px] font-bold text-green-600">
                  {stat.trend} ↗
                </span>
              )}
              {stat.sub && (
                <span className="text-[10px] font-bold text-secondary/40 uppercase">
                  {stat.sub}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row justify-end items-center gap-4 mb-8">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal hidden md:block">
            Hiển thị <span className="text-primary">1-10</span> trong số{" "}
            <span className="text-primary">1,284</span> kết quả
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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Customers Table */}
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
              {filteredCustomers.map((customer) => (
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
                      <span className="truncate">{customer.address}</span>
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
                        {customer.role === "admin" ? "Quản trị" : "Người dùng"}
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
                      {customer.status === "active" ? "HOẠT ĐỘNG" : "TẠM KHÓA"}
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
                        onClick={() => handleDelete(customer.id)}
                        className="p-1.5 text-secondary/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-primary/5 flex justify-center items-center gap-2">
          <button className="p-2 text-secondary/40 hover:text-primary transition-colors">
            <ChevronLeft size={16} />
          </button>
          {[1, 2, 3, "...", 129].map((page, idx) => (
            <button
              key={idx}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                page === 1
                  ? "bg-primary text-white shadow-md"
                  : "text-secondary/60 hover:bg-primary/5"
              }`}
            >
              {page}
            </button>
          ))}
          <button className="p-2 text-secondary/40 hover:text-primary transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* View Detail Modal */}
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
                            {selectedCustomer.phone}
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
                      {selectedCustomer.address}
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

      {/* Edit Modal */}
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
                        <div className="w-full px-4 py-3 bg-surface-container-low/10 rounded-xl border border-primary/5 text-sm font-medium text-secondary/50 flex items-center gap-2 cursor-not-allowed">
                          <Phone size={14} className="opacity-40" />
                          {tempCustomer.phone}
                        </div>
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
                        className="w-full px-4 py-3.5 bg-white rounded-2xl border border-primary/10 text-sm outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all font-bold text-primary flex items-center justify-between"
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
                  onClick={() => {
                    alert("Đã lưu thay đổi thành công!");
                    setIsEditModalOpen(false);
                  }}
                  className="px-8 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all text-sm"
                >
                  Lưu thay đổi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Decorative Background Leaf */}
      <div className="absolute right-0 bottom-0 opacity-[0.05] pointer-events-none translate-y-1/4">
        <svg width="400" height="400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,11 17,8 17,8Z" />
        </svg>
      </div>
    </div>
  );
}
