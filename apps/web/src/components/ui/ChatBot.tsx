import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'yo', 'sup'];

const answers: Record<string, string> = {
  'courses': 'We offer courses in Cybersecurity, Programming, Web Development, UI/UX Design, and more! Visit /academy to browse all courses.',
  'academy': 'Our Digital Skills Academy offers expert-led training in tech skills. From beginner to advanced levels. Check /academy!',
  'opportunities': 'We post scholarships, jobs, internships, and admissions. Visit /opportunities to find your next opportunity!',
  'scholarships': 'We regularly post scholarship opportunities for students. Check /opportunities?type=SCHOLARSHIP for the latest!',
  'services': 'We offer CV writing, web development, graphic design, video editing, and more. Visit /services to see all services.',
  'cv': 'We can help you create a professional CV! Visit /services and request our CV Writing service.',
  'apply': 'To apply for opportunities, create an account, complete your candidate profile at /dashboard/candidate, then click Apply on any opportunity.',
  'register': 'Create a free account at /register to unlock all features!',
  'contact': 'You can reach us at robertniyonkuru001@gmail.com or call +250 795 064 502. Or use the /contact form.',
  'price': 'Our services start from 10,000 RWF. Courses range from 40,000 to 200,000 RWF. Many resources are free!',
  'free': 'Yes! We have free learning resources at /resources. Some courses and services are also offered at no cost.',
  'certificate': 'We issue certificates upon course completion. Enroll in a course at /academy to get started!',
  'trainer': 'Our courses are taught by experienced industry professionals. Visit /about to learn more about our team.',
  'help': 'I can help you find courses, opportunities, services, or guide you through the application process. What are you looking for?',
  'thanks': 'You\'re welcome! 😊 Is there anything else I can help with?',
  'thank you': 'Happy to help! 🚀 Let me know if you need anything else.',
  'bye': 'Goodbye! 👋 Come back anytime you need help with courses, opportunities, or services.',
  'who are you': 'I\'m the Niroflixx Assistant! I help visitors find courses, opportunities, services, and guide them through the platform. What can I help you with?',
  'what is niroflixx': 'Niroflixx is a digital platform that combines learning, career opportunities, professional services, and resources — all in one place. We help you learn skills, find scholarships and jobs, and grow your career!',
};

const defaultReply = "I can help you with courses, opportunities, services, or applications. Try asking about 'courses', 'scholarships', 'CV writing', or 'how to apply'!";

const greetingReplies = [
  "Hello! 👋 I'm the Niroflixx assistant. How can I help you today?",
  "Hi there! 😊 Looking for courses, opportunities, or services? Just ask!",
  "Hey! Welcome to Niroflixx. What can I help you find?",
  "Good to see you! Ask me about our courses, scholarships, or services.",
];

export default function ChatBot() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isTrainer = location.pathname.startsWith('/trainer');

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; from: 'user' | 'bot' }[]>([
    { text: 'Hi! I\'m the Niroflixx assistant. Ask me anything about our platform!', from: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim().toLowerCase();
    setMessages(prev => [...prev, { text: input, from: 'user' }]);
    setInput('');

    setTimeout(() => {
      let reply = defaultReply;

      // Check greetings first
      if (greetings.some(g => userMsg.includes(g))) {
        reply = greetingReplies[Math.floor(Math.random() * greetingReplies.length)];
      } else {
        // Check keyword matches
        for (const [key, value] of Object.entries(answers)) {
          if (userMsg.includes(key)) {
            reply = value;
            break;
          }
        }
      }

      setMessages(prev => [...prev, { text: reply, from: 'bot' }]);
    }, 500);
  };

  if (isAdmin || isTrainer) return null;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all flex items-center justify-center hover:scale-110"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-secondary-200 overflow-hidden animate-slide-up">
          <div className="bg-primary-600 text-white px-5 py-4 flex items-center gap-3">
            <Bot className="w-6 h-6" />
            <div>
              <h3 className="font-semibold text-sm">Niroflixx Assistant</h3>
              <p className="text-white/70 text-xs">Ask me anything!</p>
            </div>
          </div>

          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${m.from === 'user' ? 'bg-primary-600 text-white rounded-br-md' : 'bg-secondary-100 text-secondary-800 rounded-bl-md'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="border-t p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about courses, services..."
              className="flex-1 px-4 py-2.5 bg-secondary-50 border rounded-xl text-sm focus:outline-none focus:border-primary-500"
            />
            <button onClick={handleSend} className="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}