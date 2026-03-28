import React from "react";
import { Search, Bell } from "lucide-react";

export default function AdminHeader() {
  return (
    <>
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md flex justify-between items-center px-12 h-20 shadow-sm">
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input
              className="w-full pl-12 pr-4 py-2.5 bg-surface-container-highest border-none rounded-lg focus:ring-1 focus:ring-primary text-sm"
              placeholder="Tìm kiếm dữ liệu, đơn hàng..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="relative p-2 text-stone-500 hover:text-primary transition-colors">
            <Bell size={22} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <div className="h-8 w-[1px] bg-stone-200"></div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold font-serif">Admin Profile</p>
              <p className="text-[10px] text-stone-500">Đang trực tuyến</p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
