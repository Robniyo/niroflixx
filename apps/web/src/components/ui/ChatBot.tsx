import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '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';

const SYSTEM_PROMPT = 'You are the Niroflixx assistant. Niroflixx is a digital platform for learning tech skills, finding scholarships/jobs/internships, and getting professional services like CV writing, web development, graphic design. The platform is at niroflixx.vercel.app. Be friendly, helpful, and concise.';

export default function ChatBot() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isTrainer = location.pathname.startsWith('/trainer');

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; from: 'user' | 'bot' }[]>([
    { text: "Hi! 👋 I'm the Niroflixx AI assistant. Ask me anything!", from: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, from: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://niroflixx.vercel.app',
          'X-Title': 'Niroflixx',
        },
        body: JSON.stringify({
          model: 'google/gemini-flash-1.5',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userMsg }
          ],
        }),
      });

      const data = await res.json();
      console.log('API Response:', data);

      if (data?.error) {
        setMessages(prev => [...prev, { text: `Error: ${data.error.message || 'API error'}`, from: 'bot' }]);
      } else {
        const reply = data?.choices?.[0]?.message?.content || 'Sorry, no response.';
        setMessages(prev => [...prev, { text: reply, from: 'bot' }]);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { text: 'Connection failed. Try again.', from: 'bot' }]);
    } finally { setLoading(false); }
  };

  if (isAdmin || isTrainer) return null;

  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all flex items-center justify-center hover:scale-110">
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-secondary-200 overflow-hidden animate-slide-up">
          <div className="bg-primary-600 text-white px-5 py-4 flex items-center gap-3">
            <Bot className="w-6 h-6" /><div><h3 className="font-semibold text-sm">Niroflixx AI</h3><p className="text-white/70 text-xs">Ask me anything</p></div>
          </div>
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${m.from === 'user' ? 'bg-primary-600 text-white rounded-br-md' : 'bg-secondary-100 text-secondary-800 rounded-bl-md'}`}>{m.text}</div>
              </div>
            ))}
            {loading && <div className="flex justify-start"><div className="bg-secondary-100 px-4 py-2.5 rounded-2xl rounded-bl-md"><div className="flex gap-1"><div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" /><div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} /><div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} /></div></div></div>}
            <div ref={bottomRef} />
          </div>
          <div className="border-t p-3 flex gap-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ask me anything..." className="flex-1 px-4 py-2.5 bg-secondary-50 border rounded-xl text-sm focus:outline-none focus:border-primary-500" disabled={loading} />
            <button onClick={handleSend} disabled={loading} className="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </>
  );
}