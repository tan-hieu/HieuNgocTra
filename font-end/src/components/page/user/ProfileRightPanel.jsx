import React, { useEffect, useRef, useState } from "react";
import {
  ShoppingBag,
  ReceiptText,
  Truck,
  CheckCircle2,
  X,
  Camera,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import MyOrdersTab from "./MyOrdersTab";

export default function ProfileRightPanel({ activeTab, user, onUserUpdated }) {
  if (activeTab === "personal") {
    return <PersonalInfoTab user={user} onUserUpdated={onUserUpdated} />;
  }
  if (activeTab === "orders") {
    return <MyOrdersTab user={user} />;
  }
  if (activeTab === "password") {
    return <PasswordTab />;
  }
  if (activeTab === "address") {
    return <AddressTab />;
  }
  return <OverviewTab user={user} />;
}

function OverviewTab({ user }) {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-tea-dark">
          Chào mừng trở lại, {user?.fullName?.split(" ").slice(-1)[0] || "bạn"}
        </h1>
        <p className="mt-1 text-slate-500">
          Dưới đây là tóm tắt hoạt động gần đây từ tài khoản của bạn.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
        <StatCard
          icon={<ReceiptText className="text-primary" />}
          label="Tổng đơn hàng"
          value="12"
        />
        <StatCard
          icon={<Truck className="text-tea-gold" />}
          label="Đang giao"
          value="02"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-white p-6 shadow-sm border border-primary/10"
        >
          <h2 className="text-xl font-bold text-tea-dark mb-6">
            Thông tin cơ bản
          </h2>
          <div className="space-y-4">
            <InfoRow
              label="Họ và tên"
              value={user?.fullName || "Chưa cập nhật"}
            />
            <InfoRow label="Email" value={user?.email || "Chưa cập nhật"} />
            <InfoRow
              label="Số điện thoại"
              value={user?.phone || "Chưa cập nhật"}
            />
            <InfoRow
              label="Địa chỉ mặc định"
              value={user?.address || "Chưa cập nhật"}
              last
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-white p-6 shadow-sm border border-primary/10"
        >
          <h2 className="text-xl font-bold text-tea-dark mb-6">
            Đơn hàng gần đây
          </h2>
          <div className="space-y-4">
            <OrderItem
              id="#ORD-12890"
              date="12/10/2023"
              price="850.000đ"
              status="Đang giao"
              statusType="blue"
            />
            <OrderItem
              id="#ORD-12543"
              date="28/09/2023"
              price="1.250.000đ"
              status="Hoàn tất"
              statusType="green"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function PersonalInfoTab({ user, onUserUpdated }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    avatarUrl: "",
  });

  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const hideTimerRef = useRef(null);

  useEffect(() => {
    setForm({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      email: user?.email || "",
      address: user?.address || "",
      avatarUrl: user?.avatarUrl || "",
    });
  }, [user]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setErrorMsg("");
    setShowSuccess(false);
    setForm({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      email: user?.email || "",
      address: user?.address || "",
      avatarUrl: user?.avatarUrl || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setShowSuccess(false);

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMsg("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
      return;
    }

    if (!form.fullName.trim()) {
      setErrorMsg("Họ và tên không được để trống.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/me", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          avatarUrl: form.avatarUrl.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data?.message || "Không thể lưu thông tin. Vui lòng thử lại.",
        );
      }

      const updatedUser = data?.user ?? data;
      if (updatedUser?.id) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        if (onUserUpdated) onUserUpdated(updatedUser);
      }

      setShowSuccess(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (err) {
      setErrorMsg(err.message || "Có lỗi xảy ra khi lưu thông tin.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-medium">
                Cập nhật thông tin thành công!
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="text-emerald-400 hover:text-emerald-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!!errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-tea-green/10 overflow-hidden">
        <div className="p-8 sm:p-10 bg-tea-green/5 border-b border-tea-green/5">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img
                  src={
                    form.avatarUrl ||
                    "https://picsum.photos/seed/tea-user/200/200"
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button
                type="button"
                className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full text-white"
                title="Avatar lấy từ URL bên dưới"
              >
                <Camera className="w-6 h-6" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-tea-dark mb-2">
                {form.fullName || "Người dùng"}
              </h1>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field
                label="Họ và tên"
                value={form.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
              />
              <Field
                label="Số điện thoại"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />
            </div>

            <Field
              label="Địa chỉ Email"
              type="email"
              value={form.email}
              readOnly
              disabled
            />

            <Field
              label="Ảnh đại diện (URL)"
              value={form.avatarUrl}
              onChange={(e) => setField("avatarUrl", e.target.value)}
              placeholder="https://..."
            />

            <div className="space-y-2">
              <label className="text-sm font-bold text-tea-dark/80">
                Địa chỉ liên hệ
              </label>
              <textarea
                rows={3}
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                className="w-full px-4 py-3 bg-tea-bg/30 border border-tea-green/20 rounded-xl focus:ring-2 focus:ring-tea-green/20 focus:border-tea-green outline-none transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 text-sm font-semibold text-slate-500 hover:text-tea-dark transition-colors"
                disabled={saving}
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-10 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all"
              >
                {saving ? "Đang lưu..." : "Lưu thông tin"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function PasswordTab() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-primary/10">
      Nội dung đổi mật khẩu
    </div>
  );
}
function AddressTab() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-primary/10">
      Nội dung sổ địa chỉ
    </div>
  );
}

function Field({
  label,
  type = "text",
  value = "",
  onChange,
  readOnly = false,
  disabled = false,
  placeholder = "",
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-tea-dark/80">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-xl outline-none transition-all
          ${disabled ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed" : "bg-tea-bg/30 border-tea-green/20 focus:ring-2 focus:ring-tea-green/20 focus:border-tea-green"}`}
      />
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-primary/5">
      <div className="p-2 rounded-xl bg-slate-50 w-fit mb-3">{icon}</div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-tight">
        {label}
      </p>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
}

function InfoRow({ label, value, last = false }) {
  return (
    <div
      className={`flex flex-col gap-1 ${!last ? "border-b border-primary/5 pb-3" : ""}`}
    >
      <span className="text-xs text-slate-500 font-medium">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

function OrderItem({ id, date, price, status, statusType }) {
  const statusColors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-primary/5 p-4">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-bg-cream flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold">{id}</p>
          <p className="text-xs text-slate-500">{date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-tea-gold">{price}</p>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusColors[statusType]}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
