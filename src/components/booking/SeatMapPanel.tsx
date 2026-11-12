import { Armchair, Check, CircleHelp, Plane, X } from "lucide-react";
import { BookingSelect } from "./BookingSelect";
import type { Layout } from "../../stores/useStore";
import type { Seat } from "./bookingData";
import { money } from "./bookingData";

export function SeatMapPanel({
  layout,
  seats,
  active,
  assignments,
  activeSeat,
  occupiedCount,
  message,
  onLayoutChange,
  onSelectSeat,
  onRemoveSeat,
}: {
  layout: Layout;
  seats: Seat[];
  active: number;
  assignments: Record<number, string>;
  activeSeat?: Seat;
  occupiedCount: number;
  message: string;
  onLayoutChange: (layout: Layout) => void;
  onSelectSeat: (seat: Seat) => void;
  onRemoveSeat: () => void;
}) {
  const gridTemplate =
    layout === "3-2"
      ? "28px repeat(3, minmax(40px, 1fr)) 24px repeat(2, minmax(40px, 1fr))"
      : "28px repeat(2, minmax(38px, 1fr)) 22px repeat(3, minmax(38px, 1fr)) 22px repeat(2, minmax(38px, 1fr))";
  const labels =
    layout === "3-2" ? ["A", "B", "C", "", "D", "E"] : ["A", "B", "", "D", "E", "F", "", "G", "H"];

  return (
    <section className="seat-panel panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">CABIN OVERVIEW</span>
          <h2>Choose a seat</h2>
          <p>
            {occupiedCount} occupied <span>·</span> {seats.length - occupiedCount} available
          </p>
        </div>
        <div className="layout-select">
          <span>Seat layout</span>
          <BookingSelect
            value={layout}
            ariaLabel="Aircraft seat layout"
            options={[
              { value: "3-2", label: "Narrowbody · 3–2", description: "Five seats per row" },
              { value: "2-3-2", label: "Widebody · 2–3–2", description: "Seven seats per row" },
            ]}
            onChange={(value) => onLayoutChange(value as Layout)}
          />
        </div>
      </div>
      <div className="seat-content">
        <div className="seat-legend">
          <span>
            <i className="legend-box standard" />
            Standard <b>₹1,000</b>
          </span>
          <span>
            <i className="legend-box extra" />
            Extra legroom <b>₹3,500</b>
          </span>
          <span>
            <i className="legend-box premium" />
            Premium <b>₹2,500</b>
          </span>
          <span>
            <i className="legend-box taken" />
            Occupied
          </span>
          <span>
            <i className="legend-box selected" />
            Your selection
          </span>
        </div>
        <div className="seat-map-scroll">
          <div className={`plane-map layout-${layout}`}>
            <div className="plane-nose">
              <Plane size={19} />
              <span>FRONT OF AIRCRAFT</span>
            </div>
            <div className="column-labels" style={{ gridTemplateColumns: gridTemplate }}>
              <span className="row-label-space" />
              {labels.map((letter, index) => (
                <span key={`${letter}-${index}`} className={letter ? "" : "aisle-label"}>
                  {letter}
                </span>
              ))}
            </div>
            <div className="rows">
              {Array.from({ length: 12 }, (_, rowIndex) => {
                const row = rowIndex + 1;
                return (
                  <div className="seat-row" style={{ gridTemplateColumns: gridTemplate }} key={row}>
                    <span className="row-num">{row}</span>
                    {seats
                      .filter((seat) => seat.row === row)
                      .map((seat) => {
                        const owner = Object.entries(assignments).find(
                          ([, assigned]) => assigned === seat.id,
                        )?.[0];
                        const isActive = assignments[active] === seat.id;
                        const isOtherPassenger = owner !== undefined && Number(owner) !== active;
                        return (
                          <button
                            key={seat.id}
                            aria-label={`${seat.id}, ${seat.occupied ? "occupied" : `${seat.kind === "extra" ? "extra legroom" : seat.kind} seat, ${money(seat.price)}`}${isOtherPassenger ? `, assigned to Traveler ${Number(owner) + 1}` : ""}`}
                            title={
                              seat.occupied
                                ? `${seat.id} · Occupied`
                                : `${seat.id} · ${seat.kind === "extra" ? "Extra legroom" : seat.kind} · ${money(seat.price)}${isOtherPassenger ? ` · Traveler ${Number(owner) + 1}` : ""}`
                            }
                            className={`seat ${seat.kind} ${seat.occupied ? "occupied" : ""} ${owner !== undefined ? "chosen" : ""} ${isActive ? "active-seat" : ""} ${isOtherPassenger ? "other-seat" : ""}`}
                            style={{ gridColumn: seat.column + 1 }}
                            onClick={() => onSelectSeat(seat)}
                            disabled={seat.occupied}
                            aria-pressed={owner !== undefined}
                          >
                            {seat.occupied ? (
                              <X size={15} />
                            ) : owner !== undefined ? (
                              <Check size={16} />
                            ) : (
                              <Armchair size={17} />
                            )}
                            {!seat.occupied && (
                              <span className="seat-price-label">{money(seat.price)}</span>
                            )}
                            <span className="seat-tooltip">
                              {seat.id} · {money(seat.price)}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                );
              })}
            </div>
            <div className="plane-tail">
              <span>REAR OF AIRCRAFT</span>
              <div className="tail-line" />
            </div>
          </div>
        </div>
        {message && (
          <div className="inline-message" role="status">
            {message}
          </div>
        )}
        <div className="pricing-note">
          <CircleHelp size={17} />
          <span>
            <strong>Seat prices are shown in INR.</strong> Standard seats cost ₹1,000, premium seats
            cost ₹2,500, and extra legroom seats cost ₹3,500. The amount is printed on each
            available seat.
          </span>
        </div>
      </div>
      <div className="panel-foot">
        <span>Click an available seat to assign it to Traveler {active + 1}.</span>
        {activeSeat && (
          <button className="clear-seat" onClick={onRemoveSeat}>
            Remove seat <X size={15} />
          </button>
        )}
      </div>
    </section>
  );
}
