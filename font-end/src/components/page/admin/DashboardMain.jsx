import React from "react";
import Sidebar from "../../layout/sidebar/Sidebar";
import AdminHeader from "../../layout/header/AdminHeader";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  UserPlus,
  ArrowRight,
  Eye,
  Plus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Hàm nối class đơn giản, không cần cài thêm clsx/tailwind-merge
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Data biểu đồ cột
const weeklyData = [
  { name: "TH 2", current: 40, previous: 30 },
  { name: "TH 3", current: 60, previous: 45 },
  { name: "TH 4", current: 50, previous: 40 },
  { name: "TH 5", current: 80, previous: 60 },
  { name: "TH 6", current: 70, previous: 55 },
  { name: "TH 7", current: 90, previous: 70 },
  { name: "CN", current: 65, previous: 50 },
];

// Data biểu đồ tròn
const productData = [
  { name: "Trà xanh", value: 45, color: "#375339" },
  { name: "Trà Ô long", value: 30, color: "#614816" },
  { name: "Hồng trà", value: 15, color: "#805533" },
  { name: "Khác", value: 10, color: "#d1d5db" },
];

// Data bảng đơn hàng
const orders = [
  {
    id: "#TV-8821",
    customer: "Nguyễn Lan Anh",
    initial: "NL",
    product: "Trà Nõn Tôm Thượng Hạng (x2)",
    date: "14:20, 24/05/2024",
    amount: "1.250.000 đ",
    status: "Đang chờ",
    statusColor: "bg-[#ffdea9] text-[#271900]",
  },
  {
    id: "#TV-8820",
    customer: "Phạm Văn Mạnh",
    initial: "PV",
    product: "Bộ Quà Tặng Trà Sen (x1)",
    date: "13:45, 24/05/2024",
    amount: "3.400.000 đ",
    status: "Đang chờ",
    statusColor: "bg-[#ffdea9] text-[#271900]",
  },
  {
    id: "#TV-8819",
    customer: "Trần Thu Hà",
    initial: "TH",
    product: "Trà Ô long Kim Tuyên (x3)",
    date: "11:15, 24/05/2024",
    amount: "870.000 đ",
    status: "Xử lý xong",
    statusColor: "bg-[#caebc9] text-[#05210c]",
  },
  {
    id: "#TV-8818",
    customer: "Lê Thành Trung",
    initial: "LT",
    product: "Trà Đinh Thái Nguyên (x1)",
    date: "09:30, 24/05/2024",
    amount: "2.100.000 đ",
    status: "Hủy đơn",
    statusColor: "bg-[#ffdad6] text-[#93000a]",
  },
  {
    id: "#TV-8817",
    customer: "Hoàng Thu Phương",
    initial: "HP",
    product: "Trà Shan Tuyết Cổ Thụ (x2)",
    date: "08:15, 24/05/2024",
    amount: "1.580.000 đ",
    status: "Đang chờ",
    statusColor: "bg-[#ffdea9] text-[#271900]",
  },
];

// Card thống kê
function StatCard({
  label,
  value,
  unit,
  trend,
  trendLabel,
  trendIcon,
  trendColor,
}) {
  return (
    <div className="bg-white p-8 rounded-xl flex flex-col justify-between transition-all hover:-translate-y-1 shadow-sm border border-stone-50">
      <div>
        <p className="text-secondary font-semibold text-xs uppercase tracking-widest mb-4">
          {label}
        </p>
        <h3 className="text-3xl font-bold text-stone-900">
          {value}{" "}
          {unit && (
            <span className="text-sm font-normal text-stone-400">{unit}</span>
          )}
        </h3>
      </div>

      <div
        className={cn(
          "mt-6 flex items-center gap-2 font-bold text-sm",
          trendColor,
        )}
      >
        {trendIcon}
        <span>{trend}</span>
        <span className="font-normal text-stone-400 ml-1">{trendLabel}</span>
      </div>
    </div>
  );
}

export default function DashboardMain() {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      {/* Khu vực nội dung bên phải */}
      <div className="flex-1 ml-72">
        <AdminHeader />
        {/* Main Content */}
        <main>
          <div className="p-12">
            {/* Welcome Section */}
            <div className="mb-10">
              <h2 className="text-4xl font-serif font-bold text-primary tracking-tight mb-2">
                Tổng quan hoạt động
              </h2>
              <p className="text-stone-500">
                Chào mừng trở lại, đây là tình hình kinh doanh trà của bạn trong
                tuần này.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard
                label="Tổng doanh thu"
                value="128.450.000"
                unit="đ"
                trend="+12.5%"
                trendLabel="so với tháng trước"
                trendIcon={<TrendingUp size={14} />}
                trendColor="text-primary"
              />
              <StatCard
                label="Đơn hàng mới"
                value="342"
                trend="45 đơn"
                trendLabel="đang chờ xử lý"
                trendIcon={<ShoppingBag size={14} />}
                trendColor="text-primary"
              />
              <StatCard
                label="Khách hàng mới"
                value="1,024"
                trend="+18%"
                trendLabel="tăng trưởng"
                trendIcon={<UserPlus size={14} />}
                trendColor="text-primary"
              />
              <StatCard
                label="Tỉ lệ chuyển đổi"
                value="4.2%"
                trend="-0.5%"
                trendLabel="giảm nhẹ"
                trendIcon={<TrendingDown size={14} />}
                trendColor="text-error"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              {/* Bar Chart */}
              <div className="lg:col-span-2 bg-surface-container-low p-8 rounded-xl">
                <div className="flex justify-between items-center mb-10">
                  <h4 className="text-xl font-serif font-bold">
                    Doanh thu theo tuần
                  </h4>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-primary text-white text-xs rounded-full font-bold">
                      Tháng này
                    </span>
                    <span className="px-3 py-1 bg-white text-stone-500 text-xs rounded-full font-bold border border-stone-100">
                      Tháng trước
                    </span>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={weeklyData}
                      margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fontWeight: 700,
                          fill: "#a8a29e",
                        }}
                        dy={10}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(78, 107, 80, 0.05)" }}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Bar
                        dataKey="previous"
                        fill="#e7e2d8"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                      />
                      <Bar
                        dataKey="current"
                        fill="#375339"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Donut Chart */}
              <div className="bg-surface-container-low p-8 rounded-xl flex flex-col">
                <h4 className="text-xl font-serif font-bold mb-8">
                  Cơ cấu sản phẩm
                </h4>

                <div className="flex-1 flex flex-col justify-center items-center relative">
                  <div className="h-48 w-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={productData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={0}
                          dataKey="value"
                        >
                          {productData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                      <p className="text-2xl font-bold">1.2k</p>
                      <p className="text-[10px] text-stone-500 uppercase font-bold tracking-widest">
                        Sản phẩm
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 w-full grid grid-cols-2 gap-y-3 gap-x-4">
                    {productData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></span>
                        <span className="text-xs font-bold">
                          {item.name} ({item.value}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100">
              <div className="px-8 py-6 flex justify-between items-center bg-surface-container-low/30">
                <h4 className="text-xl font-serif font-bold">
                  Đơn hàng mới nhất cần xử lý
                </h4>
                <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                  Xem tất cả <ArrowRight size={16} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low/50 text-stone-500 text-[10px] uppercase tracking-widest font-bold">
                      <th className="px-8 py-4">Mã đơn hàng</th>
                      <th className="px-8 py-4">Khách hàng</th>
                      <th className="px-8 py-4">Sản phẩm</th>
                      <th className="px-8 py-4">Ngày đặt</th>
                      <th className="px-8 py-4">Tổng tiền</th>
                      <th className="px-8 py-4">Trạng thái</th>
                      <th className="px-8 py-4 text-center">Thao tác</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-stone-100">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-surface transition-colors group"
                      >
                        <td className="px-8 py-5 font-bold text-sm text-primary">
                          {order.id}
                        </td>

                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-stone-700 font-bold text-xs">
                              {order.initial}
                            </div>
                            <span className="text-sm font-semibold">
                              {order.customer}
                            </span>
                          </div>
                        </td>

                        <td className="px-8 py-5 text-sm text-stone-600">
                          {order.product}
                        </td>

                        <td className="px-8 py-5 text-sm text-stone-500">
                          {order.date}
                        </td>

                        <td className="px-8 py-5 text-sm font-bold">
                          {order.amount}
                        </td>

                        <td className="px-8 py-5">
                          <span
                            className={cn(
                              "px-3 py-1 text-[10px] font-bold rounded-full uppercase",
                              order.statusColor,
                            )}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td className="px-8 py-5 text-center">
                          <button className="p-2 hover:bg-primary-container hover:text-white rounded-lg transition-all text-stone-400">
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 group">
        <Plus size={28} />
        <span className="absolute right-20 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Tạo đơn hàng mới
        </span>
      </button>
    </div>
  );
}
