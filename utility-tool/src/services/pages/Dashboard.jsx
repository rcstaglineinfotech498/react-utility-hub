import { createElement } from "react";
import {
  ArrowLeftRight,
  CalendarDays,
  Calculator,
  CloudSun,
  DollarSign,
  Gauge,
  TimerReset,
  KeyRound,
  Dices,
  Clapperboard,
  Link,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const popular = [
  {
    path: "/calculator",
    label: "Calculator",
    icon: Calculator,
    description: "Quick calculations",
  },
  {
    path: "/age",
    label: "Age Calculator",
    icon: CalendarDays,
    description: "Dates and milestones",
  },
  {
    path: "/units",
    label: "Unit Converter",
    icon: ArrowLeftRight,
    description: "Convert anything",
  },
  {
    path: "/currency",
    label: "Currency",
    icon: DollarSign,
    description: "Live exchange rates",
  },
  {
    path: "/weather",
    label: "Weather",
    icon: CloudSun,
    description: "Current conditions",
  },
  {
    path: "/stopwatch",
    label: "Stopwatch",
    icon: Gauge,
    description: "Time tracking",
  },
  {
    path: "/timer",
    label: "Countdown Timer",
    icon: TimerReset,
    description: "Set timers and alarms",
  },
  {
    path: "/password",
    label: "Password Generator",
    icon: KeyRound,
    description: "Create secure passwords",
  },
  {
    path: "/dice",
    label: "Dice Roller",
    icon: Dices,
    description: "Roll virtual dice",
  },
  {
    path: "/url",
    label: "URL Parser",
    icon: Link,
    description: "Analyze and extract data from URLs",
  },
  {
    path: "/movies",
    label: "Movie Search",
    icon: Clapperboard,
    description: "Find movies and details",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const favorites = useSelector((state) => state.app.favorites);
  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {popular.map(({ path, label, icon, description }, index) => (
          <button
            className="flex items-center gap-[13px] rounded-xl border border-line bg-surface p-[15px] text-left text-ink transition duration-200 hover:-translate-y-0.5 hover:border-[#c9d8ce] hover:shadow-soft"
            key={path}
            onClick={() => navigate(path)}
          >
            <div
              className={`grid size-[38px] shrink-0 place-items-center rounded-[10px] ${["bg-[#f7dfca] text-[#a56f39]", "bg-[#e8e4f4] text-[#7e6d9a]", "bg-[#FFE5BF] text-[#000000]", "bg-[#f9edb9] text-[#bd8b35]", "bg-[#f6dcd7] text-[#bd665a]", "bg-[#B1D3B9] text-[#778873]", "bg-[#DDE5E1] text-[#5A6B63]", "bg-[#95BDD7]", "bg-[#FFE2E2] text-[#000000]", "text-[#896C6C] bg-[#E5BEB5]", "bg-[#C0C9EE]"][index]}`}
            >
              {createElement(icon, { size: 20 })}
            </div>
            <div>
              <strong className="block text-[13px]">{label}</strong>
              <span className="mt-[3px] block text-[11px] text-muted">
                {description}
              </span>
            </div>
            <ArrowLeftRight
              className="ml-auto -rotate-45 text-[#b2bcb6]"
              size={16}
            />
          </button>
        ))}
      </div>
      {favorites.length > 0 && (
        <div className="mt-5 text-xs text-green-dark">
          {favorites.length} saved tool{favorites.length > 1 ? "s" : ""} in your
          workspace
        </div>
      )}
    </>
  );
}
