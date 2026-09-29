import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import { ToolFrame } from "../../components/ToolFrame";
import { Card, EmptyState, ErrorMessage, Input } from "../../components/UI";

export default function AgeCalculator() {
  const [birth, setBirth] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const result = useMemo(() => {
    if (!birth) return null;
    if (birth > today) return null;
    const start = new Date(`${birth}T00:00:00`);
    if (Number.isNaN(start.getTime())) return null;
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
  }, [birth, today]);

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
            max={today}
            value={birth}
            onChange={(event) => setBirth(event.target.value)}
          />
          <div className="pb-3 text-[11px] text-muted">
            We keep this calculation private in your browser.
          </div>
        </div>
        {birth > today && (
          <ErrorMessage>Date of birth cannot be in the future.</ErrorMessage>
        )}
        {result ? (
          <div className="mt-[25px] grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-[10px] p-[18px]">
              <strong className="block font-mono text-[25px] font-bold text-green-dark">
                {result.years}
              </strong>
              <span className="mt-1.5 block text-[11px] text-muted">
                years old
              </span>
            </div>
            <div className="rounded-[10px] p-[18px]">
              <strong className="block font-mono text-[25px] font-bold text-green-dark">
                {result.days.toLocaleString()}
              </strong>
              <span className="mt-1.5 block text-[11px] text-muted">
                total days
              </span>
            </div>
            <div className="rounded-[10px] p-[18px]">
              <strong className="block font-mono text-[25px] font-bold text-green-dark">
                {result.next}
              </strong>
              <span className="mt-1.5 block text-[11px] text-muted">
                days until birthday
              </span>
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
