import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';
import { Sparkles, User, ExternalLink, Copy, Check, Send, HelpCircle, ArrowUpRight, Compass, HelpCircle as QuestionIcon } from 'lucide-react';

interface ConsultationChatProps {
  messages: ChatMessage[];
  inputMessage: string;
  setInputMessage: (msg: string) => void;
  onSendMessage: (customMsg?: string) => void;
  isLoading: boolean;
  onOpenRoadmapModal: (subsidyName: string) => void;
}

export const ConsultationChat: React.FC<ConsultationChatProps> = ({
  messages,
  inputMessage,
  setInputMessage,
  onSendMessage,
  isLoading,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const QUICK_QUESTIONS = [
    '採択率を高めるための重要加点ポイントは？',
    '申請から入金までの資金繰りスケジュールは？',
    '「交付決定前の事前発注禁止ルール」について',
    '東京都や地方自治体の独自上乗せ助成金は？',
    'gBizIDプライムの取得手順と必要日数は？',
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-white px-5 py-3.5 flex items-center justify-between border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            AI
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">制度診断・コンサルティング回答</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                リアルタイムWeb検索連動
              </span>
            </div>
            <p className="text-[11px] text-slate-400">最新公募要領・申請締切・要件・参照URLを提示</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50">
        {messages.map((msg, idx) => (
          <div
            key={msg.id || idx}
            className={`flex gap-3 max-w-4xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-xs font-bold text-xs ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white'
                  : 'bg-blue-600 text-white'
              }`}
            >
              {msg.sender === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </div>

            {/* Message Body */}
            <div
              className={`flex-1 min-w-0 rounded-2xl p-5 sm:p-6 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-800'
              }`}
            >
              {/* Content */}
              <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed break-words">
                <ReactMarkdown
                  components={{
                    h2: ({ node, ...props }) => (
                      <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5 mt-4 mb-3 flex items-center gap-1.5" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-sm font-bold text-blue-900 bg-blue-50/80 px-3 py-1.5 rounded-xl mt-4 mb-2.5 border border-blue-200/60 flex items-center gap-1.5" {...props} />
                    ),
                    p: ({ node, ...props }) => <p className="text-sm text-slate-700 my-2 leading-relaxed" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1 text-sm text-slate-700" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1 text-sm text-slate-700" {...props} />,
                    li: ({ node, ...props }) => <li className="text-sm text-slate-700 leading-normal" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-bold text-slate-900" {...props} />,
                    a: ({ node, href, children, ...props }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-semibold underline inline-flex items-center gap-0.5 ml-1"
                        {...props}
                      >
                        {children}
                        <ArrowUpRight className="w-3 h-3 inline" />
                      </a>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>

              {/* Grounding Source URL Badges */}
              {msg.groundingSources && msg.groundingSources.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2.5">
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                    <span>参照した公的機関・事務局の公式Webソース（最新情報）:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {msg.groundingSources.map((source, sIdx) => (
                      <a
                        key={sIdx}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-800 border border-slate-200 hover:border-blue-200 text-xs font-semibold transition-all shadow-2xs group"
                      >
                        <Compass className="w-3.5 h-3.5 text-blue-600 group-hover:rotate-45 transition-transform" />
                        <span className="truncate max-w-[240px]">{source.title}</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Toolbar */}
              {msg.sender === 'ai' && (
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400">
                    {msg.timestamp}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      id={`copy-proposal-btn-${idx}`}
                      type="button"
                      onClick={() => handleCopy(msg.content, idx)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">コピー完了</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>提案内容をコピー</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex gap-3 max-w-2xl mr-auto">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>最新の公募要領・申請要件をWeb検索中...</span>
              </div>
              <p className="text-xs text-slate-500">
                中小企業庁、厚労省、自治体の最新公募情報と照合して提案書を生成しています
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Follow-up Quick Chips */}
      <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-xs font-bold text-slate-600 shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
          よくある質問:
        </span>
        <div className="flex items-center gap-1.5">
          {QUICK_QUESTIONS.map((q, i) => (
            <button
              key={i}
              id={`quick-q-btn-${i}`}
              type="button"
              disabled={isLoading}
              onClick={() => onSendMessage(q)}
              className="px-3 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-800 text-xs font-medium rounded-full border border-slate-200 hover:border-blue-300 transition-colors whitespace-nowrap shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inputMessage.trim() && !isLoading) {
              onSendMessage();
            }
          }}
          className="flex items-center gap-2"
        >
          <input
            id="chat-user-input"
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="追加の質問を入力してください（例：創業直後でも使えますか？）"
            disabled={isLoading}
            className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50 font-medium"
          />
          <button
            id="chat-send-btn"
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>送信</span>
          </button>
        </form>
      </div>
    </div>
  );
};
