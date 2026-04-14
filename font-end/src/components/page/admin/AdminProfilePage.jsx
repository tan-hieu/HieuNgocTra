import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Save, ShieldCheck, User } from "lucide-react";

const API_BASE = "http://localhost:8080/api/auth";

function getToken() {
  return localStorage.getItem("token") || "";
}

function parseJsonSafe(res) {
  return res.json().catch(() => ({}));
}

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    avatarUrl: "",
  });

  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);

  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");

  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdErr, setPwdErr] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const firstName = useMemo(() => {
    const name = String(profileForm.fullName || "").trim();
    if (!name) return "Admin";
    const parts = name.split(/\s+/);
    return parts[parts.length - 1];
  }, [profileForm.fullName]);

  useEffect(() => {
    let cancelled = false;

    async function fetchMe() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/me`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await parseJsonSafe(res);
        if (!res.ok) {
          throw new Error(
            data?.message || "Không tải được thông tin tài khoản",
          );
        }

        const u = data?.user ?? data;
        if (!cancelled) {
          setProfileForm({
            fullName: u?.fullName || "",
            email: u?.email || "",
            phone: u?.phone || "",
            address: u?.address || "",
            avatarUrl: u?.avatarUrl || "",
          });
        }
      } catch (err) {
        if (!cancelled) setProfileErr(err?.message || "Có lỗi khi tải hồ sơ");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMe();
    return () => {
      cancelled = true;
    };
  }, []);

  const onProfileChange = (key, value) => {
    setProfileForm((prev) => ({ ...prev, [key]: value }));
  };

  const onPwdChange = (key, value) => {
    setPwdForm((prev) => ({ ...prev, [key]: value }));
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    setProfileErr("");
    setProfileMsg("");

    if (!profileForm.fullName.trim()) {
      setProfileErr("Họ và tên không được để trống.");
      return;
    }

    const token = getToken();
    if (!token) {
      setProfileErr("Bạn chưa đăng nhập.");
      return;
    }

    setSavingProfile(true);
    try {
      const res = await fetch(`${API_BASE}/me`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: profileForm.fullName.trim(),
          phone: profileForm.phone.trim(),
          address: profileForm.address.trim(),
          avatarUrl: profileForm.avatarUrl.trim(),
        }),
      });

      const data = await parseJsonSafe(res);
      if (!res.ok) {
        throw new Error(data?.message || "Không thể cập nhật hồ sơ");
      }

      const updated = data?.user ?? data;
      if (updated?.id) {
        localStorage.setItem("user", JSON.stringify(updated));
      }

      setProfileMsg("Cập nhật hồ sơ thành công.");
    } catch (err) {
      setProfileErr(err?.message || "Có lỗi xảy ra khi cập nhật hồ sơ");
    } finally {
      setSavingProfile(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    setPwdErr("");
    setPwdMsg("");

    if (
      !pwdForm.currentPassword ||
      !pwdForm.newPassword ||
      !pwdForm.confirmPassword
    ) {
      setPwdErr("Vui lòng nhập đầy đủ các trường mật khẩu.");
      return;
    }

    if (pwdForm.newPassword.length < 8) {
      setPwdErr("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }

    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdErr("Xác nhận mật khẩu không khớp.");
      return;
    }

    const token = getToken();
    if (!token) {
      setPwdErr("Bạn chưa đăng nhập.");
      return;
    }

    setChangingPwd(true);
    try {
      const res = await fetch(`${API_BASE}/change-password`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: pwdForm.currentPassword,
          newPassword: pwdForm.newPassword,
          confirmPassword: pwdForm.confirmPassword,
        }),
      });

      const data = await parseJsonSafe(res);
      if (!res.ok) {
        throw new Error(data?.message || "Không thể đổi mật khẩu");
      }

      setPwdMsg("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } catch (err) {
      setPwdErr(err?.message || "Có lỗi xảy ra khi đổi mật khẩu");
    } finally {
      setChangingPwd(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#e8e2d6] bg-white p-6">
        <p className="text-sm text-[#617066]">Đang tải hồ sơ quản trị...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <section className="rounded-2xl border border-[#e8e2d6] bg-white p-6">
        <h1 className="text-2xl font-semibold text-[#1c2a22]">
          Hồ sơ quản trị
        </h1>
        <p className="text-sm text-[#617066] mt-1">
          Xin chào {firstName}, bạn có thể cập nhật thông tin và bảo mật tài
          khoản tại đây.
        </p>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <form
          onSubmit={submitProfile}
          className="rounded-2xl border border-[#e8e2d6] bg-white p-6 space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <User size={18} className="text-primary" />
            <h2 className="text-lg font-semibold text-[#1c2a22]">
              Thông tin cá nhân
            </h2>
          </div>

          {!!profileErr && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {profileErr}
            </div>
          )}
          {!!profileMsg && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              {profileMsg}
            </div>
          )}

          <Field
            label="Họ và tên"
            value={profileForm.fullName}
            onChange={(v) => onProfileChange("fullName", v)}
          />
          <Field
            label="Email"
            value={profileForm.email}
            disabled
            onChange={() => {}}
          />
          <Field
            label="Số điện thoại"
            value={profileForm.phone}
            onChange={(v) => onProfileChange("phone", v)}
          />
          <Field
            label="Ảnh đại diện (URL)"
            value={profileForm.avatarUrl}
            onChange={(v) => onProfileChange("avatarUrl", v)}
          />
          <Field
            label="Địa chỉ"
            value={profileForm.address}
            onChange={(v) => onProfileChange("address", v)}
          />

          <button
            type="submit"
            disabled={savingProfile}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-white font-semibold hover:bg-primary/90 disabled:opacity-60"
          >
            <Save size={16} />
            {savingProfile ? "Đang lưu..." : "Lưu hồ sơ"}
          </button>
        </form>

        <form
          onSubmit={submitPassword}
          className="rounded-2xl border border-[#e8e2d6] bg-white p-6 space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={18} className="text-primary" />
            <h2 className="text-lg font-semibold text-[#1c2a22]">
              Đổi mật khẩu
            </h2>
          </div>

          {!!pwdErr && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {pwdErr}
            </div>
          )}
          {!!pwdMsg && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              {pwdMsg}
            </div>
          )}

          <PasswordField
            label="Mật khẩu hiện tại"
            value={pwdForm.currentPassword}
            onChange={(v) => onPwdChange("currentPassword", v)}
            show={showCurrent}
            setShow={setShowCurrent}
          />
          <PasswordField
            label="Mật khẩu mới"
            value={pwdForm.newPassword}
            onChange={(v) => onPwdChange("newPassword", v)}
            show={showNewPwd}
            setShow={setShowNewPwd}
          />
          <PasswordField
            label="Xác nhận mật khẩu mới"
            value={pwdForm.confirmPassword}
            onChange={(v) => onPwdChange("confirmPassword", v)}
            show={showConfirm}
            setShow={setShowConfirm}
          />

          <p className="text-xs text-[#617066]">
            Mật khẩu nên có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký
            tự đặc biệt.
          </p>

          <button
            type="submit"
            disabled={changingPwd}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1c2a22] px-5 py-3 text-white font-semibold hover:bg-[#223327] disabled:opacity-60"
          >
            <ShieldCheck size={16} />
            {changingPwd ? "Đang xử lý..." : "Cập nhật mật khẩu"}
          </button>
        </form>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, disabled = false }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-[#405147]">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={
          "w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition " +
          (disabled
            ? "bg-[#f6f3ed] border-[#e8e2d6] text-[#7b877f] cursor-not-allowed"
            : "bg-white border-[#ddd6c7] focus:border-primary focus:ring-2 focus:ring-primary/20")
        }
      />
    </div>
  );
}

function PasswordField({ label, value, onChange, show, setShow }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-[#405147]">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-[#ddd6c7] bg-white px-4 py-2.5 pr-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#617066] hover:text-primary"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
