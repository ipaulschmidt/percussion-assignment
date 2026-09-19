import { useState, useRef, useEffect } from "react";
import { Drum } from "lucide-react";
import SearchInput, { type SearchPayload } from "@/components/SearchInput";
import ExampleQueries from "@/components/ExampleQueries";
import ResultsDisplay from "@/components/ResultsDisplay";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  const handleSearch = async (payload: SearchPayload) => {
    setIsLoading(true);
    setPieceName(
      payload.kind === "text"
        ? payload.query
        : payload.kind === "url"
          ? payload.url
          : payload.fileName || "Concert program photo"
    );
    setResult(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-percussion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ query }),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to analyze");
      }

      // Stream SSE response
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setResult(fullText);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      if (!fullText) {
        setResult("No results returned. Please try a different piece.");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Could not analyze the piece. Please try again.",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-5 py-8 sm:px-6">
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

        {isLoading && !result && (
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
