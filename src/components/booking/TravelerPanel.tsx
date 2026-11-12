import { Check } from "lucide-react";
import { BookingSelect } from "./BookingSelect";
import type { Seat } from "./bookingData";
import { money } from "./bookingData";

export function TravelerPanel({
  count,
  selectedCount,
  passengers,
  assignments,
  seatById,
  active,
  activeSeat,
  onCountChange,
  onSelectTraveler,
}: {
  count: number;
  selectedCount: number;
  passengers: number[];
  assignments: Record<number, string>;
  seatById: Map<string, Seat>;
  active: number;
  activeSeat?: Seat;
  onCountChange: (count: number) => void;
  onSelectTraveler: (id: number) => void;
}) {
  return (
    <section className="traveler-panel panel">
      <div className="traveler-panel-heading">
        <div>
          <span className="eyebrow">PASSENGERS</span>
          <h2>Travelers</h2>
          <p>
            {selectedCount} of {count} seats selected
          </p>
        </div>
        <div className="passenger-count">
          <span>Party size</span>
          <span className="count-select">
            <BookingSelect
              value={String(count)}
              ariaLabel="Number of passengers"
              options={[1, 2, 3, 4, 5, 6].map((number) => ({
                value: String(number),
                label: `${number} ${number === 1 ? "traveler" : "travelers"}`,
                description: `${number} seat${number === 1 ? "" : "s"} in this booking`,
              }))}
              onChange={(value) => onCountChange(Number(value))}
            />
          </span>
        </div>
      </div>
      <div className="traveler-list" role="tablist" aria-label="Choose traveler">
        {passengers.map((id) => (
          <button
            role="tab"
            aria-selected={active === id}
            className={`traveler-tab ${active === id ? "is-active" : ""}`}
            key={id}
            onClick={() => onSelectTraveler(id)}
          >
            <span className="tab-number">{assignments[id] ? <Check size={17} /> : id + 1}</span>
            <span className="traveler-tab-copy">
              <strong>Traveler {id + 1}</strong>
              <small>
                {assignments[id]
                  ? `Seat ${assignments[id]} · ${money(seatById.get(assignments[id])?.price ?? 0)}`
                  : "Choose a seat"}
              </small>
            </span>
            {active === id && <span className="tab-active-dot" />}
          </button>
        ))}
      </div>
      <div className="active-traveler-hint">
        <span className="hint-dot" />
        Selecting for <strong>Traveler {active + 1}</strong>
        {activeSeat && (
          <span className="hint-seat">
            Seat {activeSeat.id} · {money(activeSeat.price)}
          </span>
        )}
      </div>
    </section>
  );
}
