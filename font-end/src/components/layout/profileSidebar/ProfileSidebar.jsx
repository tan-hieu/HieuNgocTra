import React from "react";
import {
  ShoppingBag,
  LayoutDashboard,
  User,
  Lock,
  MapPin,
  LogOut,
} from "lucide-react";
import { motion } from "motion/react";

const MENU_ITEMS = [
  { key: "overview", label: "Tổng quan tài khoản", icon: LayoutDashboard },
  { key: "personal", label: "Thông tin cá nhân", icon: User },
  { key: "orders", label: "Đơn hàng của tôi", icon: ShoppingBag },
];

export default function ProfileSidebar({
  activeTab = "overview",
  onChangeTab = () => {},
  user = null,
  onLogout = () => {},
}) {
  return (
    <aside className="w-full md:w-1/4 lg:w-1/5 shrink-0 relative z-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl bg-white/60 backdrop-blur-sm p-6 shadow-sm border border-primary/10"
      >
        <div className="flex flex-col items-center gap-4 border-b border-primary/10 pb-6 mb-6">
          <div className="h-20 w-20 overflow-hidden rounded-full ring-4 ring-primary/10">
            <img
              src={
                user?.avatarUrl ||
                "https://picsum.photos/seed/tea-lover/200/200"
              }
              alt="User Avatar"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg text-slate-900">
              {user?.fullName || "Người dùng"}
            </h3>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.key;

            return (
              <button
                type="button"
                key={item.key}
                onClick={() => onChangeTab(item.key)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all w-full text-left ${
                  active
                    ? "bg-primary/20 text-tea-dark font-semibold"
                    : "text-slate-600 hover:bg-primary/5 hover:text-primary font-medium"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </motion.div>
    </aside>
  );
}
