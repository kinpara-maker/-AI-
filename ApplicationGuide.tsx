import React from 'react';
import { AlertTriangle, CheckCircle2, Shield, Key, TrendingUp, FileText, ArrowRight } from 'lucide-react';

interface ApplicationGuideProps {
  onConsult: (question: string) => void;
}

export const ApplicationGuide: React.FC<ApplicationGuideProps> = ({ onConsult }) => {
  return (
    <div className="space-y-6">
      {/* Bento Grid Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              失敗しないための必須知識
            </h2>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            補助金・助成金 申請準備完全マスターガイド
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            申請にあたって知っておくべき「補助金と助成金の違い」「交付決定前発注禁止の鉄則」「gBizIDプライムの取得」「加点項目の獲得術」を体系的に整理しました。
          </p>
        </div>
      </div>

      {/* Grid Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* 1. 補助金 vs 助成金 (6 cols) */}
        <div className="md:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">「補助金」と「助成金」の決定的な違い</h3>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-1">
                <div className="font-bold text-blue-900">🏛️ 補助金（経済産業省・中小企業庁・自治体）</div>
                <p className="leading-relaxed">
                  設備投資・IT導入・販路開拓を支援。<strong>審査・コンペ形式</strong>であり、予算枠内で高得点の事業者から採択されます（採択率40〜60%）。
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-1">
                <div className="font-bold text-emerald-900">👥 助成金（厚生労働省・労働局）</div>
                <p className="leading-relaxed">
                  正社員化、賃上げ、雇用改善を支援。<strong>要件を満たしていれば原則100%受給可能</strong>です（審査競争なし）。
                </p>
              </div>
            </div>
          </div>

          <button
            id="guide-consult-diff-btn"
            onClick={() => onConsult('自社のケースで補助金と助成金のどちらを狙うべきか教えてください')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 pt-2 cursor-pointer"
          >
            <span>自社に合う制度をAIに相談する</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2. 交付決定前発注禁止ルール (6 cols) */}
        <div className="md:col-span-6 bg-orange-50/50 rounded-2xl p-6 border border-orange-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-orange-950 text-base">【最重要】交付決定前の事前発注禁止ルール</h3>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <p className="font-bold text-rose-800 bg-rose-50 p-3 rounded-xl border border-rose-200 leading-relaxed">
                ⚠️ 交付決定通知書を受け取る前に契約・発注・支払いをすると、補助金は1円も支給されません！
              </p>
              <ul className="space-y-2 pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>申請書を提出しただけでは発注不可（採択発表の後の「交付決定」が必要）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>補助金は「後払い（精算払い）」のため、初期費用の立替資金の準備が必要</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            id="guide-consult-rule-btn"
            onClick={() => onConsult('交付決定前の事前発注禁止ルールとスケジュールについて詳しく教えてください')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-800 hover:text-orange-950 pt-2 cursor-pointer"
          >
            <span>発注タイミングの注意点を詳しく聞く</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3. gBizIDプライム (6 cols) */}
        <div className="md:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
              <Key className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">国の電子申請に必須: gBizIDプライム</h3>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700">
            <p className="leading-relaxed">
              国の補助金（IT導入補助金、ものづくり補助金、持続化補助金等）の申請には、認証アカウント<strong>「gBizIDプライム」</strong>が必須です。
            </p>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
              <div className="font-bold text-slate-900">取得の手順:</div>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                <li>gBizID公式サイトで基本情報を入力・申請書PDFを印刷</li>
                <li>代表者印の印鑑登録証明書（発行3ヶ月以内）を同封</li>
                <li>郵送にて審査申請（取得まで通常1〜2週間程度）</li>
              </ol>
            </div>
          </div>
        </div>

        {/* 4. 採択率を跳ね上げる3大加点項目 (6 cols) */}
        <div className="md:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">採択率を劇的に上げる3大加点項目</h3>
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="border border-indigo-100 bg-indigo-50/50 p-2.5 rounded-xl">
              <strong className="text-indigo-900">1. 賃上げ計画の表明:</strong> 給与総額年率1.5%以上増額、事業場内最低賃金+30円以上。
            </div>
            <div className="border border-indigo-100 bg-indigo-50/50 p-2.5 rounded-xl">
              <strong className="text-indigo-900">2. 事業継続力強化計画（BCP）:</strong> 防災・減災対策計画の認定取得（約2〜3週間）。
            </div>
            <div className="border border-indigo-100 bg-indigo-50/50 p-2.5 rounded-xl">
              <strong className="text-indigo-900">3. パートナーシップ構築宣言:</strong> 下請事業者との適正取引をポータルで宣言。
            </div>
          </div>
        </div>

        {/* 5. 必要書類チェックリスト (12 cols) */}
        <div className="md:col-span-12 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">チェックリスト</h2>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">申請時に揃えておくべき基本書類</h3>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              6大基本書類
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {[
              { title: '決算書・確定申告書', desc: '直近2〜3期分の貸借対照表・損益計算書・別表等（個人は確定申告書B第一表・第二表・収支内訳書）' },
              { title: '履歴事項全部証明書', desc: '発行から3ヶ月以内の登記簿謄本（法人の場合）' },
              { title: '納税証明書（その2など）', desc: '法人税・所得税・消費税の未納がないことの公的証明書' },
              { title: '見積書・相見積書', desc: '導入予定の設備・ITツール・工事の正式な見積書（複数社の相見積もりが必要な場合あり）' },
              { title: '賃金台帳・労働者名簿', desc: '直近数ヶ月分の従業員賃金台帳（賃上げ要件・助成金申請に必須）' },
              { title: '会社案内・製品資料', desc: '自社事業概要・主力製品・顧客層がわかる会社案内やパンフレット' },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
