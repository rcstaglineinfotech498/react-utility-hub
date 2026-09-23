import { useState } from "react";
import { Copy } from "lucide-react";
import { ToolFrame } from "../../components/ToolFrame";
import { Button, Card, ErrorMessage } from "../../components/UI";

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
          <span className="text-[10px] font-semibold uppercase tracking-[1.2px] text-muted">
            URL to inspect
          </span>
          <textarea
            className="min-h-[85px] w-full resize-y rounded-[9px] border border-line bg-surface px-3 py-[11px] text-[13px] text-ink outline-none focus:border-green focus:shadow-[0_0_0_3px_rgba(57,124,104,0.1)]"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </label>
        <div className="mt-3.5 flex flex-wrap gap-[9px]">
          <Button className="text-black bg-amber-50 border-1" onClick={parse}>
            Parse URL
          </Button>
          <Button
            className="bg-amber-100"
            variant="secondary"
            onClick={() => setInput(encodeURIComponent(input))}
          >
            Encode
          </Button>
          <Button
            className="bg-amber-200"
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
              <div
                className="grid grid-cols-1 gap-1.5 border-b border-line py-3 sm:grid-cols-[120px_1fr] sm:gap-[18px]"
                key={key}
              >
                <span className="text-[11px] uppercase text-muted">{key}</span>
                <strong className="break-words font-mono text-xs">
                  {value || "—"}
                </strong>
              </div>
            ))}
            <Button
              className="mt-4 bg-blue-50"
              variant="secondary"
              onClick={copy}
            >
              <Copy size={16} />
              {copied ? "Copied!" : "Copy result"}
            </Button>
          </div>
        )}
      </Card>
    </ToolFrame>
  );
}
