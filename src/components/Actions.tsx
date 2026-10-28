export default function Actions({ close, label }) {
  return <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={close} className="rounded-xl border px-5 py-3 text-sm font-semibold">Cancel</button><button type="submit" className="rounded-xl bg-[#101828] px-5 py-3 text-sm font-bold text-white">{label}</button></div>;
}
