import { Search, Star, History, Calculator, Clock, FileText, BookOpen, LogIn, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  language: "tr" | "en";
  onLanguageChange: (lang: "tr" | "en") => void;
}

const Sidebar = ({ activeItem, onItemClick, language, onLanguageChange }: SidebarProps) => {
  const menuItems = {
    tr: {
      main: "Ana Menü",
      search: "Karar Arama",
      favorites: "Favorilerim",
      history: "Arama Geçmişi",
      tools: "Hukuki Araçlar",
      interest: "Faiz Hesaplama",
      execution: "İnfaz Hesaplama",
      petitions: "Dilekçe Şablonları",
      legislation: "Mevzuat",
      login: "Giriş Yapın",
    },
    en: {
      main: "Main Menu",
      search: "Case Search",
      favorites: "My Favorites",
      history: "Search History",
      tools: "Legal Tools",
      interest: "Interest Calculator",
      execution: "Execution Calculator",
      petitions: "Petition Templates",
      legislation: "Legislation",
      login: "Sign In",
    },
  };

  const t = menuItems[language];

  return (
    <aside className="w-72 h-screen sidebar-glass flex flex-col fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: '#313643' }}>
        <h1 className="font-serif text-2xl font-bold tracking-tight" style={{ color: '#EFF2F7' }}>
          DECRETUM
        </h1>
        <p className="text-sm mt-1" style={{ color: '#9B9FA9' }}>
          Search decisions, draft smarter.
        </p>
      </div>

      {/* Language Toggle */}
      <div className="px-4 py-3 border-b" style={{ borderColor: '#313643' }}>
        <div className="flex items-center gap-2 rounded-lg p-1 language-toggle-container">
          <button
            onClick={() => onLanguageChange("tr")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all",
              language === "tr"
                ? "language-toggle-btn-active"
                : "language-toggle-btn-inactive"
            )}
          >
            <Globe className="w-4 h-4" />
            TR
          </button>
          <button
            onClick={() => onLanguageChange("en")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all",
              language === "en"
                ? "language-toggle-btn-active"
                : "language-toggle-btn-inactive"
            )}
          >
            <Globe className="w-4 h-4" />
            EN
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <div className="mb-6">
          <p className="px-4 text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#666A74' }}>
            {t.main}
          </p>
          <div className="space-y-1">
            <button
              onClick={() => onItemClick("search")}
              className={cn("nav-item w-full", activeItem === "search" && "active")}
            >
              <Search className="w-5 h-5" />
              {t.search}
            </button>
            <button
              onClick={() => onItemClick("favorites")}
              className={cn("nav-item w-full", activeItem === "favorites" && "active")}
            >
              <Star className="w-5 h-5" />
              {t.favorites}
            </button>
            <button
              onClick={() => onItemClick("history")}
              className={cn("nav-item w-full", activeItem === "history" && "active")}
            >
              <History className="w-5 h-5" />
              {t.history}
            </button>
          </div>
        </div>

        <div>
          <p className="px-4 text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#666A74' }}>
            {t.tools}
          </p>
          <div className="space-y-1">
            <button
              onClick={() => onItemClick("interest")}
              className={cn("nav-item w-full", activeItem === "interest" && "active")}
            >
              <Calculator className="w-5 h-5" />
              {t.interest}
            </button>
            <button
              onClick={() => onItemClick("execution")}
              className={cn("nav-item w-full", activeItem === "execution" && "active")}
            >
              <Clock className="w-5 h-5" />
              {t.execution}
            </button>
            <button
              onClick={() => onItemClick("petitions")}
              className={cn("nav-item w-full", activeItem === "petitions" && "active")}
            >
              <FileText className="w-5 h-5" />
              {t.petitions}
            </button>
            <button
              onClick={() => onItemClick("legislation")}
              className={cn("nav-item w-full", activeItem === "legislation" && "active")}
            >
              <BookOpen className="w-5 h-5" />
              {t.legislation}
            </button>
          </div>
        </div>
      </nav>

      {/* Login */}
      <div className="p-4 border-t" style={{ borderColor: '#313643' }}>
        <button className="nav-item w-full" style={{ color: '#AEB0B6' }}>
          <LogIn className="w-5 h-5" />
          {t.login}
        </button>
      </div>
    </aside>
  );
};

export { Sidebar };
