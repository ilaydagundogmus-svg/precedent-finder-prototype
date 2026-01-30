import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

export interface RelevantSection {
  id: string;
  code?: string;
  title: string;
  score?: number;
  snippet?: string;
}

interface RelevantSectionCardProps {
  section: RelevantSection;
  onClick?: () => void;
}

export function RelevantSectionCard({
  section,
  onClick,
}: RelevantSectionCardProps) {
  return (
    <Card
      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          {section.code && (
            <p className="text-xs font-semibold text-[#2c4563] mb-1 break-words">
              {section.code}
            </p>
          )}
          <p className="text-sm font-medium text-gray-900 break-words">
            {section.title}
          </p>
        </div>

        {typeof section.score === "number" && (
          <Badge
            variant="secondary"
            className="shrink-0 bg-blue-100 text-blue-700 border-0 text-[11px]"
          >
            %{section.score} ilgili
          </Badge>
        )}
      </div>

      {section.snippet && (
        <p className="text-xs text-gray-600 leading-relaxed break-words line-clamp-3">
          {section.snippet}
        </p>
      )}
    </Card>
  );
}


