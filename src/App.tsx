import { useEffect, useMemo, useState } from "react";
import { create } from "zustand";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Armchair, ArrowRight, Check, ChevronDown, CircleHelp, Moon, Plane, Sun, Utensils, X } from "lucide-react";
import "./index.css";

type Layout = "3-2" | "2-3-2";
type SeatKind = "standard" | "extra" | "premium";
type Seat = { id: string; row: number; letter: string; price: number; kind: SeatKind; occupied: boolean; column: number };
type Meal = { id: string; name: string; detail: string; price: number };
type BookingState = {
  count: number; layout: Layout; active: number; assignments: Record<number, string>; meals: Record<number, string>;
  setCount: (count: number) => void; setLayout: (layout: Layout) => void; setActive: (active: number) => void;
  assign: (seat: string) => void; removeSeat: () => void; setMeal: (meal: string) => void;
};

const useBooking = create<BookingState>((set, get) => ({
  count: 2, layout: "3-2", active: 0, assignments: {}, meals: {},
  setCount: (count) => set((s) => ({ count, active: Math.min(s.active, count - 1), assignments: Object.fromEntries(Object.entries(s.assignments).filter(([i]) => Number(i) < count)), meals: Object.fromEntries(Object.entries(s.meals).filter(([i]) => Number(i) < count)) })),
  setLayout: (layout) => set((s) => {
    const letters = layout === "3-2" ? ["A", "B", "C", "D", "E"] : ["A", "B", "D", "E", "F", "G", "H"];
    return { layout, assignments: Object.fromEntries(Object.entries(s.assignments).filter(([, seat]) => letters.includes(seat.slice(-1)))) };
  }),
  setActive: (active) => set({ active }),
  assign: (seat) => set((s) => ({ assignments: { ...Object.fromEntries(Object.entries(s.assignments).filter(([, value]) => value !== seat)), [s.active]: seat } })),
  removeSeat: () => { const { active, assignments } = get(); const next = { ...assignments }; delete next[active]; set({ assignments: next }); },
  setMeal: (meal) => set((s) => ({ meals: { ...s.meals, [s.active]: meal } })),
}));

const mealOptions: Meal[] = [
  { id: "none", name: "No meal", detail: "Skip meal selection", price: 0 },
  { id: "vegetarian", name: "Garden pasta", detail: "Vegetarian · served warm", price: 0 },
  { id: "chicken", name: "Roast chicken", detail: "Chicken · seasonal sides", price: 450 },
  { id: "vegan", name: "Vegan bowl", detail: "Plant based · gluten free", price: 300 },
];
const money = (price: number) => `₹${price.toLocaleString("en-IN")}`;

function createSeats(layout: Layout): Seat[] {
  const letters = layout === "3-2" ? ["A", "B", "C", "D", "E"] : ["A", "B", "D", "E", "F", "G", "H"];
  const occupied = new Set(["1A", "2E", "4B", "6D", "8A", "9H", "11C"]);
  return Array.from({ length: 12 }, (_, rowIndex) => letters.map((letter, i) => {
    const row = rowIndex + 1;
    const kind: SeatKind = row <= 2 && (i === 0 || i === letters.length - 1) ? "premium" : row === 7 ? "extra" : "standard";
    const price = kind === "premium" ? 250 : kind === "extra" ? 350 : 0;
    return { id: `${row}${letter}`, row, letter, kind, price, occupied: occupied.has(`${row}${letter}`), column: i + 1 + (layout === "3-2" ? (i > 2 ? 1 : 0) : (i > 1 ? 1 : 0) + (i > 4 ? 1 : 0)) };
  })).flat();
}

export function App() {
  return <BrowserRouter><Routes><Route path="*" element={<BookingPage />} /></Routes></BrowserRouter>;
}

function BookingPage() {
  const { count, layout, active, assignments, meals, setCount, setLayout, setActive, assign, removeSeat, setMeal } = useBooking();
  const [message, setMessage] = useState("");
  const [dark, setDark] = useState(() => typeof localStorage !== "undefined" && localStorage.getItem("wayfare-theme") === "dark");
  useEffect(() => { localStorage.setItem("wayfare-theme", dark ? "dark" : "light"); }, [dark]);

  const seats = useMemo(() => createSeats(layout), [layout]);
  const seatById = useMemo(() => new Map(seats.map((seat) => [seat.id, seat])), [seats]);
  const activeSeat = seatById.get(assignments[active] ?? "");
  const occupiedCount = seats.filter((seat) => seat.occupied).length;
  const seatTotal = Object.values(assignments).reduce((total, id) => total + (seatById.get(id)?.price ?? 0), 0);
  const mealTotal = Object.values(meals).reduce((total, id) => total + (mealOptions.find((meal) => meal.id === id)?.price ?? 0), 0);
  const total = seatTotal + mealTotal;
  const passengers = Array.from({ length: count }, (_, id) => id);
  const gridTemplate = layout === "3-2" ? "28px repeat(3, minmax(40px, 1fr)) 24px repeat(2, minmax(40px, 1fr))" : "28px repeat(2, minmax(38px, 1fr)) 22px repeat(3, minmax(38px, 1fr)) 22px repeat(2, minmax(38px, 1fr))";
  const labels = layout === "3-2" ? ["A", "B", "C", "", "D", "E"] : ["A", "B", "", "D", "E", "F", "", "G", "H"];
  const selectedCount = Object.keys(assignments).length;
  const activeMeal = meals[active] ?? "none";

  function chooseSeat(seat: Seat) {
    if (seat.occupied) return;
    const owner = Object.entries(assignments).find(([, assigned]) => assigned === seat.id);
    if (owner && Number(owner[0]) !== active) {
      setMessage(`${seat.id} is assigned to Traveler ${Number(owner[0]) + 1}. Choose another seat or switch to that traveler.`);
      return;
    }
    assign(seat.id);
    setMessage(`${seat.id} assigned to Traveler ${active + 1} · ${money(seat.price)}.`);
  }

  return <div className={`app-shell ${dark ? "theme-dark" : ""}`}>
    <header className="topbar"><Link to="/" className="brand"><span className="brand-mark"><Plane size={19} /></span><span>wayfare<span className="brand-dot">.</span></span></Link><div className="topbar-right"><span className="support-link"><CircleHelp size={17} /> Help center</span><button className="theme-toggle" onClick={() => setDark((value) => !value)} aria-label={`Switch to ${dark ? "light" : "dark"} mode`} title={`Switch to ${dark ? "light" : "dark"} mode`}>{dark ? <Sun size={18} /> : <Moon size={18} />}<span>{dark ? "Light" : "Dark"}</span></button><button className="avatar" aria-label="Account">JD</button></div></header>
    <main className="page-wrap">
      <nav className="breadcrumb" aria-label="Breadcrumb"><span>Flights</span><span className="crumb-sep">/</span><strong>Choose your seats</strong></nav>
      <section className="flight-card"><div className="flight-main"><div className="airline-icon"><Plane size={22} /></div><div><div className="flight-label">YOUR FLIGHT <span>·</span> WF 204</div><div className="route"><strong>New York</strong><span className="route-line"><i /><Plane size={16} /><i /></span><strong>London</strong></div></div></div><div className="flight-meta"><div><span>DEPARTURE</span><strong>Tue, 24 Sep · 8:45 PM</strong></div><div><span>FLIGHT TIME</span><strong>6h 55m · Nonstop</strong></div><div><span>AIRCRAFT</span><strong>Boeing 787-9</strong></div></div></section>
      <div className="step-heading"><div><span className="step-kicker">STEP 2 OF 3</span><h1>Make this flight yours</h1><p>Choose a seat and meal for each traveler. Your selections are saved as you go.</p></div><div className="step-track" aria-label="Step 2 of 3"><span className="done"><Check size={15} /></span><i /><span className="current">2</span><i /><span>3</span></div></div>
      <div className="content-grid">
        <section className="traveler-panel panel"><div className="traveler-panel-heading"><div><span className="eyebrow">PASSENGERS</span><h2>Travelers</h2><p>{selectedCount} of {count} seats selected</p></div><label className="passenger-count"><span>Party size</span><span className="count-select"><select value={count} onChange={(event) => { setCount(Number(event.target.value)); setMessage(""); }} aria-label="Number of passengers">{[1, 2, 3, 4, 5, 6].map((number) => <option key={number} value={number}>{number} {number === 1 ? "traveler" : "travelers"}</option>)}</select><ChevronDown size={16} /></span></label></div><div className="traveler-list" role="tablist" aria-label="Choose traveler">{passengers.map((id) => <button role="tab" aria-selected={active === id} className={`traveler-tab ${active === id ? "is-active" : ""}`} key={id} onClick={() => { setActive(id); setMessage(""); }}><span className="tab-number">{assignments[id] ? <Check size={17} /> : id + 1}</span><span className="traveler-tab-copy"><strong>Traveler {id + 1}</strong><small>{assignments[id] ? `Seat ${assignments[id]} · ${money(seatById.get(assignments[id])?.price ?? 0)}` : "Choose a seat"}</small></span>{active === id && <span className="tab-active-dot" />}</button>)}</div><div className="active-traveler-hint"><span className="hint-dot" />Selecting for <strong>Traveler {active + 1}</strong>{activeSeat && <span className="hint-seat">Seat {activeSeat.id} · {money(activeSeat.price)}</span>}</div></section>
        <section className="seat-panel panel"><div className="panel-heading"><div><span className="eyebrow">CABIN OVERVIEW</span><h2>Choose a seat</h2><p>{occupiedCount} occupied <span>·</span> {seats.length - occupiedCount} available</p></div><label className="layout-select"><span>Seat layout</span><select value={layout} onChange={(event) => { setLayout(event.target.value as Layout); setMessage("Seat layout updated. Any incompatible seat assignments were cleared."); }} aria-label="Aircraft seat layout"><option value="3-2">Narrowbody · 3–2</option><option value="2-3-2">Widebody · 2–3–2</option></select><ChevronDown size={16} /></label></div>
          <div className="seat-content"><div className="seat-legend"><span><i className="legend-box standard" />Standard <b>₹0</b></span><span><i className="legend-box extra" />Extra legroom <b>₹350</b></span><span><i className="legend-box premium" />Premium <b>₹250</b></span><span><i className="legend-box taken" />Occupied</span><span><i className="legend-box selected" />Your selection</span></div>
            <div className="seat-map-scroll"><div className={`plane-map layout-${layout}`}><div className="plane-nose"><Plane size={19} /><span>FRONT OF AIRCRAFT</span></div><div className="column-labels" style={{ gridTemplateColumns: gridTemplate }}><span className="row-label-space" />{labels.map((letter, index) => <span key={`${letter}-${index}`} className={letter ? "" : "aisle-label"}>{letter}</span>)}</div><div className="rows">{Array.from({ length: 12 }, (_, rowIndex) => { const row = rowIndex + 1; return <div className="seat-row" style={{ gridTemplateColumns: gridTemplate }} key={row}><span className="row-num">{row}</span>{seats.filter((seat) => seat.row === row).map((seat) => {
              const owner = Object.entries(assignments).find(([, assigned]) => assigned === seat.id)?.[0];
              const isActive = assignments[active] === seat.id;
              const isOtherPassenger = owner !== undefined && Number(owner) !== active;
              return <button key={seat.id} aria-label={`${seat.id}, ${seat.occupied ? "occupied" : `${seat.kind === "extra" ? "extra legroom" : seat.kind} seat, ${money(seat.price)}`}${isOtherPassenger ? `, assigned to Traveler ${Number(owner) + 1}` : ""}`} title={seat.occupied ? `${seat.id} · Occupied` : `${seat.id} · ${seat.kind === "extra" ? "Extra legroom" : seat.kind} · ${money(seat.price)}${isOtherPassenger ? ` · Traveler ${Number(owner) + 1}` : ""}`} className={`seat ${seat.kind} ${seat.occupied ? "occupied" : ""} ${owner !== undefined ? "chosen" : ""} ${isActive ? "active-seat" : ""} ${isOtherPassenger ? "other-seat" : ""}`} style={{ gridColumn: seat.column + 1 }} onClick={() => chooseSeat(seat)} disabled={seat.occupied} aria-pressed={owner !== undefined}>{seat.occupied ? <X size={15} /> : owner !== undefined ? <Check size={16} /> : <Armchair size={17} />}{!seat.occupied && <span className="seat-price-label">{money(seat.price)}</span>}<span className="seat-tooltip">{seat.id} · {money(seat.price)}</span></button>;
            })}</div>; })}</div><div className="plane-tail"><span>REAR OF AIRCRAFT</span><div className="tail-line" /></div></div></div>
            {message && <div className="inline-message" role="status">{message}</div>}
            <div className="pricing-note"><CircleHelp size={17} /><span><strong>Why are some seats included?</strong> Standard seats are included in your ticket. Extra legroom and premium seats have an added fee shown on the seat.</span></div>
          </div><div className="panel-foot"><span>Click an available seat to assign it to Traveler {active + 1}.</span>{activeSeat && <button className="clear-seat" onClick={() => { removeSeat(); setMessage(`Seat ${activeSeat.id} removed from Traveler ${active + 1}.`); }}>Remove seat <X size={15} /></button>}</div>
        </section>
        <aside className="summary-column"><section className="panel meal-panel"><div className="panel-heading compact"><div><span className="eyebrow">EXTRA COMFORT</span><h2><Utensils size={19} /> Choose a meal</h2><p>Optional · select for Traveler {active + 1}</p></div></div><div className="meal-options">{mealOptions.map((meal) => <button key={meal.id} className={`meal-option ${activeMeal === meal.id ? "meal-selected" : ""}`} onClick={() => setMeal(meal.id)} aria-pressed={activeMeal === meal.id}><span className="meal-radio">{activeMeal === meal.id && <span />}</span><span className="meal-copy"><strong>{meal.name}</strong><small>{meal.detail}</small></span><span className="meal-price">{money(meal.price)}</span></button>)}</div></section>
          <section className="panel cost-panel"><div className="summary-title"><div><span className="eyebrow">YOUR SELECTION</span><h2>Price summary</h2></div><span className="currency-pill">INR</span></div><div className="summary-passengers">{passengers.map((id) => <div className="summary-person" key={id}><span className="summary-person-name">Traveler {id + 1}<small>{assignments[id] ? `Seat ${assignments[id]}` : "Seat not selected"}{meals[id] && meals[id] !== "none" ? ` · ${mealOptions.find((meal) => meal.id === meals[id])?.name}` : ""}</small></span><strong>{money((seatById.get(assignments[id] ?? "")?.price ?? 0) + (mealOptions.find((meal) => meal.id === meals[id])?.price ?? 0))}</strong></div>)}</div><div className="cost-divider" /><div className="cost-line"><span>Seat selection</span><strong>{money(seatTotal)}</strong></div><div className="cost-line"><span>Meals</span><strong>{money(mealTotal)}</strong></div><div className="cost-divider" /><div className="cost-total"><span>Total <small>{selectedCount} of {count} seats selected</small></span><strong>{money(total)}</strong></div><button className="continue-button" onClick={() => setMessage(selectedCount < count ? `Choose seats for ${count - selectedCount} more traveler${count - selectedCount === 1 ? "" : "s"} to continue.` : "All seats are selected. Your choices are ready for review.")}>Continue to review <ArrowRight size={18} /></button><p className="summary-note">You can change your selections before checkout.</p></section><div className="secure-note"><Check size={16} /> Your selections are saved for this session</div></aside>
      </div><footer className="page-footer">© 2024 Wayfare Airways <span>·</span> Seat selection</footer>
    </main>
  </div>;
}

export default App;
