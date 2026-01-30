import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  language: "tr" | "en";
}

export const SearchBox = ({ value, onChange, onSearch, onKeyDown, isLoading, language }: SearchBoxProps) => {
  const content = {
    tr: {
      label: "Dava Özeti / Anahtar Kelimeler",
      placeholder: "İlgili mahkeme kararlarını bulmak için bir dava özeti veya anahtar kelime girin...",
      hint: "Aramak için Enter'a basın veya Ara butonuna tıklayın",
      searching: "Aranıyor...",
      search: "Ara",
    },
    en: {
      label: "Case Summary / Keywords",
      placeholder: "Enter a case summary or keywords to search for relevant court decisions...",
      hint: "Press Enter or click Search to find relevant decisions",
      searching: "Searching...",
      search: "Search",
    },
  };

  const t = content[language];

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="mb-4">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          {t.label}
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t.placeholder}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-border bg-card/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
        <p className="text-xs text-muted-foreground mt-2">
          {t.hint}
        </p>
      </div>
      <Button
        onClick={onSearch}
        disabled={!value.trim() || isLoading}
        className="w-full bg-[#395BB2] hover:bg-[#2d4a8f] text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t.searching}
          </>
        ) : (
          <>
            <Search className="w-4 h-4 mr-2" />
            {t.search}
          </>
        )}
      </Button>
    </div>
  );
};

