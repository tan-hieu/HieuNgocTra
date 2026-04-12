import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  ShoppingBag,
  UserPlus,
  ArrowRight,
  Layers3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

const ORDERS_API = "http://localhost:8080/api/admin/orders";
const PRODUCTS_API = "http://localhost:8080/api/admin/products";
const CUSTOMERS_API = "http://localhost:8080/api/admin/customers";
const CATEGORIES_API = "http://localhost:8080/api/admin/categories";
const ORIGINS_API = "http://localhost:8080/api/admin/origins";

function cn() {
  const classes = Array.from(arguments);
  return classes.filter(Boolean).join(" ");
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return { Authorization: "Bearer " + token };
}

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function formatMoney(value) {
  return new Intl.NumberFormat("vi-VN").format(toNumber(value));
}

function formatDateTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function initials(fullName) {
  if (!fullName) return "KH";
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "KH";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function statusUi(status) {
  const s = String(status || "").toUpperCase();
  if (s === "DELIVERED") {
    return { text: "Xử lý xong", color: "bg-[#caebc9] text-[#05210c]" };
  }
  if (s === "CANCELLED") {
    return { text: "Hủy đơn", color: "bg-[#ffdad6] text-[#93000a]" };
  }
  if (s === "SHIPPING") {
    return { text: "Đang giao", color: "bg-[#d7e3ff] text-[#0c2a6a]" };
  }
  return { text: "Đang chờ", color: "bg-[#ffdea9] text-[#271900]" };
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function mondayOfCurrentWeek() {
  const now = startOfDay(new Date());
  const jsDay = now.getDay();
  const diff = jsDay === 0 ? -6 : 1 - jsDay;
  return addDays(now, diff);
}

function weekdayIndexMondayFirst(date) {
  const jsDay = date.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: getAuthHeaders() });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = data && data.message ? data.message : "Không tải được dữ liệu";
    throw new Error(msg);
  }
  return data;
}

async function fetchAllOrders() {
  let page = 1;
  const size = 5;
  let hasNext = true;
  const all = [];
  let safeGuard = 0;

  while (hasNext && safeGuard < 500) {
    safeGuard += 1;
    const url = ORDERS_API + "?page=" + page + "&size=" + size + "&status=ALL";
    const data = await fetchJson(url);
    const content = Array.isArray(data && data.content) ? data.content : [];
    all.push.apply(all, content);
    hasNext = Boolean(data && data.hasNext);
    page += 1;
  }

  return all;
}

function buildWeeklyLineData(orders) {
  const labels = ["TH 2", "TH 3", "TH 4", "TH 5", "TH 6", "TH 7", "CN"];
  const current = [0, 0, 0, 0, 0, 0, 0];
  const previous = [0, 0, 0, 0, 0, 0, 0];

  const currentStart = mondayOfCurrentWeek();
  const currentEnd = addDays(currentStart, 7);
  const prevStart = addDays(currentStart, -7);
  const prevEnd = currentStart;

  orders.forEach(function (o) {
    const createdAt = o && o.createdAt ? new Date(o.createdAt) : null;
    if (!createdAt || Number.isNaN(createdAt.getTime())) return;

    const amount = toNumber(o && o.totalAmount);
    const status = String((o && o.orderStatus) || "").toUpperCase();
    const effectiveAmount = status === "CANCELLED" ? 0 : amount;

    const day = startOfDay(createdAt);
    const idx = weekdayIndexMondayFirst(day);

    if (day >= currentStart && day < currentEnd) {
      current[idx] += effectiveAmount;
      return;
    }
    if (day >= prevStart && day < prevEnd) {
      previous[idx] += effectiveAmount;
    }
  });

  return labels.map(function (name, i) {
    return {
      name: name,
      current: current[i],
      previous: previous[i],
    };
  });
}

function buildPieData(categories, products) {
  const palette = [
    "#375339",
    "#614816",
    "#805533",
    "#b08968",
    "#9ca3af",
    "#d1d5db",
  ];

  let rows = [];

  if (Array.isArray(categories) && categories.length > 0) {
    rows = categories
      .map(function (c) {
        return {
          name: c && c.name ? c.name : "Khác",
          count: toNumber(c && c.productCount),
        };
      })
      .filter(function (r) {
        return r.count > 0;
      });
  }

  if (rows.length === 0 && Array.isArray(products)) {
    const map = {};
    products.forEach(function (p) {
      const key = (p && p.categoryName) || "Khác";
      map[key] = (map[key] || 0) + 1;
    });
    rows = Object.keys(map).map(function (key) {
      return { name: key, count: map[key] };
    });
  }

  const total = rows.reduce(function (sum, r) {
    return sum + r.count;
  }, 0);

  if (total <= 0) {
    return {
      total: 0,
      data: [{ name: "Chưa có dữ liệu", value: 100, raw: 0, color: "#d1d5db" }],
    };
  }

  return {
    total: total,
    data: rows.map(function (r, i) {
      const percent = Math.round((r.count / total) * 100);
      return {
        name: r.name,
        value: percent,
        raw: r.count,
        color: palette[i % palette.length],
      };
    }),
  };
}

function toRecentOrderRow(o) {
  const id = (o && o.orderCode) || "#" + String((o && o.id) || "");
  const customer = (o && o.receiverName) || "Khách hàng";
  const initial = initials(customer);
  const items = Array.isArray(o && o.items) ? o.items : [];
  const firstName =
    items.length > 0 && items[0] && items[0].name ? items[0].name : "Sản phẩm";
  const product =
    items.length <= 1
      ? firstName
      : firstName + " (+" + String(items.length - 1) + " SP)";
  const date = formatDateTime(o && o.createdAt);
  const amount = formatMoney(o && o.totalAmount) + " đ";
  const status = statusUi(o && o.orderStatus);

  return {
    id: id,
    customer: customer,
    initial: initial,
    product: product,
    date: date,
    amount: amount,
    status: status.text,
    statusColor: status.color,
  };
}

function StatCard(props) {
  return (
    <div className="bg-white p-8 rounded-xl flex flex-col justify-between transition-all hover:-translate-y-1 shadow-sm border border-stone-50">
      <div>
        <p className="text-secondary font-semibold text-xs uppercase tracking-widest mb-4">
          {props.label}
        </p>
        <h3 className="text-3xl font-bold text-stone-900">
          {props.value}{" "}
          {props.unit && (
            <span className="text-sm font-normal text-stone-400">
              {props.unit}
            </span>
          )}
        </h3>
      </div>

      <div
        className={cn(
          "mt-6 flex items-center gap-2 font-bold text-sm",
          props.trendColor,
        )}
      >
        {props.trendIcon}
        <span>{props.trend}</span>
        <span className="font-normal text-stone-400 ml-1">
          {props.trendLabel}
        </span>
      </div>
    </div>
  );
}

function customerChipClass(name) {
  const palette = [
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-sky-100 text-sky-700",
    "bg-rose-100 text-rose-700",
    "bg-violet-100 text-violet-700",
    "bg-teal-100 text-teal-700",
  ];

  const str = String(name || "");
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash + str.charCodeAt(i) * (i + 1)) % 9999;
  }
  return palette[hash % palette.length];
}

function Skeleton({ className = "" }) {
  return (
    <div className={"animate-pulse rounded-lg bg-[#ece7db] " + className} />
  );
}

export default function DashboardMain() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [ordersApi, setOrdersApi] = useState([]);
  const [productsApi, setProductsApi] = useState([]);
  const [customersApi, setCustomersApi] = useState([]);
  const [categoriesApi, setCategoriesApi] = useState([]);
  const [originsApi, setOriginsApi] = useState([]);

  useEffect(function () {
    let isMounted = true;

    async function loadDashboardData() {
      setLoading(true);
      setErrorMsg("");

      try {
        const result = await Promise.all([
          fetchAllOrders(),
          fetchJson(PRODUCTS_API),
          fetchJson(CUSTOMERS_API),
          fetchJson(CATEGORIES_API),
          fetchJson(ORIGINS_API),
        ]);

        if (!isMounted) return;

        setOrdersApi(Array.isArray(result[0]) ? result[0] : []);
        setProductsApi(Array.isArray(result[1]) ? result[1] : []);
        setCustomersApi(Array.isArray(result[2]) ? result[2] : []);
        setCategoriesApi(Array.isArray(result[3]) ? result[3] : []);
        setOriginsApi(Array.isArray(result[4]) ? result[4] : []);
      } catch (e) {
        if (!isMounted) return;
        setErrorMsg(
          e && e.message ? e.message : "Không tải được dữ liệu dashboard",
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();
    return function () {
      isMounted = false;
    };
  }, []);

  const lineData = useMemo(
    function () {
      return buildWeeklyLineData(ordersApi);
    },
    [ordersApi],
  );

  const pie = useMemo(
    function () {
      return buildPieData(categoriesApi, productsApi);
    },
    [categoriesApi, productsApi],
  );

  const recentOrders = useMemo(
    function () {
      return ordersApi
        .slice()
        .sort(function (a, b) {
          const ta = new Date((a && a.createdAt) || 0).getTime();
          const tb = new Date((b && b.createdAt) || 0).getTime();
          return tb - ta;
        })
        .slice(0, 8)
        .map(toRecentOrderRow);
    },
    [ordersApi],
  );

  const stats = useMemo(
    function () {
      const totalRevenue = ordersApi.reduce(function (sum, o) {
        const status = String((o && o.orderStatus) || "").toUpperCase();
        const amount = toNumber(o && o.totalAmount);
        return sum + (status === "CANCELLED" ? 0 : amount);
      }, 0);

      const waitingCount = ordersApi.filter(function (o) {
        const s = String((o && o.orderStatus) || "").toUpperCase();
        return s === "PREPARING" || s === "PENDING" || s === "CONFIRMED";
      }).length;

      const deliveredCount = ordersApi.filter(function (o) {
        return String((o && o.orderStatus) || "").toUpperCase() === "DELIVERED";
      }).length;

      const conversion =
        ordersApi.length > 0 ? (deliveredCount / ordersApi.length) * 100 : 0;

      return {
        totalRevenue: totalRevenue,
        totalOrders: ordersApi.length,
        waitingCount: waitingCount,
        customerCount: customersApi.length,
        conversion: conversion,
        categoryCount: categoriesApi.length,
        originCount: originsApi.length,
      };
    },
    [ordersApi, customersApi, categoriesApi, originsApi],
  );

  return (
    <div className="pb-12">
      <div className="mb-10">
        <h2 className="text-4xl font-serif font-bold text-primary tracking-tight mb-2">
          Tổng quan hoạt động
        </h2>
        <p className="text-stone-500">
          Dữ liệu thật từ sản phẩm, đơn hàng, khách hàng, danh mục và xuất xứ.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 font-semibold text-sm">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          label="Tổng doanh thu"
          value={formatMoney(stats.totalRevenue)}
          unit="đ"
          trend={String(stats.totalOrders) + " đơn"}
          trendLabel="toàn hệ thống"
          trendIcon={<TrendingUp size={14} />}
          trendColor="text-primary"
        />
        <StatCard
          label="Đơn hàng mới"
          value={String(stats.totalOrders)}
          trend={String(stats.waitingCount) + " đơn"}
          trendLabel="đang chờ xử lý"
          trendIcon={<ShoppingBag size={14} />}
          trendColor="text-primary"
        />
        <StatCard
          label="Khách hàng"
          value={String(stats.customerCount)}
          trend={stats.conversion.toFixed(1) + "%"}
          trendLabel="tỉ lệ giao thành công"
          trendIcon={<UserPlus size={14} />}
          trendColor="text-primary"
        />
        <StatCard
          label="Danh mục / Xuất xứ"
          value={
            String(stats.categoryCount) + " / " + String(stats.originCount)
          }
          trend={String(productsApi.length) + " sản phẩm"}
          trendLabel="đang hoạt động"
          trendIcon={<Layers3 size={14} />}
          trendColor="text-primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-surface-container-low p-8 rounded-xl">
          <div className="flex justify-between items-center mb-10">
            <h4 className="text-xl font-serif font-bold">
              Doanh thu theo tuần
            </h4>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-primary text-white text-xs rounded-full font-bold">
                Tuần này
              </span>
              <span className="px-3 py-1 bg-white text-stone-500 text-xs rounded-full font-bold border border-stone-100">
                Tuần trước
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineData}
                margin={{ top: 0, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#ece7df"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#a8a29e" }}
                  dy={10}
                />
                <Tooltip
                  formatter={function (value) {
                    return [formatMoney(value) + " đ", "Doanh thu"];
                  }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="previous"
                  stroke="#cfc6b8"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="#375339"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-container-low p-8 rounded-xl flex flex-col">
          <h4 className="text-xl font-serif font-bold mb-8">Cơ cấu sản phẩm</h4>

          <div className="flex-1 flex flex-col justify-center items-center relative">
            <div className="h-48 w-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pie.data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {pie.data.map(function (entry, index) {
                      return (
                        <Cell
                          key={"cell-" + String(index)}
                          fill={entry.color}
                        />
                      );
                    })}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-2xl font-bold">{pie.total}</p>
                <p className="text-[10px] text-stone-500 uppercase font-bold tracking-widest">
                  Sản phẩm
                </p>
              </div>
            </div>

            <div className="mt-8 w-full grid grid-cols-2 gap-y-3 gap-x-4">
              {pie.data.map(function (item) {
                return (
                  <div key={item.name} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="text-xs font-bold">
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100">
        <div className="px-8 py-6 flex justify-between items-center bg-surface-container-low/30 border-b border-stone-100">
          <h4 className="text-xl font-serif font-bold">
            Đơn hàng mới nhất cần xử lý
          </h4>
          <button
            onClick={() => navigate("/admin/orders")}
            className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
          >
            Xem tất cả <ArrowRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left table-fixed">
            <thead>
              <tr className="bg-surface-container-low/60 text-stone-500 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4 w-[16%]">Mã đơn hàng</th>
                <th className="px-6 py-4 w-[24%]">Khách hàng</th>
                <th className="px-6 py-4 w-[28%]">Sản phẩm</th>
                <th className="px-6 py-4 w-[16%]">Ngày đặt</th>
                <th className="px-6 py-4 w-[12%] text-right">Tổng tiền</th>
                <th className="px-6 py-4 w-[14%] text-center">Trạng thái</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-sm text-stone-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              )}

              {!loading && recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-sm text-stone-500">
                    Chưa có đơn hàng.
                  </td>
                </tr>
              )}

              {!loading &&
                recentOrders.map(function (order, index) {
                  return (
                    <tr
                      key={order.id}
                      className={cn(
                        "transition-colors group",
                        index % 2 === 0 ? "bg-white" : "bg-stone-50/30",
                        "hover:bg-primary/5",
                      )}
                    >
                      <td className="px-6 py-4 font-bold text-sm text-primary truncate">
                        {order.id}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center min-w-0">
                          <span
                            className={cn(
                              "inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold mr-2 shrink-0",
                              customerChipClass(order.customer),
                            )}
                          >
                            {initials(order.customer)}
                          </span>
                          <span className="text-sm font-semibold truncate block">
                            {order.customer}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-stone-600 truncate">
                        {order.product}
                      </td>

                      <td className="px-6 py-4 text-sm text-stone-500">
                        {order.date}
                      </td>

                      <td className="px-6 py-4 text-sm font-bold text-right">
                        {order.amount}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span
                          className={cn(
                            "px-3 py-1 text-[10px] font-bold rounded-full uppercase inline-flex",
                            order.statusColor,
                          )}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
