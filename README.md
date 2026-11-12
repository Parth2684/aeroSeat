# Wayfare Seat Selection

A responsive flight seat selection interface built with React and Bun. Travelers can choose seats from an interactive cabin map, assign a different seat to each passenger, compare seat fees, and review the total before continuing.

## Features

- Interactive seat maps for 3–2 and 2–3–2 cabin layouts
- Clear seat states for standard, extra legroom, premium, selected, and occupied seats
- Passenger count selection and per-passenger seat assignment
- Seat conflict prevention, assignment clearing, and automatic removal of seats that do not exist after a layout change
- Live seat fee summary in INR
- Responsive layout for desktop, tablet, and mobile screens
- Accessible labels and status feedback for key controls

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
