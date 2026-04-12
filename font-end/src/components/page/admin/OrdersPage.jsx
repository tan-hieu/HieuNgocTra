import {
  Download,
  Plus,
  Eye,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Mail,
  CreditCard,
  MapPin,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";

const ORDERS_API = "http://localhost:8080/api/admin/orders";

function getAuthHeaders(withJson = false) {
  const token = localStorage.getItem("token");
  const headers = {};
  if (withJson) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = "Bearer " + token;
  return headers;
}

function toVnd(value) {
  const num = Number(value || 0);
  return new Intl.NumberFormat("vi-VN").format(num) + "đ";
}

function toDateVi(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN");
}

function statusToTab(status) {
  const s = String(status || "").toUpperCase();
  if (s === "DELIVERED") return "Hoàn thành";
  if (s === "CANCELLED") return "Đã hủy";
  if (s === "SHIPPING") return "Đang giao";
  return "Chờ lấy hàng";
}

function tabToStatus(tab) {
  if (tab === "Tất cả") return "ALL";
  if (tab === "Hoàn thành") return "DELIVERED";
  if (tab === "Đã hủy") return "CANCELLED";
  if (tab === "Đang giao") return "SHIPPING";
  return "PREPARING";
}

function statusLabel(status) {
  const s = String(status || "").toUpperCase();
  if (s === "PENDING") return "Chờ lấy hàng";
  if (s === "CONFIRMED") return "Chờ lấy hàng";
  if (s === "PREPARING") return "Chờ lấy hàng";
  if (s === "SHIPPING") return "Đang giao";
  if (s === "DELIVERED") return "Giao thành công";
  if (s === "CANCELLED") return "Đã hủy";
  return s || "Không rõ";
}

function isWaitingStatus(status) {
  const s = String(status || "").toUpperCase();
  return s === "PREPARING" || s === "PENDING" || s === "CONFIRMED";
}

function getStatusBadge(status) {
  const s = String(status || "").toUpperCase();

  if (s === "DELIVERED") {
    return (
      <span className="px-3 py-1 bg-green-700 text-white rounded-full text-[10px] font-bold uppercase tracking-normal text-center leading-tight">
        Giao thành công
      </span>
    );
  }

  if (s === "CANCELLED") {
    return (
      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold uppercase tracking-normal text-center leading-tight">
        Đã hủy
      </span>
    );
  }

  if (s === "SHIPPING") {
    return (
      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-normal text-center leading-tight">
        Đang giao
      </span>
    );
  }

  return (
    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-normal text-center leading-tight">
      Chờ lấy hàng
    </span>
  );
}

function toUiOrder(api) {
  const customerName = api?.receiverName || "Khách hàng";
  const email = api?.receiverEmail || "chua-cap-nhat@email.com";
  const avatar =
    customerName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0] || "")
      .join("")
      .toUpperCase() || "KH";

  return {
    rawId: Number(api?.id || 0),
    id: api?.orderCode || "#" + String(api?.id || ""),
    rawStatus: String(api?.orderStatus || "").toUpperCase(),
    orderStatusTab: statusToTab(api?.orderStatus),
    customer: {
      name: customerName,
      email,
      avatar,
      color: "bg-orange-100 text-orange-600",
      phone: api?.receiverPhone || "",
      address: api?.shippingAddress || "",
    },
    date: toDateVi(api?.createdAt),
    total: toVnd(api?.totalAmount),
    items: Array.isArray(api?.items)
      ? api.items.map((it) => ({
          name: it?.name || "Sản phẩm",
          quantity: Number(it?.quantity || 0),
          price: toVnd(it?.price),
        }))
      : [],
  };
}

export function OrdersPage() {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [size, setSize] = useState(5);
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [flashMsg, setFlashMsg] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const status = tabToStatus(activeTab);
      const url = `${ORDERS_API}?page=${page}&size=${size}&status=${encodeURIComponent(status)}`;

      const res = await fetch(url, { headers: getAuthHeaders() });
      const data = await res.json().catch(() => ({}));

      if (!res.ok)
        throw new Error(data?.message || "Không tải được danh sách đơn hàng");

      const content = Array.isArray(data?.content) ? data.content : [];
      const mapped = content.map(toUiOrder);

      setRows(mapped);
      setTotalElements(Number(data?.totalElements || 0));
      setTotalPages(Math.max(1, Number(data?.totalPages || 1)));
    } catch (error) {
      setRows([]);
      setTotalElements(0);
      setTotalPages(1);
      setErrorMsg(error?.message || "Có lỗi khi tải dữ liệu đơn hàng.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, size]);

  useEffect(() => {
    if (location.state?.flashMessage) {
      setFlashMsg(location.state.flashMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, size]);

  const updateOrderAction = async (action) => {
    if (!selectedOrder?.rawId || actionLoading) return;

    setActionLoading(true);
    setErrorMsg("");
    setFlashMsg("");

    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = "Bearer " + token;

      const res = await fetch(`${ORDERS_API}/${selectedOrder.rawId}/status`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ action }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data?.message || "Cập nhật trạng thái thất bại");

      const updatedApiOrder = data?.order;
      if (updatedApiOrder) {
        const updatedUi = toUiOrder(updatedApiOrder);
        setRows((prev) =>
          prev.map((o) => (o.rawId === updatedUi.rawId ? updatedUi : o)),
        );
        setSelectedOrder(updatedUi);
      }

      setFlashMsg(
        action === "CONFIRM"
          ? "Đã xác nhận đơn, trạng thái chuyển sang giao thành công."
          : "Đã hủy đơn hàng.",
      );

      // reload danh sách đúng filter hiện tại
      const status = tabToStatus(activeTab);
      const url = `${ORDERS_API}?page=${page}&size=${size}&status=${encodeURIComponent(status)}`;
      const reloadRes = await fetch(url, {
        headers: token ? { Authorization: "Bearer " + token } : {},
      });
      const reloadData = await reloadRes.json().catch(() => ({}));
      if (reloadRes.ok) {
        const content = Array.isArray(reloadData?.content)
          ? reloadData.content
          : [];
        setRows(content.map(toUiOrder));
        setTotalElements(Number(reloadData?.totalElements || 0));
        setTotalPages(Math.max(1, Number(reloadData?.totalPages || 1)));
      }
    } catch (error) {
      setErrorMsg(error?.message || "Có lỗi khi cập nhật trạng thái.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = useMemo(() => rows, [rows]);

  const startIndex = totalElements === 0 ? 0 : (page - 1) * size + 1;
  const endIndex = Math.min(page * size, totalElements);

  const pages = useMemo(() => {
    const maxShow = 5;
    const arr = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + maxShow - 1);
    for (let i = start; i <= end; i += 1) arr.push(i);
    return arr;
  }, [page, totalPages]);

  return (
    <div className="admin-font max-w-7xl mx-auto pb-24 px-4">
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
          <button
            onClick={() => navigate("/admin/orders/add")}
            className="flex-1 md:flex-none px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:bg-primary/90 transition-all text-sm"
          >
            <Plus size={18} />
            Tạo đơn mới
          </button>
        </div>
      </div>

      {flashMsg && (
        <div className="mb-6 px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold text-sm">
          {flashMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 font-semibold text-sm">
          {errorMsg}
        </div>
      )}

      <div className="bg-white/50 p-4 rounded-[2rem] border border-primary/5 shadow-sm mb-8 flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex bg-surface-container-low/50 p-1 rounded-2xl overflow-x-auto w-full lg:w-auto no-scrollbar">
          {["Tất cả", "Chờ lấy hàng", "Đang giao", "Hoàn thành", "Đã hủy"].map(
            (tab) => (
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
            ),
          )}
        </div>
      </div>

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
              {loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-8 py-10 text-center text-secondary/60 font-semibold"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              )}

              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-8 py-10 text-center text-secondary/60 font-semibold"
                  >
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              )}

              {!loading &&
                filteredOrders.map((order) => (
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
                      {getStatusBadge(order.rawStatus)}
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

        <div className="px-8 py-6 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal">
            Hiển thị {startIndex}-{endIndex} từ {totalElements} đơn hàng
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 text-secondary/40 hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>

            {pages.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  p === page
                    ? "bg-primary text-white shadow-md"
                    : "text-secondary/60 hover:bg-primary/5"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 text-secondary/40 hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

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
                count: `${totalElements} đơn`,
                icon: <Clock size={16} />,
              },
              {
                label: "Chờ lấy hàng",
                count: `${rows.filter((r) => r.rawStatus === "PREPARING").length} đơn`,
                icon: <Package size={16} />,
              },
              {
                label: "Hoàn thành",
                count: `${rows.filter((r) => r.rawStatus === "DELIVERED").length} đơn`,
                icon: <CheckCircle2 size={16} />,
                color: "bg-green-700",
              },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div
                  className={`w-8 h-8 rounded-full border-4 border-white shadow-sm mb-4 flex items-center justify-center ${step.color || "bg-primary"}`}
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

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
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

                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-normal">
                      Trạng thái đơn hàng
                    </p>
                    {getStatusBadge(selectedOrder.rawStatus)}
                    <p className="text-xs text-secondary/60 mt-2">
                      {statusLabel(selectedOrder.rawStatus)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 border-t border-primary/5 bg-surface-container-low/30 flex justify-end gap-3">
                {isWaitingStatus(selectedOrder.rawStatus) ? (
                  <>
                    <button
                      onClick={() => updateOrderAction("CANCEL")}
                      disabled={actionLoading}
                      className="px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? "Đang xử lý..." : "Hủy đơn"}
                    </button>
                    <button
                      onClick={() => updateOrderAction("CONFIRM")}
                      disabled={actionLoading}
                      className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? "Đang xử lý..." : "Xác nhận đơn"}
                    </button>
                  </>
                ) : (
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
