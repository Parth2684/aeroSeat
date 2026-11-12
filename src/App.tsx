import { useState } from "react";
import { create } from "zustand";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ArrowLeft, Armchair, Check, ChevronDown, Plane, X } from "lucide-react";
import "./index.css";

type Seat = { id: string; price: number; kind: "standard" | "extra" | "premium"; occupied?: boolean };
type State = { count: number; layout: "3-2" | "2-3-2"; active: number; assignments: Record<number, string>; setCount: (n: number) => void; setLayout: (s: State["layout"]) => void; setActive: (n: number) => void; assign: (seat: string) => void; remove: () => void };
const useBooking = create<State>((set, get) => ({
  count: 2, layout: "3-2", active: 0, assignments: {},
  setCount: (count) => set((s) => ({ count, active: Math.min(s.active, count - 1), assignments: Object.fromEntries(Object.entries(s.assignments).filter(([i]) => Number(i) < count)) })),
  setLayout: (layout) => set((s) => {
    const letters = layout === "3-2" ? ["A", "B", "C", "D", "E"] : ["A", "B", "C", "D", "E", "F", "G"];
    return { layout, assignments: Object.fromEntries(Object.entries(s.assignments).filter(([, seat]) => letters.includes(seat.slice(-1)))) };
  }), setActive: (active) => set({ active }),
  assign: (seat) => set((s) => ({ assignments: { ...Object.fromEntries(Object.entries(s.assignments).filter(([, value]) => value !== seat)), [s.active]: seat } })),
  remove: () => { const { active, assignments } = get(); const next = { ...assignments }; delete next[active]; set({ assignments: next }); },
}));

const rows = 12;
const makeSeats = (layout: State["layout"]): Seat[][] => Array.from({ length: rows }, (_, r) => {
  const letters = layout === "3-2" ? ["A", "B", "C", "D", "E"] : ["A", "B", "C", "D", "E", "F", "G"];
  return letters.map((letter, c) => {
    const id = `${r + 1}${letter}`, premium = r < 2, extra = c === 0 || c === letters.length - 1 || (layout === "3-2" && c === 2);
    return { id, kind: premium ? "premium" : extra ? "extra" : "standard", price: premium ? 250 : extra ? 350 : 0, occupied: ["1A", "2E", "4B", "6D", "8A", "9G", "11C"].includes(id) };
  });
});
const money = (n: number) => n === 0 ? "Free" : `₹${n}`;

export function App() {
  return <BrowserRouter><Routes><Route path="*" element={<BookingPage />} /></Routes></BrowserRouter>;
}

function BookingPage() {
  const { count, layout, active, assignments, setCount, setLayout, setActive, assign, remove } = useBooking();
  const [message, setMessage] = useState("");
  const seats = makeSeats(layout), selected = assignments[active], occupiedCount = seats.flat().filter((s) => s.occupied).length;
  const selectedSeat = seats.flat().find((s) => s.id === selected);
  const total = Object.values(assignments).reduce((sum, id) => sum + (seats.flat().find((s) => s.id === id)?.price ?? 0), 0);
  const columns = layout === "3-2" ? "repeat(3, minmax(32px, 42px)) 28px repeat(2, minmax(32px, 42px))" : "repeat(2, minmax(32px, 42px)) 24px repeat(3, minmax(32px, 42px)) 24px repeat(2, minmax(32px, 42px))";
  const gaps = layout === "3-2" ? ["3"] : ["2", "5"];
  const passengers = Array.from({ length: count }, (_, i) => ({ id: i, name: `Passenger ${i + 1}` }));
  function choose(seat: Seat) {
    if (seat.occupied) return;
    const owner = Object.entries(assignments).find(([, id]) => id === seat.id);
    if (owner && Number(owner[0]) !== active) { setMessage(`${seat.id} is assigned to Passenger ${Number(owner[0]) + 1}.`); return; }
    assign(seat.id); setMessage("");
  }
  return <div className="app-shell">
    <header className="topbar"><Link to="/" className="brand"><span className="brand-mark"><Plane size={17} /></span> wayfare<span className="brand-dot">.</span></Link><div className="topbar-right"><span>Need help?</span><button className="avatar" aria-label="Account">JD</button></div></header>
    <main className="page-wrap">
      <div className="breadcrumb"><button aria-label="Back"><ArrowLeft size={17} /></button><span>Flights</span><span className="crumb-sep">/</span><span>Choose your seats</span></div>
      <section className="flight-card"><div className="flight-main"><div className="airline-icon"><Plane size={20} /></div><div><div className="flight-label">YOUR FLIGHT <span>·</span> WF 204</div><div className="route"><strong>New York</strong><span className="route-line"><i></i><Plane size={14} /><i></i></span><strong>London</strong></div></div></div><div className="flight-meta"><div><span>DEPARTURE</span><strong>Tue, 24 Sep · 8:45 PM</strong></div><div><span>FLIGHT TIME</span><strong>6h 55m · Nonstop</strong></div><div><span>AIRCRAFT</span><strong>Boeing 787-9</strong></div></div></section>
      <div className="step-heading"><div><span className="step-kicker">STEP 2 OF 3</span><h1>Choose your seats</h1><p>Select a seat for each traveler. You can change your selection anytime.</p></div><div className="step-track" aria-label="Step 2 of 3"><span className="done"><Check size={13} /></span><i></i><span className="current">2</span><i></i><span>3</span></div></div>
      <div className="content-grid">
        <section className="seat-panel panel"><div className="panel-heading"><div><h2>Seat map</h2><p>{occupiedCount} seats occupied <span>·</span> {rows * (seats[0]?.length ?? 0) - occupiedCount} available</p></div><label className="layout-select"><select value={layout} onChange={(e) => { setLayout(e.target.value as State["layout"]); setMessage(""); }} aria-label="Seat layout"><option value="3-2">Economy · 3–2</option><option value="2-3-2">Widebody · 2–3–2</option></select><ChevronDown size={15} /></label></div>
          <div className="seat-content"><div className="seat-legend"><span><i className="legend-box standard"></i>Standard <b>Free</b></span><span><i className="legend-box extra"></i>Extra legroom <b>₹350</b></span><span><i className="legend-box premium"></i>Premium <b>₹250</b></span><span><i className="legend-box taken"></i>Occupied</span></div>
            <div className="plane-map"><div className="plane-nose"><span>FRONT</span></div><div className="column-labels" style={{ gridTemplateColumns: columns }}>{(layout === "3-2" ? ["A", "B", "C", "", "D", "E"] : ["A", "B", "", "C", "D", "E", "", "F", "G"]).map((x, i) => <span key={i}>{x}</span>)}</div><div className="rows">{seats.map((row, r) => <div className="seat-row" style={{ gridTemplateColumns: columns }} key={r}><span className="row-num">{r + 1}</span>{row.map((seat, c) => { const chosen = selected === seat.id || Object.values(assignments).includes(seat.id); const isActive = selected === seat.id; return <button key={seat.id} aria-label={`${seat.id}, ${seat.occupied ? "occupied" : money(seat.price)}`} title={`${seat.id} · ${seat.kind === "extra" ? "Extra legroom" : seat.kind === "premium" ? "Premium" : "Standard"} · ${money(seat.price)}`} className={`seat ${seat.kind} ${seat.occupied ? "occupied" : ""} ${chosen ? "chosen" : ""} ${isActive ? "active-seat" : ""}`} style={{ gridColumn: c + 1 + gaps.filter((n) => Number(n) <= c).length }} onClick={() => choose(seat)} disabled={seat.occupied}>{seat.occupied ? <X size={12} /> : chosen ? <Check size={12} /> : <Armchair size={14} />}</button>; })}</div>)}</div><div className="plane-tail"><span>BACK</span></div></div>
            {message && <div className="inline-message" role="status">{message}</div>}
          </div><div className="panel-foot"><span>{selected ? <button className="clear-seat" onClick={() => { remove(); setMessage(`Seat ${selected} cleared for Passenger ${active + 1}.`); }}>Clear this seat</button> : "Seat selection is optional"}</span><button onClick={() => { setActive((active + 1) % count); setMessage(""); }}>Next passenger <ArrowLeft className="next-arrow" size={15} /></button></div>
        </section>
        <aside className="summary-column"><section className="panel passengers"><div className="panel-heading"><div><h2>Travelers</h2><p>Assign a seat to each passenger</p></div><label className="count-select"><select value={count} onChange={(e) => setCount(Number(e.target.value))} aria-label="Number of passengers">{[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} {n === 1 ? "traveler" : "travelers"}</option>)}</select><ChevronDown size={14} /></label></div><div className="passenger-list">{passengers.map((person) => <button className={`passenger-row ${active === person.id ? "passenger-active" : ""}`} key={person.id} onClick={() => { setActive(person.id); setMessage(""); }} aria-pressed={active === person.id}><span className="passenger-avatar">{person.name.split(" ")[1]}</span><span className="passenger-info"><strong>{person.name}</strong><small>{assignments[person.id] ? `Seat ${assignments[person.id]}` : "Seat not selected"}</small></span><span className="passenger-price">{assignments[person.id] ? money(seats.flat().find((s) => s.id === assignments[person.id])?.price ?? 0) : "—"}</span>{active === person.id && <span className="active-indicator" />}</button>)}</div></section>
          <section className="panel cost-panel"><h2>Price summary</h2><div className="cost-line"><span>Seat selection <small>{Object.keys(assignments).length} of {count} selected</small></span><strong>{money(total)}</strong></div><div className="cost-divider"></div><div className="cost-total"><span>Total <small>All prices in INR</small></span><strong>{money(total)}</strong></div><button className="continue-button" onClick={() => { if (Object.keys(assignments).length < count) setMessage("Select a seat for each passenger to continue."); else setMessage("Seats confirmed for all passengers."); }}>Continue <ArrowLeft className="continue-arrow" size={16} /></button><p className="summary-note">You can review your seats before checkout.</p></section><div className="secure-note"><span>✓</span> Your seat selections are saved for this session</div></aside>
      </div><footer className="page-footer">© 2024 Wayfare Airways <span>·</span> Seat selection</footer>
    </main>
  </div>;
}

export default App;
