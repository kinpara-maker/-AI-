import React from 'react';
import { UserConditionForm } from '../types';
import { PREFECTURES, INDUSTRIES, INVESTMENT_PURPOSES } from '../data/regionsAndIndustries';
import { MapPin, Building2, Target, Users, DollarSign, Clock, CheckCircle2, RotateCcw } from 'lucide-react';

interface DiagnosticFormProps {
  conditions: UserConditionForm;
  setConditions: React.Dispatch<React.SetStateAction<UserConditionForm>>;
  onExecuteConsultation: () => void;
  isLoading: boolean;
  onReset: () => void;
}

export const DiagnosticForm: React.FC<DiagnosticFormProps> = ({
  conditions,
  setConditions,
  onExecuteConsultation,
  isLoading,
  onReset,
}) => {
  const handleChange = (field: keyof UserConditionForm, value: any) => {
    setConditions((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">現在の検索条件設定</h2>
          <p className="text-sm font-bold text-slate-800 mt-0.5">事業条件プロファイル</p>
        </div>

        <button
          id="reset-conditions-btn"
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
          title="初期化"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>リセット</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* 1. 地域・業種 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              対象地域・所在地
            </label>
            <div className="relative">
              <select
                id="condition-region-select"
                value={conditions.region}
                onChange={(e) => handleChange('region', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              >
                {PREFECTURES.map((pref) => (
                  <option key={pref} value={pref}>{pref}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              業種
            </label>
            <select
              id="condition-industry-select"
              value={conditions.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. 事業規模・形態 */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            事業形態
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'sole_proprietor', label: '個人事業主' },
              { id: 'small_business', label: '小規模 (〜5/20名)' },
              { id: 'medium_business', label: '中小企業' },
              { id: 'startup', label: '創業・予定' },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                id={`business-type-${type.id}`}
                onClick={() => handleChange('businessType', type.id)}
                className={`px-2.5 py-2 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                  conditions.businessType === type.id
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. 使い道・投資内容 */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            目的・投資内容（最重要）
          </label>
          <select
            id="condition-purpose-select"
            value={conditions.purpose}
            onChange={(e) => handleChange('purpose', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          >
            {INVESTMENT_PURPOSES.map((pur) => (
              <option key={pur.id} value={pur.label}>{pur.label}</option>
            ))}
          </select>
        </div>

        {/* 4. 従業員数・想定予算・時期 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              従業員数（常時）
            </label>
            <input
              id="condition-employee-input"
              type="text"
              value={conditions.employeeCount}
              onChange={(e) => handleChange('employeeCount', e.target.value)}
              placeholder="例: 5名"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              想定投資額
            </label>
            <input
              id="condition-budget-input"
              type="text"
              value={conditions.investmentBudget}
              onChange={(e) => handleChange('investmentBudget', e.target.value)}
              placeholder="例: 約200万円"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              実施希望時期
            </label>
            <input
              id="condition-timing-input"
              type="text"
              value={conditions.timing}
              onChange={(e) => handleChange('timing', e.target.value)}
              placeholder="例: 2〜3ヶ月以内"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* 5. 優遇・加点オプション */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
          <div className="text-[11px] font-bold text-slate-600">加点・上限アップ要件</div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
              <input
                id="wage-increase-checkbox"
                type="checkbox"
                checked={conditions.isWageIncreasePlanned}
                onChange={(e) => handleChange('isWageIncreasePlanned', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span>給与・最低賃金の引き上げを計画中（上限・採択率UP）</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
              <input
                id="gbizid-checkbox"
                type="checkbox"
                checked={conditions.hasGBizId}
                onChange={(e) => handleChange('hasGBizId', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span>gBizIDプライム取得済み（国の電子申請に必須）</span>
            </label>
          </div>
        </div>

        {/* 6. 自由記述 */}
        <div>
          <label className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
            <span>課題・具体的な導入システム（任意）</span>
          </label>
          <textarea
            id="condition-freetext-input"
            rows={2}
            value={conditions.freeTextDetail}
            onChange={(e) => handleChange('freeTextDetail', e.target.value)}
            placeholder="例: POSレジとモバイルオーダーを入れてホールの負担を減らしたい。"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-1">
        <button
          id="run-ai-diagnosis-btn"
          type="button"
          disabled={isLoading}
          onClick={onExecuteConsultation}
          className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>最新公募情報をWeb検索中...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>この条件で最新補助金をAI診断する</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
