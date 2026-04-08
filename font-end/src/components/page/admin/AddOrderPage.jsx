import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  Save,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  UserRound,
  ListChecks,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";

const ORDERS_STORAGE_KEY = "admin_orders_v1";
const CUSTOMERS_STORAGE_KEY = "admin_customers_v1";
const PRODUCTS_STORAGE_KEY = "admin_products_v1";

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

function readArray(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const fallbackCustomers = [
  {
    id: "C001",
    fullName: "Lê Hồng Phong",
    email: "hongphong@email.com",
    phone: "0901 234 567",
    address: "123 Lê Lợi, Quận 1, TP.HCM",
  },
  {
    id: "C002",
    fullName: "Nguyễn Anh Hoa",
    email: "anhhoa.art@email.com",
    phone: "0988 777 666",
    address: "456 Nguyễn Huệ, Quận 1, TP.HCM",
  },
  {
    id: "C003",
    fullName: "Trần Minh",
    email: "minhtran@email.com",
    phone: "0912 345 678",
    address: "789 Trần Hưng Đạo, Quận 5, TP.HCM",
  },
];

const fallbackProducts = [
  { id: "SP001", name: "Trà Ô Long Đặc Biệt", price: 450000 },
  { id: "SP002", name: "Trà Xanh Thái Nguyên", price: 280000 },
  { id: "SP003", name: "Trà Sen Tây Hồ", price: 850000 },
  { id: "SP004", name: "Trà Phổ Nhĩ Chín", price: 1200000 },
  { id: "SP005", name: "Trà Lài Thượng Hạng", price: 320000 },
];

const initialItem = {
  productId: "",
  name: "",
  quantity: 1,
  price: 0,
};

export function AddOrderPage() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [customerMode, setCustomerMode] = useState("manual"); // manual | existing
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

  useEffect(() => {
    const rawCustomers = readArray(CUSTOMERS_STORAGE_KEY);
    const normalizedCustomers =
      rawCustomers.length > 0
        ? rawCustomers.map((c, idx) => ({
            id: c.id || `C${idx + 1}`,
            fullName: c.fullName || c.name || "",
            email: c.email || "",
            phone: c.phone || "",
            address: c.address || "",
          }))
        : fallbackCustomers;
    setCustomers(normalizedCustomers);

    const rawProducts = readArray(PRODUCTS_STORAGE_KEY);
    const normalizedProducts = rawProducts.map((p, idx) => ({
      id: p.id || `SP${idx + 1}`,
      name: p.name || p.productName || "Sản phẩm",
      price: parsePriceToNumber(p.price),
    }));
    setProducts(normalizedProducts);
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
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { ...initialItem }],
    }));
  };

  const removeItem = (index) => {
    setForm((prev) => {
      if (prev.items.length === 1) return prev;
      const nextItems = prev.items.filter((_, i) => i !== index);
      return { ...prev, items: nextItems };
    });
  };

  const updateItemField = (index, key, value) => {
    setForm((prev) => {
      const nextItems = [...prev.items];
      nextItems[index] = { ...nextItems[index], [key]: value };
      return { ...prev, items: nextItems };
    });
    if (errorMsg) setErrorMsg("");
  };

  const handleSelectProduct = (index, productId) => {
    const picked = products.find((p) => String(p.id) === String(productId));
    setForm((prev) => {
      const nextItems = [...prev.items];
      nextItems[index] = {
        ...nextItems[index],
        productId: productId,
        name: picked ? picked.name : "",
        price: picked ? Number(picked.price || 0) : 0,
      };
      return { ...prev, items: nextItems };
    });
    if (errorMsg) setErrorMsg("");
  };

  const validate = () => {
    if (customerMode === "existing" && !selectedCustomerId) {
      return "Vui lòng chọn khách hàng có sẵn.";
    }

    if (!form.customerName.trim()) return "Vui lòng nhập tên khách hàng.";
    if (!form.customerPhone.trim()) return "Vui lòng nhập số điện thoại.";
    if (!form.customerAddress.trim()) return "Vui lòng nhập địa chỉ giao hàng.";

    if (form.items.length === 0) {
      return "Vui lòng thêm ít nhất 1 sản phẩm.";
    }

    const hasInvalidItem = form.items.some((item) => {
      return (
        !item.productId || Number(item.quantity) <= 0 || Number(item.price) <= 0
      );
    });

    if (hasInvalidItem) {
      return "Mỗi dòng sản phẩm cần chọn sản phẩm và số lượng > 0.";
    }

    return "";
  };

  const handleSave = () => {
    const err = validate();
    if (err) {
      setErrorMsg(err);
      return;
    }

    const oldData = readArray(ORDERS_STORAGE_KEY);

    const customerName = form.customerName.trim();
    const newOrder = {
      id: "#TV-" + String(Date.now()).slice(-4),
      date: new Date().toLocaleDateString("vi-VN"),
      total: toVnd(total),
      orderStatus: form.orderStatus,
      customer: {
        name: customerName,
        email: form.customerEmail.trim() || "chua-cap-nhat@email.com",
        avatar: customerName.slice(0, 2).toUpperCase(),
        color: "bg-emerald-100 text-emerald-700",
        phone: form.customerPhone.trim(),
        address: form.customerAddress.trim(),
      },
      items: form.items.map((item) => ({
        name: item.name,
        quantity: Number(item.quantity),
        price: toVnd(Number(item.price)),
      })),
    };

    localStorage.setItem(
      ORDERS_STORAGE_KEY,
      JSON.stringify([newOrder, ...oldData]),
    );
    navigate("/admin/orders");
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

  return (
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
          <h2 className="text-4xl font-bold text-primary">Tạo đơn hàng mới</h2>
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
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all text-sm flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <Save size={16} />
            Lưu đơn hàng
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
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName} - {c.phone}
              </option>
            ))}
          </select>
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

        {/* 1 ô chọn sản phẩm + số lượng */}
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

        {/* Danh sách đã chọn */}
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
                      onChange={(e) => updateOrderItemQty(idx, e.target.value)}
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
                      onClick={() => removeOrderItem(idx)}
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
      </div>
    </motion.div>
  );
}
