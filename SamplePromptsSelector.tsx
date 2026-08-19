import React from 'react';
import { SAMPLE_PROFILES } from '../data/regionsAndIndustries';
import { Sparkles, ArrowRight } from 'lucide-react';
import { UserConditionForm } from '../types';

interface SamplePromptsSelectorProps {
  onSelectSample: (conditions: UserConditionForm, message: string) => void;
  isLoading: boolean;
}

export const SamplePromptsSelector: React.FC<SamplePromptsSelectorProps> = ({
  onSelectSample,
  isLoading,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">代表的な相談事例</h3>
          <p className="text-sm font-bold text-slate-800 mt-0.5">ワンクリックで診断を試す</p>
        </div>
        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
          即時入力可能
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SAMPLE_PROFILES.map((sample, idx) => (
          <button
            key={idx}
            id={`sample-profile-btn-${idx}`}
            type="button"
            disabled={isLoading}
            onClick={() => onSelectSample(sample.conditions, sample.message)}
            className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 text-left transition-all group flex flex-col justify-between cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-blue-700 shadow-2xs">
                  {sample.badge}
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">{sample.conditions.region}</span>
              </div>
              <p className="text-xs font-bold text-slate-800 group-hover:text-blue-950 line-clamp-2 leading-snug">
                {sample.title}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-200 text-[11px] text-slate-500 group-hover:text-blue-800 font-semibold">
              <span>{sample.conditions.investmentBudget}</span>
              <span className="inline-flex items-center gap-1 text-blue-600 font-bold">
                診断する <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
