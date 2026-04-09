import ReactMarkdown from "react-markdown";
import { Music, Users, ListMusic, UserCheck, Brain, Lightbulb, ShieldAlert } from "lucide-react";

interface ResultsDisplayProps {
  content: string;
  pieceName: string;
}

const sectionIcons: Record<string, React.ReactNode> = {
  "piece": <Music className="h-4 w-4 text-primary shrink-0" />,
  "number": <Users className="h-4 w-4 text-primary shrink-0" />,
  "instrument": <ListMusic className="h-4 w-4 text-primary shrink-0" />,
  "assignment": <UserCheck className="h-4 w-4 text-primary shrink-0" />,
  "risk": <ShieldAlert className="h-4 w-4 text-primary shrink-0" />,
  "note": <Brain className="h-4 w-4 text-primary shrink-0" />,
  "tip": <Lightbulb className="h-4 w-4 text-primary shrink-0" />,
};

function getIconForHeading(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes("piece") || lower.includes("identify")) return sectionIcons.piece;
  if (lower.includes("number") || lower.includes("percussionist")) return sectionIcons.number;
  if (lower.includes("instrument") || lower.includes("list")) return sectionIcons.instrument;
  if (lower.includes("assignment")) return sectionIcons.assignment;
  if (lower.includes("risk")) return sectionIcons.risk;
  if (lower.includes("note") || lower.includes("relevant") || lower.includes("complex")) return sectionIcons.note;
  if (lower.includes("tip") || lower.includes("additional")) return sectionIcons.tip;
  return <Music className="h-4 w-4 text-primary shrink-0" />;
}

function stripEmoji(text: string): string {
  return text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}]/gu, "").trim();
}

const ResultsDisplay = ({ content, pieceName }: ResultsDisplayProps) => {
  return (
    <div className="w-full pb-16">
      {/* Piece header */}
      <div className="border-b border-border pb-4 mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-1">Analysis for</p>
        <h2 className="text-2xl font-display text-gold-gradient italic leading-tight">{pieceName}</h2>
      </div>

      {/* Markdown content */}
      <div className="results-prose font-body text-[15px] leading-[1.75] text-secondary-foreground">
        <ReactMarkdown
          components={{
            h2: ({ children }) => {
              const raw = typeof children === "string" ? children : String(children);
              const clean = stripEmoji(raw);
              return (
                <div className="flex items-center gap-2.5 mt-8 mb-4 pb-2.5 border-b border-border">
                  {getIconForHeading(clean)}
                  <h2 className="text-base font-body font-semibold text-foreground tracking-wide uppercase m-0">
                    {clean}
                  </h2>
                </div>
              );
            },
            h3: ({ children }) => {
              const raw = typeof children === "string" ? children : String(children);
              return (
                <h3 className="text-[15px] font-body font-semibold text-primary mt-5 mb-2 m-0">
                  {stripEmoji(raw)}
                </h3>
              );
            },
            p: ({ children }) => (
              <p className="my-3 leading-[1.8]">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="my-3 space-y-2 pl-4 list-disc marker:text-primary/50">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="my-3 space-y-2 pl-4 list-decimal marker:text-primary/50">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="leading-[1.7] pl-1">{children}</li>
            ),
            strong: ({ children }) => {
              const text = typeof children === "string" ? children : String(children);
              if (text === "HIGH RISK") {
                return <span className="inline-flex items-center rounded-md bg-red-500/15 px-2 py-0.5 text-xs font-bold text-red-400 ring-1 ring-inset ring-red-500/30">🔴 HIGH RISK</span>;
              }
              if (text === "MEDIUM RISK") {
                return <span className="inline-flex items-center rounded-md bg-yellow-500/15 px-2 py-0.5 text-xs font-bold text-yellow-400 ring-1 ring-inset ring-yellow-500/30">🟡 MEDIUM RISK</span>;
              }
              if (text === "LOW RISK") {
                return <span className="inline-flex items-center rounded-md bg-green-500/15 px-2 py-0.5 text-xs font-bold text-green-400 ring-1 ring-inset ring-green-500/30">🟢 LOW RISK</span>;
              }
              return <strong className="font-semibold text-foreground">{children}</strong>;
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ResultsDisplay;
