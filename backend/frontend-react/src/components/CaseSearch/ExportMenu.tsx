import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileJson, FileSpreadsheet } from "lucide-react";
import { exportFeedbackJSON, exportFeedbackCSV, getStoredFeedback } from "./feedbackHelpers";

interface ExportMenuProps {
  language: "tr" | "en";
}

export const ExportMenu = ({ language }: ExportMenuProps) => {
  const content = {
    tr: {
      export: "Dışa Aktar",
      exportJSON: "JSON olarak dışa aktar",
      exportCSV: "CSV olarak dışa aktar",
      noFeedback: "Henüz geribildirim yok",
    },
    en: {
      export: "Export",
      exportJSON: "Export as JSON",
      exportCSV: "Export as CSV",
      noFeedback: "No feedback yet",
    },
  };

  const t = content[language];

  const handleExport = (format: "json" | "csv") => {
    const entries = getStoredFeedback();
    
    if (entries.length === 0) {
      alert(t.noFeedback);
      return;
    }

    if (format === "json") {
      exportFeedbackJSON(entries);
    } else {
      exportFeedbackCSV(entries);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          {t.export}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("json")}>
          <FileJson className="w-4 h-4 mr-2" />
          {t.exportJSON}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          {t.exportCSV}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

