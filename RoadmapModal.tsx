import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { UserConditionForm } from '../types';
import { X, Sparkles, Copy, Check } from 'lucide-react';

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  subsidyName: string;
  userConditions: UserConditionForm;
}

export const RoadmapModal: React.FC<RoadmapModalProps> = ({
  isOpen,
  onClose,
  subsidyName,
  userConditions,
}) => {
  const [roadmap, setRoadmap] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && subsidyName) {
      fetchRoadmap();
    }
  }, [isOpen, subsidyName]);

  const fetchRoadmap = async () => {
    setIsLoading(true);
    setRoadmap('');
    try {
      const res = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subsidyName, userConditions }),
      });
      const data = await res.json();
      if (data.success) {
        setRoadmap(data.roadmap);
      } else {
        setRoadmap('ロードマップの生成に失敗しました。時間をおいて再試行してください。');
      }
    } catch (e) {
      setRoadmap('通信エラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roadmap);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">申請ロードマップ＆必要書類ガイド</h3>
              <p className="text-xs text-slate-500 font-medium">{subsidyName}</p>
            </div>
          </div>
          <button
            id="close-roadmap-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-800">
                『{subsidyName}』の最新公募要領に基づきロードマップを作成中...
              </p>
              <p className="text-xs text-slate-500">
                採択率向上のポイントと必要書類を整理しています
              </p>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm prose prose-sm max-w-none text-slate-800 leading-relaxed">
              <ReactMarkdown>{roadmap}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between">
          <button
            id="copy-roadmap-btn"
            type="button"
            disabled={!roadmap || isLoading}
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600">コピーしました</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>テキストをコピー</span>
              </>
            )}
          </button>

          <button
            id="close-roadmap-btn"
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
