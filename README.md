# Wayfare Seat Selection

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

## State management

Zustand stores the selected passenger count, active passenger, chosen cabin layout, seat assignments, and meal selections. A seat can appear in only one passenger assignment; occupied seats are disabled. Changing the active passenger keeps all other assignments intact, and changing cabin layouts removes assignments whose seat labels are not present in the new layout. The displayed total is derived from the current seat and meal selections, so it updates immediately after each change.

## Technology stack

- React 19 and TypeScript
- Bun 1.4 or newer for package management, development, typechecking, and builds
- React Router 7
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
