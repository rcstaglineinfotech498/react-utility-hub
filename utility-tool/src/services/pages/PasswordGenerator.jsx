import { useCallback, useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { ToolFrame } from "../../components/ToolFrame";
import { Button, Card } from "../../components/UI";

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
    password.length >= 12 && Object.values(options).filter(Boolean).length >= 3
      ? "Strong"
      : password.length >= 7
        ? "good"
        : "weak";
  const copy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <ToolFrame
      eyebrow="Security purposes"
      title="Password Generator"
      description="Crete strong and unique Password with one click."
      toolId="password"
    >
      <Card>
        <div className="flex items-center gap-3 rounded-[9px] border border-dashed border-[#bdccc2]  p-[15px]">
          <span className="flex-1 overflow-hidden text-ellipsis font-mono text-[15px]">
            {password || "Select options to generate"}
          </span>
          <Button variant="secondary" onClick={copy} disabled={!password} className="bg-amber-50">
            <Copy size={16} />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <div className="my-[21px] grid grid-cols-[auto_auto_1fr] items-center gap-3 text-[11px] text-muted">
          <span>Strength</span>
          <strong
            className={
              strength === "Strong"
                ? "text-[#438a62]"
                : strength === "Good"
                  ? "text-[#bf913f]"
                  : "text-[#c7645d]"
            }
          >
            {strength}
          </strong>
          <div className="h-[5px] overflow-hidden rounded-[5px] bg-line">
            <i
              className={
                strength === "Strong"
                  ? "block h-full w-full bg-[#438a62]"
                  : strength === "Good"
                    ? "block h-full w-[65%] bg-[#bf913f]"
                    : "block h-full w-[35%] bg-[#c7645d]"
              }
            />
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
              <input
                className="mr-2 accent-green"
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
        <Button onClick={generate} className="text-black border-1 bg-amber-50">
          Generate new password
        </Button>
      </Card>
    </ToolFrame>
  );
}
