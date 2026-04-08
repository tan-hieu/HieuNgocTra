import {
  ChevronRight,
  Download,
  Plus,
  Eye,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  ChevronLeft,
  X,
  User,
  Mail,
  CreditCard,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";

const mockOrders = [
  {
    id: "#TV-8829",
    customer: {
      name: "Lê Hồng Phong",
      email: "hongphong@email.com",
      avatar: "LP",
      color: "bg-orange-100 text-orange-600",
      phone: "0901 234 567",
      address: "123 Lê Lợi, Quận 1, TP.HCM",
    },
    date: "24/10/2023",
    total: "2.450.000đ",
    orderStatus: "preparing",
    items: [
      { name: "Trà Shan Tuyết Cổ Thụ", quantity: 2, price: "800.000đ" },
      { name: "Bộ ấm trà gốm sứ", quantity: 1, price: "850.000đ" },
    ],
  },
  {
    id: "#TV-8830",
    customer: {
      name: "Nguyễn Anh Hoa",
      email: "anhhoa.art@email.com",
      avatar: "NH",
      color: "bg-green-100 text-green-600",
      phone: "0988 777 666",
      address: "456 Nguyễn Huệ, Quận 1, TP.HCM",
    },
    date: "23/10/2023",
    total: "1.200.000đ",
    orderStatus: "preparing",
    items: [{ name: "Trà Ô Long Đặc Biệt", quantity: 3, price: "400.000đ" }],
  },
  {
    id: "#TV-8831",
    customer: {
      name: "Trần Minh",
      email: "minhtran@email.com",
      avatar: "TM",
      color: "bg-amber-100 text-amber-600",
      phone: "0912 345 678",
      address: "789 Trần Hưng Đạo, Quận 5, TP.HCM",
    },
    date: "22/10/2023",
    total: "850.000đ",
    orderStatus: "delivered",
    items: [{ name: "Trà Sen Tây Hồ", quantity: 1, price: "850.000đ" }],
  },
  {
    id: "#TV-8832",
    customer: {
      name: "Mai Thu",
      email: "maithu88@email.com",
      avatar: "MT",
      color: "bg-orange-100 text-orange-600",
      phone: "0933 444 555",
      address: "101 Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCM",
    },
    date: "22/10/2023",
    total: "5.600.000đ",
    orderStatus: "cancelled",
    items: [{ name: "Trà Phổ Nhĩ Lâu Năm", quantity: 4, price: "1.400.000đ" }],
  },
];

export function OrdersPage() {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const filteredOrders = mockOrders.filter((order) => {
    if (activeTab === "Tất cả") return true;
    if (activeTab === "Chờ lấy hàng") return order.orderStatus === "preparing";
    if (activeTab === "Hoàn thành") return order.orderStatus === "delivered";
    if (activeTab === "Đã hủy") return order.orderStatus === "cancelled";
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "preparing":
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-normal text-center leading-tight">
            Chờ lấy hàng
          </span>
        );
      case "delivered":
        return (
          <span className="px-3 py-1 bg-green-700 text-white rounded-full text-[10px] font-bold uppercase tracking-normal text-center leading-tight">
            Hoàn thành
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold uppercase tracking-normal text-center leading-tight">
            Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-font max-w-7xl mx-auto pb-24 px-4">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-bold text-primary">
            Danh sách Đơn hàng
          </h2>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-5 py-2.5 bg-surface-container-low/50 border border-primary/10 text-secondary font-bold rounded-xl hover:bg-primary/5 transition-all text-sm flex items-center justify-center gap-2">
            <Download size={16} />
            Xuất báo cáo
          </button>
          {/* Nút TẠO ĐƠN MỚI */}
          <button
            onClick={() => navigate("/admin/orders/add")}
            className="flex-1 md:flex-none px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:bg-primary/90 transition-all text-sm"
          >
            <Plus size={18} />
            Tạo đơn mới
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white/50 p-4 rounded-[2rem] border border-primary/5 shadow-sm mb-8 flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex bg-surface-container-low/50 p-1 rounded-2xl overflow-x-auto w-full lg:w-auto no-scrollbar">
          {["Tất cả", "Chờ lấy hàng", "Hoàn thành", "Đã hủy"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-white text-primary shadow-sm"
                  : "text-secondary/60 hover:text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-primary/5 shadow-sm overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary/5">
                <th className="px-8 py-6 text-[10px] font-bold text-secondary/40 uppercase tracking-normal">
                  Mã đơn
                </th>
                <th className="px-8 py-6 text-[10px] font-bold text-secondary/40 uppercase tracking-normal">
                  Khách hàng
                </th>
                <th className="px-8 py-6 text-[10px] font-bold text-secondary/40 uppercase tracking-normal text-center">
                  Ngày đặt
                </th>
                <th className="px-8 py-6 text-[10px] font-bold text-secondary/40 uppercase tracking-normal text-center">
                  Tổng tiền
                </th>
                <th className="px-8 py-6 text-[10px] font-bold text-secondary/40 uppercase tracking-normal text-center">
                  Trạng thái
                </th>
                <th className="px-8 py-6 text-[10px] font-bold text-secondary/40 uppercase tracking-normal text-center">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-primary/[0.02] transition-colors group"
                >
                  <td className="px-8 py-6">
                    <span className="font-bold text-primary">{order.id}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${order.customer.color}`}
                      >
                        {order.customer.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary">
                          {order.customer.name}
                        </p>
                        <p className="text-[10px] text-secondary/40 font-medium">
                          {order.customer.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-xs font-medium text-secondary">
                      {order.date}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-sm font-bold text-primary">
                      {order.total}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    {getStatusBadge(order.orderStatus)}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-secondary/40 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal">
            Hiển thị 4 từ 1.250 đơn hàng
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-secondary/40 hover:text-primary transition-colors">
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
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
      </div>

      {/* Delivery Progress Section */}
      <section className="bg-surface-container-low/30 p-10 rounded-[3rem] border border-primary/5 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-primary mb-12">
            Tiến độ Giao hàng Hệ thống
          </h3>

          <div className="relative flex justify-between items-start max-w-2xl mx-auto">
            <div className="absolute top-4 left-0 w-full h-[2px] bg-primary/10 -z-10"></div>

            {[
              {
                label: "Tiếp nhận",
                count: "120 đơn",
                icon: <Clock size={16} />,
              },
              {
                label: "Chờ lấy hàng",
                count: "45 đơn",
                icon: <Package size={16} />,
              },
              {
                label: "Hoàn thành",
                count: "875 đơn",
                icon: <CheckCircle2 size={16} />,
                color: "bg-green-700",
              },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div
                  className={`w-8 h-8 rounded-full border-4 border-white shadow-sm mb-4 flex items-center justify-center ${
                    step.color || "bg-primary"
                  }`}
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal mb-1">
                  {step.label}
                </p>
                <p className="text-xs font-bold text-primary">{step.count}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute right-10 bottom-0 opacity-[0.03] pointer-events-none translate-y-1/4">
          <Truck size={240} strokeWidth={1} />
        </div>
      </section>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-primary/5 flex justify-between items-center bg-surface-container-low/30">
                <div>
                  <h3 className="text-2xl font-bold text-primary">
                    Chi tiết đơn hàng {selectedOrder.id}
                  </h3>
                  <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal mt-1">
                    Ngày đặt: {selectedOrder.date}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-primary/5 rounded-full text-secondary/40 hover:text-primary transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal">
                      Thông tin khách hàng
                    </h4>
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 ${selectedOrder.customer.color}`}
                      >
                        {selectedOrder.customer.avatar}
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-bold text-primary flex items-center gap-2">
                          <User size={14} className="text-secondary/40" />
                          {selectedOrder.customer.name}
                        </p>
                        <p className="text-xs text-secondary/60 flex items-center gap-2">
                          <Mail size={14} className="text-secondary/40" />
                          {selectedOrder.customer.email}
                        </p>
                        <p className="text-xs text-secondary/60 flex items-center gap-2">
                          <CreditCard size={14} className="text-secondary/40" />
                          {selectedOrder.customer.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal">
                      Địa chỉ giao hàng
                    </h4>
                    <div className="flex items-start gap-2 text-xs text-secondary/60 leading-relaxed">
                      <MapPin
                        size={16}
                        className="text-secondary/40 shrink-0 mt-0.5"
                      />
                      {selectedOrder.customer.address}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal">
                    Sản phẩm đã chọn
                  </h4>
                  <div className="bg-surface-container-low/30 rounded-2xl border border-primary/5 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-primary/5">
                          <th className="px-6 py-4 text-[10px] font-bold text-secondary/40 uppercase tracking-normal">
                            Sản phẩm
                          </th>
                          <th className="px-6 py-4 text-[10px] font-bold text-secondary/40 uppercase tracking-normal text-center">
                            SL
                          </th>
                          <th className="px-6 py-4 text-[10px] font-bold text-secondary/40 uppercase tracking-normal text-right">
                            Đơn giá
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/5">
                        {selectedOrder.items?.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 text-xs font-bold text-primary">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 text-xs font-medium text-secondary text-center">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 text-xs font-bold text-primary text-right">
                              {item.price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-primary/[0.02]">
                          <td
                            colSpan={2}
                            className="px-6 py-4 text-sm font-bold text-primary"
                          >
                            Tổng cộng
                          </td>
                          <td className="px-6 py-4 text-lg font-bold text-primary text-right">
                            {selectedOrder.total}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal">
                      Trạng thái đơn hàng
                    </p>
                    {getStatusBadge(selectedOrder.orderStatus)}
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="px-8 py-6 border-t border-primary/5 bg-surface-container-low/30 flex justify-end gap-3">
                {selectedOrder.orderStatus === "preparing" && (
                  <>
                    <button
                      onClick={() => {
                        alert(`Đã hủy đơn hàng ${selectedOrder.id}`);
                        setSelectedOrder(null);
                      }}
                      className="px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all text-sm"
                    >
                      Hủy đơn hàng
                    </button>
                    <button
                      onClick={() => {
                        alert(`Đã xác nhận đơn hàng ${selectedOrder.id}`);
                        setSelectedOrder(null);
                      }}
                      className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all text-sm"
                    >
                      Xác nhận đơn
                    </button>
                  </>
                )}
                {selectedOrder.orderStatus !== "preparing" && (
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-6 py-2.5 bg-surface-container-low border border-primary/10 text-secondary font-bold rounded-xl hover:bg-primary/5 transition-all text-sm"
                  >
                    Đóng
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
