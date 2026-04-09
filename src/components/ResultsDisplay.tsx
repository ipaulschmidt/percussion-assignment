import ReactMarkdown from "react-markdown";
import { Music, Users, ListMusic, UserCheck, Brain, Lightbulb } from "lucide-react";

interface ResultsDisplayProps {
  content: string;
  pieceName: string;
}

const sectionIcons: Record<string, React.ReactNode> = {
  "piece": <Music className="h-5 w-5 text-primary" />,
  "number": <Users className="h-5 w-5 text-primary" />,
  "instrument": <ListMusic className="h-5 w-5 text-primary" />,
  "assignment": <UserCheck className="h-5 w-5 text-primary" />,
  "note": <Brain className="h-5 w-5 text-primary" />,
  "tip": <Lightbulb className="h-5 w-5 text-primary" />,
};

function getIconForHeading(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes("piece") || lower.includes("identify")) return sectionIcons.piece;
  if (lower.includes("number") || lower.includes("percussionist")) return sectionIcons.number;
  if (lower.includes("instrument") || lower.includes("list")) return sectionIcons.instrument;
  if (lower.includes("assignment")) return sectionIcons.assignment;
  if (lower.includes("note") || lower.includes("relevant") || lower.includes("complex")) return sectionIcons.note;
  if (lower.includes("tip") || lower.includes("additional")) return sectionIcons.tip;
  return <Music className="h-5 w-5 text-primary" />;
}

const ResultsDisplay = ({ content, pieceName }: ResultsDisplayProps) => {
  return (
    <div className="w-full space-y-4 pb-24">
      <div className="border-b border-gold-subtle pb-3">
        <p className="text-sm text-muted-foreground font-body">Analysis for</p>
        <h2 className="text-xl font-display text-gold-gradient italic">{pieceName}</h2>
      </div>
      <div className="prose prose-invert prose-sm max-w-none font-body
        prose-headings:font-display prose-headings:text-foreground prose-headings:text-lg
        prose-h2:flex prose-h2:items-center prose-h2:gap-2 prose-h2:border-b prose-h2:border-gold-subtle prose-h2:pb-2 prose-h2:mt-6
        prose-h3:text-base prose-h3:text-primary
        prose-strong:text-primary
        prose-li:text-secondary-foreground
        prose-p:text-secondary-foreground prose-p:leading-relaxed
        prose-ul:space-y-1
      ">
        <ReactMarkdown
          components={{
            h2: ({ children, ...props }) => {
              const text = typeof children === "string" ? children : String(children);
              return (
                <h2 {...props} className="flex items-center gap-2 border-b border-gold-subtle pb-2 mt-6 font-display text-foreground text-lg">
                  {getIconForHeading(text)}
                  {children}
                </h2>
              );
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
