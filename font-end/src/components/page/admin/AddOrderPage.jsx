import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  Save,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  UserRound,
  ListChecks,
  X,
  AlertTriangle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const CUSTOMERS_API = "http://localhost:8080/api/admin/customers";
const PRODUCTS_API = "http://localhost:8080/api/admin/products";
const ORDERS_API = "http://localhost:8080/api/admin/orders";

function toVnd(value) {
  const num = Number(value || 0);
  return new Intl.NumberFormat("vi-VN").format(num) + "đ";
}

function parsePriceToNumber(raw) {
  if (raw == null) return 0;
  if (typeof raw === "number") return raw;
  const normalized = String(raw).replace(/[^\d]/g, "");
  return Number(normalized || 0);
}

function normalizeApiStatus(status) {
  return String(status || "").toUpperCase();
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = "Bearer " + token;
  return headers;
}

function asArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
}

function mapUiStatusToApi(uiStatus) {
  const s = String(uiStatus || "").toLowerCase();
  if (s === "preparing") return "PREPARING";
  if (s === "shipping") return "SHIPPING";
  if (s === "delivered") return "DELIVERED";
  if (s === "cancelled") return "CANCELLED";
  return "PENDING";
}

export function AddOrderPage() {
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [customerLoadMsg, setCustomerLoadMsg] = useState("");
  const [productLoadMsg, setProductLoadMsg] = useState("");

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [customerMode, setCustomerMode] = useState("manual");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    orderStatus: "preparing",
    items: [],
  });

  const [quickProductId, setQuickProductId] = useState("");
  const [quickQty, setQuickQty] = useState(1);

  const [confirmRemoveIndex, setConfirmRemoveIndex] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadCustomers = async () => {
      const res = await fetch(CUSTOMERS_API, { headers: getAuthHeaders() });
      const data = await res.json().catch(() => []);
      if (!res.ok)
        throw new Error(data?.message || "Không tải được danh sách khách hàng");

      const apiCustomers = asArray(data)
        .filter((c) => normalizeApiStatus(c?.status) !== "INACTIVE")
        .filter((c) => normalizeApiStatus(c?.status) !== "LOCKED")
        .map((c) => ({
          id: c?.id,
          fullName: c?.fullName || c?.name || c?.username || "",
          email: c?.email || "",
          phone: c?.phone || "",
          address: c?.address || "",
        }))
        .filter((c) => String(c.id ?? "").trim() && c.fullName.trim());

      if (isMounted) setCustomers(apiCustomers);
    };

    const loadProducts = async () => {
      const res = await fetch(PRODUCTS_API, { headers: getAuthHeaders() });
      const data = await res.json().catch(() => []);
      if (!res.ok)
        throw new Error(data?.message || "Không tải được danh sách sản phẩm");

      const apiProducts = asArray(data)
        .map((p) => {
          const status = normalizeApiStatus(p?.status);
          return {
            id: p?.id,
            name: p?.name || p?.productName || "Sản phẩm",
            price: parsePriceToNumber(p?.price),
            stock: Number(p?.stockQuantity ?? p?.stock ?? 0),
            status,
          };
        })
        .filter((p) => String(p.id ?? "").trim() && p.name.trim())
        .filter((p) => {
          const isActive = !p.status || p.status === "ACTIVE";
          const isInStock = p.status !== "OUT_OF_STOCK" && p.stock > 0;
          return isActive && isInStock;
        });

      if (isMounted) setProducts(apiProducts);
    };

    (async () => {
      setCustomerLoadMsg("");
      setProductLoadMsg("");

      const [customerResult, productResult] = await Promise.allSettled([
        loadCustomers(),
        loadProducts(),
      ]);

      if (!isMounted) return;

      if (customerResult.status === "rejected") {
        setCustomers([]);
        setCustomerLoadMsg(
          customerResult.reason?.message ||
            "Không tải được khách hàng từ CSDL.",
        );
      }

      if (productResult.status === "rejected") {
        setProducts([]);
        setProductLoadMsg(
          productResult.reason?.message || "Không tải được sản phẩm từ CSDL.",
        );
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedCustomer = useMemo(() => {
    return (
      customers.find((c) => String(c.id) === String(selectedCustomerId)) || null
    );
  }, [customers, selectedCustomerId]);

  useEffect(() => {
    if (customerMode !== "existing") return;
    if (!selectedCustomer) return;

    setForm((prev) => ({
      ...prev,
      customerName: selectedCustomer.fullName || "",
      customerEmail: selectedCustomer.email || "",
      customerPhone: selectedCustomer.phone || "",
      customerAddress: selectedCustomer.address || "",
    }));
  }, [customerMode, selectedCustomer]);

  const total = useMemo(() => {
    return form.items.reduce((sum, item) => {
      return sum + Number(item.quantity || 0) * Number(item.price || 0);
    }, 0);
  }, [form.items]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errorMsg) setErrorMsg("");
    if (successMsg) setSuccessMsg("");
  };

  const validate = () => {
    if (customerMode === "existing" && !selectedCustomerId)
      return "Vui lòng chọn khách hàng có sẵn.";
    if (!form.customerName.trim()) return "Vui lòng nhập tên khách hàng.";
    if (!form.customerPhone.trim()) return "Vui lòng nhập số điện thoại.";
    if (!form.customerAddress.trim()) return "Vui lòng nhập địa chỉ giao hàng.";
    if (form.items.length === 0) return "Vui lòng thêm ít nhất 1 sản phẩm.";

    const hasInvalidItem = form.items.some((item) => {
      return (
        !item.productId || Number(item.quantity) <= 0 || Number(item.price) <= 0
      );
    });
    if (hasInvalidItem)
      return "Mỗi dòng sản phẩm cần chọn sản phẩm và số lượng > 0.";

    return "";
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      setErrorMsg(err);
      return;
    }

    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload = {
        customerMode: customerMode === "existing" ? "EXISTING" : "MANUAL",
        customerId:
          customerMode === "existing" ? Number(selectedCustomerId) : null,
        receiverName: form.customerName.trim(),
        receiverPhone: form.customerPhone.trim(),
        shippingAddress: form.customerAddress.trim(),
        receiverEmail: form.customerEmail.trim() || null,
        note: null,
        paymentMethod: "COD",
        orderStatus: mapUiStatusToApi(form.orderStatus),
        adminNote: null,
        items: form.items.map((item) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
        })),
      };

      const res = await fetch(ORDERS_API, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "Lưu đơn hàng thất bại.");
      }

      const messageParts = [];
      messageParts.push(
        "Lưu đơn hàng thành công: " + (data?.orderCode || "N/A"),
      );
      if (data?.phoneWarningMessage)
        messageParts.push(data.phoneWarningMessage);

      setSuccessMsg(messageParts.join(" | "));

      setTimeout(() => {
        navigate("/admin/orders", {
          state: { flashMessage: messageParts.join(" | ") },
        });
      }, 500);
    } catch (error) {
      setErrorMsg(error?.message || "Có lỗi xảy ra khi lưu đơn hàng.");
    } finally {
      setIsSaving(false);
    }
  };

  const addSelectedProduct = () => {
    if (!quickProductId) return;

    const picked = products.find(
      (p) => String(p.id) === String(quickProductId),
    );
    if (!picked) return;

    setForm((prev) => {
      const existedIndex = prev.items.findIndex(
        (it) => String(it.productId) === String(quickProductId),
      );

      if (existedIndex >= 0) {
        const nextItems = [...prev.items];
        nextItems[existedIndex] = {
          ...nextItems[existedIndex],
          quantity:
            Number(nextItems[existedIndex].quantity || 0) +
            Number(quickQty || 1),
        };
        return { ...prev, items: nextItems };
      }

      return {
        ...prev,
        items: [
          ...prev.items,
          {
            productId: picked.id,
            name: picked.name,
            quantity: Number(quickQty || 1),
            price: Number(picked.price || 0),
          },
        ],
      };
    });

    setQuickProductId("");
    setQuickQty(1);
    if (errorMsg) setErrorMsg("");
    if (successMsg) setSuccessMsg("");
  };

  const updateOrderItemQty = (index, qty) => {
    const safeQty = Math.max(1, Number(qty || 1));
    setForm((prev) => {
      const nextItems = [...prev.items];
      nextItems[index] = { ...nextItems[index], quantity: safeQty };
      return { ...prev, items: nextItems };
    });
  };

  const removeOrderItem = (index) => {
    setForm((prev) => {
      const nextItems = prev.items.filter((_, i) => i !== index);
      return { ...prev, items: nextItems };
    });
  };

  const confirmRemoveItem = () => {
    if (confirmRemoveIndex === null) return;
    removeOrderItem(confirmRemoveIndex);
    setConfirmRemoveIndex(null);
  };

  const removingItemName =
    confirmRemoveIndex !== null ? form.items?.[confirmRemoveIndex]?.name : "";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 pb-24"
      >
        <div className="flex items-center gap-2 text-[10px] font-bold text-secondary/40 uppercase tracking-normal">
          <Link
            to="/admin/orders"
            className="hover:text-primary transition-colors"
          >
            Đơn hàng
          </Link>
          <ChevronRight size={12} />
          <span className="text-primary">Thêm mới</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-4xl font-bold text-primary">
              Tạo đơn hàng mới
            </h2>
            <p className="text-secondary/60 mt-2">
              Chọn khách hàng và sản phẩm để tạo đơn nhanh.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/admin/orders")}
              className="px-5 py-2.5 rounded-xl border border-primary/10 text-secondary hover:bg-primary/5 transition-all text-sm font-bold flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Quay lại
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all text-sm flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {isSaving ? "Đang lưu..." : "Lưu đơn hàng"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-primary/5 p-6 md:p-8 space-y-6">
          <h3 className="text-lg font-bold text-primary">Khách hàng</h3>

          <div className="flex gap-2 bg-surface-container-low/40 rounded-xl p-1 w-fit">
            <button
              onClick={() => {
                setCustomerMode("manual");
                setSelectedCustomerId("");
              }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                customerMode === "manual"
                  ? "bg-white text-primary shadow-sm"
                  : "text-secondary/70 hover:text-primary"
              }`}
            >
              <UserRound size={16} />
              Nhập tay
            </button>
            <button
              onClick={() => setCustomerMode("existing")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                customerMode === "existing"
                  ? "bg-white text-primary shadow-sm"
                  : "text-secondary/70 hover:text-primary"
              }`}
            >
              <ListChecks size={16} />
              Khách có sẵn
            </button>
          </div>

          {customerMode === "existing" && (
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full md:w-1/2 px-4 py-3 rounded-xl border border-primary/10 outline-none focus:ring-2 focus:ring-primary/10"
            >
              <option value="">-- Chọn khách hàng --</option>
              {customers.length === 0 && (
                <option value="" disabled>
                  Chưa có khách hàng trong hệ thống
                </option>
              )}
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} - {c.phone}
                </option>
              ))}
            </select>
          )}

          {customerLoadMsg && (
            <p className="text-sm text-red-600 font-semibold">
              {customerLoadMsg}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Tên khách hàng"
              value={form.customerName}
              onChange={(e) => setField("customerName", e.target.value)}
              readOnly={customerMode === "existing"}
              className="px-4 py-3 rounded-xl border border-primary/10 outline-none focus:ring-2 focus:ring-primary/10 disabled:bg-surface-container-low/30"
            />
            <input
              placeholder="Email (không bắt buộc)"
              value={form.customerEmail}
              onChange={(e) => setField("customerEmail", e.target.value)}
              readOnly={customerMode === "existing"}
              className="px-4 py-3 rounded-xl border border-primary/10 outline-none focus:ring-2 focus:ring-primary/10 disabled:bg-surface-container-low/30"
            />
            <input
              placeholder="Số điện thoại"
              value={form.customerPhone}
              onChange={(e) => setField("customerPhone", e.target.value)}
              readOnly={customerMode === "existing"}
              className="px-4 py-3 rounded-xl border border-primary/10 outline-none focus:ring-2 focus:ring-primary/10 disabled:bg-surface-container-low/30"
            />
            <select
              value={form.orderStatus}
              onChange={(e) => setField("orderStatus", e.target.value)}
              className="px-4 py-3 rounded-xl border border-primary/10 outline-none focus:ring-2 focus:ring-primary/10"
            >
              <option value="preparing">Chờ lấy hàng</option>
              <option value="shipping">Đang giao</option>
              <option value="delivered">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <textarea
            rows={3}
            placeholder="Địa chỉ giao hàng"
            value={form.customerAddress}
            onChange={(e) => setField("customerAddress", e.target.value)}
            readOnly={customerMode === "existing"}
            className="w-full px-4 py-3 rounded-xl border border-primary/10 outline-none focus:ring-2 focus:ring-primary/10 resize-none disabled:bg-surface-container-low/30"
          />
        </div>

        <div className="bg-white rounded-[2rem] border border-primary/5 p-6 md:p-8 space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              <ShoppingBag size={18} />
              Sản phẩm
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-surface-container-low/20 border border-primary/5 rounded-xl p-3">
            <select
              value={quickProductId}
              onChange={(e) => setQuickProductId(e.target.value)}
              className="md:col-span-7 px-4 py-2.5 rounded-lg border border-primary/10 outline-none focus:ring-2 focus:ring-primary/10"
            >
              <option value="">-- Chọn sản phẩm --</option>
              {products.length === 0 && (
                <option value="" disabled>
                  Chưa có sản phẩm trong hệ thống
                </option>
              )}
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - {toVnd(p.price)}
                </option>
              ))}
            </select>

            <input
              type="number"
              min={1}
              value={quickQty}
              onChange={(e) =>
                setQuickQty(Math.max(1, Number(e.target.value || 1)))
              }
              className="md:col-span-2 px-4 py-2.5 rounded-lg border border-primary/10 outline-none focus:ring-2 focus:ring-primary/10"
            />

            <button
              onClick={addSelectedProduct}
              disabled={products.length === 0}
              className="md:col-span-3 px-4 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Thêm vào đơn
            </button>
          </div>

          {productLoadMsg && (
            <p className="text-sm text-red-600 font-semibold">
              {productLoadMsg}
            </p>
          )}

          <div className="overflow-x-auto rounded-xl border border-primary/5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-primary/5 bg-surface-container-low/30">
                  <th className="px-4 py-3 text-xs font-bold text-secondary/60 uppercase tracking-normal">
                    Sản phẩm
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-secondary/60 uppercase tracking-normal text-center">
                    SL
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-secondary/60 uppercase tracking-normal text-right">
                    Đơn giá
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-secondary/60 uppercase tracking-normal text-right">
                    Thành tiền
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-secondary/60 uppercase tracking-normal text-center">
                    Xóa
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {form.items.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-sm text-secondary/60 text-center"
                    >
                      Chưa có sản phẩm nào.
                    </td>
                  </tr>
                )}

                {form.items.map((item, idx) => (
                  <tr key={item.productId + "-" + idx}>
                    <td className="px-4 py-3 text-sm font-semibold text-primary">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateOrderItemQty(idx, e.target.value)
                        }
                        className="w-20 text-center px-2 py-1.5 rounded-md border border-primary/10 outline-none focus:ring-2 focus:ring-primary/10"
                      />
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-secondary">
                      {toVnd(item.price)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-primary">
                      {toVnd(Number(item.price) * Number(item.quantity))}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setConfirmRemoveIndex(idx)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-primary/10 flex justify-between items-center">
            <p className="text-sm text-secondary/60">Tổng đơn hàng</p>
            <p className="text-xl font-bold text-primary">{toVnd(total)}</p>
          </div>

          {errorMsg && (
            <p className="text-sm text-red-600 font-semibold">{errorMsg}</p>
          )}
          {successMsg && (
            <p className="text-sm text-emerald-700 font-semibold">
              {successMsg}
            </p>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {confirmRemoveIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[170] bg-black/45 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmRemoveIndex(null)}
          >
            <motion.div
              className="w-full max-w-md bg-white rounded-2xl border border-rose-100 p-6 shadow-2xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-rose-700">
                    Xác nhận xóa
                  </h4>
                  <p className="text-sm text-secondary/70 mt-1">
                    Bạn có chắc muốn xóa sản phẩm
                    {removingItemName ? " " + removingItemName : ""} khỏi đơn
                    hàng?
                  </p>
                </div>
                <button
                  onClick={() => setConfirmRemoveIndex(null)}
                  className="p-1 rounded-md hover:bg-black/5"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmRemoveIndex(null)}
                  className="px-4 py-2.5 rounded-xl border border-primary/20 text-primary font-semibold"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmRemoveItem}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-semibold"
                >
                  Xóa
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
