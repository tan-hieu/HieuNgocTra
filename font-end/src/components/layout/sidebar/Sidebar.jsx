import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  MapPin,
  Settings,
  Leaf,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "Sản phẩm", path: "/admin/products" },
  { icon: ShoppingCart, label: "Đơn hàng", path: "/admin/orders" },
  { icon: Users, label: "Khách hàng", path: "/admin/customers" },
  { icon: FolderTree, label: "Danh mục", path: "/admin/categories" },
  { icon: MapPin, label: "Xuất xứ", path: "/admin/origins" },
  // { icon: Settings, label: "Cài đặt", path: "/admin/settings" },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-container-low flex flex-col py-6 z-50 border-r-2 border-primary-container/30">
      <div className="px-8 mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/10">
          <Leaf size={22} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-serif text-primary leading-none">
            Artisanal Ledger
          </h1>
          <p className="text-[10px] font-semibold text-secondary mt-1.5">
            Hệ thống quản trị
          </p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 group ${
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/10"
                  : "text-primary/80 hover:bg-primary/10 hover:text-primary"
              }`
            }
          >
            <item.icon size={20} className="transition-colors" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-6 mt-auto">
        <div className="p-4 bg-primary-container/30 rounded-2xl flex items-center gap-3 border border-primary-container/50">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
            AD
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate text-primary">
              Trần Hoàng Minh
            </p>
            <p className="text-[10px] font-semibold text-secondary/60">
              Quản trị viên
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
