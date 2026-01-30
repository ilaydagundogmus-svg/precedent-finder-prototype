import { Decision } from "../CaseSearchPage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, Building2, X } from "lucide-react";

interface FullTextModalProps {
  decision: Decision | null;
  isOpen: boolean;
  onClose: () => void;
  language: "tr" | "en";
}

export const FullTextModal = ({ decision, isOpen, onClose, language }: FullTextModalProps) => {
  const content = {
    tr: {
      fullText: "Tam Metin",
      relevance: "İlgililik",
    },
    en: {
      fullText: "Full Text",
      relevance: "Relevance",
    },
  };

  const t = content[language];

  if (!decision) return null;

  const score = decision.relevanceScore || 0;
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500/20 text-green-600 border-green-500/30";
    if (score >= 60) return "bg-blue-500/20 text-blue-600 border-blue-500/30";
    if (score >= 40) return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
    return "bg-gray-500/20 text-gray-600 border-gray-500/30";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <DialogTitle className="text-xl font-serif font-bold mb-2">
                {decision.title}
              </DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
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
              <div className="flex flex-wrap gap-2 mb-3">
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
              <Badge variant="outline" className={getScoreColor(score)}>
                {t.relevance}: {score}%
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <h3 className="text-sm font-semibold text-foreground mb-2">{t.fullText}</h3>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {decision.fullText}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

