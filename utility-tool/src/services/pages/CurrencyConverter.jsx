
import { useRef, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { ToolFrame } from "../../components/ToolFrame";
import { Button, Card, ErrorMessage, Input, Select } from "../../components/UI";
import { apiConfig, currencyApi } from "../../services/api";

const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "INR"];
export default function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");
  const requestId = useRef(0);
  const resetConversion = () => {
    requestId.current += 1;
    setResult(null);
    setStatus("idle");
  };
  const convert = async () => {
    if (!amount || Number(amount) <= 0) return;
    const currentRequestId = ++requestId.current;
    setStatus("loading");
    try {
      const { data } = await currencyApi.get("/latest", {
        params: {
          apikey: apiConfig.currencyKey,
          base_currency: from,
          currencies: to,
        },
      });
      if (currentRequestId !== requestId.current) return;
      setResult(Number(amount) * data.data[to]);
      setStatus("success");
    } catch {
      if (currentRequestId !== requestId.current) return;
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
            onChange={(event) => {
              setAmount(event.target.value);
              resetConversion();
            }}
          />
          <Select
            label="From"
            value={from}
            onChange={(event) => {
              setFrom(event.target.value);
              resetConversion();
            }}
          >
            {currencies.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <Select
            label="To"
            value={to}
            onChange={(event) => {
              setTo(event.target.value);
              resetConversion();
            }}
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
              resetConversion();
            }}
          >
            <ArrowLeftRight size={16} /> Swap currencies
          </Button>
          <Button onClick={convert} disabled={status === "loading"} className="text-black border-1 bg-amber-50">
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
