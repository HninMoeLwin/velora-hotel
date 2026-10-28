import { Search } from "lucide-react";

export default function SearchBox({ query, setQuery }) {
  return <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-3 sm:w-[300px]"><Search size={16} className="text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search guests or bookings..." className="w-full bg-transparent text-sm outline-none" /></div>;
}
