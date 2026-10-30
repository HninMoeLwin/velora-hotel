import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BedDouble,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Coffee,
  Heart,
  Hotel,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wifi,
  X,
} from "lucide-react";

const money = (amount) => `${new Intl.NumberFormat("en-US").format(Math.round(amount))} MMK`;
const localDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const today = localDate(new Date());
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const defaultCheckIn = localDate(tomorrow);
const defaultCheckOutDate = new Date(tomorrow);
defaultCheckOutDate.setDate(defaultCheckOutDate.getDate() + 2);
const defaultCheckOut = localDate(defaultCheckOutDate);

function RoomImage({ room, className = "" }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={room.image}
        alt={room.name}
        className="h-full w-full object-cover transition duration-700 hover:scale-105"
      />
    </div>
  );
}

function RoomCard({ room, index, onSelect }) {
  const nightly = room.price * (1 - (room.discount || 0) / 100);

  return (
    <article key={room.id} className="group bg-[#fbfaf7]">
      <div className="relative aspect-[1.38] overflow-hidden bg-[#d8d2c5]">
        <RoomImage room={room} className="h-full w-full" />
        {room.discount > 0 && <span className="absolute left-4 top-4 bg-[#b39870] px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[#1d2822]">{room.discount}% off</span>}
        <span className={`absolute bottom-4 right-4 px-3 py-2 text-[9px] font-semibold uppercase tracking-widest ${room.status === "Available" ? "bg-[#fbfaf7]/95 text-[#555a51]" : "bg-[#1d2822]/90 text-white"}`}>
          {room.status === "Available" ? (index === 0 ? "Guest favorite" : "Thoughtful design") : "Currently unavailable"}
        </span>
      </div>
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.19em] text-[#a47b46]">{room.type}</p>
            <h3 className="mt-2 font-serif text-2xl font-medium">{room.name}</h3>
          </div>
          <Heart size={18} className="mt-1 shrink-0 text-[#99958b]" />
        </div>
        <p className="mt-3 min-h-[48px] text-xs leading-6 text-[#77796f]">{room.description}</p>
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-y border-[#e9e5db] py-4 text-[10px] text-[#6c7068]">
          <span className="flex items-center gap-1.5"><BedDouble size={14} className="text-[#a47b46]" />{room.beds}</span>
          <span className="flex items-center gap-1.5"><Users size={14} className="text-[#a47b46]" />Up to {room.capacity}</span>
          {room.amenities.slice(0, 2).map((amenity) => <span key={amenity} className="flex items-center gap-1.5"><Check size={13} className="text-[#a47b46]" />{amenity}</span>)}
        </div>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <span className="font-serif text-xl">{money(nightly)}</span>
            <span className="ml-1 text-[10px] text-[#77796f]">/ night</span>
          </div>
          <button
            onClick={() => onSelect(room)}
            className="flex items-center gap-2 border-b border-[#b39870] pb-1 text-[9px] font-bold uppercase tracking-[0.14em] transition hover:text-[#a47b46]"
          >
            View details <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function CustomerSite({ rooms, bookings, discounts, settings, onAdmin, onBookingCreated }) {
  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guestCount, setGuestCount] = useState("2");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingStep, setBookingStep] = useState(false);
  const [sitePage, setSitePage] = useState(() => window.location.hash === "#all-rooms" ? "rooms" : "home");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    const syncPage = () => setSitePage(window.location.hash === "#all-rooms" ? "rooms" : "home");
    window.addEventListener("hashchange", syncPage);
    return () => window.removeEventListener("hashchange", syncPage);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [sitePage]);

  const availableRooms = useMemo(
    () =>
      rooms.filter(
        (room) =>
          room.status === "Available" &&
          room.capacity >= Number(guestCount) &&
          !bookings.some(
            (booking) =>
              booking.roomId === room.id &&
              booking.status !== "Cancelled" &&
              checkIn < booking.checkOut &&
              checkOut > booking.checkIn,
          ),
      ),
    [rooms, bookings, checkIn, checkOut, guestCount],
  );

  const nights = Math.max(1, (new Date(`${checkOut}T00:00:00`) - new Date(`${checkIn}T00:00:00`)) / 86400000);

  const submitBooking = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const guest = String(form.get("guest")).trim();
    const email = String(form.get("email")).trim();
    const phone = String(form.get("phone")).trim();
    const code = String(form.get("code")).trim().toUpperCase();
    const promo = discounts.find((discount) => discount.code === code && discount.active);
    const room = rooms.find((item) => item.id === selectedRoom.id);

    if (checkIn < today || checkOut <= checkIn) {
      setConfirmation("Please choose valid future dates for your stay.");
      return;
    }
    if (
      !room ||
      room.status !== "Available" ||
      room.capacity < Number(guestCount) ||
      bookings.some(
        (booking) =>
          booking.roomId === room.id &&
          booking.status !== "Cancelled" &&
          checkIn < booking.checkOut &&
          checkOut > booking.checkIn,
      )
    ) {
      setConfirmation("This room is no longer available for those dates. Please choose another stay.");
      setSelectedRoom(null);
      return;
    }

    const booking = {
      id: `VB-${Date.now()}`,
      guest,
      email,
      phone,
      roomId: room.id,
      checkIn,
      checkOut,
      guests: Number(guestCount),
      status: "Pending",
      promoCode: promo?.code || "",
      promoPercent: promo?.percent || 0,
    };
    onBookingCreated(booking);
    setSelectedRoom(null);
    setBookingStep(false);
    setConfirmation(`Thank you, ${guest}. Your request ${booking.id} has been sent to ${settings.name}. We'll be in touch soon.`);
    event.currentTarget.reset();
  };

  const selectRoom = (room) => {
    setConfirmation("");
    setGuestCount(String(Math.min(Number(guestCount), room.capacity)));
    setSelectedRoom(room);
    setBookingStep(false);
  };

  const closeRoomDialog = () => {
    setSelectedRoom(null);
    setBookingStep(false);
  };

  const navigateToSection = (event, section) => {
    if (sitePage !== "rooms") return;
    event.preventDefault();
    window.history.pushState(null, "", `#${section}`);
    setSitePage("home");
    window.setTimeout(() => document.getElementById(section)?.scrollIntoView({ behavior: "smooth" }), 0);
  };

  const roomPrice = selectedRoom
    ? selectedRoom.price * (1 - (selectedRoom.discount || 0) / 100) * nights
    : 0;

  return (
    <div className="velora-site min-h-screen bg-[#f7f5f0] text-[#20251f]">
      <div className="bg-[#1d2822] px-4 py-2 text-center text-[10px] font-medium tracking-[0.16em] text-white/80 sm:text-xs">
        A QUIETER KIND OF LUXURY <span className="mx-2 text-[#c5a77b]">·</span> YOUR YANGON CITY RETREAT
      </div>

      <header className="relative z-20 border-b border-[#e8e4da] bg-[#fbfaf7]">
        <div className="mx-auto flex h-[82px] max-w-7xl items-center justify-between px-5 lg:px-10">
          <a href="#home" className="flex items-center gap-3" aria-label={`${settings.name} home`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d2822] text-[#d8bd91]"><Hotel size={19} /></span>
            <span>
              <span className="block font-serif text-[22px] font-semibold leading-none tracking-tight">{settings.name}</span>
              <span className="mt-1 block text-[9px] uppercase tracking-[0.28em] text-[#8d8a7f]">a stay to remember</span>
            </span>
          </a>

          <nav className="hidden items-center gap-9 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#555a51] md:flex">
            <a onClick={(event) => navigateToSection(event, "stay")} className="transition hover:text-[#a47b46]" href="#stay">The stay</a>
            <a className="transition hover:text-[#a47b46]" href="#all-rooms">Rooms & suites</a>
            <a onClick={(event) => navigateToSection(event, "experience")} className="transition hover:text-[#a47b46]" href="#experience">Experiences</a>
            <a onClick={(event) => navigateToSection(event, "contact")} className="transition hover:text-[#a47b46]" href="#contact">Contact</a>
          </nav>

          <div className="hidden items-center gap-5 md:flex">
            <button onClick={onAdmin} className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#77796f] transition hover:text-[#20251f]">
              Admin
            </button>
            <a href="#all-rooms" className="group flex items-center gap-3 bg-[#1d2822] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#34483c]">
              Book your stay <ArrowUpRight size={14} className="text-[#d8bd91] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <button onClick={() => setMobileMenu((open) => !open)} className="p-2 text-[#1d2822] md:hidden" aria-label="Toggle navigation">
            {mobileMenu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        {mobileMenu && (
          <nav className="absolute left-0 right-0 top-full flex flex-col gap-1 border-t border-[#e8e4da] bg-[#fbfaf7] p-5 shadow-lg md:hidden">
            {["The stay", "Rooms & suites", "Experiences", "Contact"].map((item, index) => {
              const href = ["#stay", "#all-rooms", "#experience", "#contact"][index];
              const section = ["stay", "", "experience", "contact"][index];
              return (
                <a key={item} onClick={(event) => { setMobileMenu(false); if (section) navigateToSection(event, section); }} className="py-3 text-xs font-semibold uppercase tracking-widest" href={href}>{item}</a>
              );
            })}
            <button onClick={onAdmin} className="border-t border-[#e8e4da] py-3 text-left text-xs font-semibold uppercase tracking-widest">Admin portal</button>
          </nav>
        )}
      </header>

      <main>
        {confirmation && (
          <div className="mx-auto mt-8 flex max-w-6xl items-start gap-3 border border-[#c9d7c8] bg-[#eef4ec] px-5 py-4 text-sm text-[#34483c]">
            <BadgeCheck size={19} className="mt-0.5 shrink-0" />
            <p className="flex-1 leading-6">{confirmation}</p>
            <button onClick={() => setConfirmation("")} aria-label="Dismiss confirmation"><X size={17} /></button>
          </div>
        )}

        {sitePage === "rooms" ? (
          <section className="min-h-[65vh] bg-[#eeece5] px-6 py-16 lg:px-10 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a47b46]">Find your perfect stay</p>
              <div className="mt-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <h1 className="font-serif text-4xl font-normal tracking-tight sm:text-5xl">All rooms & suites.</h1>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-[#6c7068]">Explore every room currently listed by {settings.name}. Select a room to see its details and booking options.</p>
                </div>
                <p className="text-sm text-[#6c7068]">{rooms.length} room {rooms.length === 1 ? "type" : "types"} listed</p>
              </div>

              {rooms.length ? (
                <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {rooms.map((room, index) => <RoomCard key={room.id} room={room} index={index} onSelect={selectRoom} />)}
                </div>
              ) : (
                <div className="mt-10 border border-[#d9d4c8] bg-[#fbfaf7] px-6 py-12 text-center">
                  <BedDouble className="mx-auto text-[#a47b46]" size={25} />
                  <h2 className="mt-4 font-serif text-2xl">No rooms listed yet</h2>
                  <p className="mt-2 text-sm text-[#77796f]">Please check back soon for available room options.</p>
                </div>
              )}
            </div>
          </section>
        ) : (
          <>
        <section id="home" className="relative min-h-[610px] overflow-hidden bg-[#28342d] lg:min-h-[690px]">
          <img
            src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=2200&q=90"
            alt="Warm, sunlit hotel suite"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101915]/85 via-[#17211b]/55 to-[#142019]/10" />
          <div className="relative mx-auto flex min-h-[610px] max-w-7xl flex-col justify-center px-6 pb-28 pt-16 lg:min-h-[690px] lg:px-10">
            <div className="max-w-2xl">
              <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e2c99e]">
                <span className="h-px w-9 bg-[#d8bd91]" /> Yangon, Myanmar
              </p>
              <h1 className="mt-7 font-serif text-[50px] font-normal leading-[1.05] tracking-[-0.035em] text-white sm:text-6xl lg:text-[76px]">
                Find your own<br />pace in the city.
              </h1>
              <p className="mt-6 max-w-md text-sm leading-7 text-white/75 sm:text-base">
                Thoughtful rooms, warm hospitality, and a little more room to breathe. Welcome to {settings.name}.
              </p>
              <a href="#rooms" className="mt-9 inline-flex items-center gap-3 border-b border-[#d8bd91] pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                Discover your stay <ArrowDown size={14} className="text-[#d8bd91]" />
              </a>
            </div>
            <div className="absolute bottom-8 right-7 hidden items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/65 sm:flex lg:right-10">
              <span className="h-px w-8 bg-white/50" /> An address worth finding
            </div>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="relative z-10 mx-auto -mt-[1px] grid max-w-6xl gap-px bg-[#d9d4c8] px-5 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_1fr_auto]"
          >
            <label className="flex items-center gap-4 bg-[#fbfaf7] px-5 py-4">
              <CalendarDays size={17} className="shrink-0 text-[#aa8d64]" />
              <span className="min-w-0 flex-1">
                <span className="block text-[9px] font-bold uppercase tracking-[0.15em] text-[#77796f]">Check in</span>
                <input aria-label="Check-in date" type="date" min={today} value={checkIn} onChange={(event) => setCheckIn(event.target.value)} className="mt-1 w-full bg-transparent text-xs font-semibold outline-none" />
              </span>
            </label>
            <label className="flex items-center gap-4 bg-[#fbfaf7] px-5 py-4">
              <CalendarDays size={17} className="shrink-0 text-[#aa8d64]" />
              <span className="min-w-0 flex-1">
                <span className="block text-[9px] font-bold uppercase tracking-[0.15em] text-[#77796f]">Check out</span>
                <input aria-label="Check-out date" type="date" min={checkIn || today} value={checkOut} onChange={(event) => setCheckOut(event.target.value)} className="mt-1 w-full bg-transparent text-xs font-semibold outline-none" />
              </span>
            </label>
            <label className="flex items-center gap-4 bg-[#fbfaf7] px-5 py-4">
              <Users size={17} className="shrink-0 text-[#aa8d64]" />
              <span className="relative min-w-0 flex-1">
                <span className="block text-[9px] font-bold uppercase tracking-[0.15em] text-[#77796f]">Guests</span>
                <select aria-label="Number of guests" value={guestCount} onChange={(event) => setGuestCount(event.target.value)} className="mt-1 w-full appearance-none bg-transparent pr-6 text-xs font-semibold text-[#1d2822] outline-none focus:text-[#a47b46]">
                  {[1, 2, 3, 4].map((count) => <option key={count} value={count}>{count} guest{count > 1 ? "s" : ""}</option>)}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute bottom-0 right-0 text-[#a47b46]" />
              </span>
            </label>
            <button type="submit" className="flex items-center justify-center gap-3 bg-[#b39870] px-7 py-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1d2822] transition hover:bg-[#c8ac83]">
              Find a room <ArrowRight size={15} />
            </button>
          </form>
        </section>

        <section id="stay" className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20 lg:px-10 lg:py-28">
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/3] overflow-hidden bg-[#dfd9cb]">
              <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1100&q=85" alt="Quiet hotel lounge with natural textures" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-5 right-4 flex items-center gap-3 bg-[#1d2822] px-5 py-4 text-white sm:right-[-18px]">
              <Star size={16} className="fill-[#d8bd91] text-[#d8bd91]" />
              <span className="font-serif text-xl">Made for slowing down</span>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a47b46]">A thoughtful place to land</p>
            <h2 className="mt-5 max-w-xl font-serif text-4xl font-normal leading-tight tracking-tight sm:text-5xl">
              The city outside.<br /><span className="text-[#9b8666]">Your sanctuary inside.</span>
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[#6c7068]">
              At {settings.name}, good hospitality is found in the details: a soft landing after a long day, a friendly face who knows the neighborhood, and the freedom to make the stay your own.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-5 border-t border-[#dedacf] pt-6 sm:grid-cols-3">
              {[
                [Wifi, "Thoughtful comforts"],
                [Coffee, "Slow mornings"],
                [ShieldCheck, "Care in every detail"],
              ].map(([Icon, text]) => (
                <div key={text} className="flex items-start gap-3">
                  <Icon size={17} className="mt-0.5 shrink-0 text-[#a47b46]" />
                  <span className="text-[11px] leading-5 text-[#555a51]">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="rooms" className="bg-[#eeece5] px-6 py-20 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a47b46]">Rest, your way</p>
                <h2 className="mt-4 font-serif text-4xl font-normal tracking-tight sm:text-5xl">Rooms with room to be.</h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-[#6c7068]">
                {availableRooms.length} room {availableRooms.length === 1 ? "style is" : "styles are"} available for your selected dates.
              </p>
            </div>

            {availableRooms.length ? (
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {availableRooms.slice(0, 3).map((room, index) => <RoomCard key={room.id} room={room} index={index} onSelect={selectRoom} />)}
              </div>
            ) : (
              <div className="mt-10 border border-[#d9d4c8] bg-[#fbfaf7] px-6 py-12 text-center">
                <CalendarDays className="mx-auto text-[#a47b46]" size={25} />
                <h3 className="mt-4 font-serif text-2xl">No rooms for these dates</h3>
                <p className="mt-2 text-sm text-[#77796f]">Try different dates or a smaller guest count to see what’s available.</p>
              </div>
            )}
            {rooms.length > 0 && (
              <div className="mt-9 text-center">
                <a href="#all-rooms" className="inline-flex items-center gap-2 border-b border-[#b39870] pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1d2822] transition hover:text-[#a47b46]">
                  View all {rooms.length} rooms <ArrowRight size={14} />
                </a>
              </div>
            )}
          </div>
        </section>

        <section id="experience" className="relative overflow-hidden bg-[#1d2822] px-6 py-20 text-white lg:px-10 lg:py-24">
          <div className="absolute -right-32 -top-40 h-[520px] w-[520px] rounded-full border border-white/10" />
          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#d8bd91]">More than a room</p>
              <h2 className="mt-5 font-serif text-4xl font-normal leading-tight sm:text-5xl">A little more<br />like you belong.</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/65">Our team is here to make the small things easy and the good moments last a little longer.</p>
              <a href="#contact" className="mt-8 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#e2c99e]">Get to know us <ArrowRight size={14} /></a>
            </div>
            <div className="grid gap-px bg-white/10 sm:grid-cols-3">
              {[
                [Clock3, "Easy arrivals", "A warm welcome, whenever you get here."],
                [MapPin, "Local insight", "The neighborhood, shared by people who know it."],
                [Sparkles, "Little details", "The thoughtful touches that make it yours."],
              ].map(([Icon, title, copy]) => (
                <div key={title} className="bg-[#1d2822] px-6 py-8">
                  <Icon size={20} className="text-[#d8bd91]" />
                  <h3 className="mt-7 font-serif text-xl">{title}</h3>
                  <p className="mt-3 text-xs leading-6 text-white/55">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
          </>
        )}
      </main>

      <footer id="contact" className="bg-[#fbfaf7] px-6 py-12 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d2822] text-[#d8bd91]"><Hotel size={19} /></span>
              <span className="font-serif text-2xl">{settings.name}</span>
            </div>
            <p className="mt-4 max-w-xs text-xs leading-6 text-[#77796f]">A considered city stay, with a little more warmth in every detail.</p>
          </div>
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a47b46]">Find us</h3>
            <p className="mt-4 flex gap-2 text-xs leading-6 text-[#555a51]"><MapPin size={14} className="mt-1 shrink-0 text-[#a47b46]" />{settings.address}</p>
          </div>
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a47b46]">Say hello</h3>
            <a href={`tel:${settings.phone}`} className="mt-4 flex items-center gap-2 text-xs text-[#555a51]"><Phone size={14} className="text-[#a47b46]" />{settings.phone}</a>
            <a href={`mailto:${settings.email}`} className="mt-3 block text-xs text-[#555a51]">{settings.email}</a>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl flex-wrap justify-between gap-3 border-t border-[#e8e4da] pt-5 text-[9px] uppercase tracking-[0.12em] text-[#929087]">
          <span>© {new Date().getFullYear()} {settings.name}. All rights reserved.</span>
          <span>Made for meaningful stays</span>
        </div>
      </footer>

      {selectedRoom && !bookingStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#111812]/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="room-detail-title">
          <div className="my-auto w-full max-w-3xl overflow-hidden bg-[#fbfaf7] shadow-2xl">
            <div className="relative h-64 bg-[#28342d] sm:h-80">
              <RoomImage room={selectedRoom} className="h-full w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101915]/75 via-transparent to-transparent" />
              <button onClick={closeRoomDialog} aria-label="Close room details" className="absolute right-4 top-4 rounded-full bg-[#fbfaf7]/90 p-2 text-[#1d2822] hover:bg-white"><X size={19} /></button>
              <span className="absolute bottom-5 left-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e2c99e]">{selectedRoom.type}</span>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 id="room-detail-title" className="font-serif text-3xl sm:text-4xl">{selectedRoom.name}</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#77796f]">{selectedRoom.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-2xl">{money(selectedRoom.price * (1 - (selectedRoom.discount || 0) / 100))}</p>
                  <p className="text-[10px] text-[#77796f]">per night{selectedRoom.discount > 0 ? ` · ${selectedRoom.discount}% off` : ""}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 border-y border-[#e9e5db] py-5 text-xs text-[#555a51] sm:grid-cols-2">
                <p className="flex items-center gap-2"><BedDouble size={16} className="text-[#a47b46]" />{selectedRoom.beds}</p>
                <p className="flex items-center gap-2"><Users size={16} className="text-[#a47b46]" />Up to {selectedRoom.capacity} guests</p>
              </div>
              <div className="mt-5">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a47b46]">Room amenities</h3>
                {selectedRoom.amenities.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedRoom.amenities.map((amenity) => (
                      <span key={amenity} className="flex items-center gap-2 rounded-full bg-[#eeece5] px-3 py-2 text-xs text-[#555a51]"><Check size={13} className="text-[#a47b46]" />{amenity}</span>
                    ))}
                  </div>
                ) : <p className="mt-3 text-xs text-[#77796f]">Please contact us for amenity details.</p>}
              </div>
              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#e8e4da] pt-5 sm:flex-row sm:justify-end">
                <button onClick={closeRoomDialog} className="border border-[#dedacf] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#555a51] hover:bg-[#f3f1eb]">Close</button>
                <button
                  onClick={() => setBookingStep(true)}
                  disabled={selectedRoom.status !== "Available"}
                  className="flex items-center justify-center gap-2 bg-[#1d2822] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#34483c] disabled:cursor-not-allowed disabled:bg-[#9a9b91]"
                >
                  {selectedRoom.status === "Available" ? "Book this room" : "Currently unavailable"} <ArrowRight size={14} className="text-[#d8bd91]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedRoom && bookingStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#111812]/75 p-4 backdrop-blur-sm">
          <div className="my-auto grid w-full max-w-3xl overflow-hidden bg-[#fbfaf7] shadow-2xl md:grid-cols-[0.8fr_1.2fr]">
            <div className="relative hidden min-h-[600px] bg-[#28342d] md:block">
              <RoomImage room={selectedRoom} className="absolute inset-0 h-full w-full opacity-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101915]/90 via-transparent to-[#101915]/10" />
              <div className="absolute bottom-7 left-7 right-7 text-white">
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#e2c99e]">{selectedRoom.type}</p>
                <h2 className="mt-2 font-serif text-3xl">{selectedRoom.name}</h2>
                <p className="mt-3 text-xs leading-5 text-white/75">{selectedRoom.description}</p>
                <p className="mt-5 border-t border-white/20 pt-4 text-xs">{nights} nights · {guestCount} guests</p>
                <p className="mt-1 font-serif text-xl">{money(roomPrice)} <span className="font-sans text-[10px] text-white/60">estimated total</span></p>
              </div>
            </div>
            <div className="relative p-6 sm:p-8">
              <button onClick={closeRoomDialog} aria-label="Close booking form" className="absolute right-4 top-4 p-2 text-[#77796f] hover:text-[#1d2822]"><X size={19} /></button>
              <button type="button" onClick={() => setBookingStep(false)} className="mb-4 text-[9px] font-bold uppercase tracking-[0.14em] text-[#a47b46] hover:text-[#1d2822]">Back to room details</button>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a47b46]">Your stay starts here</p>
              <h2 className="mt-2 font-serif text-3xl">Request a booking</h2>
              <p className="mt-2 text-xs leading-5 text-[#77796f]">Share a few details and our team will confirm your reservation.</p>
              <form onSubmit={submitBooking} className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-[10px] font-semibold text-[#555a51]">Check in<input type="date" min={today} value={checkIn} onChange={(event) => setCheckIn(event.target.value)} className="mt-1.5 w-full border border-[#dedacf] bg-white px-3 py-2.5 text-xs outline-none focus:border-[#b39870]" required /></label>
                  <label className="text-[10px] font-semibold text-[#555a51]">Check out<input type="date" min={checkIn || today} value={checkOut} onChange={(event) => setCheckOut(event.target.value)} className="mt-1.5 w-full border border-[#dedacf] bg-white px-3 py-2.5 text-xs outline-none focus:border-[#b39870]" required /></label>
                </div>
                <label className="block text-[10px] font-semibold text-[#555a51]">Full name<input name="guest" autoComplete="name" className="mt-1.5 w-full border border-[#dedacf] bg-white px-3 py-2.5 text-xs outline-none focus:border-[#b39870]" required /></label>
                <label className="block text-[10px] font-semibold text-[#555a51]">Email address<input name="email" type="email" autoComplete="email" className="mt-1.5 w-full border border-[#dedacf] bg-white px-3 py-2.5 text-xs outline-none focus:border-[#b39870]" required /></label>
                <label className="block text-[10px] font-semibold text-[#555a51]">Phone number<input name="phone" type="tel" autoComplete="tel" className="mt-1.5 w-full border border-[#dedacf] bg-white px-3 py-2.5 text-xs outline-none focus:border-[#b39870]" required /></label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-[10px] font-semibold text-[#555a51]">Guests<select value={guestCount} onChange={(event) => setGuestCount(event.target.value)} className="mt-1.5 w-full border border-[#dedacf] bg-white px-3 py-2.5 text-xs outline-none">{Array.from({ length: selectedRoom.capacity }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count} guest{count > 1 ? "s" : ""}</option>)}</select></label>
                  <label className="text-[10px] font-semibold text-[#555a51]">Promo code <span className="font-normal text-[#929087]">(optional)</span><input name="code" placeholder="WELCOME10" className="mt-1.5 w-full border border-[#dedacf] bg-white px-3 py-2.5 text-xs uppercase outline-none focus:border-[#b39870]" /></label>
                </div>
                <div className="flex items-start gap-2 border-t border-[#e8e4da] pt-4 text-[10px] leading-5 text-[#77796f]"><ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#a47b46]" />No payment is taken now. Your request will be reviewed by our team.</div>
                <button type="submit" className="flex w-full items-center justify-center gap-2 bg-[#1d2822] px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#34483c]">Send booking request <ArrowRight size={14} className="text-[#d8bd91]" /></button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
