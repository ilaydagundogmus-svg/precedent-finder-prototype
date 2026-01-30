import { useState } from "react";
import { Search, Sparkles, FileText, X, Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SearchPanelProps {
  language: "tr" | "en";
  jurisdiction: string;
  onJurisdictionChange: (value: string) => void;
}

interface ActiveFilters {
  jurisdiction: string;
  year: string;
  chamber: string;
  topic: string;
  caseNumber: string;
}

const SearchPanel = ({ language, jurisdiction, onJurisdictionChange }: SearchPanelProps) => {
  const [searchMode, setSearchMode] = useState<"ai" | "keyword">("ai");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ActiveFilters>({
    jurisdiction: jurisdiction,
    year: "",
    chamber: "",
    topic: "",
    caseNumber: "",
  });

  const jurisdictions = {
    tr: [
      { value: "all", label: "Tüm Mahkemeler" },
      { value: "yargitay", label: "Yargıtay" },
      { value: "danistay", label: "Danıştay" },
      { value: "anayasa", label: "Anayasa Mahkemesi" },
      { value: "aihm", label: "Avrupa İnsan Hakları Mahkemesi" },
      { value: "abad", label: "Avrupa Birliği Adalet Divanı" },
    ],
    en: [
      { value: "all", label: "All Courts" },
      { value: "yargitay", label: "Court of Cassation" },
      { value: "danistay", label: "Council of State" },
      { value: "anayasa", label: "Constitutional Court" },
      { value: "aihm", label: "European Court of Human Rights" },
      { value: "abad", label: "Court of Justice of the EU" },
    ],
  };

  const years = Array.from({ length: 15 }, (_, i) => (2025 - i).toString());

  const chambers = {
    tr: [
      "1. Hukuk Dairesi", "2. Hukuk Dairesi", "3. Hukuk Dairesi", "4. Hukuk Dairesi",
      "5. Hukuk Dairesi", "6. Hukuk Dairesi", "7. Hukuk Dairesi", "8. Hukuk Dairesi",
      "9. Hukuk Dairesi", "10. Hukuk Dairesi", "11. Hukuk Dairesi", "12. Hukuk Dairesi",
      "13. Hukuk Dairesi", "Ceza Genel Kurulu", "Hukuk Genel Kurulu",
    ],
    en: [
      "1st Civil Chamber", "2nd Civil Chamber", "3rd Civil Chamber", "4th Civil Chamber",
      "5th Civil Chamber", "6th Civil Chamber", "7th Civil Chamber", "8th Civil Chamber",
      "9th Civil Chamber", "10th Civil Chamber", "11th Civil Chamber", "12th Civil Chamber",
      "13th Civil Chamber", "Criminal General Assembly", "Civil General Assembly",
    ],
  };

  const topics = {
    tr: [
      "Ticaret Hukuku", "İş Hukuku", "Ceza Hukuku", "Tüketici Hukuku",
      "Aile Hukuku", "Miras Hukuku", "Borçlar Hukuku", "Eşya Hukuku",
      "İcra ve İflas Hukuku", "İdare Hukuku", "Vergi Hukuku", "Fikri Mülkiyet",
    ],
    en: [
      "Commercial Law", "Labor Law", "Criminal Law", "Consumer Law",
      "Family Law", "Inheritance Law", "Obligations Law", "Property Law",
      "Enforcement and Bankruptcy", "Administrative Law", "Tax Law", "Intellectual Property",
    ],
  };

  const content = {
    tr: {
      title: "Dava Detaylarını Açıklayın",
      subtitle: "Davanızın özetini yazın veya anahtar kelimeler girin.",
      aiMode: "Anlam Temelli (AI)",
      keywordMode: "Anahtar Kelime",
      placeholder: "Örnek: Banka müvekkilimin bilgisi ve izni olmadan vadeli işlem (future) yapmıştır. Bu konuda emsal karar arıyorum...",
      searchBtn: "Karar Ara",
      jurisdiction: "Yargı Yetkisi",
      filters: "Filtreler",
      year: "Yıl",
      chamber: "Daire",
      topic: "Konu",
      caseNumber: "Karar No",
      caseNumberPlaceholder: "Örn: 2023/11674 E., 2025/4935 K.",
      selectJurisdiction: "Mahkeme Seçin",
      selectYear: "Yıl Seçin",
      selectChamber: "Daire Seçin",
      selectTopic: "Konu Seçin",
      activeFilters: "Aktif Filtreler",
      clearAll: "Tümünü Temizle",
      resultsTitle: "Arama Sonuçları Burada Görünecek",
      resultsSubtitle: "Dava detaylarınızı girdikten sonra, AI en ilgili mahkeme kararlarını benzerlik skorlarıyla birlikte listeleyecektir.",
      aiTranslationActive: "AI Çeviri Aktif",
    },
    en: {
      title: "Describe Your Case Details",
      subtitle: "Write a summary of your case or enter keywords.",
      aiMode: "Semantic (AI)",
      keywordMode: "Keyword",
      placeholder: "Example: The bank made futures transactions without my client's knowledge or consent. I am looking for precedent decisions on this matter...",
      searchBtn: "Search Cases",
      jurisdiction: "Jurisdiction",
      filters: "Filters",
      year: "Year",
      chamber: "Chamber",
      topic: "Topic",
      caseNumber: "Case No",
      caseNumberPlaceholder: "E.g: 2023/11674 E., 2025/4935 K.",
      selectJurisdiction: "Select Court",
      selectYear: "Select Year",
      selectChamber: "Select Chamber",
      selectTopic: "Select Topic",
      activeFilters: "Active Filters",
      clearAll: "Clear All",
      resultsTitle: "Search Results Will Appear Here",
      resultsSubtitle: "After entering your case details, AI will list the most relevant court decisions with similarity scores.",
      aiTranslationActive: "AI Translation Active",
    },
  };

  const t = content[language];
  const currentJurisdictions = jurisdictions[language];
  const currentChambers = chambers[language];
  const currentTopics = topics[language];

  const handleFilterChange = (key: keyof ActiveFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === "jurisdiction") {
      onJurisdictionChange(value);
    }
  };

  const removeFilter = (key: keyof ActiveFilters) => {
    setFilters((prev) => ({ ...prev, [key]: key === "jurisdiction" ? "all" : "" }));
    if (key === "jurisdiction") {
      onJurisdictionChange("all");
    }
  };

  const clearAllFilters = () => {
    setFilters({
      jurisdiction: "all",
      year: "",
      chamber: "",
      topic: "",
      caseNumber: "",
    });
    onJurisdictionChange("all");
  };

  const getActiveFilterChips = () => {
    const chips: { key: keyof ActiveFilters; label: string; value: string }[] = [];
    
    if (filters.jurisdiction && filters.jurisdiction !== "all") {
      const jurisdictionLabel = currentJurisdictions.find((j) => j.value === filters.jurisdiction)?.label || filters.jurisdiction;
      chips.push({ key: "jurisdiction", label: t.jurisdiction, value: jurisdictionLabel });
    }
    if (filters.year) {
      chips.push({ key: "year", label: t.year, value: filters.year });
    }
    if (filters.chamber) {
      chips.push({ key: "chamber", label: t.chamber, value: filters.chamber });
    }
    if (filters.topic) {
      chips.push({ key: "topic", label: t.topic, value: filters.topic });
    }
    if (filters.caseNumber) {
      chips.push({ key: "caseNumber", label: t.caseNumber, value: filters.caseNumber });
    }
    
    return chips;
  };

  const activeChips = getActiveFilterChips();

  return (
    <div className="flex-1 min-h-screen bg-background overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground">DECRETUM</h1>
            <p className="text-sm text-muted-foreground">Search decisions, draft smarter.</p>
          </div>
        </div>
      </header>

      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="max-w-5xl mx-auto px-8 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground mr-2">{t.activeFilters}:</span>
            {activeChips.map((chip) => (
              <Badge
                key={chip.key}
                variant="secondary"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                <span className="text-xs font-medium">{chip.value}</span>
                <button
                  onClick={() => removeFilter(chip.key)}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {activeChips.length > 1 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-muted-foreground hover:text-foreground underline ml-2 transition-colors"
              >
                {t.clearAll}
              </button>
            )}

            {/* AI Translation Badge */}
            <Badge
              variant="outline"
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-accent/20 text-accent border border-accent/30"
            >
              <Sparkles className="w-3 h-3" />
              <span className="text-xs font-medium">{t.aiTranslationActive}</span>
            </Badge>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-8 py-8">
        {/* Search Section */}
        <section className="glass-card rounded-2xl p-8 animate-fade-in">
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">{t.title}</h2>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>

          {/* Search Mode Toggle */}
          <div className="bg-muted rounded-xl p-1.5 inline-flex mb-6">
            <button
              onClick={() => setSearchMode("ai")}
              className={cn("toggle-tab flex items-center gap-2", searchMode === "ai" && "active")}
            >
              <Sparkles className="w-4 h-4" />
              {t.aiMode}
            </button>
            <button
              onClick={() => setSearchMode("keyword")}
              className={cn("toggle-tab flex items-center gap-2", searchMode === "keyword" && "active")}
            >
              {t.keywordMode}
            </button>
          </div>

          {/* Search Input */}
          <div className="search-input-glow rounded-xl border border-border bg-card transition-all duration-300 mb-6">
            <textarea
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.placeholder}
              rows={4}
              className="w-full px-5 py-4 bg-transparent resize-none focus:outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Filter Panel */}
          <div className="bg-muted/50 rounded-xl p-5 mb-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">{t.filters}</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* Jurisdiction Filter */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.jurisdiction}</label>
                <Select value={filters.jurisdiction} onValueChange={(value) => handleFilterChange("jurisdiction", value)}>
                  <SelectTrigger className="w-full bg-card border-border">
                    <SelectValue placeholder={t.selectJurisdiction} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border z-50 max-h-60">
                    {currentJurisdictions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.year}</label>
                <Select value={filters.year} onValueChange={(value) => handleFilterChange("year", value)}>
                  <SelectTrigger className="w-full bg-card border-border">
                    <SelectValue placeholder={t.selectYear} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border z-50 max-h-60">
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Chamber Filter */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.chamber}</label>
                <Select value={filters.chamber} onValueChange={(value) => handleFilterChange("chamber", value)}>
                  <SelectTrigger className="w-full bg-card border-border">
                    <SelectValue placeholder={t.selectChamber} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border z-50 max-h-60">
                    {currentChambers.map((chamber) => (
                      <SelectItem key={chamber} value={chamber}>
                        {chamber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Topic Filter */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.topic}</label>
                <Select value={filters.topic} onValueChange={(value) => handleFilterChange("topic", value)}>
                  <SelectTrigger className="w-full bg-card border-border">
                    <SelectValue placeholder={t.selectTopic} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border z-50 max-h-60">
                    {currentTopics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Case Number Filter */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.caseNumber}</label>
                <Input
                  value={filters.caseNumber}
                  onChange={(e) => handleFilterChange("caseNumber", e.target.value)}
                  placeholder={t.caseNumberPlaceholder}
                  className="bg-card border-border"
                />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button className="btn-search w-full py-4 rounded-xl flex items-center justify-center gap-3 text-lg">
            <Search className="w-5 h-5" />
            {t.searchBtn}
          </button>
        </section>

        {/* Results Section */}
        <section className="mt-8 glass-card rounded-2xl p-12 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-3">{t.resultsTitle}</h3>
            <p className="text-muted-foreground max-w-md leading-relaxed">{t.resultsSubtitle}</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export { SearchPanel };
