import { useState, useRef, useEffect } from "react";
import { Drum } from "lucide-react";
import SearchInput from "@/components/SearchInput";
import ExampleQueries from "@/components/ExampleQueries";
import ResultsDisplay from "@/components/ResultsDisplay";
import { useToast } from "@/hooks/use-toast";

const SYSTEM_PROMPT = `You are a professional orchestral percussion consultant. Your task is to determine the optimal number of percussionists required for a given musical work and provide a detailed, practical assignment of instruments.

For every response, follow this structure:

## 🎯 Piece Identification
Restate the piece, composer, and any relevant context.

## 🥁 Number of Percussionists
- **Minimum**: fewest players with some doubling
- **Ideal**: enough for no critical overlaps

## 🎼 Full Instrument List
Complete list with exact types, quantities. Be specific (e.g., "5-octave marimba", "Germanic crash cymbals", "5 timpani").

## 👥 Percussionist Assignments
Assign from most to least challenging. Label as Percussionist 1, 2, 3, etc. Group by setup proximity and technique similarity. Ensure all transitions are physically possible.

## 🧠 Relevant Notes
- **Complexity Level** per part: Beginner / Intermediate / Advanced
- **Technical Skills Required**: 4-mallet proficiency, fast switching, rhythmic precision, extended techniques, etc.

## 💡 Additional Tips
Setup advice, transition tips, common professional practices.

Rules: Never guess instrumentation. Prioritize realism and playability. Be specific and structured. Think like a performer setting up the stage.`;

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [pieceName, setPieceName] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [result]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setPieceName(query);
    setResult(null);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer placeholder`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `Determine the percussion setup and assignments for: ${query}` },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setResult(data.choices?.[0]?.message?.content || "No result returned.");
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not analyze the piece. Please try again.",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-gold-subtle shadow-gold">
            <Drum className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display text-gold-gradient">
            Percussion Assignment Pro
          </h1>
          <p className="mt-2 text-sm text-muted-foreground font-body">
            AI-powered orchestral percussion assignments
          </p>
        </header>

        {/* Search */}
        <div className="mb-6">
          <SearchInput onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Examples or Loading */}
        {!result && !isLoading && (
          <ExampleQueries onSelect={handleSearch} disabled={isLoading} />
        )}

        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground font-body animate-pulse-gold">
              Analyzing percussion parts…
            </p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div ref={resultsRef}>
            <ResultsDisplay content={result} pieceName={pieceName} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
