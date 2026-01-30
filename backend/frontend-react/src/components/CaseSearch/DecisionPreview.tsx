import { Decision } from "../CaseSearchPage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Building2, FileText, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { RelevanceExplanation } from "./RelevanceExplanation";
import { FeedbackButtons } from "./FeedbackButtons";
import { highlightMatches, tokenizeQuery } from "./relevanceHelpers";
import { FeedbackValue } from "./types";
import { getFeedbackForDecision } from "./feedbackHelpers";

interface DecisionPreviewProps {
  decision: Decision | null;
  onReadFullText: () => void;
  language: "tr" | "en";
  isFavorite: boolean;
  onToggleFavorite: () => void;
  queryId: string;
  searchQuery: string;
  onFeedback?: (value: FeedbackValue) => void;
  researchMode?: boolean;
}

export const DecisionPreview = ({
  decision,
  onReadFullText,
  language,
  isFavorite,
  onToggleFavorite,
  queryId,
  searchQuery,
  onFeedback,
  researchMode = false,
}: DecisionPreviewProps) => {
  const content = {
    tr: {
      selectDecision: "Önizleme için bir karar seçin",
      summary: "Özet",
      keywords: "Anahtar Kelimeler",
      readFullText: "Tam Metni Oku",
      addFavorite: "Favorilere Ekle",
      removeFavorite: "Favorilerden Çıkar",
    },
    en: {
      selectDecision: "Select a decision to preview",
      summary: "Summary",
      keywords: "Keywords",
      readFullText: "Read Full Text",
      addFavorite: "Add to Favorites",
      removeFavorite: "Remove from Favorites",
    },
  };

  const t = content[language];

  if (!decision) {
    return (
      <div className="glass-card rounded-xl p-8 h-full flex items-center justify-center text-center">
        <div>
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">
            {t.selectDecision}
          </p>
        </div>
      </div>
    );
  }

  const score = decision.relevanceScore || 0;
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500/20 text-green-600 border-green-500/30";
    if (score >= 60) return "bg-blue-500/20 text-blue-600 border-blue-500/30";
    if (score >= 40) return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
    return "bg-gray-500/20 text-gray-600 border-gray-500/30";
  };

  return (
    <div className="glass-card rounded-xl p-6 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-3 gap-2">
          <h2 className="font-serif text-xl font-bold text-foreground flex-1 pr-2">{decision.title}</h2>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className={cn(getScoreColor(score))}>
              {score}%
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleFavorite}
              className={cn(
                "h-8 w-8 rounded-full",
                "hover:bg-accent",
                isFavorite && "text-yellow-500 hover:text-yellow-600"
              )}
              aria-label={isFavorite ? t.removeFavorite : t.addFavorite}
            >
              <Star className={cn("w-4 h-4", isFavorite && "fill-current")} />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            {decision.court}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(decision.date).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Relevance Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div
            className={cn(
              "h-2 rounded-full transition-all",
              score >= 80 ? "bg-green-500" : score >= 60 ? "bg-blue-500" : score >= 40 ? "bg-yellow-500" : "bg-gray-500"
            )}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4 flex-1 overflow-y-auto">
        <h3 className="text-sm font-semibold text-foreground mb-2">{t.summary}</h3>
        <div className="text-sm text-muted-foreground leading-relaxed">
          {searchQuery && searchQuery.trim()
            ? highlightMatches(decision.summary, tokenizeQuery(searchQuery))
            : decision.summary}
        </div>
      </div>

      {/* Relevance Explanation */}
      {(researchMode || decision.relevanceBreakdown) && decision.relevanceBreakdown && (
        <div className="mb-4">
          <RelevanceExplanation
            breakdown={decision.relevanceBreakdown}
            language={language}
            compact={false}
          />
        </div>
      )}

      {/* Keywords */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground mb-2">{t.keywords}</h3>
        <div className="flex flex-wrap gap-2">
          {decision.keywords.map((keyword) => (
            <Badge
              key={keyword}
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20"
            >
              {keyword}
            </Badge>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {onFeedback && queryId && decision && (
        <FeedbackButtons
          value={getFeedbackForDecision(queryId, decision.id)?.value || null}
          onFeedback={onFeedback}
          language={language}
          compact={false}
        />
      )}

      {/* Action Button */}
      <Button
        onClick={onReadFullText}
        className="w-full bg-[#395BB2] hover:bg-[#2d4a8f] text-white mt-4"
      >
        <FileText className="w-4 h-4 mr-2" />
        {t.readFullText}
      </Button>
    </div>
  );
};

