import { Filter, ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

type FilterState = {
  court: string;
  country: string;
  dateStart: string;
  dateEnd: string;
  minRelevance: number;
};

type SortOption = "relevance" | "date-desc" | "date-asc";

interface FiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  language: "tr" | "en";
}

export const Filters = ({ filters, onFiltersChange, sortBy, onSortChange, language }: FiltersProps) => {
  const content = {
    tr: {
      filters: "Filtreler & Sıralama",
      court: "Mahkeme",
      allCourts: "Tüm Mahkemeler",
      yargitay: "Yargıtay",
      danistay: "Danıştay",
      anayasa: "Anayasa Mahkemesi",
      country: "Ülke",
      allCountries: "Tüm Ülkeler",
      turkey: "Türkiye",
      us: "ABD",
      germany: "Almanya",
      france: "Fransa",
      uk: "İngiltere",
      ireland: "İrlanda",
      startDate: "Başlangıç Tarihi",
      endDate: "Bitiş Tarihi",
      minRelevance: "Minimum İlgililik",
      sortBy: "Sırala",
      relevance: "İlgililik (Yüksekten Düşüğe)",
      dateDesc: "Tarih (Yeniden Eskiye)",
      dateAsc: "Tarih (Eskiden Yeniye)",
    },
    en: {
      filters: "Filters & Sort",
      court: "Court",
      allCourts: "All Courts",
      yargitay: "Court of Cassation",
      danistay: "Council of State",
      anayasa: "Constitutional Court",
      country: "Country",
      allCountries: "All Countries",
      turkey: "Turkey",
      us: "United States",
      germany: "Germany",
      france: "France",
      uk: "United Kingdom",
      ireland: "Ireland",
      startDate: "Start Date",
      endDate: "End Date",
      minRelevance: "Minimum Relevance",
      sortBy: "Sort By",
      relevance: "Relevance (High to Low)",
      dateDesc: "Date (Newest First)",
      dateAsc: "Date (Oldest First)",
    },
  };

  const t = content[language];
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">{t.filters}</h3>
      </div>

      <div className="space-y-4">
        {/* Country Filter */}
        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.country}</Label>
          <Select value={filters.country} onValueChange={(value) => updateFilter("country", value)}>
            <SelectTrigger className="w-full bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allCountries}</SelectItem>
              <SelectItem value="Turkey">{t.turkey}</SelectItem>
              <SelectItem value="US">{t.us}</SelectItem>
              <SelectItem value="Germany">{t.germany}</SelectItem>
              <SelectItem value="France">{t.france}</SelectItem>
              <SelectItem value="UK">{t.uk}</SelectItem>
              <SelectItem value="Ireland">{t.ireland}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Court Filter */}
        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.court}</Label>
          <Select value={filters.court} onValueChange={(value) => updateFilter("court", value)}>
            <SelectTrigger className="w-full bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allCourts}</SelectItem>
              <SelectItem value="Yargıtay">{t.yargitay}</SelectItem>
              <SelectItem value="Danıştay">{t.danistay}</SelectItem>
              <SelectItem value="Anayasa Mahkemesi">{t.anayasa}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              {t.startDate}
            </Label>
            <Input
              type="date"
              value={filters.dateStart}
              onChange={(e) => updateFilter("dateStart", e.target.value)}
              className="bg-card border-border"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              {t.endDate}
            </Label>
            <Input
              type="date"
              value={filters.dateEnd}
              onChange={(e) => updateFilter("dateEnd", e.target.value)}
              className="bg-card border-border"
            />
          </div>
        </div>

        {/* Min Relevance */}
        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            {t.minRelevance}: {filters.minRelevance}%
          </Label>
          <Slider
            value={[filters.minRelevance]}
            onValueChange={([value]) => updateFilter("minRelevance", value)}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        {/* Sort */}
        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1.5 block flex items-center gap-2">
            <ArrowUpDown className="w-3 h-3" />
            {t.sortBy}
          </Label>
          <Select
            value={sortBy}
            onValueChange={(value) => onSortChange(value as SortOption)}
          >
            <SelectTrigger className="w-full bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">{t.relevance}</SelectItem>
              <SelectItem value="date-desc">{t.dateDesc}</SelectItem>
              <SelectItem value="date-asc">{t.dateAsc}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

