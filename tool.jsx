// agecal


import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import { ToolFrame } from "../components/ToolFrame";
import { Card, EmptyState, Input } from "../components/UI";

export default function AgeCalculator() {
  const [birth, setBirth] = useState("");
  const result = useMemo(() => {
    if (!birth) return null;
    const start = new Date(`${birth}T00:00:00`);
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    const birthday = new Date(
      now.getFullYear(),
      start.getMonth(),
      start.getDate(),
    );
    if (birthday > now) years--;
    const next =
      birthday > now
        ? birthday
        : new Date(now.getFullYear() + 1, start.getMonth(), start.getDate());
    return {
      years,
      days: Math.floor((now - start) / 86400000),
      next: Math.ceil((next - now) / 86400000),
    };
  }, [birth]);
  return (
    <ToolFrame
      eyebrow="Dates & milestones"
      title="Age Calculator"
      description="See your journey in years, days, and the next milestone."
      toolId="age"
    >
      <Card>
        <div className="flex flex-col items-stretch gap-3.5 sm:flex-row sm:items-end">
          <Input
            label="Your date of birth"
            type="date"
            value={birth}
            onChange={(event) => setBirth(event.target.value)}
          />
          <div className="pb-3 text-[11px] text-muted">
            We keep this calculation private in your browser.
          </div>
        </div>
        {result ? (
          <div className="mt-[25px] grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-[10px] bg-[#f4f7f2] p-[18px]">
              <strong className="block font-mono text-[25px] font-bold text-green-dark">{result.years}</strong>
              <span className="mt-1.5 block text-[11px] text-muted">years old</span>
            </div>
            <div className="rounded-[10px] bg-[#f4f7f2] p-[18px]">
              <strong className="block font-mono text-[25px] font-bold text-green-dark">{result.days.toLocaleString()}</strong>
              <span className="mt-1.5 block text-[11px] text-muted">total days</span>
            </div>
            <div className="rounded-[10px] bg-[#f4f7f2] p-[18px]">
              <strong className="block font-mono text-[25px] font-bold text-green-dark">{result.next}</strong>
              <span className="mt-1.5 block text-[11px] text-muted">days until birthday</span>
            </div>
          </div>
        ) : (
          <EmptyState icon={CalendarDays} title="Enter a date to begin">
            Your result will appear here.
          </EmptyState>
        )}
      </Card>
    </ToolFrame>
  );
}


//calculator

import { useCallback, useEffect, useState } from "react";
import { ToolFrame } from "../components/ToolFrame";
import { Card } from "../components/UI";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const press = useCallback(
    (value) => {
      if (value === "AC") {
        setDisplay("0");
        setExpression("");
        return;
      }
      if (value === "⌫") {
        setDisplay((item) => (item.length > 1 ? item.slice(0, -1) : "0"));
        return;
      }
      if (value === "=") {
        try {
          setDisplay(
            String(
              Function(`"use strict"; return (${expression || display})`)(),
            ),
          );
          setExpression("");
        } catch {
          setDisplay("Error");
        }
        return;
      }
      if (["+", "−", "×", "÷", "%"].includes(value)) {
        setExpression(
          (expression || display) +
            value.replace("×", "*").replace("÷", "/").replace("−", "-"),
        );
        setDisplay(value);
        return;
      }
      setDisplay((item) =>
        item === "0" ||
        ["+", "−", "×", "÷", "%"].includes(item) ||
        item === "Error"
          ? value
          : item + value,
      );
    },
    [display, expression],
  );
  useEffect(() => {
    const onKey = (event) => {
      const key =
        {
          "*": "×",
          "/": "÷",
          "-": "−",
          Enter: "=",
          Backspace: "⌫",
          Escape: "AC",
        }[event.key] || event.key;
      if (
        /^[0-9.+%]$/.test(key) ||
        ["×", "÷", "−", "=", "⌫", "AC"].includes(key)
      )
        press(key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);
  return (
    <ToolFrame
      eyebrow="Everyday math"
      title="Calculator"
      description="Fast, focused calculations for whatever is next."
      toolId="calculator"
    >
      <Card className="max-w-[390px] border-[#28352f] bg-[#28352f] p-[18px]">
        <div className="flex min-h-[110px] flex-col items-end justify-end px-2.5 pb-5 pt-3 text-white">
          <small className="text-[11px] text-[#99a8a0]">{expression || "Ready when you are"}</small>
          <strong className="max-w-full overflow-hidden font-mono text-[38px] font-bold">{display}</strong>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            "AC",
            "⌫",
            "%",
            "÷",
            "7",
            "8",
            "9",
            "×",
            "4",
            "5",
            "6",
            "−",
            "1",
            "2",
            "3",
            "+",
            "0",
            ".",
            "=",
          ].map((key) => (
            <button
              key={key}
              className={`h-[52px] rounded-[9px] border-0 bg-[#394840] text-base text-[#f5faf6] hover:bg-[#4a5d51] ${["AC", "⌫", "%"].includes(key) ? "bg-[#313e37] text-[#b8c5bd]" : ""} ${["÷", "×", "−", "+", "="].includes(key) ? "text-[#9ce4c7]" : ""} ${key === "=" ? "col-span-2 bg-[#79c5aa] text-[#173a2e]" : ""}`}
              onClick={() => press(key)}
            >
              {key}
            </button>
          ))}
        </div>
      </Card>
    </ToolFrame>
  );
}




//currency


        )}
        {results.length > 0 && (
          <div className="movie-grid">
            {results.map((movie) => (
              <article className="movie-card" key={movie.imdbID}>
                {movie.Poster !== "N/A" ? (
                  <img src={movie.Poster} alt="" />
                ) : (
                  <div className="poster-fallback">
                    <Sparkles size={24} />
                  </div>
                )}
                <div>
                  <strong>{movie.Title}</strong>
                  <span>
                    {movie.Year} · {movie.Type}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>
    </ToolFrame>
  );
}



  return (
    <ToolFrame
      eyebrow="Time tracking"
      title="Stopwatch"
      description="Track time with a clear, distraction-free clock."
      toolId="stopwatch"
    >
      <Card className="time-card">
        <div className="time-readout">{formatTime(elapsed)}</div>
        <div className="time-actions">
          <Button onClick={() => setRunning(!running)}>
            <Play size={17} fill="currentColor" />
            {running ? "Pause" : elapsed ? "Resume" : "Start"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setRunning(false);
              setElapsed(0);
            }}
          >
            <RotateCcw size={16} /> Reset
          </Button>
        </div>
      </Card>
    </ToolFrame>
  );
}




         setRemaining(null);
            }}
          >
            <RotateCcw size={16} /> Reset
          </Button>
        </div>
      </Card>
    </ToolFrame>
  );
}



        )}
        {parsed && !parsed.error && (
          <div className="url-table">
            {Object.entries(parsed).map(([key, value]) => (
              <div key={key}>
                <span>{key}</span>
                <strong>{value || "—"}</strong>
              </div>
            ))}
            <Button variant="secondary" onClick={copy}>
              <Copy size={16} />
              {copied ? "Copied!" : "Copy result"}
            </Button>
          </div>
        )}
      </Card>
    </ToolFrame>
  );
}



// currency

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { ToolFrame } from "../components/ToolFrame";
import { Button, Card, ErrorMessage, Input, Select } from "../components/UI";
import { currencyApi } from "../services/api";

const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "INR"];
export default function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");
  const convert = async () => {
    if (!amount || Number(amount) <= 0) return;
    setStatus("loading");
    try {
      const { data } = await currencyApi.get(
        `/latest?amount=${amount}&from=${from}&to=${to}`,
      );
      setResult(data.rates[to]);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };
  return (
    <ToolFrame
      eyebrow="Market tools"
      title="Currency Converter"
      description="Convert with current rates from a reliable exchange source."
      toolId="currency"
    >
      <Card>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          <Input
            label="Amount"
            type="number"
            min="0"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
          <Select
            label="From"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          >
            {currencies.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <Select
            label="To"
            value={to}
            onChange={(event) => setTo(event.target.value)}
          >
            {currencies.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>
        <div className="mt-3.5 flex flex-wrap gap-[9px]">
          <Button
            variant="secondary"
            onClick={() => {
              setFrom(to);
              setTo(from);
            }}
          >
            <ArrowLeftRight size={16} /> Swap currencies
          </Button>
          <Button onClick={convert} disabled={status === "loading"}>
            {status === "loading" ? "Converting..." : "Convert currency"}
          </Button>
        </div>
        {status === "error" && (
          <ErrorMessage>
            Could not load the exchange rate. Check your connection and try
            again.
          </ErrorMessage>
        )}
        {result !== null && (
          <div className="mt-7 grid gap-[5px] border-l-[3px] border-green px-[18px] py-[5px]">
            <span className="text-xs text-muted">
              {amount} {from} equals
            </span>
            <strong className="font-mono text-[29px] font-bold text-green-dark">
              {Number(result).toFixed(2)} {to}
            </strong>
            <small className="text-xs text-muted">Live result from Frankfurter</small>
          </div>
        )}
      </Card>
    </ToolFrame>
  );
}


//Dashbord

import { createElement } from "react";
import {
  ArrowLeftRight,
  CalendarDays,
  Calculator,
  CloudSun,
  Globe2,
  Sparkles,
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
    icon: Globe2,
    description: "Live exchange rates",
  },
  {
    path: "/weather",
    label: "Weather",
    icon: CloudSun,
    description: "Forecast at a glance",
  },
];
export default function Dashboard() {
  const navigate = useNavigate();
  const favorites = useSelector((state) => state.app.favorites);
  return (
    <>
      <div className="mb-8 flex items-end justify-between max-sm:block">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[1.2px] text-muted">MONDAY, SEPTEMBER 21, 2026</div>
          <h1>
            Good morning, Jamie <span className="text-[0.72em] text-[#db9c6d]">✦</span>
          </h1>
          <p>Everything you need, right at your fingertips.</p>
        </div>
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-[9px] rounded-[11px] border border-line bg-surface px-3.5 py-3 text-[11px] text-muted max-sm:mt-5 max-sm:w-max">
          <CalendarDays size={18} />
          <span>Daily focus</span>
          <strong>Make space for what matters</strong>
        </div>
      </div>
      <section className="relative mb-[42px] flex min-h-[236px] items-center justify-between overflow-hidden rounded-2xl bg-[#d9e9df] px-[25px] py-[25px] sm:px-[38px] sm:py-8">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-[20px] bg-white/50 px-2.5 py-1.5 text-[10px] font-semibold text-green-dark">
            <Sparkles size={13} /> Your workspace
          </span>
          <h2 className="my-[17px] text-[29px] leading-[1.03] tracking-[-1.3px] sm:text-[33px]">
            Small tools.
            <br />
            <em className="not-italic text-green-dark">Big momentum.</em>
          </h2>
          <p className="text-[13px] text-[#668075]">A calm collection of utilities for the moments between ideas.</p>
        </div>
        <div className="relative z-[1] grid size-[130px] place-items-center rounded-full bg-green text-white shadow-[0_0_0_17px_rgba(57,124,104,0.11)] sm:size-[170px] max-sm:absolute max-sm:-bottom-5 max-sm:-right-7">
          <div className="absolute inset-[-30px] rounded-full border border-dashed border-[rgba(57,124,104,0.32)]" />
          <Sparkles size={44} />
        </div>
      </section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2>Jump back in</h2>
          <p className="mt-[5px] text-xs text-muted">Popular utilities ready when you are.</p>
        </div>
        <NavLink to="/calculator" className="flex items-center gap-[7px] text-xs font-semibold text-green-dark no-underline">
          View all <span className="tracking-[1px]">•••</span>
        </NavLink>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {popular.map(({ path, label, icon, description }, index) => (
          <button
            className="flex items-center gap-[13px] rounded-xl border border-line bg-surface p-[15px] text-left text-ink transition duration-200 hover:-translate-y-0.5 hover:border-[#c9d8ce] hover:shadow-soft"
            key={path}
            onClick={() => navigate(path)}
          >
            <div className={`grid size-[38px] shrink-0 place-items-center rounded-[10px] ${["bg-[#f7dfca] text-[#a56f39]", "bg-[#e8e4f4] text-[#7e6d9a]", "bg-mint text-[#49826e]", "bg-[#f9edb9] text-[#bd8b35]", "bg-[#f6dcd7] text-[#bd665a]"][index]}`}>
              {createElement(icon, { size: 20 })}
            </div>
            <div>
              <strong className="block text-[13px]">{label}</strong>
              <span className="mt-[3px] block text-[11px] text-muted">{description}</span>
            </div>
            <ArrowLeftRight className="ml-auto rotate-[-45deg] text-[#b2bcb6]" size={16} />
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


//dice

import { useState } from "react";
import { Dice5 } from "lucide-react";
import { ToolFrame } from "../components/ToolFrame";
import { Button, Card, EmptyState } from "../components/UI";

export default function DiceRoller() {
  const [count, setCount] = useState(2);
  const [values, setValues] = useState([]);
  const [rolling, setRolling] = useState(false);
  const roll = () => {
    setRolling(true);
    setTimeout(() => {
      setValues(
        Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1),
      );
      setRolling(false);
    }, 500);
  };
  return (
    <ToolFrame
      eyebrow="A little chance"
      title="Dice Roller"
      description="Roll up to six dice and keep the total close."
      toolId="dice"
    >
      <Card>
        <div className="flex flex-wrap items-end gap-3.5 sm:flex-nowrap">
          <label className="text-[10px] font-semibold uppercase tracking-[1.2px] text-muted">Number of dice</label>
          <div className="flex h-[39px] items-center rounded-lg border border-line">
            <button className="h-full w-[34px] border-0 bg-transparent text-[19px] text-green-dark" onClick={() => setCount(Math.max(1, count - 1))}>−</button>
            <strong className="w-7 text-center font-mono text-base">{count}</strong>
            <button className="h-full w-[34px] border-0 bg-transparent text-[19px] text-green-dark" onClick={() => setCount(Math.min(6, count + 1))}>+</button>
          </div>
          <Button onClick={roll}>
            <Dice5 size={18} /> {rolling ? "Rolling..." : "Roll dice"}
          </Button>
        </div>
        {values.length ? (
          <>
            <div className="my-8 flex flex-wrap gap-[15px]">
              {values.map((value, index) => (
                <div className="grid size-[70px] place-items-center rounded-xl bg-[#f1d9c8] font-mono text-[28px] font-bold text-[#855b43] shadow-[3px_3px_0_#dfbda4]" key={index}>
                  {value}
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t border-line pt-[17px] text-xs text-muted">
              Total{" "}
              <strong className="font-mono text-xl text-ink">{values.reduce((sum, value) => sum + value, 0)}</strong>
            </div>
          </>
        ) : (
          <EmptyState icon={Dice5} title="Ready to roll?">
            Choose how many dice to play with.
          </EmptyState>
        )}
      </Card>
    </ToolFrame>
  );
}




// movies

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { ToolFrame } from "../components/ToolFrame";
import {
  Button,
  Card,
  EmptyState,
  ErrorMessage,
  Input,
  Loader,
} from "../components/UI";
import { apiConfig, movieApi } from "../services/api";

export default function MovieSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");
  const searchMovies = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    setStatus("loading");
    try {
      const { data } = await movieApi.get(
        `/?apikey=${apiConfig.movieKey}&s=${encodeURIComponent(query)}&type=movie`,
      );
      setResults(data.Response === "False" ? [] : data.Search || []);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };
  return (
    <ToolFrame
      eyebrow="Find something great"
      title="Movie Search"
      description="Search the catalog and find your next favorite."
      toolId="movies"
    >
      <Card>
        <form className="flex flex-col gap-2.5 sm:flex-row" onSubmit={searchMovies}>
          <Input
            placeholder="Try a title, actor, or year..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button type="submit">
            <Search size={17} /> Search
          </Button>
        </form>
        {status === "loading" && <Loader text="Searching the catalog..." />}
        {status === "error" && (
          <ErrorMessage>
            We couldn't reach the movie service right now.
          </ErrorMessage>
        )}
        {status === "idle" && (
          <EmptyState icon={Search} title="What do you want to watch?">
            Search by title to see matching films.
          </EmptyState>
        )}
        {status === "success" && !results.length && (
          <EmptyState title="No matches found">
            Try a different title or a broader search.
          </EmptyState>
        )}
        {results.length > 0 && (
          <div className="mt-[27px] grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-[18px]">
            {results.map((movie) => (
              <article className="overflow-hidden rounded-[10px] border border-line bg-surface" key={movie.imdbID}>
                {movie.Poster !== "N/A" ? (
                  <img className="h-[180px] w-full object-cover sm:h-[210px]" src={movie.Poster} alt="" />
                ) : (
                  <div className="grid h-[180px] w-full place-items-center bg-[#e8e4f4] text-[#8d80a5] sm:h-[210px]">
                    <Sparkles size={24} />
                  </div>
                )}
                <div className="p-3">
                  <strong className="block text-xs">{movie.Title}</strong>
                  <span className="mt-[5px] block text-[10px] text-muted">
                    {movie.Year} · {movie.Type}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>
    </ToolFrame>
  );
}



// password

import { useCallback, useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { ToolFrame } from "../components/ToolFrame";
import { Button, Card } from "../components/UI";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const generate = useCallback(() => {
    let chars = "";
    if (options.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (options.numbers) chars += "0123456789";
    if (options.symbols) chars += "!@#$%^&*()_+";
    if (!chars) return setPassword("");
    const values = new Uint32Array(length);
    crypto.getRandomValues(values);
    setPassword(
      Array.from(values, (value) => chars[value % chars.length]).join(""),
    );
  }, [length, options]);
  useEffect(generate, [generate]);
  const strength =
    password.length >= 16 && Object.values(options).filter(Boolean).length >= 3
      ? "Strong"
      : password.length >= 10
        ? "Good"
        : "Weak";
  const copy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <ToolFrame
      eyebrow="Security tools"
      title="Password Generator"
      description="Create a strong, unique password in one click."
      toolId="password"
    >
      <Card>
        <div className="flex items-center gap-3 rounded-[9px] border border-dashed border-[#bdccc2] bg-[#f4f7f2] p-[15px]">
          <span className="flex-1 overflow-hidden text-ellipsis font-mono text-[15px]">{password || "Select options to generate"}</span>
          <Button variant="secondary" onClick={copy} disabled={!password}>
            <Copy size={16} />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <div className="my-[21px] grid grid-cols-[auto_auto_1fr] items-center gap-3 text-[11px] text-muted">
          <span>Strength</span>
          <strong className={strength === "Strong" ? "text-[#438a62]" : strength === "Good" ? "text-[#bf913f]" : "text-[#c7645d]"}>
            {strength}
          </strong>
          <div className="h-[5px] overflow-hidden rounded-[5px] bg-line">
            <i className={strength === "Strong" ? "block h-full w-full bg-[#438a62]" : strength === "Good" ? "block h-full w-[65%] bg-[#bf913f]" : "block h-full w-[35%] bg-[#c7645d]"} />
          </div>
        </div>
        <div className="mb-[22px] grid gap-2.5">
          <label className="flex justify-between text-[10px] font-semibold uppercase tracking-[1.2px] text-muted">
            Password length <strong>{length}</strong>
          </label>
          <input
            type="range"
            min="6"
            max="40"
            value={length}
            onChange={(event) => setLength(Number(event.target.value))}
          />
        </div>
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Object.keys(options).map((key) => (
            <label className="text-xs text-muted" key={key}>
              <input className="mr-2 accent-green"
                type="checkbox"
                checked={options[key]}
                onChange={() =>
                  setOptions({ ...options, [key]: !options[key] })
                }
              />
              {key[0].toUpperCase() + key.slice(1)}
            </label>
          ))}
        </div>
        <Button onClick={generate}>Generate new password</Button>
      </Card>
    </ToolFrame>
  );
}


//setttings
import { useDispatch, useSelector } from "react-redux";
import { Button, Card } from "../components/UI";
import { toggleTheme } from "../store";
import { ToolFrame } from "../components/ToolFrame";

export default function Settings() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.app.theme);
  return (
    <ToolFrame
      eyebrow="Workspace preferences"
      title="Settings"
      description="Keep your workspace comfortable and personal."
    >
      <Card>
        <div className="flex items-center justify-between gap-5">
          <div>
            <strong className="block">Appearance</strong>
            <span className="mt-[5px] block text-xs text-muted">Choose a light or dark workspace.</span>
          </div>
          <Button variant="secondary" onClick={() => dispatch(toggleTheme())}>
            {theme === "light" ? "Light mode" : "Dark mode"}
          </Button>
        </div>
      </Card>
    </ToolFrame>
  );
}



//stopwatch

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { ToolFrame } from "../components/ToolFrame";
import { Button, Card } from "../components/UI";

const formatTime = (seconds) =>
  `${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(Math.floor(seconds / 60) % 60).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (running)
      ref.current = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(ref.current);
  }, [running]);
  return (
    <ToolFrame
      eyebrow="Time tracking"
      title="Stopwatch"
      description="Track time with a clear, distraction-free clock."
      toolId="stopwatch"
    >
      <Card className="max-w-[600px] text-center">
        <div className="py-[25px] pb-8 font-mono text-[clamp(40px,9vw,74px)] font-bold tracking-[-3px] text-green-dark">{formatTime(elapsed)}</div>
        <div className="flex justify-center gap-2.5">
          <Button onClick={() => setRunning(!running)}>
            <Play size={17} fill="currentColor" />
            {running ? "Pause" : elapsed ? "Resume" : "Start"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setRunning(false);
              setElapsed(0);
            }}
          >
            <RotateCcw size={16} /> Reset
          </Button>
        </div>
      </Card>
    </ToolFrame>
  );
}






//timer

import { useEffect, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { ToolFrame } from "../components/ToolFrame";
import { Button, Card, Input } from "../components/UI";

const formatTime = (seconds) =>
  `${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(Math.floor(seconds / 60) % 60).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
export default function Timer() {
  const [input, setInput] = useState({ hours: 0, minutes: 5, seconds: 0 });
  const [remaining, setRemaining] = useState(null);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(
      () =>
        setRemaining((value) => {
          if (value <= 1) {
            setRunning(false);
            return 0;
          }
          return value - 1;
        }),
      1000,
    );
    return () => clearInterval(id);
  }, [running]);
  const start = () => {
    const value =
      Number(input.hours) * 3600 +
      Number(input.minutes) * 60 +
      Number(input.seconds);
    if (value > 0) {
      setRemaining(value);
      setRunning(true);
    }
  };
  return (
    <ToolFrame
      eyebrow="Time tracking"
      title="Countdown Timer"
      description="Give your next block of focus a clear finish line."
      toolId="timer"
    >
      <Card className="max-w-[600px] text-center">
        {remaining === null ? (
          <div className="mb-[25px] grid grid-cols-1 gap-3.5 text-left sm:grid-cols-3">
            {Object.keys(input).map((key) => (
              <Input
                key={key}
                label={key}
                type="number"
                min="0"
                value={input[key]}
                onChange={(event) =>
                  setInput({ ...input, [key]: event.target.value })
                }
              />
            ))}
          </div>
        ) : (
          <div className="py-[25px] pb-8 font-mono text-[clamp(40px,9vw,74px)] font-bold tracking-[-3px] text-green-dark">{formatTime(remaining)}</div>
        )}
        <div className="flex justify-center gap-2.5">
          <Button
            onClick={() =>
              remaining !== null ? setRunning(!running) : start()
            }
          >
            <Play size={17} fill="currentColor" />
            {running ? "Pause" : remaining !== null ? "Resume" : "Start timer"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setRunning(false);
              setRemaining(null);
            }}
          >
            <RotateCcw size={16} /> Reset
          </Button>
        </div>
      </Card>
    </ToolFrame>
  );
}



//unitconv

import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { ToolFrame } from "../components/ToolFrame";
import { Card, Input, Select } from "../components/UI";

const unitData = {
  Length: [
    ["Meters", "Feet", 3.28084],
    ["Kilometers", "Miles", 0.621371],
    ["Centimeters", "Inches", 0.393701],
  ],
  Weight: [
    ["Kilograms", "Pounds", 2.20462],
    ["Grams", "Ounces", 0.035274],
  ],
  Temperature: [["Celsius", "Fahrenheit", "temp"]],
  Time: [
    ["Hours", "Minutes", 60],
    ["Days", "Hours", 24],
  ],
};
export default function UnitConverter() {
  const [category, setCategory] = useState("Length");
  const [from, setFrom] = useState("Meters");
  const [to, setTo] = useState("Feet");
  const [value, setValue] = useState("1");
  const options = unitData[category];
  const units = [...new Set(options.flatMap((row) => row.slice(0, 2)))];
  const converted = useMemo(() => {
    const number = Number(value);
    if (!Number.isFinite(number)) return "";
    const row = options.find(
      (item) => item.includes(from) && item.includes(to),
    );
    if (!row) return number;
    if (row[2] === "temp")
      return from === "Celsius"
        ? (number * 9) / 5 + 32
        : ((number - 32) * 5) / 9;
    return number * row[2];
  }, [value, from, to, options]);
  const changeCategory = (event) => {
    const next = event.target.value;
    setCategory(next);
    setFrom(unitData[next][0][0]);
    setTo(unitData[next][0][1]);
  };
  return (
    <ToolFrame
      eyebrow="Everyday conversions"
      title="Unit Converter"
      description="Move between the units you use every day."
      toolId="units"
    >
      <Card>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          <Select label="Category" value={category} onChange={changeCategory}>
            {Object.keys(unitData).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <Input
            label="Value"
            type="number"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <Select
            label="From"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          >
            {units.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>
        <div className="mt-[23px] grid grid-cols-1 items-end gap-3.5 sm:grid-cols-[auto_1fr_1fr]">
          <button
            className="grid size-[38px] place-items-center rounded-[9px] border-0 bg-mint text-green-dark hover:bg-green hover:text-white"
            onClick={() => {
              setFrom(to);
              setTo(from);
            }}
            aria-label="Swap units"
          >
            <ArrowLeftRight size={18} />
          </button>
          <Select
            label="To"
            value={to}
            onChange={(event) => setTo(event.target.value)}
          >
            {units
              .filter((item) => item !== from)
              .map((item) => (
                <option key={item}>{item}</option>
              ))}
          </Select>
          <div className="rounded-[9px] bg-mint px-[13px] py-[11px]">
            <span className="block text-[10px] text-muted">Result</span>
            <strong className="mt-[5px] block text-[15px] text-green-dark">
              {Number(converted).toLocaleString(undefined, {
                maximumFractionDigits: 6,
              })}{" "}
              {to}
            </strong>
          </div>
        </div>
      </Card>
    </ToolFrame>
  );
}



//url


import { useState } from "react";
import { Copy } from "lucide-react";
import { ToolFrame } from "../components/ToolFrame";
import { Button, Card, ErrorMessage } from "../components/UI";

export default function UrlParser() {
  const [input, setInput] = useState(
    "https://example.com:8080/products?search=utility#features",
  );
  const [parsed, setParsed] = useState(null);
  const [copied, setCopied] = useState(false);
  const parse = () => {
    try {
      const url = new URL(input.includes("://") ? input : `https://${input}`);
      setParsed(
        Object.fromEntries(
          [
            "protocol",
            "hostname",
            "port",
            "pathname",
            "search",
            "hash",
            "origin",
          ].map((key) => [key, url[key]]),
        ),
      );
    } catch {
      setParsed({ error: true });
    }
  };
  const copy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(parsed, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <ToolFrame
      eyebrow="Web utilities"
      title="URL Parser & Decoder"
      description="Break down a URL into the parts that matter."
      toolId="url"
    >
      <Card>
        <label className="grid flex-1 gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[1.2px] text-muted">URL to inspect</span>
          <textarea
            className="min-h-[85px] w-full resize-y rounded-[9px] border border-line bg-surface px-3 py-[11px] text-[13px] text-ink outline-none focus:border-green focus:shadow-[0_0_0_3px_rgba(57,124,104,0.1)]"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </label>
        <div className="mt-3.5 flex flex-wrap gap-[9px]">
          <Button onClick={parse}>Parse URL</Button>
          <Button
            variant="secondary"
            onClick={() => setInput(encodeURIComponent(input))}
          >
            Encode
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              try {
                setInput(decodeURIComponent(input));
              } catch {
                setParsed({ error: true });
              }
            }}
          >
            Decode
          </Button>
        </div>
        {parsed?.error && (
          <ErrorMessage>That doesn't look like a valid URL.</ErrorMessage>
        )}
        {parsed && !parsed.error && (
          <div className="mt-[25px] border-t border-line">
            {Object.entries(parsed).map(([key, value]) => (
              <div className="grid grid-cols-1 gap-1.5 border-b border-line py-3 sm:grid-cols-[120px_1fr] sm:gap-[18px]" key={key}>
                <span className="text-[11px] uppercase text-muted">{key}</span>
                <strong className="break-words font-mono text-xs">{value || "—"}</strong>
              </div>
            ))}
            <Button variant="secondary" onClick={copy}>
              <Copy size={16} />
              {copied ? "Copied!" : "Copy result"}
            </Button>
          </div>
        )}
      </Card>
    </ToolFrame>
  );
}




//weather

import { useState } from "react";
import { CloudSun, Search } from "lucide-react";
import { ToolFrame } from "../components/ToolFrame";
import {
  Button,
  Card,
  EmptyState,
  ErrorMessage,
  Input,
  Loader,
} from "../components/UI";
import { apiConfig, weatherApi } from "../services/api";

export default function Weather() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");
  const searchWeather = async (event) => {
    event.preventDefault();
    if (!city.trim()) return;
    setStatus("loading");
    try {
      const { data: response } = await weatherApi.get(
        `/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiConfig.weatherKey}`,
      );
      setData(response);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };
  return (
    <ToolFrame
      eyebrow="Outside, simplified"
      title="Weather"
      description="A quick read on the sky wherever you are."
      toolId="weather"
    >
      <Card>
        <form className="flex flex-col gap-2.5 sm:flex-row" onSubmit={searchWeather}>
          <Input
            placeholder="Search a city..."
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
          <Button type="submit">
            <Search size={17} /> Search
          </Button>
        </form>
        {status === "loading" && <Loader text="Finding your forecast..." />}
        {status === "error" && (
          <ErrorMessage>
            We couldn't find that city. Check the spelling and try again.
          </ErrorMessage>
        )}
        {status === "idle" && (
          <EmptyState icon={CloudSun} title="Where are you headed?">
            Search a city to see current conditions.
          </EmptyState>
        )}
        {data && (
          <div className="mt-7 rounded-xl bg-[#e6f1ee] p-6">
            <div className="flex items-center gap-[18px] text-green-dark">
              <CloudSun size={48} />
              <div className="grid gap-0.5">
                <span>
                  {data.name}, {data.sys.country}
                </span>
                <strong className="font-mono text-[42px] font-bold leading-none">{Math.round(data.main.temp)}°</strong>
                <em className="text-xs capitalize not-italic">{data.weather[0].description}</em>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-[22px] border-t border-[rgba(57,124,104,0.2)] pt-[15px] text-[11px] text-muted">
              <span>
                Feels like <b className="ml-1 text-ink">{Math.round(data.main.feels_like)}°</b>
              </span>
              <span>
                Humidity <b className="ml-1 text-ink">{data.main.humidity}%</b>
              </span>
              <span>
                Wind <b className="ml-1 text-ink">{data.wind.speed} m/s</b>
              </span>
            </div>
          </div>
        )}
      </Card>
    </ToolFrame>
  );
}
