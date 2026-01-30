import { Decision } from "../CaseSearchPage";
import { DecisionCard } from "./DecisionCard";
import { FileText } from "lucide-react";
import { FeedbackValue } from "./types";
import { getFeedbackForDecision } from "./feedbackHelpers";

interface ResultsListProps {
  results: Decision[];
  isLoading: boolean;
  selectedId?: string;
  onSelect: (decision: Decision) => void;
  language: "tr" | "en";
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  queryId: string;
  searchQuery: string;
  onFeedback?: (decisionId: string, value: FeedbackValue) => void;
  researchMode?: boolean;
}

export const ResultsList = ({
  results,
  isLoading,
  selectedId,
  onSelect,
  language,
  isFavorite,
  onToggleFavorite,
  queryId,
  searchQuery,
  onFeedback,
  researchMode = false,
}: ResultsListProps) => {
  const content = {
    tr: {
      noResults: "Sonuç bulunamadı",
      noResultsDesc: "Arama sorgunuzu veya filtrelerinizi ayarlamayı deneyin",
      found: "sonuç bulundu",
      foundPlural: "sonuç bulundu",
    },
    en: {
      noResults: "No results found",
      noResultsDesc: "Try adjusting your search query or filters",
      found: "result found",
      foundPlural: "results found",
    },
  };

  const t = content[language];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card rounded-xl p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-3" />
            <div className="h-3 bg-muted rounded w-1/2 mb-4" />
            <div className="h-3 bg-muted rounded w-full mb-2" />
            <div className="h-3 bg-muted rounded w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="glass-card rounded-xl p-12 text-center">
        <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center mb-4 mx-auto">
          <FileText className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
          {t.noResults}
        </h3>
        <p className="text-muted-foreground text-sm">
          {t.noResultsDesc}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        {results.length} {results.length === 1 ? t.found : t.foundPlural}
      </div>
      {results.map((decision) => {
        const feedback = queryId ? getFeedbackForDecision(queryId, decision.id) : null;
        return (
          <DecisionCard
            key={decision.id}
            decision={decision}
            isSelected={decision.id === selectedId}
            onClick={() => onSelect(decision)}
            isFavorite={isFavorite(decision.id)}
            onToggleFavorite={(e) => {
              e.stopPropagation();
              onToggleFavorite(decision.id);
            }}
            language={language}
            queryId={queryId}
            searchQuery={searchQuery}
            onFeedback={onFeedback ? (value) => onFeedback(decision.id, value) : undefined}
            researchMode={researchMode}
            currentFeedback={feedback?.value || null}
          />
        );
      })}
    </div>
  );
};

