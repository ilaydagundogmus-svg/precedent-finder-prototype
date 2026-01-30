import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { FeedbackValue } from "./types";
import { cn } from "@/lib/utils";

interface FeedbackButtonsProps {
  value: FeedbackValue | null;
  onFeedback: (value: FeedbackValue) => void;
  language: "tr" | "en";
  compact?: boolean;
}

export const FeedbackButtons = ({
  value,
  onFeedback,
  language,
  compact = false,
}: FeedbackButtonsProps) => {
  const content = {
    tr: {
      relevant: "İlgili",
      notRelevant: "İlgisiz",
      relevantAria: "Bu sonucu ilgili olarak işaretle",
      notRelevantAria: "Bu sonucu ilgisiz olarak işaretle",
    },
    en: {
      relevant: "Relevant",
      notRelevant: "Not Relevant",
      relevantAria: "Mark this result as relevant",
      notRelevantAria: "Mark this result as not relevant",
    },
  };

  const t = content[language];

  if (compact) {
    return (
      <div className="flex items-center gap-1 mt-2">
        <Button
          variant={value === "relevant" ? "default" : "ghost"}
          size="sm"
          onClick={() => onFeedback("relevant")}
          className={cn(
            "h-7 px-2 text-xs",
            value === "relevant" && "bg-green-600 hover:bg-green-700 text-white"
          )}
          aria-label={t.relevantAria}
        >
          <ThumbsUp className="w-3 h-3" />
        </Button>
        <Button
          variant={value === "not_relevant" ? "default" : "ghost"}
          size="sm"
          onClick={() => onFeedback("not_relevant")}
          className={cn(
            "h-7 px-2 text-xs",
            value === "not_relevant" && "bg-red-600 hover:bg-red-700 text-white"
          )}
          aria-label={t.notRelevantAria}
        >
          <ThumbsDown className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2 pt-3 border-t border-border">
      <div className="text-xs font-medium text-muted-foreground mb-2">
        {language === "tr" ? "Geribildirim" : "Feedback"}
      </div>
      <div className="flex gap-2">
        <Button
          variant={value === "relevant" ? "default" : "outline"}
          size="sm"
          onClick={() => onFeedback("relevant")}
          className={cn(
            "flex-1 text-xs",
            value === "relevant" && "bg-green-600 hover:bg-green-700 text-white"
          )}
          aria-label={t.relevantAria}
        >
          <ThumbsUp className="w-3 h-3 mr-1" />
          {t.relevant}
        </Button>
        <Button
          variant={value === "not_relevant" ? "default" : "outline"}
          size="sm"
          onClick={() => onFeedback("not_relevant")}
          className={cn(
            "flex-1 text-xs",
            value === "not_relevant" && "bg-red-600 hover:bg-red-700 text-white"
          )}
          aria-label={t.notRelevantAria}
        >
          <ThumbsDown className="w-3 h-3 mr-1" />
          {t.notRelevant}
        </Button>
      </div>
    </div>
  );
};

