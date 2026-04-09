const examples = [
  "Stravinsky — The Rite of Spring",
  "Mahler — Symphony No. 6",
  "Bartók — Concerto for Orchestra",
  "Ravel — Daphnis et Chloé",
  "Rimsky-Korsakov — Scheherazade",
];

interface ExampleQueriesProps {
  onSelect: (query: string) => void;
  disabled: boolean;
}

const ExampleQueries = ({ onSelect, disabled }: ExampleQueriesProps) => {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground font-body font-medium">
        Try an example
      </p>
      <div className="flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex}
            onClick={() => !disabled && onSelect(ex)}
            disabled={disabled}
            className="rounded-full border border-gold-subtle bg-secondary/50 px-3 py-1.5 text-sm text-secondary-foreground font-body transition-all hover:border-primary/40 hover:bg-secondary disabled:opacity-40"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExampleQueries;
