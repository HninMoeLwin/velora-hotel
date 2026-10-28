import { useEffect, useRef, useState } from "react";
import { ChevronDown, CircleUserRound, Settings, LogOut, Building2 } from "lucide-react";

export default function UserMenu({ onNavigate, notify, onProfile, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const closeOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    };
    const closeEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
    };
  }, []);

  const action = (callback) => {
    setOpen(false);
    callback();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Open user account menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full p-1.5 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#101828] font-bold text-[#d9b77c]">A</span>
        <ChevronDown size={15} className="text-slate-500" />
      </button>

      {open && (
        <div className="absolute right-2 top-14 z-50 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          <div className="border-b px-3 py-3">
            <p className="text-sm font-bold text-slate-800">Admin User</p>
            <p className="mt-1 text-xs text-slate-500">Property manager · Demo</p>
          </div>

          <button onClick={() => action(() => { if (onProfile) onProfile(); else notify("Signed in as Admin User · Demo account"); })} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm hover:bg-slate-50">
            <CircleUserRound size={17} /> Profile
          </button>

          <button onClick={() => action(() => onNavigate("Hotel Settings"))} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm hover:bg-slate-50">
            <Settings size={17} /> Settings
          </button>

          <button onClick={() => action(() => notify("Demo version: account switching is not connected yet."))} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm hover:bg-slate-50">
            <Building2 size={17} /> Switch property
          </button>

          <button onClick={() => action(() => { if (onLogout) onLogout(); else notify("Demo version: sign out is not connected to authentication."); })} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-rose-600 hover:bg-rose-50">
            <LogOut size={17} /> Logout / Sign out
          </button>
        </div>
      )}
    </div>
  );
}
