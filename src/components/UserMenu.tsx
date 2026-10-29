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
        className="flex items-center gap-2 rounded-full p-1.5 transition hover:bg-[#f1eee6] focus:outline-none focus:ring-2 focus:ring-[#b39870]"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d2822] font-bold text-[#d8bd91]">A</span>
        <ChevronDown size={15} className="text-[#77796f]" />
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-60 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[#e8e4da] bg-[#fbfaf7] p-2 text-[#26342b] shadow-[0_16px_40px_rgba(16,24,20,0.18)]">
          <div className="border-b border-[#e8e4da] px-3 py-3">
            <p className="text-sm font-bold text-[#26342b]">Admin User</p>
            <p className="mt-1 text-xs text-[#858477]">Property manager · Demo</p>
          </div>

          <button onClick={() => action(() => { if (onProfile) onProfile(); else notify("Signed in as Admin User · Demo account"); })} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition hover:bg-[#f1eee6]">
            <CircleUserRound size={17} /> Profile
          </button>

          <button onClick={() => action(() => onNavigate("Hotel Settings"))} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition hover:bg-[#f1eee6]">
            <Settings size={17} /> Settings
          </button>

          <button onClick={() => action(() => notify("Demo version: account switching is not connected yet."))} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition hover:bg-[#f1eee6]">
            <Building2 size={17} /> Switch property
          </button>

          <button onClick={() => action(() => { if (onLogout) onLogout(); else notify("Demo version: sign out is not connected to authentication."); })} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-rose-600 transition hover:bg-rose-50">
            <LogOut size={17} /> Logout / Sign out
          </button>
        </div>
      )}
    </div>
  );
}
