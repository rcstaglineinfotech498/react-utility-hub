import { useState } from "react";
import { Dice5 } from "lucide-react";
import { ToolFrame } from "../../components/ToolFrame";
import { Button, Card, EmptyState } from "../../components/UI";

export default function DiceRoller() {
  const [count, setCount] = useState(2);
  const [values, setValues] = useState([]);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    setRolling(true);
    setTimeout(() => {
      setValues(
        Array.from({ length: count }, () => Math.floor(Math.random() * 6 + 1)),
      );
      // console.log(values)
      setRolling(false);
    }, 500);
  };
  return (
    <ToolFrame
      title="Dice Roller"
      description="Roll up to six dice and keep the total close."
      toolId="dice"
    >
      <Card>
        <div className="flex flex-wrap items-end gap-3.5 sm:flex-nowrap">
          <label className="text-[12px] pb-2 font-semibold uppercase tracking-[1.2px] text-muted">
            Number of dice
          </label>
          <div className="flex h-[39px] items-center rounded-lg border border-line ">
            <button
              className="h-full w-[34px] border-0 bg-transparent text-[19px] text-green-dark"
              onClick={() => setCount(Math.max(1, count - 1))}
            >
              −
            </button>
            <strong className="w-7 text-center font-mono text-base">
              {count}
            </strong>
            <button
              className="h-full w-[34px] border-0 bg-transparent text-[19px] text-green-dark"
              onClick={() => setCount(Math.min(6, count + 1))}
            >
              +
            </button>
          </div>
          <Button onClick={roll} className="text-black bg-amber-50 border-1">
            <Dice5 size={18} /> {rolling ? "Rolling..." : "Roll dice"}
          </Button>
        </div>
        { values.length ? (
          <>
            <div className="my-8 flex flex-wrap gap-[15px]">
              {values.map((value, index) => (
                <div
                  className="grid size-[70px] place-items-center rounded-xl bg-[#f7f1da] font-mono text-[28px] font-bold text-[#857b43] shadow-[3px_3px_0_#dfbda4]"
                  key={index}
                >
                  {value}
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t border-line pt-[17px] text-xs text-muted">
              Total{" "}
              <strong className="font-mono text-xl text-ink">
                {values.reduce((sum, value) => sum + value, 0)}
              </strong>
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
