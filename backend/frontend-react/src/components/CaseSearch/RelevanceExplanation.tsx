import { RelevanceBreakdown } from "./types";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useState } from "react";

interface RelevanceExplanationProps {
  breakdown: RelevanceBreakdown;
  language: "tr" | "en";
  compact?: boolean;
}

export const RelevanceExplanation = ({
  breakdown,
  language,
  compact = false,
}: RelevanceExplanationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const content = {
    tr: {
      whyMatched: "Neden Bu Sonuç?",
      breakdown: "Skor Detayı",
      keywordScore: "Anahtar Kelime",
      titleScore: "Başlık",
      summaryScore: "Özet",
      fullTextScore: "Tam Metin",
      topTerms: "En Etkili Terimler",
      totalScore: "Toplam Skor",
    },
    en: {
      whyMatched: "Why This Result?",
      breakdown: "Score Breakdown",
      keywordScore: "Keywords",
      titleScore: "Title",
      summaryScore: "Summary",
      fullTextScore: "Full Text",
      topTerms: "Top Contributing Terms",
      totalScore: "Total Score",
    },
  };

  const t = content[language];

  const maxBreakdownScore = Math.max(
    breakdown.keywordScore,
    breakdown.titleScore,
    breakdown.summaryScore,
    breakdown.fullTextScore,
    1
  );

  if (compact) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-3">
        <CollapsibleTrigger className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full">
          <Sparkles className="w-3 h-3" />
          <span>{t.whyMatched}</span>
          {isOpen ? (
            <ChevronUp className="w-3 h-3 ml-auto" />
          ) : (
            <ChevronDown className="w-3 h-3 ml-auto" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-2">
          <div className="text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t.keywordScore}</span>
              <span className="font-medium">{breakdown.keywordScore}%</span>
            </div>
            <Progress value={(breakdown.keywordScore / maxBreakdownScore) * 100} className="h-1" />
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t.titleScore}</span>
              <span className="font-medium">{breakdown.titleScore}%</span>
            </div>
            <Progress value={(breakdown.titleScore / maxBreakdownScore) * 100} className="h-1" />
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t.summaryScore}</span>
              <span className="font-medium">{breakdown.summaryScore}%</span>
            </div>
            <Progress value={(breakdown.summaryScore / maxBreakdownScore) * 100} className="h-1" />
          </div>

          {breakdown.topTerms.length > 0 && (
            <div className="pt-2 border-t border-border">
              <div className="text-xs font-medium text-muted-foreground mb-1.5">
                {t.topTerms}
              </div>
              <div className="flex flex-wrap gap-1">
                {breakdown.topTerms.map((term, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-xs px-1.5 py-0 bg-primary/10 text-primary border-primary/20"
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <div className="space-y-3 pt-3 border-t border-border">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-semibold text-foreground">{t.whyMatched}</h4>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{t.keywordScore}</span>
          <span className="font-medium">{breakdown.keywordScore}%</span>
        </div>
        <Progress value={(breakdown.keywordScore / maxBreakdownScore) * 100} className="h-2" />

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{t.titleScore}</span>
          <span className="font-medium">{breakdown.titleScore}%</span>
        </div>
        <Progress value={(breakdown.titleScore / maxBreakdownScore) * 100} className="h-2" />

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{t.summaryScore}</span>
          <span className="font-medium">{breakdown.summaryScore}%</span>
        </div>
        <Progress value={(breakdown.summaryScore / maxBreakdownScore) * 100} className="h-2" />

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{t.fullTextScore}</span>
          <span className="font-medium">{breakdown.fullTextScore}%</span>
        </div>
        <Progress value={(breakdown.fullTextScore / maxBreakdownScore) * 100} className="h-2" />
      </div>

      {breakdown.topTerms.length > 0 && (
        <div className="pt-2">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            {t.topTerms}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {breakdown.topTerms.map((term, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20"
              >
                {term}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

