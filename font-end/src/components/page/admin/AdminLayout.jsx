import { Outlet } from "react-router-dom";
import Sidebar from "../../layout/sidebar/Sidebar";
import AdminHeader from "../../layout/header/AdminHeader";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Khu nội dung bên phải, chừa chỗ cho sidebar rộng 72 */}
      <div className="flex-1 ml-72">
        {/* Header admin cố định trên cùng */}
        <AdminHeader />

        {/* Phần nội dung thay đổi theo từng route con (/admin, /admin/products, ...) */}
        <main className="pt-24 px-8 pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
