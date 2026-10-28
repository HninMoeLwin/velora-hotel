import { useEffect, useMemo, useState } from "react";
import UserMenu from "./components/UserMenu";
import {
  Hotel,
  LayoutDashboard,
  CalendarDays,
  BedDouble,
  BadgePercent,
  Users,
  Settings2,
  Plus,
  Search,
  Pencil,
  Trash2,
  Check,
  X,
  Menu,
  ArrowRight,
  Sparkles,
  CircleDollarSign,
  CheckCircle2,
  DoorOpen,
  Tag,
  ShieldCheck,
  Heart,
  Phone,
  Mail,
  MoonStar,
  SunMedium,
  LogIn,
  BarChart3,
  CircleUserRound,
  BellRing,
  TrendingUp,
} from "lucide-react";

const seedRooms = [
  { id: 1, name: "Classic Single", type: "Single Room", price: 48000, capacity: 1, beds: "1 single bed", status: "Available", discount: 0, image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80", description: "A calm, thoughtfully designed room for solo stays.", amenities: ["Wi-Fi", "Air conditioning", "Work desk"] },
  { id: 2, name: "Deluxe Double", type: "Double Room", price: 76000, capacity: 2, beds: "1 queen bed", status: "Available", discount: 10, image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80", description: "Warm tones and extra space for a comfortable city break.", amenities: ["Wi-Fi", "Breakfast", "City view"] },
  { id: 3, name: "Velora VIP Suite", type: "VIP Room", price: 165000, capacity: 2, beds: "1 king bed", status: "Available", discount: 15, image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80", description: "A private premium suite with elegant details.", amenities: ["VIP lounge", "Breakfast", "Bathtub"] },
  { id: 4, name: "Family Retreat", type: "Family Room", price: 128000, capacity: 4, beds: "1 queen + 2 singles", status: "Available", discount: 5, image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80", description: "A spacious retreat designed for family time.", amenities: ["Wi-Fi", "Breakfast", "Extra space"] },
];

const seedBookings = [
  { id: "VB-2401", guest: "May Thiri", email: "may@example.com", phone: "09 123 456 789", roomId: 3, checkIn: "2026-10-27", checkOut: "2026-10-29", guests: 2, status: "Confirmed" },
  { id: "VB-2402", guest: "Aung Min", email: "aung@example.com", phone: "09 987 654 321", roomId: 2, checkIn: "2026-10-28", checkOut: "2026-10-30", guests: 2, status: "Pending" },
  { id: "VB-2403", guest: "Nwe Nwe", email: "nwe@example.com", phone: "09 444 555 666", roomId: 1, checkIn: "2026-11-02", checkOut: "2026-11-04", guests: 1, status: "Cancelled" },
];

const money = (n) => `${new Intl.NumberFormat("en-US").format(Math.round(n))} MMK`;

const load = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

function useStore(key, fallback) {
  const [value, setValue] = useState(() => load(key, fallback));
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function Field({ label, name, defaultValue, type = "text", required = true }) {
  return (
    <label className="block text-xs font-bold text-slate-600">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        min={type === "number" ? 0 : undefined}
        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal outline-none focus:border-amber-500"
      />
    </label>
  );
}

function Modal({ title, close, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/70 p-3 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#d9b77c]/30 bg-[#fffaf3] shadow-[0_20px_60px_rgba(16,24,40,0.25)]">
        <div className="flex items-center justify-between border-b border-[#f0e3c6] bg-[#101828] px-5 py-4 text-white">
          <h2 className="text-xl font-extrabold text-white">{title}</h2>
          <button onClick={close} className="rounded-xl border border-white/15 bg-white/5 p-2 text-[#d9b77c] transition hover:bg-white/10" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 text-slate-700">{children}</div>
      </div>
    </div>
  );
}

function SearchBox({ query, setQuery }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-3 sm:w-[300px]">
      <Search size={16} className="text-slate-400" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search guests or bookings..."
        className="w-full bg-transparent text-sm outline-none"
      />
    </div>
  );
}

function BookingTable({ bookings, room, onStatus, onSelectBooking, compact = false }) {
  if (!bookings.length) {
    return <p className="p-10 text-center text-sm text-slate-400">No bookings found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[650px] text-left">
        <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-5 py-3">Guest</th>
            <th className="px-5 py-3">Room</th>
            <th className="px-5 py-3">Stay dates</th>
            <th className="px-5 py-3">Status</th>
            {!compact && <th className="px-5 py-3">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y">
          {bookings.map((b) => (
            <tr key={b.id} className="cursor-pointer hover:bg-slate-50" onClick={() => onSelectBooking && onSelectBooking(b)}>
              <td className="px-5 py-4">
                <p className="text-sm font-bold">{b.guest}</p>
                <p className="mt-1 text-[11px] text-slate-400">{b.id} � {b.email}</p>
              </td>
              <td className="px-5 py-4 text-xs font-semibold">{room(b.roomId)?.name || "Room removed"}</td>
              <td className="px-5 py-4 text-xs text-slate-500">
                {b.checkIn}
                <br />
                to {b.checkOut}
              </td>
              <td className="px-5 py-4">
                <span
                  className={`rounded-full px-2.5 py-1.5 text-[10px] font-bold ${
                    b.status === "Confirmed"
                      ? "bg-emerald-50 text-emerald-700"
                      : b.status === "Pending"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {b.status}
                </span>
              </td>
              {!compact && (
                <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-2">
                    {b.status === "Pending" && (
                      <>
                        <button onClick={() => onStatus(b.id, "Confirmed")} title="Confirm" className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                          <Check size={15} />
                        </button>
                        <button onClick={() => onStatus(b.id, "Cancelled")} title="Cancel" className="rounded-lg bg-rose-50 p-2 text-rose-600">
                          <X size={15} />
                        </button>
                      </>
                    )}
                    {b.status === "Confirmed" && (
                      <button onClick={() => onStatus(b.id, "Cancelled")} className="rounded-lg border px-3 py-2 text-xs text-rose-600">
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Actions({ close, label }) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
      <button type="button" onClick={close} className="rounded-xl border px-5 py-3 text-sm font-semibold">
        Cancel
      </button>
      <button type="submit" className="rounded-xl bg-[#101828] px-5 py-3 text-sm font-bold text-white">
        {label}
      </button>
    </div>
  );
}

export default function App() {
  const [rooms, setRooms] = useStore("velora_rooms", seedRooms);
  const [bookings, setBookings] = useStore("velora_bookings", seedBookings);
  const [discounts, setDiscounts] = useStore("velora_discounts", [
    { id: 1, code: "WELCOME10", percent: 10, description: "Welcome offer for new guests", active: true },
    { id: 2, code: "VIP15", percent: 15, description: "Premium stay offer", active: true },
  ]);
  const [settings, setSettings] = useStore("velora_settings", {
    name: "Velora Hotel",
    address: "Yangon, Myanmar",
    phone: "+95 9 123 456 789",
    email: "hello@velorahotel.com",
  });

  const [page, setPage] = useState("Overview");
  const [mobile, setMobile] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [roomModal, setRoomModal] = useState(null);
  const [bookingModal, setBookingModal] = useState(null);
  const [discountModal, setDiscountModal] = useState(false);
  const [toast, setToast] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [profileModal, setProfileModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@velorahotel.com",
    role: "Property Manager",
    phone: "+95 9 111 222 333",
    hotel: "Velora Hotel",
  });

  const notify = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2600);
  };

  const room = (id) => rooms.find((r) => r.id === Number(id));
  const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
  const pending = bookings.filter((b) => b.status === "Pending").length;
  const available = rooms.filter((r) => r.status === "Available").length;

  const revenue = bookings
    .filter((b) => b.status === "Confirmed")
    .reduce(
      (sum, b) =>
        sum +
        (room(b.roomId)?.price || 0) *
          Math.max(1, (new Date(b.checkOut) - new Date(b.checkIn)) / 86400000) *
          (1 - (room(b.roomId)?.discount || 0) / 100),
      0,
    );

  const navs = [
    ["Overview", LayoutDashboard],
    ["Bookings", CalendarDays],
    ["Rooms & Suites", BedDouble],
    ["Discounts", BadgePercent],
    ["Guest Directory", Users],
    ["Hotel Settings", Settings2],
  ];

  const analytics = useMemo(() => {
    const totalNights = bookings.reduce(
      (sum, booking) => sum + Math.max(1, (new Date(booking.checkOut) - new Date(booking.checkIn)) / 86400000),
      0,
    );
    const avgRoomRate = rooms.length ? rooms.reduce((sum, roomItem) => sum + roomItem.price, 0) / rooms.length : 0;
    const occupancy = rooms.length ? Math.min(100, (bookings.filter((b) => b.status !== "Cancelled").length / rooms.length) * 35) : 0;
    const cancellation = bookings.length ? (bookings.filter((b) => b.status === "Cancelled").length / bookings.length) * 100 : 0;

    const monthlyRevenue = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, index) => {
      const monthValue = bookings
        .filter((b) => b.status === "Confirmed")
        .filter((b) => new Date(b.checkIn).getMonth() === index)
        .reduce((sum, booking) => {
          const roomItem = room(booking.roomId);
          const nights = Math.max(1, (new Date(booking.checkOut) - new Date(booking.checkIn)) / 86400000);
          return sum + (roomItem?.price || 0) * nights * (1 - (roomItem?.discount || 0) / 100);
        }, 0);
      return { month, value: monthValue };
    });

    return {
      occupancy: Math.round(occupancy),
      avgRoomRate: Math.round(avgRoomRate),
      adr: Math.round(revenue / Math.max(1, bookings.filter((b) => b.status === "Confirmed").length || 1)),
      cancellation: Math.round(cancellation),
      totalNights,
      monthlyRevenue,
    };
  }, [bookings, rooms, revenue]);

  const saveRoom = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      id: roomModal?.id || Date.now(),
      name: form.get("name"),
      type: form.get("type"),
      price: +form.get("price"),
      capacity: +form.get("capacity"),
      beds: form.get("beds"),
      status: form.get("status"),
      discount: Math.min(90, +form.get("discount")),
      image: form.get("image") || seedRooms[0].image,
      description: form.get("description"),
      amenities: String(form.get("amenities")).split(",").map((s) => s.trim()).filter(Boolean),
    };
    setRooms((prev) => (roomModal?.id ? prev.map((x) => (x.id === data.id ? data : x)) : [data, ...prev]));
    setRoomModal(null);
    notify("Room saved successfully");
  };

  const saveBooking = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const roomId = +form.get("roomId");
    const checkIn = form.get("checkIn");
    const checkOut = form.get("checkOut");

    if (checkOut <= checkIn) return notify("Check-out must be after check-in");
    if (checkIn < new Date().toISOString().slice(0, 10)) return notify("Choose a future check-in date");
    if (bookings.some((b) => b.roomId === roomId && b.status !== "Cancelled" && checkIn < b.checkOut && checkOut > b.checkIn)) {
      return notify("This room category is booked for those dates");
    }

    const code = String(form.get("code")).trim().toUpperCase();
    const promo = discounts.find((d) => d.code === code && d.active);

    setBookings((prev) => [{
      id: `VB-${Math.floor(1000 + Math.random() * 9000)}`,
      guest: form.get("guest"),
      email: form.get("email"),
      phone: form.get("phone"),
      roomId,
      checkIn,
      checkOut,
      guests: +form.get("guests"),
      status: "Pending",
      promoCode: promo?.code || "",
      promoPercent: promo?.percent || 0,
    }, ...prev]);
    setBookingModal(null);
    setPage("Bookings");
    notify("Booking request created");
  };

  const filtered = bookings.filter(
    (b) =>
      (filter === "All" || b.status === filter) &&
      `${b.id} ${b.guest} ${b.email} ${room(b.roomId)?.name || ""}`.toLowerCase().includes(query.toLowerCase()),
  );

  const shellClass = darkMode ? "min-h-screen bg-[#020817] text-slate-100" : "min-h-screen bg-[#f6f7fb] text-slate-800";
  const panelClass = darkMode ? "border-slate-800 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-800";
  const subtleClass = darkMode ? "text-slate-300" : "text-slate-500";

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#1e293b,_#020817_58%)] p-6">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-slate-700/60 bg-slate-950/70 shadow-2xl shadow-slate-950/40 backdrop-blur md:grid-cols-2">
          <div className="flex flex-col justify-between p-8 md:p-12">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#d9b77c] p-3 text-[#101828]"><Hotel size={24} /></div>
              <div>
                <p className="font-serif text-2xl font-bold text-white">velora<span className="text-amber-300">.</span></p>
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">hotel management</p>
              </div>
            </div>

            <div className="mt-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
                <ShieldCheck size={12} /> Premium hospitality platform
              </span>
              <h1 className="mt-6 text-4xl font-black leading-tight text-white md:text-5xl">
                Smart hotel operations, beautifully managed.
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
                Monitor bookings, rooms, discounts, and guest activity from one premium dashboard built for hotel teams.
              </p>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
                <p className="text-2xl font-black text-white">120+</p>
                <p className="mt-1 text-xs text-slate-400">Monthly stays</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
                <p className="text-2xl font-black text-white">96%</p>
                <p className="mt-1 text-xs text-slate-400">Guest satisfaction</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
                <p className="text-2xl font-black text-white">24/7</p>
                <p className="mt-1 text-xs text-slate-400">Operations view</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center bg-slate-900/70 p-8 md:p-12">
            <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); notify("Welcome back, Admin."); }} className="w-full max-w-md rounded-[28px] border border-slate-700 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/50">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Access portal</p>
                  <h2 className="mt-2 text-3xl font-black text-white">Welcome back</h2>
                </div>
                <div className="rounded-xl bg-[#d9b77c] p-3 text-[#101828]"><LogIn size={20} /></div>
              </div>

              <div className="space-y-5">
                <label className="block text-sm font-semibold text-slate-300">
                  Email
                  <input type="email" defaultValue="admin@velorahotel.com" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-amber-400" required />
                </label>

                <label className="block text-sm font-semibold text-slate-300">
                  Password
                  <input type="password" defaultValue="demo123" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-amber-400" required />
                </label>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="accent-amber-400" /> Keep me signed in
                  </label>
                  <button type="button" className="text-amber-300">Forgot password?</button>
                </div>

                <button type="submit" className="w-full rounded-2xl bg-[#d9b77c] px-5 py-3 text-sm font-bold text-[#101828] transition hover:bg-[#e4c78f]">
                  Sign in to dashboard
                </button>
              </div>

              <p className="mt-5 text-center text-xs text-slate-500">Demo login: admin@velorahotel.com / demo123</p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={shellClass}>
      {toast && (
        <div className="fixed right-4 top-4 z-[80] rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">
          <CheckCircle2 className="mr-2 inline text-emerald-300" size={18} />
          {toast}
        </div>
      )}

      {mobile && <button onClick={() => setMobile(false)} className="fixed inset-0 z-30 bg-black/40 lg:hidden" />}

      <div className="flex min-h-screen">
        <aside className={`fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col ${darkMode ? "bg-[#0b1220] text-white" : "bg-[#101828] text-white"} transition-transform lg:static lg:translate-x-0 ${mobile ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex h-[82px] items-center gap-3 border-b border-white/10 px-5">
            <div className="rounded-xl bg-[#d9b77c] p-3 text-[#101828]"><Hotel size={22} /></div>
            <div>
              <p className="font-serif text-xl font-bold">velora<span className="text-amber-300">.</span></p>
              <p className="text-[10px] uppercase tracking-[.2em] text-slate-400">Hotel management</p>
            </div>
          </div>

          <div className="m-4 rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs text-slate-400">PROPERTY</p>
            <p className="mt-1 font-semibold">{settings.name}</p>
            <p className="mt-1 text-xs text-slate-400">{settings.address}</p>
          </div>

          <nav className="flex-1 space-y-1 px-3 pt-3">
            {navs.map(([name, Icon]) => (
              <button
                key={name}
                onClick={() => {
                  setPage(name);
                  setMobile(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm ${page === name ? "bg-[#d9b77c] font-bold text-[#101828]" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
              >
                <Icon size={18} />
                {name}
                {name === "Bookings" && <span className="ml-auto rounded bg-black/10 px-2 py-0.5 text-xs">{pending}</span>}
              </button>
            ))}
          </nav>

          <div className="m-4 rounded-2xl bg-white/5 p-4">
            <Sparkles className="text-[#d9b77c]" size={18} />
            <p className="mt-2 text-sm font-semibold">Stay beautifully.</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">Every guest deserves a thoughtful stay.</p>
          </div>

          <div className="border-t border-white/10 p-4">
            <p className="text-sm font-bold">{profile.name}</p>
            <p className="mt-1 text-xs text-slate-500">{profile.role} � Demo</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className={`sticky top-0 z-20 flex h-[74px] items-center justify-between border-b ${darkMode ? "border-slate-800 bg-slate-950/90" : "border-slate-200 bg-white/90"} px-4 backdrop-blur sm:px-8`}>
            <div className="flex items-center gap-3">
              <button className="lg:hidden" onClick={() => setMobile(true)}><Menu size={21} /></button>
              <div>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-400"}`}>
                  Hotel management / <span className={darkMode ? "text-slate-200" : "text-slate-600"}>{page}</span>
                </p>
                <h1 className={`mt-1 text-xl font-extrabold ${darkMode ? "text-white" : "text-[#101828]"}`}>{page}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-2">
              <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Demo is live
              </span>

              <button
                type="button"
                onClick={() => setDarkMode((v) => !v)}
                className={`flex h-10 w-10 items-center justify-center rounded-full border ${darkMode ? "border-slate-700 bg-slate-900 text-amber-200" : "border-slate-200 bg-white text-slate-700"}`}
                aria-label="Toggle theme"
              >
                {darkMode ? <SunMedium size={16} /> : <MoonStar size={16} />}
              </button>

              <UserMenu
                onNavigate={setPage}
                notify={notify}
                onProfile={() => setProfileModal(true)}
                onLogout={() => {
                  setIsLoggedIn(false);
                  notify("You have been signed out.");
                }}
              />
            </div>
          </header>

          <div className="mx-auto max-w-[1450px] p-4 sm:p-8">
            {page === "Overview" && (
              <div className="space-y-7">
                <div className={`relative overflow-hidden rounded-3xl ${darkMode ? "bg-[#0f172a] text-white" : "bg-[#101828] text-white"} p-6 sm:p-9`}>
                  <div className="absolute -right-10 -top-20 h-72 w-72 rounded-full border border-amber-200/20" />
                  <div className="relative max-w-2xl">
                    <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#e6c997]">
                      <Sparkles size={13} /> Your hospitality at a glance
                    </span>
                    <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl">
                      Welcome back, {profile.name.split(" ")[0]}.<br />
                      <span className="text-[#e6c997]">Let's make every stay special.</span>
                    </h2>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
                      Manage reservations, room categories and guest offers in one beautiful place.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button onClick={() => setPage("Bookings")} className="rounded-xl bg-[#d9b77c] px-4 py-3 text-sm font-bold text-[#101828]">
                        Review bookings <ArrowRight className="ml-1 inline" size={15} />
                      </button>
                      <button onClick={() => setPage("Rooms & Suites")} className="rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold">
                        Manage rooms
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                  {[
                    { label: "Total bookings", value: bookings.length, note: `${pending} awaiting review`, Icon: CalendarDays, color: "bg-blue-50 text-blue-700" },
                    { label: "Confirmed stays", value: confirmed, note: "Ready for arrival", Icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700" },
                    { label: "Room categories", value: rooms.length, note: `${available} available`, Icon: BedDouble, color: "bg-amber-50 text-amber-700" },
                    { label: "Confirmed value", value: money(revenue), note: "Estimated booking value", Icon: CircleDollarSign, color: "bg-violet-50 text-violet-700" },
                  ].map((stat) => (
                    <div key={stat.label} className={`${panelClass} rounded-2xl border p-5 shadow-sm`}>
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                        <stat.Icon size={20} />
                      </div>
                      <p className={`mt-5 text-xs ${subtleClass}`}>{stat.label}</p>
                      <h3 className="mt-1 break-words text-2xl font-extrabold">{stat.value}</h3>
                      <p className="mt-2 text-xs text-slate-400">{stat.note}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                  <div className={`overflow-hidden rounded-2xl border ${panelClass}`}>
                    <div className="flex items-center justify-between border-b border-slate-200 p-5">
                      <div>
                        <h3 className="font-bold">Recent reservations</h3>
                        <p className={`mt-1 text-xs ${subtleClass}`}>Latest guest activity</p>
                      </div>
                      <button onClick={() => setPage("Bookings")} className="text-xs font-bold text-amber-700">View all ?</button>
                    </div>
                    <BookingTable bookings={bookings.slice(0, 4)} room={room} compact onSelectBooking={setSelectedBooking} />
                  </div>

                  <div className={`rounded-2xl border ${panelClass} p-5`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold">Booking summary</h3>
                        <p className={`mt-1 text-xs ${subtleClass}`}>Live overview</p>
                      </div>
                      <BarChart3 className="text-amber-700" />
                    </div>

                    <div className="mt-5 space-y-4">
                      {[
                        { label: "Occupancy", value: `${analytics.occupancy}%`, tone: "bg-emerald-500" },
                        { label: "ADR", value: money(analytics.adr), tone: "bg-blue-500" },
                        { label: "Night booked", value: `${analytics.totalNights}`, tone: "bg-violet-500" },
                        { label: "Cancellation", value: `${analytics.cancellation}%`, tone: "bg-rose-500" },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="mb-2 flex justify-between text-xs">
                            <span className="font-semibold">{item.label}</span>
                            <span className={subtleClass}>{item.value}</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100">
                            <div
                              className={`h-2 rounded-full ${item.tone}`}
                              style={{ width: item.label === "Cancellation" ? `${Math.min(100, analytics.cancellation)}%` : item.label === "Occupancy" ? `${analytics.occupancy}%` : "80%" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
                  <div className={`rounded-2xl border ${panelClass} p-5`}>
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                      <div>
                        <h3 className="font-bold">Advanced analytics</h3>
                        <p className={`mt-1 text-xs ${subtleClass}`}>Performance snapshot</p>
                      </div>
                      <TrendingUp className="text-amber-700" />
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {[
                        { label: "Avg room rate", value: money(analytics.avgRoomRate) },
                        { label: "Confirmed bookings", value: confirmed },
                        { label: "Open requests", value: pending },
                        { label: "Guest nights", value: analytics.totalNights },
                      ].map((item) => (
                        <div key={item.label} className={`rounded-2xl border ${darkMode ? "border-slate-800 bg-slate-950/70" : "border-slate-200 bg-slate-50"} p-4`}>
                          <p className={`text-xs ${subtleClass}`}>{item.label}</p>
                          <p className="mt-2 text-2xl font-black">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`rounded-2xl border ${panelClass} p-5`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold">Room availability</h3>
                        <p className={`mt-1 text-xs ${subtleClass}`}>By room category</p>
                      </div>
                      <DoorOpen className="text-amber-700" />
                    </div>

                    <div className="mt-6 space-y-5">
                      {[...new Set(rooms.map((r) => r.type))].map((type) => {
                        const list = rooms.filter((r) => r.type === type);
                        const count = list.filter((r) => r.status === "Available").length;
                        return (
                          <div key={type}>
                            <div className="mb-2 flex justify-between text-xs">
                              <span className="font-semibold">{type}</span>
                              <span className={subtleClass}>{count}/{list.length} available</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100">
                              <div className="h-2 rounded-full bg-[#d9b77c]" style={{ width: `${(count / Math.max(1, list.length)) * 100}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {page === "Bookings" && (
              <section>
                <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <p className={`text-sm ${subtleClass}`}>Review, confirm or cancel guest reservations.</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {[
                        "All",
                        "Pending",
                        "Confirmed",
                        "Cancelled",
                      ].map((status) => (
                        <button
                          key={status}
                          onClick={() => setFilter(status)}
                          className={`rounded-full px-4 py-2 text-xs font-bold ${filter === status ? "bg-[#101828] text-white" : "border bg-white text-slate-500"}`}
                        >
                          {status} � {status === "All" ? bookings.length : bookings.filter((b) => b.status === status).length}
                        </button>
                      ))}
                    </div>
                  </div>
                  <SearchBox query={query} setQuery={setQuery} />
                </div>

                <div className={`overflow-hidden rounded-2xl border ${panelClass}`}>
                  <div className="border-b p-5">
                    <h3 className="font-bold">Reservation list</h3>
                    <p className={`mt-1 text-xs ${subtleClass}`}>{filtered.length} bookings found</p>
                  </div>
                  <BookingTable
                    bookings={filtered}
                    room={room}
                    onStatus={(id, status) => {
                      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
                      notify("Booking status updated");
                    }}
                    onSelectBooking={setSelectedBooking}
                  />
                </div>
              </section>
            )}

            {page === "Rooms & Suites" && (
              <section>
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <p className={`text-sm ${subtleClass}`}>Create room categories, prices, discounts and availability.</p>
                    <p className={`mt-2 text-xs ${subtleClass}`}>{rooms.length} categories � {available} available</p>
                  </div>
                  <button onClick={() => setRoomModal({})} className="rounded-xl bg-[#101828] px-4 py-3 text-sm font-bold text-white">
                    <Plus className="mr-1 inline" size={17} /> Add room
                  </button>
                </div>

                <div className="mb-5"><SearchBox query={query} setQuery={setQuery} /></div>

                <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                  {rooms.filter((r) => `${r.name} ${r.type}`.toLowerCase().includes(query.toLowerCase())).map((r) => (
                    <article key={r.id} className={`overflow-hidden rounded-2xl border ${panelClass} shadow-sm`}>
                      <div className="relative h-48 bg-slate-100">
                        <img src={r.image} alt={r.name} className="h-full w-full object-cover" />
                        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold">{r.status}</span>
                        {r.discount > 0 && <span className="absolute right-4 top-4 rounded-full bg-[#d9b77c] px-3 py-1.5 text-[11px] font-bold">{r.discount}% OFF</span>}
                      </div>

                      <div className="p-5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">{r.type}</p>
                        <div className="mt-1 flex items-start justify-between gap-2">
                          <h3 className="font-extrabold text-[#101828]">{r.name}</h3>
                          <p className="text-right text-sm font-extrabold">
                            {money(r.price * (1 - r.discount / 100))}
                            <span className="block text-[10px] font-normal text-slate-400">per night</span>
                          </p>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-500">{r.description}</p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {r.amenities.map((a) => (
                            <span key={a} className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-500">{a}</span>
                          ))}
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t pt-4">
                          <span className="text-xs text-slate-500">{r.capacity} guest(s) � {r.beds}</span>
                          <div className="flex gap-2">
                            <button onClick={() => setRoomModal(r)} className="rounded-lg border border-slate-200 p-2 text-slate-600"><Pencil size={14} /></button>
                            <button onClick={() => setRooms((prev) => prev.filter((x) => x.id !== r.id))} className="rounded-lg border border-rose-200 p-2 text-rose-600"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {page === "Discounts" && (
              <section>
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <p className={`text-sm ${subtleClass}`}>Create promo codes and manage room offers.</p>
                  </div>
                  <button onClick={() => setDiscountModal(true)} className="rounded-xl bg-[#101828] px-4 py-3 text-sm font-bold text-white">
                    <Plus className="mr-1 inline" size={16} /> Create discount
                  </button>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  {discounts.map((d) => (
                    <div key={d.id} className={`rounded-2xl border ${panelClass} p-6 shadow-sm`}>
                      <div className="flex items-start justify-between">
                        <div className="rounded-xl bg-[#101828] p-3 text-[#d9b77c]"><Tag size={22} /></div>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${d.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                          {d.active ? "Active" : "Paused"}
                        </span>
                      </div>

                      <div className="mt-5 flex items-end justify-between">
                        <div>
                          <p className="text-xs text-slate-400">PROMO CODE</p>
                          <h3 className="mt-1 text-2xl font-extrabold tracking-wider">{d.code}</h3>
                          <p className="mt-2 text-sm text-slate-500">{d.description}</p>
                        </div>
                        <p className="text-4xl font-black text-amber-700">{d.percent}%</p>
                      </div>

                      <div className="mt-5 flex justify-between border-t pt-4">
                        <button onClick={() => setDiscounts((prev) => prev.map((x) => (x.id === d.id ? { ...x, active: !x.active } : x)))} className="text-xs font-bold text-slate-600">
                          {d.active ? "Pause offer" : "Activate offer"}
                        </button>
                        <button onClick={() => setDiscounts((prev) => prev.filter((x) => x.id !== d.id))} className="text-xs font-bold text-rose-500">
                          <Trash2 className="mr-1 inline" size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  Room discounts are applied automatically. Promo codes can be entered during a booking request.
                </p>
              </section>
            )}

            {page === "Guest Directory" && (
              <section>
                <p className={`mb-5 text-sm ${subtleClass}`}>Guest contact details from existing reservations.</p>
                <div className={`overflow-hidden rounded-2xl border ${panelClass}`}>
                  <div className="border-b p-4">
                    <SearchBox query={query} setQuery={setQuery} />
                  </div>

                  {[...new Map(bookings.map((b) => [b.email, b])).values()]
                    .filter((b) => `${b.guest} ${b.email} ${b.phone}`.toLowerCase().includes(query.toLowerCase()))
                    .map((b) => (
                      <div key={b.email} className="flex flex-wrap items-center gap-4 border-b p-5 last:border-0">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-800">
                          {b.guest.split(" ").map((s) => s[0]).join("")}
                        </div>
                        <div className="min-w-[160px] flex-1">
                          <p className="font-bold">{b.guest}</p>
                          <p className="mt-1 text-xs text-slate-400"><Mail className="mr-1 inline" size={12} />{b.email}</p>
                        </div>
                        <p className="text-xs text-slate-500"><Phone className="mr-1 inline" size={13} />{b.phone}</p>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {page === "Hotel Settings" && (
              <section className="max-w-3xl">
                <p className={`mb-6 text-sm ${subtleClass}`}>Edit the hotel information shown in the dashboard.</p>
                <form onSubmit={(e) => { e.preventDefault(); const form = new FormData(e.currentTarget); setSettings({ name: form.get("name"), address: form.get("address"), phone: form.get("phone"), email: form.get("email") }); notify("Hotel settings saved"); }} className={`rounded-2xl border ${panelClass} p-6`}>
                  <div className="mb-6 flex items-center gap-3 border-b pb-5">
                    <div className="rounded-xl bg-[#101828] p-3 text-[#d9b77c]"><Hotel size={22} /></div>
                    <div>
                      <h3 className="font-bold">Property information</h3>
                      <p className="mt-1 text-xs text-slate-400">Your hotel's public-facing details</p>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Hotel name" name="name" defaultValue={settings.name} />
                    <Field label="Address" name="address" defaultValue={settings.address} />
                    <Field label="Contact phone" name="phone" defaultValue={settings.phone} />
                    <Field label="Contact email" name="email" type="email" defaultValue={settings.email} />
                  </div>

                  <button className="mt-6 rounded-xl bg-[#101828] px-5 py-3 text-sm font-bold text-white">Save changes</button>
                </form>

                <div className={`mt-5 rounded-2xl border ${panelClass} p-5`}>
                  <h3 className="font-bold">Demo data</h3>
                  <p className="mt-1 text-sm text-slate-500">Data is stored in your browser using localStorage.</p>
                  <button
                    onClick={() => {
                      if (confirm("Reset all demo data?")) {
                        ["velora_rooms", "velora_bookings", "velora_discounts", "velora_settings"].forEach((key) => localStorage.removeItem(key));
                        location.reload();
                      }
                    }}
                    className="mt-4 text-sm font-bold text-rose-600"
                  >
                    <Trash2 className="mr-1 inline" size={15} /> Reset demo data
                  </button>
                </div>
              </section>
            )}

            <footer className={`mt-12 flex flex-wrap justify-between gap-2 border-t ${darkMode ? "border-slate-800" : "border-slate-200"} pt-5 text-xs ${darkMode ? "text-slate-400" : "text-slate-400"}`}>
              <span>� 2026 Velora Hotel Management � React demo</span>
              <span>Crafted for memorable stays <Heart className="ml-1 inline text-rose-400" size={12} /></span>
            </footer>
          </div>
        </main>
      </div>

      {roomModal && (
        <Modal title={roomModal.id ? "Edit room" : "Add room"} close={() => setRoomModal(null)}>
          <form onSubmit={saveRoom} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Room name" name="name" defaultValue={roomModal.name || ""} />
              <label className="block text-xs font-bold text-slate-600">
                Room type
                <select name="type" defaultValue={roomModal.type || "Single Room"} className="mt-2 w-full rounded-xl border px-3 py-3 text-sm font-normal">
                  {[
                    "Single Room",
                    "Double Room",
                    "Twin Room",
                    "Family Room",
                    "VIP Room",
                    "Deluxe Room",
                  ].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <Field label="Price per night (MMK)" name="price" type="number" defaultValue={roomModal.price ?? 50000} />
              <Field label="Guest capacity" name="capacity" type="number" defaultValue={roomModal.capacity ?? 2} />
              <Field label="Bed setup" name="beds" defaultValue={roomModal.beds || "1 queen bed"} />
              <Field label="Discount (%)" name="discount" type="number" defaultValue={roomModal.discount ?? 0} />
              <label className="block text-xs font-bold text-slate-600">
                Status
                <select name="status" defaultValue={roomModal.status || "Available"} className="mt-2 w-full rounded-xl border px-3 py-3 text-sm font-normal">
                  <option>Available</option>
                  <option>Maintenance</option>
                  <option>Hidden</option>
                </select>
              </label>
              <Field label="Image URL" name="image" required={false} defaultValue={roomModal.image || ""} />
              <div className="sm:col-span-2">
                <Field label="Description" name="description" defaultValue={roomModal.description || ""} />
              </div>
              <div className="sm:col-span-2">
                <Field label="Amenities (comma separated)" name="amenities" defaultValue={(roomModal.amenities || ["Wi-Fi", "Air conditioning"]).join(", ")} />
              </div>
            </div>
            <Actions close={() => setRoomModal(null)} label="Save room" />
          </form>
        </Modal>
      )}

      {discountModal && (
        <Modal title="Create discount" close={() => setDiscountModal(false)}>
          <form onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const code = String(form.get("code")).trim().toUpperCase();
            if (discounts.some((d) => d.code === code)) return notify("Code already exists");
            setDiscounts((prev) => [{ id: Date.now(), code, percent: Math.min(90, +form.get("percent")), description: form.get("description"), active: true }, ...prev]);
            setDiscountModal(false);
            notify("Discount created");
          }} className="space-y-4">
            <Field label="Promo code" name="code" defaultValue="" />
            <Field label="Discount percentage" name="percent" type="number" defaultValue="10" />
            <Field label="Description" name="description" defaultValue="Special offer for guests" />
            <Actions close={() => setDiscountModal(false)} label="Create discount" />
          </form>
        </Modal>
      )}

      {bookingModal && (
        <Modal title="Book your stay" close={() => setBookingModal(null)}>
          <form onSubmit={saveBooking} className="space-y-4">
            <label className="block text-xs font-bold text-slate-600">
              Room category
              <select name="roomId" defaultValue={bookingModal.roomId} className="mt-2 w-full rounded-xl border px-3 py-3 text-sm font-normal">
                {rooms.filter((r) => r.status === "Available").map((r) => (
                  <option value={r.id} key={r.id}>{r.name} � {money(r.price * (1 - r.discount / 100))}/night</option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Guest full name" name="guest" defaultValue="" />
              <Field label="Email address" name="email" type="email" defaultValue="" />
              <Field label="Phone number" name="phone" defaultValue="" />
              <Field label="Number of guests" name="guests" type="number" defaultValue="2" />
              <Field label="Check-in" name="checkIn" type="date" defaultValue="2026-10-27" />
              <Field label="Check-out" name="checkOut" type="date" defaultValue="2026-10-29" />
            </div>

            <Field label="Promo code (optional)" name="code" required={false} defaultValue="" />

            <p className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              Booking requests start as Pending. The admin can confirm or cancel them from the Bookings page.
            </p>

            <Actions close={() => setBookingModal(null)} label="Request booking" />
          </form>
        </Modal>
      )}

      {profileModal && (
        <Modal title="Profile" close={() => setProfileModal(false)}>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#101828] text-2xl font-black text-[#d9b77c]">A</div>
              <div>
                <p className="text-lg font-extrabold">{profile.name}</p>
                <p className="text-sm text-slate-500">{profile.role}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="profileName" defaultValue={profile.name} />
              <Field label="Role" name="profileRole" defaultValue={profile.role} />
              <Field label="Email" name="profileEmail" type="email" defaultValue={profile.email} />
              <Field label="Phone" name="profilePhone" defaultValue={profile.phone} />
            </div>

            <button
              onClick={() => {
                const profileName = document.querySelector('input[name="profileName"]')?.value || profile.name;
                const profileRole = document.querySelector('input[name="profileRole"]')?.value || profile.role;
                const profileEmail = document.querySelector('input[name="profileEmail"]')?.value || profile.email;
                const profilePhone = document.querySelector('input[name="profilePhone"]')?.value || profile.phone;
                setProfile({ ...profile, name: profileName, role: profileRole, email: profileEmail, phone: profilePhone });
                setProfileModal(false);
                notify("Profile updated successfully");
              }}
              className="mt-4 w-full rounded-xl bg-[#101828] px-5 py-3 text-sm font-bold text-white"
            >
              Save profile
            </button>
          </div>
        </Modal>
      )}

      {selectedBooking && (
        <Modal title={`Booking details - ${selectedBooking.id}`} close={() => setSelectedBooking(null)}>
          <div className="space-y-4 text-sm">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Guest</span>
                <span className="font-bold">{selectedBooking.guest}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-slate-500">Room</span>
                <span className="font-bold">{room(selectedBooking.roomId)?.name}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-slate-500">Status</span>
                <span className="font-bold text-amber-600">{selectedBooking.status}</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border p-4">
                <p className="text-xs text-slate-500">Check-in</p>
                <p className="mt-1 font-bold">{selectedBooking.checkIn}</p>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="text-xs text-slate-500">Check-out</p>
                <p className="mt-1 font-bold">{selectedBooking.checkOut}</p>
              </div>
            </div>

            <div className="rounded-2xl border p-4">
              <p className="text-xs text-slate-500">Contact</p>
              <p className="mt-1">{selectedBooking.email}</p>
              <p className="mt-1">{selectedBooking.phone}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
