import { create } from "zustand";

export type Layout = "3-2" | "2-3-2";

type BookingState = {
  count: number;
  layout: Layout;
  active: number;
  assignments: Record<number, string>;
  meals: Record<number, string>;
  setCount: (count: number) => void;
  setLayout: (layout: Layout) => void;
  setActive: (active: number) => void;
  assign: (seat: string) => void;
  removeSeat: () => void;
  setMeal: (meal: string) => void;
};

export const useBooking = create<BookingState>((set, get) => ({
  count: 2,
  layout: "3-2",
  active: 0,
  assignments: {},
  meals: {},
  setCount: (count) =>
    set((state) => ({
      count,
      active: Math.min(state.active, count - 1),
      assignments: Object.fromEntries(
        Object.entries(state.assignments).filter(([id]) => Number(id) < count),
      ),
      meals: Object.fromEntries(
        Object.entries(state.meals).filter(([id]) => Number(id) < count),
      ),
    })),
  setLayout: (layout) =>
    set((state) => {
      const validLetters =
        layout === "3-2"
          ? ["A", "B", "C", "D", "E"]
          : ["A", "B", "D", "E", "F", "G", "H"];
      return {
        layout,
        assignments: Object.fromEntries(
          Object.entries(state.assignments).filter(([, seat]) =>
            validLetters.includes(seat.slice(-1)),
          ),
        ),
      };
    }),
  setActive: (active) => set({ active }),
  assign: (seat) =>
    set((state) => ({
      assignments: {
        ...Object.fromEntries(
          Object.entries(state.assignments).filter(([, value]) => value !== seat),
        ),
        [state.active]: seat,
      },
    })),
  removeSeat: () => {
    const { active, assignments } = get();
    const nextAssignments = { ...assignments };
    delete nextAssignments[active];
    set({ assignments: nextAssignments });
  },
  setMeal: (meal) =>
    set((state) => ({ meals: { ...state.meals, [state.active]: meal } })),
}));
