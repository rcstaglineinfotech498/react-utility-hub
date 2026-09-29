import { createElement, useEffect, useState } from "react";
import {
  HashRouter,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  CalendarDays,
  Calculator,
  CloudSun,
  Dice5,
  ExternalLink,
  Gauge,
  DollarSign,
  KeyRound,
  LayoutDashboard,
  Menu,
  Moon,
  Sun,
  Clapperboard,
  TimerReset,
  ArrowLeftRight,
  X,
} from "lucide-react";

// import { Button } from "./components/UI";
import { store, toggleTheme } from "./store";
import Dashboard from "./services/pages/Dashboard";
import CalculatorPage from "./services/pages/Calculator";
import AgeCalculator from "./services/pages/AgeCalculator";
import UnitConverter from "./services/pages/UnitConverter";
import CurrencyConverter from "./services/pages/CurrencyConverter";
import Weather from "./services/pages/Weather";
import Stopwatch from "./services/pages/Stopwatch";
import Timer from "./services/pages/Timer";
import PasswordGenerator from "./services/pages/PasswordGenerator";
import DiceRoller from "./services/pages/DiceRoller";
import UrlParser from "./services/pages/UrlParser";
import MovieSearch from "./services/pages/MovieSearch";
import MovieDetails from "./services/pages/MovieDetails";
import Settings from "./services/pages/Settings";
import "./App.css";

const tools = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/calculator", label: "Calculator", icon: Calculator },
  { path: "/age", label: "Age Calculator", icon: CalendarDays },
  { path: "/units", label: "Unit Converter", icon: ArrowLeftRight },
  { path: "/currency", label: "Currency", icon: DollarSign },
  { path: "/weather", label: "Weather", icon: CloudSun },
  { path: "/stopwatch", label: "Stopwatch", icon: Gauge },
  { path: "/timer", label: "Countdown Timer", icon: TimerReset },
  { path: "/password", label: "Password Generator", icon: KeyRound },
  { path: "/dice", label: "Dice Roller", icon: Dice5 },
  { path: "/url", label: "URL Parser", icon: ExternalLink },
  { path: "/movies", label: "Movie Search", icon: Clapperboard },
];

function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.app);
  const location = useLocation();
  const current = tools.find(
    (tool) =>
      tool.path === location.pathname ||
      (tool.path === "/movies" && location.pathname.startsWith("/movies/")),
  ) || {
    label: "Settings",
  };
  useEffect(() => {
    // console.log(theme)
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span>
            Utility<span className="brand-accent">Hub</span>
          </span>
          <button className="sidebar-close" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <div className="sidebar-label">Workspace</div>
        <nav>
          {tools.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              {createElement(icon, { size: 18 })}
              <span>{label}</span>
              {label === "Dashboard" && <span className="nav-dot" />}
            </NavLink>
          ))}
        </nav>
      </aside>
      {open && (
        <button
          className="scrim"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        />
      )}
      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setOpen(true)}>
            <Menu size={21} />
          </button>
          <div className="breadcrumb">
            <span>UtilityHub</span>
            <span>/</span>
            <strong>{current.label}</strong>
          </div>
          <div className="top-actions">
            <button
              className="icon-button"
              onClick={() => dispatch(toggleTheme())}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <div className="avatar">RS</div>
          </div>
        </header>
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/age" element={<AgeCalculator />} />
            <Route path="/units" element={<UnitConverter />} />
            <Route path="/currency" element={<CurrencyConverter />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/stopwatch" element={<Stopwatch />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/password" element={<PasswordGenerator />} />
            <Route path="/dice" element={<DiceRoller />} />
            <Route path="/url" element={<UrlParser />} />
            <Route path="/movies" element={<MovieSearch />} />
            <Route path="/movies/:imdbID" element={<MovieDetails />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Layout>
      </HashRouter>
    </Provider>
  );
}

export default App;
