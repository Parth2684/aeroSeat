import type { Layout } from "../../stores/useStore";

export type SeatKind = "standard" | "extra" | "premium";
export type Seat = {
  id: string;
  row: number;
  letter: string;
  price: number;
  kind: SeatKind;
  occupied: boolean;
  column: number;
};
export type Meal = { id: string; name: string; detail: string; price: number };

export const mealOptions: Meal[] = [
  { id: "none", name: "No meal", detail: "Skip meal selection", price: 0 },
  { id: "vegetarian", name: "Garden pasta", detail: "Vegetarian · served warm", price: 100 },
  { id: "chicken", name: "Roast chicken", detail: "Chicken · seasonal sides", price: 450 },
  { id: "vegan", name: "Vegan bowl", detail: "Plant based · gluten free", price: 300 },
];

export const money = (price: number) => `₹${price.toLocaleString("en-IN")}`;

export function createSeats(layout: Layout): Seat[] {
  const letters = layout === "3-2"
    ? ["A", "B", "C", "D", "E"]
    : ["A", "B", "D", "E", "F", "G", "H"];
  const occupied = new Set(["1A", "2E", "4B", "6D", "8A", "9H", "11C"]);

  return Array.from({ length: 12 }, (_, rowIndex) =>
    letters.map((letter, index) => {
      const row = rowIndex + 1;
      const kind: SeatKind =
        row <= 2 && (index === 0 || index === letters.length - 1)
          ? "premium"
          : row === 7
            ? "extra"
            : "standard";
      const price = kind === "premium" ? 2500 : kind === "extra" ? 3500 : 1000;

      return {
        id: `${row}${letter}`,
        row,
        letter,
        kind,
        price,
        occupied: occupied.has(`${row}${letter}`),
        column:
          index +
          1 +
          (layout === "3-2"
            ? index > 2 ? 1 : 0
            : (index > 1 ? 1 : 0) + (index > 4 ? 1 : 0)),
      };
    }),
  ).flat();
}
