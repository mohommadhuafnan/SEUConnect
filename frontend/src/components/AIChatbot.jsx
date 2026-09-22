import React, { useState } from 'react';
import { Bot, Send, X, BookOpen, FileText, AlertCircle } from 'lucide-react';
import { aiService } from '../services/extraServices';

export const AIChatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am SEUConnect AI, your institutional assistant for the Faculty of Technology. How can I help you with process guidelines, faculty forms, academic regulations, or examination procedures today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userQuery = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userQuery }]);
    setLoading(true);

    try {
      const res = await aiService.chat(userQuery);
      if (res.success) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: res.data.reply,
            relatedForms: res.data.relatedForms,
            relatedProcesses: res.data.relatedProcesses
          }
        ]);
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'I could not connect to the SEUConnect AI engine. Please verify your connection or check with the faculty dean office.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '650px', height: '620px', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="modal-header" style={{ backgroundColor: 'var(--primary-900)', color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0b1f3a'
            }}>
              <Bot size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>SEUConnect Academic AI</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Grounded in Faculty of Technology Regulations & Documents</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Message Log */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '0.88rem',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                backgroundColor: m.sender === 'user' ? 'var(--primary-600)' : 'var(--bg-surface-hover)',
                color: m.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                border: m.sender === 'user' ? 'none' : '1px solid var(--border-color)'
              }}>
                {m.text}
              </div>

              {/* Related forms or processes pill attachments */}
              {m.relatedForms && m.relatedForms.length > 0 && (
                <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {m.relatedForms.map(f => (
                    <a
                      key={f.formId}
                      href={`/student/forms/${f.formId}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        backgroundColor: 'var(--primary-50)',
                        color: 'var(--primary-700)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        border: '1px solid var(--primary-100)'
                      }}
                    >
                      <FileText size={12} /> {f.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              SEUConnect AI is reviewing university regulations...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          gap: '10px',
          backgroundColor: 'var(--bg-surface)'
        }}>
          <input
            type="text"
            className="form-input"
            placeholder="Ask about repeat exams, medical submission, 80% attendance, PIV vouchers..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatbot;
