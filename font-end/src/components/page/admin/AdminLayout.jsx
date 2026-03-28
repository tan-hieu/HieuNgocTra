import { Outlet } from "react-router-dom";
import DashboardMain from "./DashboardMain";
import Sidebar from "../../layout/sidebar/Sidebar";
import AdminHeader from "../../layout/header/AdminHeader";

export default function AdminLayout() {
  return (
    <div>
      {/* <Sidebar />
      <AdminHeader /> */}
      <DashboardMain />
    </div>
  );
}
