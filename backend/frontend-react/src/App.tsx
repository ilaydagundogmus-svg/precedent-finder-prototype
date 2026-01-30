import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { SearchPanel } from "./components/SearchPanel";
import { FavoritesPage } from "./components/FavoritesPage";
import CaseSearchPage from "./components/CaseSearchPage";
import { LegalChatbot, ChatbotToggle } from "./components/LegalChatbot";
import { Toaster } from "@/components/ui/sonner";

const MOCK_DECISIONS = [
  {
    id: "1",
    caseNumber: "11. Hukuk Dairesi 2014/10569 E., 2015/7116 K.",
    date: "26.05.2015",
    chamber: "11. Hukuk Dairesi",
    subject:
      "Vadeli döviz alım-satım (future/futures) işlemi — yazılı talimat olmadan işlem — sonradan onay (icazet)",
    summary:
      "Davacı, bankanın bilgisi/rızası dışında future işlemi yaptığını ve oluşan zararın tazminini ister. Mahkeme, başlangıçta yazılı talimat bulunmasa da davacının daha sonra yazılı onay vererek işleme icazet ettiğini değerlendirir; davanın reddine karar verilir ve karar onanır.",
    relevance: 92,

    // Demo için: Tam Metin
    fullText: `İçtihat Metni \n\n MAHKEMESİ :TİCARET MAHKEMESİ \n\n Taraflar arasında görülen davada Asliye Ticaret Mahkemesi'nce verilen 08/04/2014 tarih ve 2011/258- 2014/83 sayılı kararın duruşmalı olarak incelenmesi davacı vekili tarafından istenmiş olup, duruşma için belirlenen 26/05/2015 günü hazır bulunan davacı vekili Av. ... ile davalı vekili Av. ... dinlenildikten sonra duruşmalı işlerin yoğunluğu ve süre darlığından ötürü işin incelenerek karara bağlanması ileriye bırakıldı. Tetkik Hakimi tarafından düzenlenen rapor dinlenildikten ve yine dosya içerisindeki dilekçe, layihalar, duruşma tutanakları ve tüm belgeler okunup incelendikten sonra işin gereği görüşülüp, düşünüldü: \n\n
Davacı vekili, davacının 04/09/2009 tarihinde davalı banka ile .... imzaladığını, davacının bu tarihten itibaren Sözleşme kapsamında, yatırım amaçlı olarak "Vadeli Döviz alım satım Sözleşmesi" işlemleri yaptığını, davalı bankanın, 19/01/2010 tarihli "Vadeli Döviz alım satım Sözleşmesi" alım işlemini davacının rızası olmadan gerçekleştirdiğini, davalı banka bu işleminde, adet fiyatı 1,4365 USD'den toplam değeri 8.978.125 USD olan 50 adet kontrat, adet fiyatı 1,4391 USD den toplam değeri 8.994.375 USD olan 50 adet kontrat, adet fiyatı 4,4339 USD'den toplam değeri 8.961.875 USD olan 50 adet kontrat ve son olarak adet fiyatı 1,4310 USD'den toplam değeri 8.943.750 USD olan 50 adet alımı yaptığını, bu kontratların vadeleri sonucunda, davacının kontratın başlangıç ve bitim tarihlerindeki fark olan 808,000 USD tutarında zarar ettiğinin anlaşıldığını, davacının, rızası dışında yapılan işlem nedeniyle zarara uğradığını, 19/01/2010 tarihinde davalı bankanın ilgili şube müdür yardımcılarından ....'nun kendisini aramasından sonra haberdar olduğunu, daha sonra bankada görev yapan yetkililerle görüştüğünü ve zararın karşılanacağının kendisine taahhüt edildiğini, ancak sonradan her hangi bir gelişme meydana gelmediğini, bunun üzerine 06/04/2010 tarihinde davalı bankaya ihtarname çekilerek, kendi hatalarından kaynaklanan işlemler sonucunda oluşan zararın tazmin edilmesinin talep edildiğini, davalı banka tarafından 19/04/2010 tarihinde verilen cevapta her hangi bir sorumluluklarının olmadığı ve taleplerinin yerine getirilmeyeceği bildirildiğini ileri sürerek, şimdilik 808,000 USD zararın davalıdan tahsiline karar verilmesini talep ve dava etmiştir. \n\n
Davalı vekili, davalı bankanın, davacı tarafından ıslak imza ile imzalanmış olan talimata uygun hareket ettiğini, davacının bizzat dava dilekçesinde ikrar etmiş olduğu üzere, futures işlemlerinin ne anlama geldiğini bildiğini ve futures kontratlarını ticari olarak alıp sattığını, davalının tecrübeli bir tacir olduğunu, bankanın üzerine düşen aydınlatma yükümlülüğünü yerine getirdiğini, davacının bu tür futures kontrat alım satımlarından çok yüksek tutarlarda ticari kazanç elde ettiğini, davalı bankanın davacıya yeterli tavsiyelerde bulunduğunu ve riski anlattığını ve bankanın aydınlatma yükümlülüğünü layıkıyla yerine getirdiğini, taraflar arasında delil sözleşmesinin mevcut olduğunu, sözleşmeye aykırı olarak ibraz edilmek istenen delillere muvafakatlerinin olmadığını, davacı, iradesi dışında işlem .../...  yapıldığı konusunda ısrar etmesine karşılık, kendisi tarafından imzalanmış, işlem sonrasında aylarca itiraz edilmemiş olan talimattan bahsetmediğini, davacının kendi anlatımına göre talimatı sonradan imzalamış olsa bile banka tarafından yapılan işleme muvafakat etmiş olduğunu ve sonradan zarara uğradığını öne süremeyeceğini bildirerek, davanın reddini savunmuştur. \n\n
Mahkemece, iddia, savunma ve benimsenen bilirkişi raporu kapsamından, davalı banka çalışanları tarafından davacının bilgisi olmaksızın 19/01/2010 tarihinde 4 adet future kontratının alım işleminin gerçekleştirildiği, daha sonra banka görevlileri tarafından, davacıya alım işleminin sözlü olarak bildirildiği, davacı tarafından 26/01/2010 tarihinde yazılı onay vermek suretiyle sözkonusu kontratların alınmasını onayladığı, yapılan bu dört işlemin ikisinden davacı tarafın toplam 16.875 USD miktarında kar elde ettiği, diğer iki adet kontrattan ise komisyon tutarı ile birlikte 758.625 USD dolarında zarar ettiği, gerek Bankacılık Kanunu hükümleri, gerekse davacı ile davalı arasında imzalanmış olan ...Ürünler Çerçeve Sözleşmesi hükümleri dikkate alındığında, davalı banka çalışanlarının, müşterinin yazılı izni olmaksızın future işlemi yapmaması gerektiği, tarafların bizzat hazır olarak işlem yapılmasının esas olduğu, bununla birlikte sözleşme uyarınca müşteri tarafından belirtilen elektronik posta adresi ile, ya da faks suretiyle işlem talimatları alınması, yahut da sözlü alınacak talimatların bankanın konuşmaları kayıt altına alınan telefonla sözlü olarak yapılması halinde, opsiyon süresi içerisinde yazılı onayın alınması gerektiği, her ne kadar davalı banka tarafından davaya cevap dilekçesinde, yazılı onayın alındığı iddia edilmiş ise de, gerek banka teftiş kurulunun denetim raporunda, gerekse tarafların daha sonra dosyaya yansıyan beyan ve dilekçeleri gözönüne alındığında yazılı talimatın başlangıçta alınmadığı, daha sonra 26/01/2010 tarihinde alınmış olduğu, tüm bu hususlar dikkate alındığında, davalı banka ve banka çalışanlarının davacının bilgisi ve talebi olmaksızın, davacı adına future işlemleri yaparak %100 kusurlu olduğu sonucuna varıldığı, B.K nun 38. Maddesi uyarınca yetkisiz temsilcinin yapmış olduğu işleme onay veren tarafın artık bu onayı ile sözkonusu işlem kendisinin başlangıçta vermiş olduğu yetki tam ve sağlammış gibi, bu işlemle bağlı olup, kontrat bu işlem uyarınca doğacak hak ve sorumluluklarda vekil olana ait olduğu, yetkisiz temsilci tarafından yapılan işlemin icazet verildiği takdirde geçerli hale geldiği, davacının 26/01/2010 tarihinde dava konusu işlemlere ilişkin talimatı imzalayarak işleme onay verdiği gerekçesiyle, davanın reddine karar verilmiştir. Kararı, davacı vekili temyiz etmiştir. \n\n
Dava dosyası içerisindeki bilgi ve belgelere, mahkeme kararının gerekçesinde dayanılan delillerin tartışılıp, değerlendirilmesinde usul ve yasaya aykırı bir yön bulunmamasına göre, davacı vekilinin tüm temyiz itirazları yerinde değildir. SONUÇ: Yukarıda açıklanan nedenlerden dolayı, davacı vekilinin bütün temyiz itirazlarının reddiyle usul ve kanuna uygun bulunan hükmün ONANMASINA, takdir olunan 1.100 TL duruşma vekalet ücretinin davacıdan alınarak davalıya verilmesine, aşağıda yazılı bakiye 2,50 TL temyiz ilam harcının temyiz edenden alınmasına, 26/05/2015 tarihinde oybirliğiyle karar verildi. \n\n Kişisel Verilerden Arındırılmıştır`,

    // Sağ panelde "ilgili bölümler" (mevzuat yerine issue-based başlıklar)
    relevantSections: [
      {
        id: "rs1",
        title: "Sonradan onay (icazet) — yetkisiz işleme etkisi",
        description:
          "Davacının daha sonra yazılı onay vermesi, işlem başlangıçta yetkisiz olsa bile sonradan geçerli hale gelebilir.",
        score: 95,
      },
      {
        id: "rs2",
        title: "Yazılı talimat olmadan bankacılık işlemi yapılması",
        description:
          "Çerçeve sözleşme ve bankacılık uygulamaları kapsamında yazılı talimat gerekliliği tartışması.",
        score: 90,
      },
    ],

    // Modal'da sarı kutuda göstereceğimiz "AI highlight"
    highlight:
      "Önemli nokta: İşlem ilk aşamada yazılı talimat olmaksızın yapılmış olsa bile, davacının 26/01/2010 tarihli yazılı onayı işlemi benimsediği (icazet) şeklinde değerlendirilmiş; bu nedenle tazminat talebi reddedilmiştir.",

    // Frontend-only PDF link (public/karar1.pdf)
    pdfUrl: "/karar1.pdf",
  },
];

export default function App() {
  const [activeItem, setActiveItem] = useState("search");
  const [language, setLanguage] = useState<"tr" | "en">("tr");
  const [jurisdiction, setJurisdiction] = useState("all");
  const [results, setResults] = useState<typeof MOCK_DECISIONS>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<
    Array<(typeof MOCK_DECISIONS)[number] & { favoritedAt: string }>
  >([]);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleSearch = (_query: string, _type: "ai" | "keyword") => {
    setLoading(true);
    setResults([]);

    // demo hissi için gecikme
    setTimeout(() => {
      setResults(MOCK_DECISIONS);
      setLoading(false);
    }, 600);
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites(favorites.filter((fav) => fav.id !== id));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeItem={activeItem} 
        onItemClick={setActiveItem}
        language={language}
        onLanguageChange={setLanguage}
      />

      <div className="flex-1 overflow-hidden flex flex-col ml-72">
        {activeItem === "search" && <CaseSearchPage language={language} />}
        {activeItem === "search-old" && (
          <SearchPanel
            language={language}
            jurisdiction={jurisdiction}
            onJurisdictionChange={setJurisdiction}
          />
        )}
        {activeItem === "favorites" && (
          <FavoritesPage
            favorites={favorites}
            onRemoveFavorite={handleRemoveFavorite}
          />
        )}
        {activeItem === "history" && (
          <div className="flex-1 bg-gray-50 overflow-y-auto relative scrollbar-visible min-h-0">
            <div className="max-w-4xl mx-auto p-8">
              <h1 className="text-2xl font-semibold text-[#2c4563] mb-8">
                Arama Geçmişi
              </h1>
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-600">
                  Arama geçmişi özelliği yakında eklenecek.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chatbot */}
      {!isChatbotOpen && (
        <ChatbotToggle onClick={() => setIsChatbotOpen(true)} />
      )}
      <LegalChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
      <Toaster />
    </div>
  );
}
