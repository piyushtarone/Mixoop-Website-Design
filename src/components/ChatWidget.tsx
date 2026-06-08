import React, { useState, useRef, useEffect } from 'react';
import { Zap, Minus, MessageSquare, Send } from 'lucide-react';

interface ChatWidgetProps {
  isVisible: boolean;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export default function ChatWidget({ isVisible }: ChatWidgetProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'user', text: 'Deploy the new e-commerce architecture.' },
    { role: 'ai', text: 'Analyzing requirements... Generating cloud-native infrastructure with zero downtime. 🚀' },
    { role: 'user', text: 'Optimize for speed and security.' },
    { role: 'ai', text: 'Applied Edge caching and advanced encryption. Deployment successful in 1.2s.' }
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized]);

  if (!isVisible) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMsg = { role: 'user' as const, text: inputText };
    setMessages(prev => [...prev, newMsg]);
    setInputText("");

    // Simulated AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: 'I am Mixoop Copilot. I can help you automate and scale your architecture further. What else do you need?' 
      }]);
    }, 1000);
  };

  if (isMinimized) {
    return (
      <div 
        className="chat-widget-minimized glow animate-pop-in"
        onClick={() => setIsMinimized(false)}
        style={{
          position: 'fixed',
          right: '5%',
          bottom: '5%',
          zIndex: 100,
          background: 'rgba(20, 20, 20, 0.9)',
          border: '1px solid rgba(5, 217, 232, 0.5)',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          pointerEvents: 'auto',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease'
        }}
      >
        <MessageSquare size={28} color="#05D9E8" />
      </div>
    );
  }

  return (
    <div 
      className="ai-chat-interface animate-pop-in" 
      style={{ position: 'fixed', right: '5%', bottom: '5%', zIndex: 100, pointerEvents: 'auto' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={18} color="#05D9E8" />
          <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>Mixoop Copilot</span>
        </div>
        <button 
          onClick={() => setIsMinimized(true)}
          style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px', transition: 'color 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.color = 'white'}
          onMouseOut={(e) => e.currentTarget.style.color = '#888'}
        >
          <Minus size={18} />
        </button>
      </div>

      <div className="chat-messages-container" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '5px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-msg ${msg.role === 'user' ? 'msg-user' : 'msg-ai'}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Copilot..."
          style={{ 
            flex: 1, 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '8px', 
            padding: '8px 12px', 
            color: 'white',
            outline: 'none',
            fontSize: '0.85rem'
          }}
        />
        <button 
          onClick={handleSend}
          style={{ 
            background: '#05D9E8', 
            border: 'none', 
            borderRadius: '8px', 
            width: '35px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          <Send size={16} color="black" />
        </button>
      </div>
    </div>
  );
}
