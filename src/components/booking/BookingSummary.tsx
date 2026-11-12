import { ArrowRight, Check, Utensils } from "lucide-react";
import type { Meal, Seat } from "./bookingData";
import { mealOptions, money } from "./bookingData";

export function BookingSummary({
  passengers,
  active,
  count,
  assignments,
  meals,
  seatById,
  seatTotal,
  mealTotal,
  total,
  selectedCount,
  activeMeal,
  onSelectMeal,
  onContinue,
}: {
  passengers: number[];
  active: number;
  count: number;
  assignments: Record<number, string>;
  meals: Record<number, string>;
  seatById: Map<string, Seat>;
  seatTotal: number;
  mealTotal: number;
  total: number;
  selectedCount: number;
  activeMeal: string;
  onSelectMeal: (meal: string) => void;
  onContinue: () => void;
}) {
  return (
    <aside className="summary-column">
      <section className="panel meal-panel">
        <div className="panel-heading compact">
          <div>
            <span className="eyebrow">EXTRA COMFORT</span>
            <h2>
              <Utensils size={19} /> Choose a meal
            </h2>
            <p>Optional · select for Traveler {active + 1}</p>
          </div>
        </div>
        <div className="meal-options">
          {mealOptions.map((meal: Meal) => (
            <button
              key={meal.id}
              className={`meal-option ${activeMeal === meal.id ? "meal-selected" : ""}`}
              onClick={() => onSelectMeal(meal.id)}
              aria-pressed={activeMeal === meal.id}
            >
              <span className="meal-radio">{activeMeal === meal.id && <span />}</span>
              <span className="meal-copy">
                <strong>{meal.name}</strong>
                <small>{meal.detail}</small>
              </span>
              <span className="meal-price">{money(meal.price)}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel cost-panel">
        <div className="summary-title">
          <div>
            <span className="eyebrow">YOUR SELECTION</span>
            <h2>Price summary</h2>
          </div>
          <span className="currency-pill">INR</span>
        </div>
        <div className="summary-passengers">
          {passengers.map((id) => (
            <div className="summary-person" key={id}>
              <span className="summary-person-name">
                Traveler {id + 1}
                <small>
                  {assignments[id] ? `Seat ${assignments[id]}` : "Seat not selected"}
                  {meals[id] && meals[id] !== "none"
                    ? ` · ${mealOptions.find((meal) => meal.id === meals[id])?.name}`
                    : ""}
                </small>
              </span>
              <strong>
                {money(
                  (seatById.get(assignments[id] ?? "")?.price ?? 0) +
                    (mealOptions.find((meal) => meal.id === meals[id])?.price ?? 0),
                )}
              </strong>
            </div>
          ))}
        </div>
        <div className="cost-divider" />
        <div className="cost-line">
          <span>Seat selection</span>
          <strong>{money(seatTotal)}</strong>
        </div>
        <div className="cost-line">
          <span>Meals</span>
          <strong>{money(mealTotal)}</strong>
        </div>
        <div className="cost-divider" />
        <div className="cost-total">
          <span>
            Total{" "}
            <small>
              {selectedCount} of {count} seats selected
            </small>
          </span>
          <strong>{money(total)}</strong>
        </div>
        <button className="continue-button" onClick={onContinue}>
          Continue to review <ArrowRight size={18} />
        </button>
        <p className="summary-note">You can change your selections before checkout.</p>
      </section>
      <div className="secure-note">
        <Check size={16} /> Your selections are saved for this session
      </div>
    </aside>
  );
}
