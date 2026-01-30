import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Star, 
  Search, 
  Folder, 
  FolderPlus, 
  Trash2, 
  Filter,
  Calendar,
  BookmarkCheck,
  Grid3x3,
  List,
  Clock,
  Tag
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface FavoriteDecision {
  id: string;
  caseNumber: string;
  date: string;
  chamber: string;
  subject: string;
  summary: string;
  relevance?: number;
  savedAt: string;
  collection?: string;
  tags?: string[];
  notes?: string;
  relevantSections?: {
    id: string;
    title: string;
    page: number;
    content: string;
  }[];
}

interface FavoritesPageProps {
  onDecisionClick: (decision: FavoriteDecision) => void;
}

export function FavoritesPage({ onDecisionClick }: FavoritesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'saved' | 'relevance'>('saved');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');

  // Mock data - replace with real data from state management
  const [favorites] = useState<FavoriteDecision[]>([
    {
      id: '1',
      caseNumber: 'Yargıtay 3. Hukuk Dairesi - 2023/4567 E., 2024/1234 K.',
      date: '15.03.2024',
      chamber: '3. Hukuk Dairesi',
      subject: 'Kiracının Tahliyesi - Tadilat Nedeniyle Tahliye Talebi',
      summary: 'Somut olayda, kiralanan taşınmazın tadilat nedeniyle tahliye edilmesi talep edilmiştir. Mahkemece yapılan keşif ve bilirkişi incelemesi neticesinde, tadilat işlemlerinin kiracının taşınmazda bulunmasıyla yapılamayacağı tespit edilmiş olup, tahliye talebinin kabulüne karar verilmiştir.',
      relevance: 94,
      savedAt: '2024-01-02T10:30:00',
      collection: 'Tahliye Davaları',
      tags: ['Tadilat', 'Tahliye', 'TBK'],
      notes: 'Müvekkil dosyası için önemli içtihat',
      relevantSections: [
        {
          id: '1',
          title: 'Tadilat Gerekliliği Tespiti',
          page: 3,
          content: 'Mahkemece yapılan keşif ve bilirkişi incelemesi neticesinde, tadilat işlemlerinin kiracının taşınmazda bulunmasıyla yapılamayacağı tespit edilmiş olup, bu durum bilirkişi raporuyla sabit olmuştur.'
        },
        {
          id: '2',
          title: 'Tahliye Kararının Gerekçesi',
          page: 5,
          content: 'Tahliye talebinin kabulüne karar verilmiştir. Yapılacak tadilat işlemlerinin mahiyeti itibariyle esaslı nitelikte olduğu ve kiracının taşınmazı boşaltması halinde gerçekleştirilebileceği anlaşılmıştır.'
        }
      ]
    },
    {
      id: '2',
      caseNumber: 'Yargıtay 11. Hukuk Dairesi - 2023/8912 E., 2024/456 K.',
      date: '22.02.2024',
      chamber: '11. Hukuk Dairesi',
      subject: 'Haksız Rekabet - Piyasa Değerinin Altında Satış',
      summary: 'Davalı şirketin, piyasa koşullarının altında fiyatlarla ürün satarak haksız rekabete yol açtığı iddiasıyla açılan davada, mahkemece davalının bu davranışının TTK m.55 kapsamında haksız rekabet oluşturduğu ve bundan vazgeçmesine karar verilmiştir.',
      relevance: 91,
      savedAt: '2024-01-01T15:20:00',
      collection: 'Ticaret Hukuku',
      tags: ['Haksız Rekabet', 'TTK', 'Piyasa'],
      relevantSections: [
        {
          id: '1',
          title: 'Haksız Rekabet Tespiti',
          page: 2,
          content: 'Davalının piyasa koşullarının altında fiyatlarla ürün satması, rakip şirketlerin piyasadan dışlanmasına yönelik sistematik bir davranış olarak değerlendirilmiştir.'
        }
      ]
    },
    {
      id: '3',
      caseNumber: 'Yargıtay 3. Hukuk Dairesi - 2022/3344 E., 2023/2211 K.',
      date: '19.04.2023',
      chamber: '3. Hukuk Dairesi',
      subject: 'Kiralananın Tahliyesi - Esaslı Onarım Gereksinimi',
      summary: 'Taşınmazın statik açıdan tehlike arz ettiği ve esaslı onarım gerektiği bilirkişi raporu ile tespit edilmiştir. Kiracının güvenliği açısından da tahliyenin zorunlu olduğu anlaşılmıştır.',
      relevance: 79,
      savedAt: '2023-12-28T09:15:00',
      collection: 'Tahliye Davaları',
      tags: ['Statik', 'Güvenlik', 'Onarım'],
      relevantSections: [
        {
          id: '1',
          title: 'Statik Tehlike Tespiti',
          page: 2,
          content: 'Bilirkişi raporu uyarınca binanın statik açıdan tehlike arz ettiği ve acil müdahale gerektirdiği tespit edilmiştir.'
        }
      ]
    },
    {
      id: '4',
      caseNumber: 'Yargıtay 11. Hukuk Dairesi - 2023/5678 E., 2023/9012 K.',
      date: '10.11.2023',
      chamber: '11. Hukuk Dairesi',
      subject: 'Haksız Rekabet - Yanıltıcı Reklam',
      summary: 'Davalının internet sitesinde ve sosyal medya hesaplarında yayınladığı reklamlarda, rakip şirket ürünlerini küçük düşürücü ve yanıltıcı beyanlarda bulunduğu tespit edilmiş, bu davranışların TTK m.55/A.I-4 kapsamında haksız rekabet oluşturduğuna karar verilmiştir.',
      relevance: 88,
      savedAt: '2023-12-15T14:45:00',
      collection: 'Ticaret Hukuku',
      tags: ['Haksız Rekabet', 'Reklam', 'Sosyal Medya'],
      relevantSections: [
        {
          id: '1',
          title: 'Yanıltıcı Reklam Değerlendirmesi',
          page: 3,
          content: 'İnternet ve sosyal medya üzerinden yapılan reklamların rakip şirket ürünlerini küçük düşürücü ve yanıltıcı nitelikte olduğu tespit edilmiştir.'
        }
      ]
    },
    {
      id: '5',
      caseNumber: 'Yargıtay 3. Hukuk Dairesi - 2023/7890 E., 2024/345 K.',
      date: '05.02.2024',
      chamber: '3. Hukuk Dairesi',
      subject: 'Kira - Kira Bedelinin Güncellemesi',
      summary: 'Taraflar arasındaki kira sözleşmesinde kira bedelinin TÜFE\'ye göre artırılacağına dair hüküm bulunmaktadır. Kiraya verenin talep ettiği artış oranının yasal sınırları aşıp aşmadığı hususunda yapılan inceleme sonucunda...',
      relevance: 86,
      savedAt: '2023-12-10T11:30:00',
      collection: 'Tahliye Davaları',
      tags: ['Kira', 'TÜFE', 'Güncelleme'],
      relevantSections: [
        {
          id: '1',
          title: 'TÜFE Artışı Değerlendirmesi',
          page: 4,
          content: 'Kira sözleşmesinde yer alan TÜFE artış oranının uygulanmasında yasal sınırların gözetilmesi gerektiği belirtilmiştir.'
        }
      ]
    }
  ]);

  const collections = [
    { id: 'all', name: 'Tüm Favoriler', count: favorites.length },
    { id: 'tahliye', name: 'Tahliye Davaları', count: 3 },
    { id: 'ticaret', name: 'Ticaret Hukuku', count: 2 },
  ];

  const filteredFavorites = favorites.filter(fav => {
    const matchesSearch = fav.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fav.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fav.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCollection = selectedCollection === 'all' || 
                             fav.collection === collections.find(c => c.id === selectedCollection)?.name;
    
    return matchesSearch && matchesCollection;
  });

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'saved') {
      return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
    } else {
      return (b.relevance || 0) - (a.relevance || 0);
    }
  });

  const EmptyState = () => (
    <div className="flex-1 flex items-center justify-center py-20">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Star className="w-10 h-10 text-amber-500" />
        </div>
        <h3 className="text-gray-900 mb-3">Henüz favori karar yok</h3>
        <p className="text-sm text-gray-600 mb-6">
          Karar arama sayfasından beğendiğiniz kararları favorilere ekleyerek daha sonra kolayca erişebilirsiniz. Favorilerinizi koleksiyonlarda organize edebilir ve notlar ekleyebilirsiniz.
        </p>
        <Button variant="outline" className="gap-2">
          <Search className="w-4 h-4" />
          Karar Aramaya Başla
        </Button>
      </div>
    </div>
  );

  if (favorites.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <h1 className="text-gray-900">Favorilerim</h1>
            </div>
            <p className="text-sm text-gray-600">
              {favorites.length} karar kaydedildi
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <FolderPlus className="w-4 h-4" />
            Yeni Koleksiyon
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Favorilerde ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Sırala
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setSortBy('saved')}>
                <Clock className="w-4 h-4 mr-2" />
                Eklenme Tarihi
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('date')}>
                <Calendar className="w-4 h-4 mr-2" />
                Karar Tarihi
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('relevance')}>
                <BookmarkCheck className="w-4 h-4 mr-2" />
                Eşleşme Oranı
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 px-3"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 px-3"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={selectedCollection} onValueChange={setSelectedCollection} className="h-full flex flex-col">
          {/* Collection tabs */}
          <div className="bg-white border-b border-gray-200 px-8">
            <TabsList className="bg-transparent h-12 gap-1">
              {collections.map((collection) => (
                <TabsTrigger 
                  key={collection.id} 
                  value={collection.id}
                  className="gap-2 data-[state=active]:bg-gray-100"
                >
                  <Folder className="w-4 h-4" />
                  {collection.name}
                  <Badge variant="secondary" className="ml-1 bg-gray-200 text-gray-700">
                    {collection.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-visible">
            <TabsContent value={selectedCollection} className="mt-0">
              {sortedFavorites.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Bu koleksiyonda karar bulunamadı.</p>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-2 gap-4' 
                    : 'space-y-4'
                }>
                  {sortedFavorites.map((favorite) => (
                    <FavoriteCard
                      key={favorite.id}
                      favorite={favorite}
                      viewMode={viewMode}
                      onDecisionClick={onDecisionClick}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

interface FavoriteCardProps {
  favorite: FavoriteDecision;
  viewMode: 'grid' | 'list';
  onDecisionClick: (decision: FavoriteDecision) => void;
}

function FavoriteCard({ favorite, viewMode, onDecisionClick }: FavoriteCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Bugün';
    if (diffInDays === 1) return 'Dün';
    if (diffInDays < 7) return `${diffInDays} gün önce`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} hafta önce`;
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 relative overflow-hidden">
      {/* Favorite indicator */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-amber-500"></div>
      
      <div className="p-6 pl-7">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div 
              className="text-[#2c4563] mb-2 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => onDecisionClick(favorite)}
            >
              {favorite.caseNumber}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
              <span>{favorite.date}</span>
              <span>•</span>
              <span>{favorite.chamber}</span>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            {favorite.relevance && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0">
                %{favorite.relevance}
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                >
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Favorilerden Çıkar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-3">{favorite.subject}</p>
        <p className={`text-sm text-gray-600 ${viewMode === 'grid' ? 'line-clamp-2' : 'line-clamp-3'}`}>
          {favorite.summary}
        </p>

        {/* Tags */}
        {favorite.tags && favorite.tags.length > 0 && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <Tag className="w-3 h-3 text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {favorite.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-gray-50 border-gray-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>Kaydedildi: {formatDate(favorite.savedAt)}</span>
          </div>
          {favorite.collection && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Folder className="w-3 h-3" />
              <span>{favorite.collection}</span>
            </div>
          )}
        </div>

        {/* Notes preview */}
        {favorite.notes && (
          <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-xs text-amber-900 italic">"{favorite.notes}"</p>
          </div>
        )}
      </div>
    </Card>
  );
}
