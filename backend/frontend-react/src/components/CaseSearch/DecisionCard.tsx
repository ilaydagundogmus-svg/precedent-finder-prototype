import { Decision } from "../CaseSearchPage";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Calendar, Building2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RelevanceExplanation } from "./RelevanceExplanation";
import { FeedbackButtons } from "./FeedbackButtons";
import { highlightMatches, tokenizeQuery } from "./relevanceHelpers";
import { FeedbackValue } from "./types";

interface DecisionCardProps {
  decision: Decision;
  isSelected: boolean;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  language: "tr" | "en";
  queryId: string;
  searchQuery: string;
  onFeedback?: (value: FeedbackValue) => void;
  researchMode?: boolean;
  currentFeedback?: FeedbackValue | null;
}

export const DecisionCard = ({
  decision,
  isSelected,
  onClick,
  isFavorite,
  onToggleFavorite,
  language,
  queryId,
  searchQuery,
  onFeedback,
  researchMode = false,
  currentFeedback = null,
}: DecisionCardProps) => {
  const score = decision.relevanceScore || 0;
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500/20 text-green-600 border-green-500/30";
    if (score >= 60) return "bg-blue-500/20 text-blue-600 border-blue-500/30";
    if (score >= 40) return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
    return "bg-gray-500/20 text-gray-600 border-gray-500/30";
  };

  const ariaLabels = {
    tr: {
      addFavorite: "Favorilere ekle",
      removeFavorite: "Favorilerden çıkar",
    },
    en: {
      addFavorite: "Add to favorites",
      removeFavorite: "Remove from favorites",
    },
  };

  const t = ariaLabels[language];

  return (
    <div
      className={cn(
        "relative w-full glass-card rounded-xl p-6 transition-all duration-200",
        "hover:shadow-lg hover:scale-[1.02]",
        isSelected && "ring-2 ring-[#395BB2] shadow-lg"
      )}
    >
      <button
        onClick={onClick}
        className="w-full text-left pr-10"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{decision.title}</h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {decision.court}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(decision.date).toLocaleDateString(language === "tr" ? "tr-TR" : "en-US")}
              </div>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn("shrink-0 ml-2", getScoreColor(score))}
          >
            {score}%
          </Badge>
        </div>

        {/* Relevance Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-3">
          <div
            className={cn(
              "h-2 rounded-full transition-all",
              score >= 80 ? "bg-green-500" : score >= 60 ? "bg-blue-500" : score >= 40 ? "bg-yellow-500" : "bg-gray-500"
            )}
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Summary */}
        <div className="text-sm text-muted-foreground line-clamp-2">
          {searchQuery && searchQuery.trim()
            ? highlightMatches(decision.summary, tokenizeQuery(searchQuery))
            : decision.summary}
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {decision.keywords.slice(0, 3).map((keyword) => (
            <Badge
              key={keyword}
              variant="secondary"
              className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20"
            >
              {keyword}
            </Badge>
          ))}
        </div>
      </button>

      {/* Relevance Explanation & Feedback */}
      {(researchMode || decision.relevanceBreakdown) && decision.relevanceBreakdown && (
        <div className="mt-3 pt-3 border-t border-border">
          <RelevanceExplanation
            breakdown={decision.relevanceBreakdown}
            language={language}
            compact={true}
          />
        </div>
      )}
      
      {onFeedback && queryId && (
        <FeedbackButtons
          value={currentFeedback}
          onFeedback={onFeedback}
          language={language}
          compact={true}
        />
      )}

      {/* Favorite Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleFavorite}
        className={cn(
          "absolute top-4 right-4 h-8 w-8 rounded-full",
          "hover:bg-accent",
          isFavorite && "text-yellow-500 hover:text-yellow-600"
        )}
        aria-label={isFavorite ? t.removeFavorite : t.addFavorite}
      >
        <Star className={cn("w-4 h-4", isFavorite && "fill-current")} />
      </Button>
    </div>
  );
};

