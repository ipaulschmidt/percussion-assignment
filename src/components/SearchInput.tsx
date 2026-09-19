import { useRef, useState } from "react";
import { Search, Loader2, Image as ImageIcon, Link2, Type, X } from "lucide-react";

export type SearchPayload =
  | { kind: "text"; query: string }
  | { kind: "image"; image: string; fileName: string }
  | { kind: "url"; url: string };

interface SearchInputProps {
  onSearch: (payload: SearchPayload) => void;
  isLoading: boolean;
}

type Mode = "text" | "image" | "url";

const modes: { id: Mode; label: string; icon: typeof Type }[] = [
  { id: "text", label: "Type", icon: Type },
  { id: "image", label: "Image", icon: ImageIcon },
  { id: "url", label: "Link", icon: Link2 },
];

const SearchInput = ({ onSearch, isLoading }: SearchInputProps) => {
  const [mode, setMode] = useState<Mode>("text");
  const [query, setQuery] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState<{ data: string; name: string } | null>(null);
  const [converting, setConverting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const readAsDataUrl = (file: Blob) =>
    new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(file);
    });

  const handleFile = async (file: File) => {
    setConverting(true);
    try {
      let blob: Blob = file;
      const isHeic =
        /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
      if (isHeic) {
        const heic2any = (await import("heic2any")).default;
        const out = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
        blob = Array.isArray(out) ? out[0] : (out as Blob);
      }
      const data = await readAsDataUrl(blob);
      setImage({ data, name: file.name });
    } finally {
      setConverting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || converting) return;
    if (mode === "text" && query.trim()) onSearch({ kind: "text", query: query.trim() });
    if (mode === "url" && url.trim()) onSearch({ kind: "url", url: url.trim() });
    if (mode === "image" && image)
      onSearch({ kind: "image", image: image.data, fileName: image.name });
  };

  const busy = isLoading || converting;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <div className="grid grid-cols-3 gap-1 rounded-lg bg-secondary p-1 border border-gold-subtle">
        {modes.map((m) => {
          const Icon = m.icon;
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-body transition-colors ${
                active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {m.label}
            </button>
          );
        })}
      </div>

      {mode === "text" && (
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Stravinsky — The Rite of Spring"
            className="w-full rounded-lg bg-secondary px-4 py-4 pl-12 pr-14 text-foreground placeholder:text-muted-foreground border border-gold-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-body text-base"
            disabled={busy}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <button
            type="submit"
            disabled={!query.trim() || busy}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-primary px-3 py-2 text-primary-foreground font-medium text-sm disabled:opacity-40 transition-opacity hover:opacity-90"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Go"}
          </button>
        </div>
      )}

      {mode === "url" && (
        <div className="relative">
          <input
            type="url"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://orchestra.org/concert-program"
            className="w-full rounded-lg bg-secondary px-4 py-4 pl-12 pr-14 text-foreground placeholder:text-muted-foreground border border-gold-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-body text-base"
            disabled={busy}
          />
          <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <button
            type="submit"
            disabled={!url.trim() || busy}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-primary px-3 py-2 text-primary-foreground font-medium text-sm disabled:opacity-40 transition-opacity hover:opacity-90"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Go"}
          </button>
        </div>
      )}

      {mode === "image" && (
        <div className="space-y-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.heic,.heif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          {image ? (
            <div className="relative rounded-lg border border-gold-subtle bg-secondary p-3">
              <img
                src={image.data}
                alt="Concert program"
                className="max-h-56 w-full rounded-md object-contain"
              />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-muted-foreground"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-gold-subtle bg-secondary px-4 py-8 text-muted-foreground font-body text-sm"
            >
              {converting ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <ImageIcon className="h-6 w-6 text-primary" />
              )}
              {converting ? "Preparing photo…" : "Tap to add a photo or screenshot"}
              <span className="text-xs">JPEG, PNG, HEIC, WebP</span>
            </button>
          )}
          <button
            type="submit"
            disabled={!image || busy}
            className="w-full rounded-lg bg-primary py-3 text-primary-foreground font-medium text-sm disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            {isLoading ? "Analyzing…" : "Analyze concert program"}
          </button>
        </div>
      )}
    </form>
  );
};

export default SearchInput;
