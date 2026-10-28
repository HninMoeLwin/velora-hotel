import { X } from "lucide-react";

export default function Modal({ title, close, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/70 p-3 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#d9b77c]/30 bg-[#fffaf3] shadow-[0_20px_60px_rgba(16,24,40,0.25)]">
        <div className="flex items-center justify-between border-b border-[#f0e3c6] bg-[#101828] px-5 py-4 text-white">
          <h2 className="text-xl font-extrabold text-white">{title}</h2>
          <button type="button" onClick={close} className="rounded-xl border border-white/15 bg-white/5 p-2 text-[#d9b77c] transition hover:bg-white/10" aria-label="Close"><X size={18} /></button>
        </div>
        <div className="p-5 text-slate-700">{children}</div>
      </div>
    </div>
  );
}
