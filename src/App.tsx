import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { BookingSummary } from "./components/booking/BookingSummary";
import { FlightHeader } from "./components/booking/FlightHeader";
import { SeatMapPanel } from "./components/booking/SeatMapPanel";
import { TravelerPanel } from "./components/booking/TravelerPanel";
import { createSeats, mealOptions, money } from "./components/booking/bookingData";
import type { Seat } from "./components/booking/bookingData";
import { useBooking, type Layout } from "./stores/useStore";
import "./index.css";

export function App() {
  const {
    count,
    layout,
    active,
    assignments,
    meals,
    setCount,
    setLayout,
    setActive,
    assign,
    removeSeat,
    setMeal,
  } = useBooking();
  const [message, setMessage] = useState("");
  const [dark, setDark] = useState(
    () =>
      typeof localStorage !== "undefined" &&
      localStorage.getItem("wayfare-theme") === "dark",
  );

  useEffect(() => {
    localStorage.setItem("wayfare-theme", dark ? "dark" : "light");
  }, [dark]);

  const seats = useMemo(() => createSeats(layout), [layout]);
  const seatById = useMemo(
    () => new Map(seats.map((seat) => [seat.id, seat])),
    [seats],
  );
  const activeSeat = seatById.get(assignments[active] ?? "");
  const occupiedCount = seats.filter((seat) => seat.occupied).length;
  const seatTotal = Object.values(assignments).reduce(
    (sum, id) => sum + (seatById.get(id)?.price ?? 0),
    0,
  );
  const mealTotal = Object.values(meals).reduce(
    (sum, id) => sum + (mealOptions.find((meal) => meal.id === id)?.price ?? 0),
    0,
  );
  const total = seatTotal + mealTotal;
  const passengers = Array.from({ length: count }, (_, id) => id);
  const selectedCount = Object.keys(assignments).length;
  const activeMeal = meals[active] ?? "none";

  function chooseSeat(seat: Seat) {
    if (seat.occupied) return;
    const owner = Object.entries(assignments).find(
      ([, assigned]) => assigned === seat.id,
    );
    if (owner && Number(owner[0]) !== active) {
      setMessage(
        `${seat.id} is assigned to Traveler ${Number(owner[0]) + 1}. Choose another seat or switch to that traveler.`,
      );
      return;
    }
    assign(seat.id);
    setMessage(`${seat.id} assigned to Traveler ${active + 1} · ${money(seat.price)}.`);
  }

  function clearActiveSeat() {
    if (!activeSeat) return;
    removeSeat();
    setMessage(`Seat ${activeSeat.id} removed from Traveler ${active + 1}.`);
  }

  function continueToReview() {
    setMessage(
      selectedCount < count
        ? `Choose seats for ${count - selectedCount} more traveler${count - selectedCount === 1 ? "" : "s"} to continue.`
        : "All seats are selected. Your choices are ready for review.",
    );
  }

  return (
    <div className={`app-shell ${dark ? "theme-dark" : ""}`}>
      <FlightHeader dark={dark} onToggleTheme={() => setDark((value) => !value)} />
      <main className="page-wrap">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <span>Flights</span><span className="crumb-sep">/</span>
          <strong>Choose your seats</strong>
        </nav>
        <div className="step-heading">
          <div>
            <span className="step-kicker">STEP 2 OF 3</span>
            <h1>Make this flight yours</h1>
            <p>Choose a seat and meal for each traveler. Your selections are saved as you go.</p>
          </div>
          <div className="step-track" aria-label="Step 2 of 3">
            <span className="done"><Check size={15} /></span><i />
            <span className="current">2</span><i /><span>3</span>
          </div>
        </div>
        <div className="content-grid">
          <TravelerPanel
            count={count}
            selectedCount={selectedCount}
            passengers={passengers}
            assignments={assignments}
            seatById={seatById}
            active={active}
            activeSeat={activeSeat}
            onCountChange={(nextCount) => {
              setCount(nextCount);
              setMessage("");
            }}
            onSelectTraveler={(id) => {
              setActive(id);
              setMessage("");
            }}
          />
          <SeatMapPanel
            layout={layout}
            seats={seats}
            active={active}
            assignments={assignments}
            activeSeat={activeSeat}
            occupiedCount={occupiedCount}
            message={message}
            onLayoutChange={(nextLayout: Layout) => {
              setLayout(nextLayout);
              setMessage("Seat layout updated. Any incompatible seat assignments were cleared.");
            }}
            onSelectSeat={chooseSeat}
            onRemoveSeat={clearActiveSeat}
          />
          <BookingSummary
            passengers={passengers}
            active={active}
            count={count}
            assignments={assignments}
            meals={meals}
            seatById={seatById}
            seatTotal={seatTotal}
            mealTotal={mealTotal}
            total={total}
            selectedCount={selectedCount}
            activeMeal={activeMeal}
            onSelectMeal={setMeal}
            onContinue={continueToReview}
          />
        </div>
        <footer className="page-footer">
          © 2024 Wayfare Airways <span>·</span> Seat selection
        </footer>
      </main>
    </div>
  );
}

export default App;
