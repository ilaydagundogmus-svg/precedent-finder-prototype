import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";

export function FilterPanel() {
  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
      <h3 className="mb-6">Filtrele</h3>
      
      {/* Year Filter */}
      <div className="mb-6">
        <Label className="text-sm text-gray-700 mb-2 block">Yıl</Label>
        <Select defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Tüm Yıllar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Yıllar</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2021">2021</SelectItem>
            <SelectItem value="2020">2020</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Daire (Chamber) Filter */}
      <div className="mb-6">
        <Label className="text-sm text-gray-700 mb-2 block">Daire</Label>
        <Select defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Tüm Daireler" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Daireler</SelectItem>
            <SelectItem value="hgk">Hukuk Genel Kurulu</SelectItem>
            <SelectItem value="1">1. Hukuk Dairesi</SelectItem>
            <SelectItem value="2">2. Hukuk Dairesi</SelectItem>
            <SelectItem value="3">3. Hukuk Dairesi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Konu (Subject) Filter */}
      <div className="mb-6">
        <Label className="text-sm text-gray-700 mb-2 block">Konu</Label>
        <Select defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Tüm Konular" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Konular</SelectItem>
            <SelectItem value="haksiz-rekabet">Haksız Rekabet</SelectItem>
            <SelectItem value="is-hukuku" disabled>
              <div className="flex items-center justify-between w-full">
                <span>İş Hukuku</span>
                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-0 ml-2">
                  Yakında
                </Badge>
              </div>
            </SelectItem>
            <SelectItem value="borclar-hukuku" disabled>
              <div className="flex items-center justify-between w-full">
                <span>Borçlar Hukuku</span>
                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-0 ml-2">
                  Yakında
                </Badge>
              </div>
            </SelectItem>
            <SelectItem value="tapu-iptali" disabled>
              <div className="flex items-center justify-between w-full">
                <span>Tapu İptali</span>
                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-0 ml-2">
                  Yakında
                </Badge>
              </div>
            </SelectItem>
            <SelectItem value="tazminat" disabled>
              <div className="flex items-center justify-between w-full">
                <span>Tazminat</span>
                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-0 ml-2">
                  Yakında
                </Badge>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Case Number Filter */}
      <div>
        <Label className="text-sm text-gray-700 mb-2 block">Karar Numarası</Label>
        <Input 
          placeholder="Örn: 2023/1234"
          className="text-sm"
        />
      </div>
    </div>
  );
}