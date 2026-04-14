import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileSidebar from "../../layout/profileSidebar/ProfileSidebar";
import ProfileRightPanel from "./ProfileRightPanel";

const ALLOWED_TABS = ["overview", "personal", "orders", "password", "address"];

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialTab = useMemo(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    return ALLOWED_TABS.includes(tab) ? tab : "overview";
  }, [location.search]);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchMe = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/auth/me", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return;
        const data = await res.json();
        const userData = data?.user ?? data;
        if (userData?.id) {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch {}
    };

    fetchMe();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChangeTab = (tab) => {
    setActiveTab(tab);
    navigate(`/profile?tab=${tab}`, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col font-body">
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col md:flex-row md:px-10 lg:px-20 gap-8 relative overflow-hidden py-12 px-4 mt-16">
        <div className="absolute inset-0 tea-pattern pointer-events-none"></div>

        <ProfileSidebar
          activeTab={activeTab}
          onChangeTab={handleChangeTab}
          user={user}
          onLogout={handleLogout}
        />

        <section className="flex-1 relative z-10">
          <ProfileRightPanel
            activeTab={activeTab}
            user={user}
            onUserUpdated={setUser}
          />
        </section>
      </main>
    </div>
  );
}
