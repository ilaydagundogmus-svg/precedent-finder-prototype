import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { SearchPanel } from "@/components/SearchPanel";

const Index = () => {
  const [activeItem, setActiveItem] = useState("search");
  const [language, setLanguage] = useState<"tr" | "en">("tr");
  const [jurisdiction, setJurisdiction] = useState("all");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        activeItem={activeItem}
        onItemClick={setActiveItem}
        language={language}
        onLanguageChange={setLanguage}
      />
      <SearchPanel
        language={language}
        jurisdiction={jurisdiction}
        onJurisdictionChange={setJurisdiction}
      />
    </div>
  );
};

export default Index;

