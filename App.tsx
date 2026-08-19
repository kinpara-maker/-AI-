import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { DiagnosticForm } from './components/DiagnosticForm';
import { ConsultationChat } from './components/ConsultationChat';
import { SubsidyDatabase } from './components/SubsidyDatabase';
import { ApplicationGuide } from './components/ApplicationGuide';
import { SamplePromptsSelector } from './components/SamplePromptsSelector';
import { RoadmapModal } from './components/RoadmapModal';
import { UserConditionForm, ChatMessage } from './types';

const INITIAL_CONDITIONS: UserConditionForm = {
  region: '全国（指定なし）',
  industry: '飲食・フードサービス業',
  purpose: '💻 ITツール・ソフトウェア・業務DX（受発注・会計・予約・POS等）',
  businessType: 'small_business',
  employeeCount: '5名',
  capital: '300万円',
  investmentBudget: '200万円',
  timing: '2〜3ヶ月以内',
  isWageIncreasePlanned: true,
  hasGBizId: true,
  freeTextDetail: '',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'consult' | 'database' | 'calculator' | 'guide'>('consult');
  const [conditions, setConditions] = useState<UserConditionForm>(INITIAL_CONDITIONS);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roadmapModalSubsidy, setRoadmapModalSubsidy] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      timestamp: 'たった今',
      content: `### 🌟 補助金・助成金専門コンサルタントAIへようこそ！

中小企業・小規模事業者・個人事業主の皆様のビジネス成長や設備投資、人材採用、DX・省エネ推進を支援する最新の補助金・助成金制度をご提案します。

---
#### 📌 当サービスの特徴
1. **最新の公募要領をWeb検索**: 直近で公募中または次回公募予定の制度をリアルタイムに検索・提示します。
2. **要件・上限・補助率を網羅**: 制度名・対象要件・補助上限額・補助率・申請スケジュール・採択ポイントを明確に整理。
3. **公式ソースURL明記**: 各府省庁・自治体・事務局の公式Webページを直接ご確認いただけます。

👈 左側の「事業条件プロファイル」で地域や使い道を設定して「AI診断する」を押すか、下のチャット欄から気になる投資内容やご相談を自由に入力してください。`,
    },
  ]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() && !conditions.purpose) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: textToSend || `【条件診断】地域: ${conditions.region} / 業種: ${conditions.industry} / 目的: ${conditions.purpose} / 規模: ${conditions.employeeCount} / 予算: ${conditions.investmentBudget}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conditions: conditions,
          history: messages.slice(-5),
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          content: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          groundingSources: data.sources || [],
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: `error-${Date.now()}`,
          sender: 'ai',
          content: `申し訳ございません。情報の取得中にエラーが発生しました。\n\n**詳細:** ${data.error || '一時的な通信障害です。'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (error: any) {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'ai',
        content: `ネットワークエラーが発生しました。インターネット接続を確認の上、再度お試しください。`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteDiagnosis = () => {
    setActiveTab('consult');
    const promptText = `【事業診断依頼】
- 所在地: ${conditions.region}
- 業種: ${conditions.industry}
- 投資内容・目的: ${conditions.purpose}
- 従業員数: ${conditions.employeeCount}
- 想定予算: ${conditions.investmentBudget}
- 実施希望時期: ${conditions.timing}
- 賃上げ計画: ${conditions.isWageIncreasePlanned ? 'あり' : 'なし'}
- 詳細希望: ${conditions.freeTextDetail || '最適な補助金・助成金の候補と要件、上限額、次回公募期限を教えてください。'}

上記の条件で、現在または直近で公募されている最も活用可能性の高い補助金・助成金制度をご提案ください。`;

    handleSendMessage(promptText);
  };

  const handleSelectSample = (sampleConditions: UserConditionForm, sampleMessage: string) => {
    setConditions(sampleConditions);
    setActiveTab('consult');
    handleSendMessage(sampleMessage);
  };

  const handleConsultSpecificSubsidy = (subsidyName: string) => {
    setActiveTab('consult');
    const msg = `『${subsidyName}』について、最新の公募スケジュール、対象要件、補助率・上限額、採択率を上げる加点ポイントや必要書類を詳しく教えてください。`;
    handleSendMessage(msg);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasActiveConditions={Boolean(conditions.region || conditions.purpose)}
        onOpenConditions={() => setActiveTab('consult')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'consult' && (
          <div className="space-y-5">
            {/* Sample Prompts Bento Card */}
            <SamplePromptsSelector
              onSelectSample={handleSelectSample}
              isLoading={isLoading}
            />

            {/* Split View: Left Diagnostic Form, Right Consultation Chat */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Form: 5 cols on lg */}
              <div className="lg:col-span-5 space-y-4">
                <DiagnosticForm
                  conditions={conditions}
                  setConditions={setConditions}
                  onExecuteConsultation={handleExecuteDiagnosis}
                  isLoading={isLoading}
                  onReset={() => setConditions(INITIAL_CONDITIONS)}
                />
              </div>

              {/* Right Chat: 7 cols on lg */}
              <div className="lg:col-span-7 h-[760px]">
                <ConsultationChat
                  messages={messages}
                  inputMessage={inputMessage}
                  setInputMessage={setInputMessage}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  onOpenRoadmapModal={(subName) => setRoadmapModalSubsidy(subName)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <SubsidyDatabase
            onConsultSpecificSubsidy={handleConsultSpecificSubsidy}
            onOpenRoadmapModal={(subName) => setRoadmapModalSubsidy(subName)}
          />
        )}

        {activeTab === 'guide' && (
          <ApplicationGuide
            onConsult={(q) => {
              setActiveTab('consult');
              handleSendMessage(q);
            }}
          />
        )}
      </main>

      {/* Roadmap Modal */}
      <RoadmapModal
        isOpen={Boolean(roadmapModalSubsidy)}
        onClose={() => setRoadmapModalSubsidy(null)}
        subsidyName={roadmapModalSubsidy || ''}
        userConditions={conditions}
      />
    </div>
  );
}
