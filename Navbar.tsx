import React from 'react';
import { Sparkles, Database, CheckSquare } from 'lucide-react';

interface NavbarProps {
  activeTab: 'consult' | 'database' | 'calculator' | 'guide';
  setActiveTab: (tab: 'consult' | 'database' | 'calculator' | 'guide') => void;
  hasActiveConditions: boolean;
  onOpenConditions: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setActiveTab('consult')}
          >
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-base shadow-sm">
              助
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg tracking-tight text-slate-900">
                  補助金・助成金コンサルタント AI
                </h1>
                <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-full border border-blue-100">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-semibold text-blue-700 leading-none">最新Web検索連動</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                中小企業・個人事業主のための制度検索・要件診断・採択支援
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              id="nav-consult-btn"
              onClick={() => setActiveTab('consult')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'consult'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI相談・診断</span>
            </button>

            <button
              id="nav-database-btn"
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'database'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">主要補助金一覧</span>
              <span className="sm:hidden">制度一覧</span>
            </button>

            <button
              id="nav-guide-btn"
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>申請準備ガイド</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
