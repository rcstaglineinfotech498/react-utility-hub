import { useEffect, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { ToolFrame } from "../../components/ToolFrame";
import { Button, Card, Input } from "../../components/UI";

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
          <Button className="text-black border-1 bg-amber-50"
            onClick={() =>
              remaining !== null ? setRunning(!running) : start()
            }
          >
            <Play size={17} fill="black" />
            {running ? "Pause" : remaining !== null ? "Resume" : "Start timer"}
          </Button>
          <Button
          className="bg-amber-100"
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
