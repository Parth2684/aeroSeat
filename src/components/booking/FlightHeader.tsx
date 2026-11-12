import { CircleHelp, Moon, Plane, Sun } from "lucide-react";

export function FlightHeader({
  dark,
  onToggleTheme,
}: {
  dark: boolean;
  onToggleTheme: () => void;
}) {
  return (
    <>
      <header className="topbar">
        <a href="/" className="brand">
          <span className="brand-mark">
            <Plane size={19} />
          </span>
          <span>
            AeroSeat<span className="brand-dot">.</span>
          </span>
        </a>
        <div className="topbar-right">
          <span className="support-link">
            <CircleHelp size={17} /> Help center
          </span>
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
            title={`Switch to ${dark ? "light" : "dark"} mode`}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
            <span>{dark ? "Light" : "Dark"}</span>
          </button>
          <button className="avatar" aria-label="Account">
            JD
          </button>
        </div>
      </header>

      <section className="flight-card">
        <div className="flight-main">
          <div className="airline-icon">
            <Plane size={22} />
          </div>
          <div>
            <div className="flight-label">
              YOUR FLIGHT <span>·</span> WF 204
            </div>
            <div className="route">
              <strong>New York</strong>
              <span className="route-line">
                <i />
                <Plane size={16} />
                <i />
              </span>
              <strong>London</strong>
            </div>
          </div>
        </div>
        <div className="flight-meta">
          <div>
            <span>DEPARTURE</span>
            <strong>Tue, 24 Sep · 8:45 PM</strong>
          </div>
          <div>
            <span>FLIGHT TIME</span>
            <strong>6h 55m · Nonstop</strong>
          </div>
          <div>
            <span>AIRCRAFT</span>
            <strong>Boeing 787-9</strong>
          </div>
        </div>
      </section>
    </>
  );
}
