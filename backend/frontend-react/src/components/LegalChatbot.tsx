import { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  X,
  Minimize2,
  Maximize2,
  RotateCcw
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface LegalChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LegalChatbot({ isOpen, onClose }: LegalChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Merhaba! Ben Yargıtay kararları konusunda size yardımcı olacak hukuki asistanınızım. Size nasıl yardımcı olabilirim?',
      timestamp: new Date(),
      suggestions: [
        'Tahliye davaları hakkında bilgi ver',
        'Haksız rekabet örnek kararlar',
        'Kira artışı yasal sınırları nedir?',
        'İş sözleşmesi feshi kararları'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: { [key: string]: string } = {
        'tahliye': 'Tahliye davaları konusunda size yardımcı olabilirim. Yargıtay\'a göre tahliye sebepleri:\n\n1. **Tadilat gereksinimi**: Esaslı tadilat işlemlerinin kiracının taşınmazda bulunmasıyla yapılamayacağının ispatlanması gerekir (Yargıtay 3. HD 2023/4567).\n\n2. **Kira bedelini ödememe**: Üst üste iki kira döneminde kiranın ödenmemesi halinde tahliye mümkündür.\n\n3. **Kendisi veya yakınları için kullanım**: Kiraya verenin veya birinci derece yakınlarının kullanımı için tahliye istenebilir.\n\nHangi tahliye sebebi hakkında daha detaylı bilgi almak istersiniz?',
        'haksız rekabet': 'Haksız rekabet konusunda TTK madde 55\'e göre başlıca haksız rekabet halleri:\n\n1. **Yanıltıcı reklam**: Rakip ürünleri küçük düşürücü beyanlar (Yargıtay 11. HD 2023/5678)\n\n2. **Piyasa değerinin altında satış**: Sistematik olarak zarara satış yaparak rakipleri piyasadan dışlamaya çalışma (Yargıtay 11. HD 2023/8912)\n\n3. **Ticari sırların ifşası**: Rakibin ticari sırlarını haksız yollardan ele geçirme ve kullanma\n\n4. **Kopyalama**: Rakibin ürün tasarımını veya ambalajını aynen kopyalama\n\nHangi konu hakkında örnek kararlar görmek istersiniz?',
        'kira': 'Kira artışı konusunda 6098 sayılı TBK ve ilgili düzenlemelere göre:\n\n**Konut ve çatılı işyeri kiralarında:**\n- Kira artış oranı, bir önceki kira yılındaki artışla sınırlıdır\n- TÜFE oranını geçemez\n- Yargıtay kararlarına göre, sözleşmede daha yüksek artış öngörülse bile yasal sınırlar uygulanır\n\n**Açık işyerleri ve diğer taşınmazlarda:**\n- Taraflar kira artış oranını serbestçe belirleyebilir\n- Ancak TBK md. 138 çerçevesinde aşırı ifa güçlüğü itirazı yapılabilir\n\nDaha spesifik bir soru sormak ister misiniz?',
        'iş': 'İş sözleşmesinin feshi konusunda Yargıtay içtihatları:\n\n**Haklı nedenle fesih:**\n- İşçinin güven sarsıcı davranışları (hırsızlık, güven kaybı)\n- İşverenin mobbing uygulaması\n- Ücretin zamanında ödenmemesi\n\n**Geçerli nedenle fesih:**\n- İşyeri gereklerinden kaynaklanan sebepler\n- İşçinin yeterliliğinden kaynaklanan sebepler\n\nYargıtay, feshin haklı veya geçerli sebebe dayanıp dayanmadığını titizlikle inceler. Hangi fesih türü hakkında detaylı bilgi istersiniz?'
      };

      let responseContent = 'Anladım. Bu konuda size yardımcı olmak için Yargıtay kararlarını aramanızı öneriyorum. Arama sayfasından sorgunuzu AI tabanlı arama ile girebilir, en ilgili kararları bulabilirsiniz.\n\nBaşka bir konuda yardımcı olabilir miyim?';
      
      for (const [key, value] of Object.entries(responses)) {
        if (input.toLowerCase().includes(key)) {
          responseContent = value;
          break;
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        suggestions: [
          'İlgili kararları göster',
          'Başka bir konu sor',
          'Daha fazla detay ver'
        ]
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleReset = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Merhaba! Ben Yargıtay kararları konusunda size yardımcı olacak hukuki asistanınızım. Size nasıl yardımcı olabilirim?',
        timestamp: new Date(),
        suggestions: [
          'Tahliye davaları hakkında bilgi ver',
          'Haksız rekabet örnek kararlar',
          'Kira artışı yasal sınırları nedir?',
          'İş sözleşmesi feshi kararları'
        ]
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`shadow-2xl border-slate-200 overflow-hidden transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white">Hukuki Asistan</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-xs text-slate-300">Çevrimiçi</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 w-8 p-0 text-white hover:bg-slate-600"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 text-white hover:bg-slate-600"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-white hover:bg-slate-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea className="h-[440px] p-4 bg-slate-50" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id}>
                    <div className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-br from-slate-600 to-slate-700' 
                          : 'bg-gradient-to-br from-blue-400 to-blue-600'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                        <div className={`inline-block max-w-[85%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-slate-700 text-white rounded-tr-sm'
                            : 'bg-white border border-slate-200 rounded-tl-sm'
                        }`}>
                          <p className={`text-sm whitespace-pre-line ${
                            message.role === 'user' ? 'text-white' : 'text-gray-800'
                          }`}>
                            {message.content}
                          </p>
                          <p className={`text-xs mt-2 ${
                            message.role === 'user' ? 'text-slate-300' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && message.role === 'assistant' && (
                      <div className="ml-11 mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs h-7 bg-white hover:bg-slate-50 border-slate-200"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex gap-2">
                <Input
                  placeholder="Sorunuzu yazın..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-slate-700 hover:bg-slate-800 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI destekli hukuki yardımcı
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export function ChatbotToggle({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white"
      size="icon"
    >
      <MessageCircle className="w-6 h-6" />
    </Button>
  );
}

