import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchInput = ({ onSearch, isLoading }: SearchInputProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Stravinsky — The Rite of Spring"
          className="w-full rounded-lg bg-secondary px-4 py-4 pl-12 pr-14 text-foreground placeholder:text-muted-foreground border border-gold-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-body text-base"
          disabled={isLoading}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-primary px-3 py-2 text-primary-foreground font-medium text-sm disabled:opacity-40 transition-opacity hover:opacity-90"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Go"}
        </button>
      </div>
    </form>
  );
};

export default SearchInput;
