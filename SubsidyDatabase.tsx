import React, { useState, useMemo } from 'react';
import { CURATED_SUBSIDIES } from '../data/curatedSubsidies';
import { MajorSubsidyInfo } from '../types';
import { Search, ExternalLink, Calculator, CheckCircle, Sparkles, ChevronDown, ChevronUp, ArrowRight, Tag, HelpCircle } from 'lucide-react';

interface SubsidyDatabaseProps {
  onConsultSpecificSubsidy: (subsidyName: string) => void;
  onOpenRoadmapModal: (subsidyName: string) => void;
}

export const SubsidyDatabase: React.FC<SubsidyDatabaseProps> = ({
  onConsultSpecificSubsidy,
  onOpenRoadmapModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('it-donyu');
  const [simBudget, setSimBudget] = useState<number>(3000000); // 300万円

  const categories = [
    { id: 'all', label: 'すべて表示' },
    { id: 'it', label: '💻 IT導入・DX' },
    { id: 'equipment', label: '⚙️ 機械・設備投資' },
    { id: 'sme_support', label: '🏢 小規模・販路開拓' },
    { id: 'wage_increase', label: '👥 賃金引上げ・採用' },
    { id: 'energy', label: '🌱 省エネ・GX' },
    { id: 'local', label: '🏛️ 創業・自治体' },
  ];

  const filteredSubsidies = useMemo(() => {
    return CURATED_SUBSIDIES.filter((sub) => {
      const matchCategory = selectedCategory === 'all' || sub.category === selectedCategory;
      const matchQuery =
        searchQuery === '' ||
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.targetInvestments.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchQuery;
    });
  }, [searchQuery, selectedCategory]);

  const calculateEstimate = (sub: MajorSubsidyInfo, budget: number) => {
    let rate = 0.5;
    let max = 4500000;

    if (sub.id === 'it-donyu') {
      rate = 0.66;
      max = 4500000;
    } else if (sub.id === 'monodukuri') {
      rate = 0.66;
      max = 12500000;
    } else if (sub.id === 'jizokuka') {
      rate = 0.66;
      max = 2000000;
    } else if (sub.id === 'shoryokuka') {
      rate = 0.5;
      max = 5000000;
    } else if (sub.id === 'gyomu-kaizen') {
      rate = 0.75;
      max = 6000000;
    } else if (sub.id === 'career-up') {
      return {
        subsidyAmount: 800000,
        selfPay: 0,
        ratePercent: 100,
        note: '正社員転換1名あたり定額80万円支給',
      };
    } else if (sub.id === 'energy-saving') {
      rate = 0.5;
      max = 50000000;
    } else if (sub.id === 'tokyo-sougyou') {
      rate = 0.66;
      max = 4000000;
    }

    const calculated = budget * rate;
    const finalSubsidy = Math.min(calculated, max);
    const selfPay = Math.max(0, budget - finalSubsidy);
    const ratePercent = Math.round((finalSubsidy / budget) * 100);

    return {
      subsidyAmount: Math.round(finalSubsidy),
      selfPay: Math.round(selfPay),
      ratePercent,
      note: `補助率目安: 約${Math.round(rate * 100)}%`,
    };
  };

  return (
    <div className="space-y-6">
      {/* Bento Grid Header & Simulator Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Main Simulator Bento Box */}
        <div className="md:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                自己負担額シミュレーター
              </h2>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              主要補助金データベース & 試算シミュレーション
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              予定している総投資額を入力すると、各主要制度ごとの概算補助受給額と自己負担額をリアルタイム試算します。
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
              <span>想定投資総額（税抜）:</span>
              <span className="text-blue-600 font-black text-lg">
                {(simBudget / 10000).toLocaleString()} 万円
              </span>
            </div>

            <input
              id="simulator-budget-slider"
              type="range"
              min="300000"
              max="30000000"
              step="100000"
              value={simBudget}
              onChange={(e) => setSimBudget(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />

            <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
              <span>30万円</span>
              <span>500万円</span>
              <span>1,500万円</span>
              <span>3,000万円</span>
            </div>
          </div>
        </div>

        {/* Bento Stat Card 1: Max grant rate */}
        <div className="md:col-span-4 bg-emerald-50 rounded-2xl border border-emerald-200 p-6 flex flex-col justify-between shadow-xs">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">最大補助率</p>
          <div>
            <p className="text-4xl font-black text-emerald-900">4/5<span className="text-lg font-bold ml-1.5">(80%)</span></p>
            <p className="text-xs font-semibold text-emerald-700 mt-1">インボイス枠・小規模事業者優遇</p>
          </div>
          <p className="text-[11px] text-emerald-600/90 font-medium">※条件により補助率上乗せ可能</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`cat-filter-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="subsidy-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="制度名、設備、キーワードで検索..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>
      </div>

      {/* Subsidies Bento Grid List */}
      <div className="space-y-4">
        {filteredSubsidies.map((sub, idx) => {
          const isExpanded = expandedId === sub.id;
          const estimate = calculateEstimate(sub, simBudget);
          const isFeatured = idx === 0;

          return (
            <div
              key={sub.id}
              id={`subsidy-card-${sub.id}`}
              className={`bg-white rounded-2xl shadow-sm transition-all overflow-hidden relative ${
                isFeatured
                  ? 'border-2 border-blue-600'
                  : 'border border-slate-200'
              }`}
            >
              {isFeatured && (
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-bl-xl z-10">
                  最もおすすめ
                </div>
              )}

              {/* Card Main Header */}
              <div className="p-6 sm:p-7">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">
                        {sub.organizer}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {sub.currentStatus}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      {sub.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {sub.description}
                    </p>

                    {/* Target tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {sub.targetInvestments.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 text-[11px] font-medium border border-slate-200/80"
                        >
                          <Tag className="w-2.5 h-2.5 text-slate-400" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Simulator Result Bento Box */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 shrink-0 lg:w-80 space-y-3">
                    <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                      <span>投資額 {(simBudget / 10000).toLocaleString()}万円の試算:</span>
                      <span className="text-blue-600 font-bold">{estimate.note}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center">
                        <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">概算補助金額</div>
                        <div className="text-base font-black text-emerald-900 mt-0.5">
                          {(estimate.subsidyAmount / 10000).toLocaleString()} <span className="text-xs font-bold">万円</span>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 p-3 rounded-xl text-center">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">実質自己負担</div>
                        <div className="text-base font-black text-slate-800 mt-0.5">
                          {(estimate.selfPay / 10000).toLocaleString()} <span className="text-xs font-bold">万円</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 text-center font-medium">
                      ※実際の交付額は審査・対象経費の内訳により決定されます
                    </div>
                  </div>
                </div>

                {/* Key Spec Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">主な対象者</span>
                    <span className="font-bold text-slate-800">{sub.target}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">補助上限額</span>
                    <span className="font-bold text-emerald-800">{sub.maxAmount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">補助率</span>
                    <span className="font-bold text-slate-800">{sub.subsidyRate}</span>
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100">
                  <button
                    id={`toggle-expand-${sub.id}`}
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        <span>詳細要件・加点項目を閉じる</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        <span>申請要件・加点項目・対象経費を見る</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={sub.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>公式サイト・公募要領</span>
                    </a>

                    <button
                      id={`consult-btn-${sub.id}`}
                      type="button"
                      onClick={() => onConsultSpecificSubsidy(sub.name)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>この制度をAI相談</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Detail Bento Panel */}
              {isExpanded && (
                <div className="bg-slate-50 border-t border-slate-200 p-6 sm:p-7 space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Key Requirements */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2.5 shadow-2xs">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span>必須要件・主な申請条件</span>
                      </h4>
                      <ul className="space-y-2 pl-1">
                        {sub.keyRequirements.map((req, rIdx) => (
                          <li key={rIdx} className="text-slate-700 flex items-start gap-2 leading-relaxed">
                            <span className="text-blue-500 font-bold">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bonus Points */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2.5 shadow-2xs">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>採択率が跳ね上がる主な加点項目</span>
                      </h4>
                      <ul className="space-y-2 pl-1">
                        {sub.bonusPoints.map((bp, bIdx) => (
                          <li key={bIdx} className="text-slate-700 flex items-start gap-2 leading-relaxed">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{bp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Eligible Expenses & Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2.5 shadow-2xs">
                      <h4 className="font-bold text-slate-900 text-sm">対象となる主な経費</h4>
                      <ul className="space-y-1.5 pl-1">
                        {sub.eligibleExpenses.map((exp, eIdx) => (
                          <li key={eIdx} className="text-slate-700 flex items-start gap-2">
                            <span className="text-slate-400 font-bold">•</span>
                            <span>{exp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2.5 shadow-2xs flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-2">標準的な申請〜入金タイムライン</h4>
                        <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                          {sub.typicalTimeline}
                        </p>
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          id={`generate-roadmap-btn-${sub.id}`}
                          type="button"
                          onClick={() => onOpenRoadmapModal(sub.name)}
                          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                        >
                          <span>詳細な申請ロードマップをAI生成する</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
