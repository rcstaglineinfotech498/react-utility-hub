import { useCallback, useEffect, useState } from "react";
import { ToolFrame } from "../../components/ToolFrame";
import { Card } from "../../components/UI";

const operatorMap = {
  "+": "+",
  "−": "-",
  "×": "*",
  "÷": "/",
};

const formatValue = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "Error";
  }

  if (!Number.isFinite(value)) {
    return "Error";
  }

  const rounded = Number(value.toFixed(10));
  return String(rounded);
};

const calculate = (firstValue, operator, secondValue) => {
  switch (operator) {
    case "+":
      return firstValue + secondValue;
    case "-":
      return firstValue - secondValue;
    case "*":
      return firstValue * secondValue;
    case "/":
      return secondValue === 0 ? "Error" : firstValue / secondValue;
    default:
      return secondValue;
  }
};

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [storedValue, setStoredValue] = useState(null);
  const [pendingOperator, setPendingOperator] = useState(null);
  const [waitingForNextValue, setWaitingForNextValue] = useState(false);

  const resetCalculator = useCallback(() => {
    setDisplay("0");
    setExpression("");
    setStoredValue(null);
    setPendingOperator(null);
    setWaitingForNextValue(false);
  }, []);

  const press = useCallback(
    (value) => {
      if (value === "AC") {
        resetCalculator();
        return;
      }

      if (value === "⌫") {
        if (display === "Error") {
          resetCalculator();
          return;
        }

        const nextValue =
          display.length > 1 ? display.slice(0, -1) || "0" : "0";
        setDisplay(nextValue);
        setWaitingForNextValue(false);
        return;
      }

      if (/^\d$/.test(value)) {
        if (display === "Error" || waitingForNextValue || display === "0") {
          setDisplay(value);
        } else {
          setDisplay((current) => `${current}${value}`);
        }
        setWaitingForNextValue(false);
        return;
      }

      if (value === "%") {
        const currentValue = Number(display);
        const percentageValue = currentValue / 100;
        const formatted = formatValue(percentageValue);
        setDisplay(formatted);
        setExpression(`${formatted}`);
        setStoredValue(null);
        setPendingOperator(null);
        setWaitingForNextValue(true);
        return;
      }
      if (value === "."){
        if (waitingForNextValue) {
          setDisplay("0.");
          setWaitingForNextValue(false);
          return;
        }

        if (display.includes(".")) {
          return;
        }

        const nextValue = display === "0" ? "0." : `${display}.`;
        setDisplay(nextValue);
        return;
      }

      if (["+", "−", "×", "÷"].includes(value)) {
        const nextOperator = operatorMap[value];
        const currentValue = Number(display);

        if (pendingOperator && waitingForNextValue) {
          setPendingOperator(nextOperator);
          setExpression(`${formatValue(storedValue ?? currentValue)} ${value}`);
          return;
        }

        if (storedValue === null){
          setStoredValue(currentValue);
        } else if (pendingOperator) {
          const result = calculate(storedValue, pendingOperator, currentValue);
          const finalResult = formatValue(result);

          setDisplay(finalResult);
          setStoredValue(result);
          setExpression(
            `${formatValue(storedValue)} ${value} ${formatValue(currentValue)} = ${finalResult}`,
          );
        }

        setPendingOperator(nextOperator);
        setExpression((prev) => {
          if (!prev || prev.endsWith("=")) {
            return `${formatValue(storedValue ?? currentValue)} ${value}`;
          }
          return `${prev} ${value}`;
        });
        setWaitingForNextValue(true);
        return;
      }

      if (value === "=") {
        if (pendingOperator === null || storedValue === null) {
          return;
        }

        const currentValue = Number(display);
        const result = calculate(storedValue, pendingOperator, currentValue);
        const formattedResult = formatValue(result);

        setDisplay(formattedResult);
        setExpression(
          `${formatValue(storedValue)} ${operatorMap[pendingOperator] ?? pendingOperator} ${formatValue(currentValue)} = ${formattedResult}`,
        );
        setStoredValue(result);
        setPendingOperator(null);
        setWaitingForNextValue(true);
        return;
      }

      if (display === "Error") {
        setDisplay(value);
        return;
      }

      const isNewNumber =
        waitingForNextValue ||
        display === "0" ||
        ["+", "−", "×", "÷"].includes(display);

      setDisplay((current) => (isNewNumber ? value : `${current}${value}`));
      setWaitingForNextValue(false);
    },
    [
      display,
      pendingOperator,
      resetCalculator,
      storedValue,
      waitingForNextValue,
    ],
  );

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        press("=");
        return;
      }

    const key =
        {
          "*": "×",
          "/": "÷",
          "-": "−",
          Backspace: "⌫",
          Escape: "AC",
        }[event.key] || event.key;
      if (
        /^[0-9.+%]$/.test(key) ||
        ["×", "÷", "−", "+", "=", "⌫", "AC"].includes(key)
      ) {
        event.preventDefault();
        press(key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  return (
    <ToolFrame
      title="Calculator"
      description="Calculate your problems"
      toolId="calculator"
    >
      <Card className="max-w-[390px] border-[#28352f] bg-[#28352f] p-[18px]">
        <div className="flex min-h-[110px] flex-col items-end justify-end px-2.5 pb-5 pt-3 text-white">
          <small className="text-[11px] text-[#99a8a0]">
            {expression || "Enter any number"}
          </small>
          <strong className="max-w-full overflow-hidden font-mono text-[38px] font-bold">
            {display}
          </strong>
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
              type="button"
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
