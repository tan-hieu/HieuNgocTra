import React, { useEffect, useMemo, useState } from "react";
import { ShoppingBag, RefreshCcw } from "lucide-react";

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("vi-VN") + "đ";
};

const formatDateTime = (iso) => {
  if (!iso) return "--";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "--";
  return d.toLocaleString("vi-VN");
};

const statusMeta = (status) => {
  const s = String(status || "").toUpperCase();
  if (s === "PENDING")
    return {
      label: "Đang chờ xác nhận",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    };
  if (s === "CONFIRMED")
    return {
      label: "Đã xác nhận",
      cls: "bg-blue-50 text-blue-700 border-blue-200",
    };
  if (s === "PREPARING")
    return {
      label: "Đang chuẩn bị",
      cls: "bg-indigo-50 text-indigo-700 border-indigo-200",
    };
  if (s === "SHIPPING")
    return {
      label: "Đang giao",
      cls: "bg-cyan-50 text-cyan-700 border-cyan-200",
    };
  if (s === "DELIVERED")
    return {
      label: "Hoàn tất",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  if (s === "CANCELLED")
    return { label: "Đã hủy", cls: "bg-rose-50 text-rose-700 border-rose-200" };
  return {
    label: status || "Không xác định",
    cls: "bg-slate-50 text-slate-700 border-slate-200",
  };
};

export default function MyOrdersTab() {
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [orders, setOrders] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const sortedOrders = useMemo(() => {
    return [...orders].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    );
  }, [orders]);

  const fetchOrders = async (isRefresh = false) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMsg("Bạn chưa đăng nhập.");
      setOrders([]);
      setLoading(false);
      setFetching(false);
      return;
    }

    if (isRefresh) setFetching(true);
    else setLoading(true);

    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:8080/api/orders/my", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const data = await res.json().catch(function () {
        return [];
      });

      if (!res.ok) {
        throw new Error(
          data && data.message ? data.message : "Không tải được đơn hàng",
        );
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorMsg(err && err.message ? err.message : "Có lỗi khi tải đơn hàng");
      setOrders([]);
    } finally {
      setLoading(false);
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchOrders(false);
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-primary/10">
        <div className="text-sm text-slate-500">
          Đang tải đơn hàng của bạn...
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-primary/10 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-tea-dark">Đơn hàng của tôi</h2>
        <button
          type="button"
          onClick={() => fetchOrders(true)}
          disabled={fetching}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/20 text-sm font-semibold text-tea-dark hover:bg-primary/5 disabled:opacity-60"
        >
          <RefreshCcw
            className={"w-4 h-4" + (fetching ? " animate-spin" : "")}
          />
          Làm mới
        </button>
      </div>

      {!!errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {sortedOrders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
          <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-slate-500" />
          </div>
          <p className="text-slate-700 font-semibold">
            Bạn chưa có đơn hàng nào
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Hãy quay lại cửa hàng để mua sản phẩm yêu thích.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map((order) => {
            const meta = statusMeta(order.orderStatus);
            const items = Array.isArray(order.items) ? order.items : [];

            return (
              <div
                key={order.id}
                className="rounded-xl border border-primary/10 p-4 md:p-5"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">Mã đơn</p>
                    <p className="text-base font-bold text-slate-900">
                      {order.orderCode}
                    </p>
                  </div>

                  <div className="text-sm text-slate-600">
                    {formatDateTime(order.createdAt)}
                  </div>

                  <span
                    className={
                      "inline-flex w-fit rounded-full border px-3 py-1 text-xs font-bold " +
                      meta.cls
                    }
                  >
                    {meta.label}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {items.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 line-clamp-1">
                          {it.productName}
                        </p>
                        <p className="text-xs text-slate-500">
                          SL: {it.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-tea-gold">
                        {formatCurrency(it.lineTotal)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-primary/10 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <p className="text-sm text-slate-600">
                    Giao tới:{" "}
                    <span className="font-semibold text-slate-800">
                      {order.shippingAddress || "--"}
                    </span>
                  </p>
                  <p className="text-base font-bold text-slate-900">
                    Tổng:{" "}
                    <span className="text-tea-gold">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
