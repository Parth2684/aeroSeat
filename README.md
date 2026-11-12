# AeroSeat Seat Selection

A responsive flight seat and passenger management interface built with React and Bun. Travelers can select passengers, choose seats from an interactive cabin map, add optional meals, and review an itemized total before continuing.

## Features

- Interactive seat maps for 3–2 and 2–3–2 cabin layouts, with row numbers, seat letters, and aisle gaps
- Seat states for standard, extra legroom, premium, selected, and occupied seats, with the price printed on each available seat
- Passenger count selection, traveler tabs, and persistent per-passenger assignments while switching between travelers
- Seat conflict prevention, assignment removal, and automatic clearing of incompatible seats after a layout change
- Optional per-passenger meal selection, including included and paid meals
- Live itemized seat and meal price summary in INR
- Persistent light and dark themes
- Responsive layout for desktop, tablet, and mobile screens
- Accessible labels and status feedback for key controls

Mock seat prices are ₹1,000 for standard seats, ₹2,500 for premium seats, and ₹3,500 for extra legroom seats. Optional meals can be free or paid, and their charges are added to the booking total.

## State management and seat assignment

The Zustand store lives in [`src/stores/useStore.ts`](src/stores/useStore.ts). It keeps the passenger count, active passenger, cabin layout, seat assignments, and meal selections in one booking store. Assignments are keyed by passenger index. Switching passengers changes only the active index, so each traveler’s existing seat and meal remain selected.

When a traveler selects an available seat, the app checks that it is not occupied or assigned to another traveler before saving it. Each passenger has at most one seat; choosing a different seat replaces their previous one, and the remove-seat action clears it. Reducing the passenger count removes assignments for passengers who are no longer in the booking. Changing layouts clears assignments for seat labels that do not exist in the new cabin.

Seat and meal charges are calculated from the current selections and summed for the price summary. The totals update immediately when a seat or meal is selected, changed, or removed.

## Technology stack

- React 19 and TypeScript
- Bun 1.4 or newer for package management, development, typechecking, and builds
- Zustand 5
- Lucide React icons
- Tailwind CSS 4 (through the existing Bun Tailwind plugin)

## Prerequisites

Install [Bun](https://bun.sh/) 1.4 or newer. No separate Node.js installation is required for the Bun commands below.

## Installation

```bash
bun install
```

## Development

Start the hot-reloading development server:

```bash
bun run dev
```

The server prints its local URL when it starts.

## Typecheck

Run Bun's built-in TypeScript checker across the project:

```bash
bun run typecheck
```

## Production build

Create an optimized production build in `dist/`:

```bash
bun run build
```

Run the app with Bun in production mode:

```bash
bun run start
```
