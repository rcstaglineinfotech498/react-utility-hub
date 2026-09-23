import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { ToolFrame } from "../../components/ToolFrame";
import { Button, Card } from "../../components/UI";

const formatTime = (milliseconds) => {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor(milliseconds / 60000) % 60;
  const seconds = Math.floor(milliseconds / 1000) % 60;
  const remainder = milliseconds % 1000;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(remainder).padStart(3, "0")}`;
};
export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const startedAt = useRef(0);
  const ref = useRef(null);
  useEffect(() => {
    if (running) {
      ref.current = setInterval(
        () => setElapsed(Date.now() - startedAt.current),
        10,
      );
    } 
    return () => clearInterval(ref.current);
  }, [running]);
  return (
    <ToolFrame
      eyebrow="Time tracking"
      title="Stopwatch"
      description="Track time with every seconds."
      toolId="stopwatch"
    >
      <Card className="max-w-[600px] text-center">
        <div className="py-[25px] pb-8 font-mono text-[clamp(40px,9vw,74px)] font-bold tracking-[-3px] text-green-dark">{formatTime(elapsed)}</div>
        <div className="flex justify-center gap-2.5">
          <Button
            onClick={() => {
              if (running) {
                setElapsed(Date.now() - startedAt.current);
              } else {
                startedAt.current = Date.now() - elapsed;
              }
              setRunning(!running);
            }}
            className="border text-black bg-amber-50"
          >
            <Play size={17} fill="black" />
            {running ? "Pause" : elapsed ? "Resume" : "Start"}
          </Button>
          <Button
            className="bg-amber-100"
            variant="secondary"
            onClick={() => {
              setRunning(false);
              setElapsed(0);
              startedAt.current = 0;
            }}
          >
            <RotateCcw size={16} /> Reset
          </Button>
        </div>
      </Card>
    </ToolFrame>
  );
}
