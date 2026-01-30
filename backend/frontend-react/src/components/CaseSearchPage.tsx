import { useState, useMemo, useCallback } from "react";
import { Search, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBox } from "./CaseSearch/SearchBox";
import { Filters } from "./CaseSearch/Filters";
import { ResultsList } from "./CaseSearch/ResultsList";
import { DecisionPreview } from "./CaseSearch/DecisionPreview";
import { FullTextModal } from "./CaseSearch/FullTextModal";
import { MOCK_DECISIONS } from "./CaseSearch/mockData";
import { ResearchExportMenu } from "./CaseSearch/ResearchExportMenu";
import { logDecisionClick } from "./CaseSearch/feedbackHelpers";
import { computeRelevanceDetailed } from "./CaseSearch/relevanceHelpers";
import { saveFeedback, getFeedbackForDecision } from "./CaseSearch/feedbackHelpers";
import { RelevanceBreakdown, FeedbackValue } from "./CaseSearch/types";

export type Decision = {
  id: string;
  title: string;
  court: string;
  country: string;
  date: string;
  summary: string;
  keywords: string[];
  fullText: string;
  relevanceScore?: number;
  relevanceBreakdown?: RelevanceBreakdown;
};

type FilterState = {
  court: string;
  country: string;
  dateStart: string;
  dateEnd: string;
  minRelevance: number;
};

type SortOption = "relevance" | "date-desc" | "date-asc";

interface CaseSearchPageProps {
  language?: "tr" | "en";
}

const CaseSearchPage = ({ language = "tr" }: CaseSearchPageProps) => {
  const content = {
    tr: {
      title: "Karar Arama",
      subtitle: "AI destekli anlamsal arama ile mahkeme kararlarında arama yapın",
      startSearch: "Aramaya başlayın",
      startSearchDesc: "İlgili mahkeme kararlarını bulmak için bir dava özeti veya anahtar kelime girin",
      foundResults: "sonuç bulundu",
      foundResult: "sonuç bulundu",
      noResults: "Sonuç bulunamadı",
      noResultsDesc: "Arama sorgunuzu veya filtrelerinizi ayarlamayı deneyin",
    },
    en: {
      title: "Case Search",
      subtitle: "Search through court decisions using AI-powered semantic search",
      startSearch: "Start your search",
      startSearchDesc: "Enter a case summary or keywords to find relevant court decisions",
      foundResults: "results found",
      foundResult: "result found",
      noResults: "No results found",
      noResultsDesc: "Try adjusting your search query or filters",
    },
  };

  const t = content[language];
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [fullTextModalOpen, setFullTextModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [queryId, setQueryId] = useState<string>("");
  const [researchMode, setResearchMode] = useState(false);

  const toggleFavorite = (decisionId: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(decisionId)) {
        newSet.delete(decisionId);
      } else {
        newSet.add(decisionId);
      }
      return newSet;
    });
  };

  const isFavorite = (decisionId: string) => favorites.has(decisionId);
  const [filters, setFilters] = useState<FilterState>({
    court: "all",
    country: "all",
    dateStart: "",
    dateEnd: "",
    minRelevance: 0,
  });
  const [sortBy, setSortBy] = useState<SortOption>("relevance");

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setSearchPerformed(true);
    setSelectedDecision(null);
    
    // Generate new queryId for this search
    const newQueryId = `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setQueryId(newQueryId);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const handleFeedback = useCallback(
    (decisionId: string, value: FeedbackValue) => {
      if (!queryId || !searchQuery.trim()) return;

      const decision = MOCK_DECISIONS.find((d) => d.id === decisionId);
      if (!decision) return;

      const breakdown = computeRelevanceDetailed(searchQuery, decision);

      saveFeedback({
        queryId,
        decisionId,
        value,
        timestamp: Date.now(),
        queryText: searchQuery,
        decisionTitle: decision.title,
        court: decision.court,
        date: decision.date,
        scoreAtTime: breakdown.totalScore,
        matchedTerms: breakdown.matchedTerms,
      });
    },
    [queryId, searchQuery]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const computedResults = useMemo(() => {
    if (!searchPerformed || !searchQuery.trim()) return [];

    let results = MOCK_DECISIONS.map((decision) => {
      const breakdown = computeRelevanceDetailed(searchQuery, decision);
      return {
        ...decision,
        relevanceScore: breakdown.totalScore,
        relevanceBreakdown: breakdown,
      };
    });

    // Apply filters
    if (filters.country !== "all") {
      results = results.filter((d) => d.country === filters.country);
    }

    if (filters.court !== "all") {
      results = results.filter((d) => d.court === filters.court);
    }

    if (filters.dateStart) {
      results = results.filter((d) => d.date >= filters.dateStart);
    }

    if (filters.dateEnd) {
      results = results.filter((d) => d.date <= filters.dateEnd);
    }

    results = results.filter((d) => (d.relevanceScore || 0) >= filters.minRelevance);

    // Sort
    results.sort((a, b) => {
      if (sortBy === "relevance") {
        return (b.relevanceScore || 0) - (a.relevanceScore || 0);
      } else if (sortBy === "date-desc") {
        return b.date.localeCompare(a.date);
      } else {
        return a.date.localeCompare(b.date);
      }
    });

    return results;
  }, [searchQuery, searchPerformed, filters, sortBy]);

  return (
    <div className="flex-1 min-h-screen bg-background overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border px-8 py-4">
        <div className="max-w-[1600px] mx-auto">
          <h1 className="font-serif text-2xl font-bold text-foreground">{t.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t.subtitle}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_400px] gap-6">
          {/* Left Column - Filters */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-muted-foreground">
                {language === "tr" ? "Araştırma Modu" : "Research Mode"}
              </label>
              <button
                onClick={() => setResearchMode(!researchMode)}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  researchMode ? "bg-primary" : "bg-muted"
                )}
                aria-label={language === "tr" ? "Araştırma modunu aç/kapat" : "Toggle research mode"}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    researchMode ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
            <Filters
              filters={filters}
              onFiltersChange={setFilters}
              sortBy={sortBy}
              onSortChange={setSortBy}
              language={language}
            />
            <div className="pt-2">
              <ResearchExportMenu
                language={language}
                researchMode={researchMode}
                hasSearchPerformed={searchPerformed}
              />
            </div>
          </div>

          {/* Middle Column - Search & Results */}
          <div className="space-y-6">
            {/* Search Box */}
            <SearchBox
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              onKeyDown={handleKeyDown}
              isLoading={isLoading}
              language={language}
            />

            {/* Results List */}
            {searchPerformed ? (
              <ResultsList
                results={computedResults}
                isLoading={isLoading}
                selectedId={selectedDecision?.id}
                onSelect={(decision) => {
                  setSelectedDecision(decision);
                  if (queryId) {
                    logDecisionClick(queryId, decision.id);
                  }
                }}
                language={language}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                queryId={queryId}
                searchQuery={searchQuery}
                onFeedback={handleFeedback}
                researchMode={researchMode}
              />
            ) : (
              <div className="glass-card rounded-xl p-12 text-center">
                <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center mb-4 mx-auto">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                  {t.startSearch}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t.startSearchDesc}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Preview Panel */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            <DecisionPreview
              decision={selectedDecision}
              onReadFullText={() => setFullTextModalOpen(true)}
              language={language}
              isFavorite={selectedDecision ? isFavorite(selectedDecision.id) : false}
              onToggleFavorite={() => selectedDecision && toggleFavorite(selectedDecision.id)}
              queryId={queryId}
              searchQuery={searchQuery}
              onFeedback={selectedDecision ? (value) => handleFeedback(selectedDecision.id, value) : undefined}
              researchMode={researchMode}
            />
          </div>
        </div>
      </main>

      {/* Full Text Modal */}
      <FullTextModal
        decision={selectedDecision}
        isOpen={fullTextModalOpen}
        onClose={() => setFullTextModalOpen(false)}
        language={language}
      />
    </div>
  );
};


export default CaseSearchPage;

