import { X, Download } from "lucide-react";
import { Badge } from "./ui/badge";
import { RelevantSectionCard } from "./RelevantSectionCard";

export interface DecisionDetailResult {
  id: string;
  caseNumber: string;
  date: string;
  chamber: string;
  subject: string;
  summary: string;
  relevance?: number;
  fullText?: string;
  pdfUrl?: string;
}

// RelevantSection tipini componentin props'undan
type RelevantSection = React.ComponentProps<typeof RelevantSectionCard>["section"];

interface DecisionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  decision: DecisionDetailResult | null;
  fullText?: string;
  relevantSections?: RelevantSection[];
  pdfUrl?: string;
  searchQuery?: string;
}

export function DecisionDetailModal({
  isOpen,
  onClose,
  decision,
  fullText,
  relevantSections,
  pdfUrl,
  searchQuery,
}: DecisionDetailModalProps) {
  if (!isOpen || !decision) {
    return null;
  }

  // Use fullText prop if available, otherwise fall back to decision.fullText
  const textToDisplay = fullText || decision.fullText;
  
  const displayText = (textToDisplay && textToDisplay.trim().length > 0)
    ? Array.from(new Set(textToDisplay.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean))).join("\n\n")
    : decision.summary;

  // Function to highlight sentences containing search query keywords
  const highlightRelevantText = (text: string): React.ReactNode => {
    // Use searchQuery if available, otherwise return text without highlighting
    if (!searchQuery || !searchQuery.trim()) {
      return text;
    }

    // Turkish stop words to filter out
    const stopWords = new Set([
      'bir', 'bu', 'şu', 'o', 've', 'ile', 'için', 'gibi', 'kadar', 'daha', 'en', 'çok',
      'az', 'mi', 'mı', 'mu', 'mü', 'da', 'de', 'ta', 'te', 'ya', 'ye', 'ki', 'ise',
      'ama', 'fakat', 'ancak', 'lakin', 'çünkü', 'zira', 'halbuki', 'oysa', 'oysaki',
      'eğer', 'şayet', 'hangi', 'hangisi', 'nerede', 'nereye', 'nereden', 'nasıl',
      'ne', 'kim', 'kimi', 'kime', 'kimden', 'kimin', 'neden', 'niçin', 'niye'
    ]);

    // Extract meaningful words from search query
    const words = searchQuery
      .toLowerCase()
      .replace(/[.,;:!?()[\]{}'"]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word.toLowerCase()));

    if (words.length === 0) {
      return text;
    }

    // Remove duplicates
    const uniqueKeywords = Array.from(new Set(words));

    // Create regex pattern for matching keywords (case-insensitive)
    const escapedKeywords = uniqueKeywords.map(k => 
      k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    const keywordPattern = new RegExp(`\\b(${escapedKeywords.join('|')})\\b`, 'gi');

    // Split text into sentences (by period, question mark, exclamation mark)
    // Keep the sentence delimiters
    const sentenceRegex = /([.!?]+)\s*/g;
    const sentences: Array<{ text: string; delimiter: string; hasKeyword: boolean }> = [];
    let lastIndex = 0;
    let match;

    sentenceRegex.lastIndex = 0;
    while ((match = sentenceRegex.exec(text)) !== null) {
      const sentenceText = text.substring(lastIndex, match.index);
      const delimiter = match[1];
      const fullSentence = sentenceText.trim();
      
      if (fullSentence.length > 0) {
        // Check if sentence contains any of the keywords
        const hasKeyword = keywordPattern.test(fullSentence);
        sentences.push({ text: fullSentence, delimiter, hasKeyword });
      }
      
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text if any
    if (lastIndex < text.length) {
      const remaining = text.substring(lastIndex).trim();
      if (remaining.length > 0) {
        keywordPattern.lastIndex = 0;
        const hasKeyword = keywordPattern.test(remaining);
        sentences.push({ text: remaining, delimiter: '', hasKeyword });
      }
    }

    // If no sentences found, split by newlines
    if (sentences.length === 0) {
      const lines = text.split('\n');
      const parts: React.ReactNode[] = [];
      lines.forEach((line, index) => {
        if (line.trim().length > 0) {
          keywordPattern.lastIndex = 0;
          const hasKeyword = keywordPattern.test(line);
          if (hasKeyword) {
            parts.push(
              <mark key={`highlight-${index}`} className="bg-yellow-200 text-gray-900 rounded px-1 py-0.5 block">
                {line}
              </mark>
            );
          } else {
            parts.push(line);
          }
          if (index < lines.length - 1) {
            parts.push('\n');
          }
        } else {
          parts.push('\n');
        }
      });
      return parts;
    }

    // Build the result with highlighted sentences
    const parts: React.ReactNode[] = [];
    sentences.forEach((sentence, index) => {
      if (sentence.hasKeyword) {
        parts.push(
          <mark key={`highlight-${index}`} className="bg-yellow-200 text-gray-900 rounded px-1 py-0.5">
            {sentence.text}{sentence.delimiter}
          </mark>
        );
      } else {
        parts.push(`${sentence.text}${sentence.delimiter}`);
      }
      // Add space between sentences
      if (index < sentences.length - 1) {
        parts.push(' ');
      }
    });

    return parts;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="max-w-[1200px] w-full max-h-[90vh] mx-4 rounded-xl bg-white shadow-xl border border-gray-200 flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-100">
          <div className="min-w-0 space-y-1">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Karar Detayı
            </p>
            <h2 className="text-lg font-semibold text-[#2c4563] break-words">
              {decision.caseNumber}
            </h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
              <span>{decision.date}</span>
              <span>•</span>
              <span className="truncate max-w-[220px]">{decision.chamber}</span>
              {decision.relevance != null && (
                <>
                  <span>•</span>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 border-0"
                  >
                    %{decision.relevance} eşleşme
                  </Badge>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {pdfUrl && (
              <a href={pdfUrl} download className="inline-flex">
                <button
                  type="button"
                  className="inline-flex h-8 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  PDF İndir
                </button>
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-hidden px-6 py-4">
          <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-6 h-full">
            {/* Left column: summary + full text */}
            <section className="min-w-0 flex flex-col gap-4 overflow-hidden">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900 break-words">
                  {decision.subject}
                </h3>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r">
                  <p className="text-sm text-gray-700 break-words">
                    {decision.summary}
                  </p>
                </div>
              </div>

              <div className="flex flex-col">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  Kararın Tam Metni
                </h4>

                {/* max-height = scrolling */}
                <div className="max-h-[55vh] overflow-y-auto rounded-lg border border-gray-100 bg-gray-50/60 p-4 pr-3">
                  <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap break-words">
                    {highlightRelevantText(displayText)}
                  </div>
                </div>
              </div>
            </section>

            {/* Right column: relevant sections */}
            <aside className="w-[320px] shrink-0 flex flex-col min-h-0">
              <div className="mb-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  İlgili Maddeler
                </h4>
                <p className="text-xs text-gray-500">
                  Kararla en çok ilişkili mevzuat ve alt başlıklar
                </p>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2 scrollbar-visible">
                {relevantSections && relevantSections.length > 0 ? (
                  relevantSections.map((section) => (
                    <RelevantSectionCard key={section.id} section={section} />
                  ))
                ) : (
                  <p className="text-xs text-gray-400">
                    İlgili madde bilgisi henüz bulunmuyor.
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
