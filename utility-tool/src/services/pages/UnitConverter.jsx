import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { ToolFrame } from "../../components/ToolFrame";
import { Card, Input, Select } from "../../components/UI";

const unitData = {
  Length: {
    Meters: { factor: 1 },
    Kilometers: { factor: 1000 },
    Centimeters: { factor: 0.01 },
    Millimeters: { factor: 0.001 },
    Miles: { factor: 1609.344 },
    Yards: { factor: 0.9144 },
    Feet: { factor: 0.3048 },
    Inches: { factor: 0.0254 },
  },
  Weight: {
    Kilograms: { factor: 1 },
    Grams: { factor: 0.001 },
    Milligrams: { factor: 0.000001 },
    Pounds: { factor: 0.45359237 },
    Ounces: { factor: 0.028349523125 },
  },
  Temperature: {
    Celsius: {},
    Fahrenheit: {},
    Kelvin: {},
  },
  Time: {
    Seconds: { factor: 1 },
    Milliseconds: { factor: 0.001 },
    Minutes: { factor: 60 },
    Hours: { factor: 3600 },
    Days: { factor: 86400 },
  },
};

const convertTemperature = (number, from, to) => {
  const celsius =
    from === "Celsius"
      ? number
      : from === "Fahrenheit"
        ? (number - 32) * (5 / 9)
        : number - 273.15;
  return to === "Celsius"
    ? celsius
    : to === "Fahrenheit"
      ? celsius * (9 / 5) + 32
      : celsius + 273.15;
};

export default function UnitConverter() {
  const [category, setCategory] = useState("Length");
  const [from, setFrom] = useState("Meters");
  const [to, setTo] = useState("Feet");
  const [value, setValue] = useState("1");
  const units = Object.keys(unitData[category]);
  const converted = useMemo(() => {
    const number = Number(value);
    if (!Number.isFinite(number)) return "";
    if (from === to) return number;
    if (category === "Temperature") return convertTemperature(number, from, to);
    return (number * unitData[category][from].factor) / unitData[category][to].factor;
  }, [category, from, to, value]);
  const changeCategory = (event) => {
    const next = event.target.value;
    setCategory(next);
    const nextUnits = Object.keys(unitData[next]);
    setFrom(nextUnits[0]);
    setTo(nextUnits[1]);
  };
  return (
    <ToolFrame
      eyebrow="Everyday conversions"
      title="Unit Converter"
      description="Move between the units you use every day."
      toolId="units"
    >
      <Card>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <Select label="Category" value={category} onChange={changeCategory}>
            {Object.keys(unitData).map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </Select>
          <Input
            label="Value"
            type="number"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        
        </div>
        <div className="mt-[23px] grid grid-cols-1 items-end gap-3.5 sm:grid-cols-[1fr_auto_1fr]">
            <Select
            label="From"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          >
            {units.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
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
            {units.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <div className="rounded-[9px] bg-mint py-[6px]">
            <span className="block text-[14px] text-muted">Result</span>
            <strong className="mt-[5px] block text-[17px] text-green-dark">
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

