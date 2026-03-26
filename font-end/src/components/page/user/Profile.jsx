/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  ShoppingBag,
  LayoutDashboard,
  User,
  Lock,
  MapPin,
  LogOut,
  ReceiptText,
  Truck,
  Award,
} from "lucide-react";
// eslint-disable-next-line
import { motion } from "motion/react";

export default function Profile() {
  return (
    <div className="min-h-screen flex flex-col font-body">
      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 md:flex-row md:px-10 lg:px-20 gap-8 relative overflow-hidden py-12 px-4 mt-16">
        <div className="absolute inset-0 tea-pattern pointer-events-none"></div>

        {/* Sidebar */}
        <aside className="w-full md:w-1/4 lg:w-1/5 shrink-0 relative z-10 ">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-white/60 backdrop-blur-sm p-6 shadow-sm border border-primary/10"
          >
            <div className="flex flex-col items-center gap-4 border-b border-primary/10 pb-6 mb-6">
              <div className="h-20 w-20 overflow-hidden rounded-full ring-4 ring-primary/10">
                <img
                  src="https://picsum.photos/seed/tea-lover/200/200"
                  alt="User Avatar"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg text-slate-900">
                  Nguyễn Văn An
                </h3>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              <SidebarLink
                icon={<LayoutDashboard className="w-5 h-5" />}
                label="Tổng quan tài khoản"
                active
              />
              <SidebarLink
                icon={<User className="w-5 h-5" />}
                label="Thông tin cá nhân"
              />
              <SidebarLink
                icon={<ShoppingBag className="w-5 h-5" />}
                label="Đơn hàng của tôi"
              />
              <SidebarLink
                icon={<Lock className="w-5 h-5" />}
                label="Đổi mật khẩu"
              />
              <SidebarLink
                icon={<MapPin className="w-5 h-5" />}
                label="Sổ địa chỉ"
              />
              <hr className="my-2 border-primary/5" />
              <button className="flex items-center gap-3 rounded-lg px-4 py-3 text-rose-600 hover:bg-rose-50 transition-all w-full text-left">
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Đăng xuất</span>
              </button>
            </nav>
          </motion.div>
        </aside>

        {/* Main Panel */}
        <section className="flex-1 space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-tea-dark">
              Chào mừng trở lại, An
            </h1>
            <p className="mt-1 text-slate-500">
              Dưới đây là tóm tắt hoạt động gần đây từ tài khoản của bạn.
            </p>
          </motion.div>

          {/* Stats Grid */}
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

          {/* Info & Orders */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Personal Info */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-white p-6 shadow-sm border border-primary/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-tea-dark">
                  Thông tin cơ bản
                </h2>
              </div>
              <div className="space-y-4">
                <InfoRow label="Họ và tên" value="Nguyễn Văn An" />
                <InfoRow label="Email" value="an.nguyen@email.com" />
                <InfoRow label="Số điện thoại" value="090 123 4567" />
                <InfoRow
                  label="Địa chỉ mặc định"
                  value="123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh"
                  last
                />
              </div>
            </motion.div>

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-white p-6 shadow-sm border border-primary/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-tea-dark">
                  Đơn hàng gần đây
                </h2>
                <button className="text-sm font-semibold text-primary hover:underline">
                  Xem tất cả
                </button>
              </div>
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
                <OrderItem
                  id="#ORD-12301"
                  date="15/09/2023"
                  price="420.000đ"
                  status="Hoàn tất"
                  statusType="green"
                />
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, active = false }) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
        active
          ? "bg-primary/20 text-tea-dark font-semibold"
          : "text-slate-600 hover:bg-primary/5 hover:text-primary font-medium"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </a>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-primary/5">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-xl bg-slate-50">{icon}</div>
      </div>
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
      className={`flex flex-col gap-1 ${
        !last ? "border-b border-primary/5 pb-3" : ""
      }`}
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
    <div className="flex items-center justify-between rounded-xl border border-primary/5 p-4 hover:bg-bg-cream/50 transition-colors cursor-pointer">
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
          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
            statusColors[statusType]
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
