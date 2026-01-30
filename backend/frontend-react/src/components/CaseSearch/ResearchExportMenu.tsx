import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Download, FileJson, FileSpreadsheet, Loader2, Info } from "lucide-react";
import {
  buildResearchExportData,
  exportResearchJSON,
  exportResearchCSV,
  getStoredFeedback,
} from "./feedbackHelpers";
import { toast } from "sonner";

interface ResearchExportMenuProps {
  language: "tr" | "en";
  researchMode: boolean;
  hasSearchPerformed: boolean;
}

export const ResearchExportMenu = ({
  language,
  researchMode,
  hasSearchPerformed,
}: ResearchExportMenuProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const content = {
    tr: {
      export: "Araştırma Verisini Dışa Aktar",
      exportJSON: "Araştırma verisini JSON olarak indir",
      exportCSV: "Araştırma verisini CSV olarak indir",
      tooltipDisabled:
        "Araştırma verisi dışa aktarılabilmesi için en az bir karar değerlendirilmelidir.",
      tooltipInfo:
        "Bu işlem, anonimleştirilmiş kullanıcı etkileşimi ve alaka değerlendirme verisini araştırma ve değerlendirme amaçlı dışa aktarır.",
      success: "Araştırma verisi başarıyla dışa aktarıldı.",
      error: "Veri dışa aktarılırken bir hata oluştu.",
    },
    en: {
      export: "Export Research Data",
      exportJSON: "Download research data as JSON",
      exportCSV: "Download research data as CSV",
      tooltipDisabled:
        "At least one decision must be evaluated to export research data.",
      tooltipInfo:
        "This operation exports anonymized user interaction and relevance assessment data for research and evaluation purposes.",
      success: "Research data exported successfully.",
      error: "An error occurred while exporting data.",
    },
  };

  const t = content[language];

  // Check if export is possible
  const feedbackEntries = getStoredFeedback();
  const canExport =
    researchMode && hasSearchPerformed && feedbackEntries.length > 0;

  const handleExport = async (format: "json" | "csv") => {
    if (!canExport) return;

    setIsExporting(true);
    try {
      // Small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 300));

      const data = buildResearchExportData();

      if (data.length === 0) {
        toast.error(t.tooltipDisabled);
        setIsExporting(false);
        return;
      }

      if (format === "json") {
        exportResearchJSON(data);
      } else {
        exportResearchCSV(data);
      }

      toast.success(t.success);
    } catch (error) {
      console.error("Export error:", error);
      toast.error(t.error);
    } finally {
      setIsExporting(false);
    }
  };

  // Don't render if research mode is off
  if (!researchMode) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={!canExport || isExporting}
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {t.export}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleExport("json")}
                  disabled={!canExport || isExporting}
                >
                  <FileJson className="w-4 h-4 mr-2" />
                  {t.exportJSON}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleExport("csv")}
                  disabled={!canExport || isExporting}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  {t.exportCSV}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-xs">
            {!canExport ? (
              <p>{t.tooltipDisabled}</p>
            ) : (
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                <p>{t.tooltipInfo}</p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

