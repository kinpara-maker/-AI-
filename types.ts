export interface GroundingSource {
  title: string;
  url: string;
}

export interface SubsidyProposal {
  id?: string;
  name: string;
  targetEligibility: string;
  maxAmountAndRate: string;
  schedulePeriod: string;
  reasonAndPoints: string;
  sourceUrls?: GroundingSource[];
  additionalQuestions?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  content: string;
  timestamp: string;
  groundingSources?: GroundingSource[];
  proposals?: SubsidyProposal[];
  followUpQuestions?: string[];
  isLoading?: boolean;
}

export interface UserConditionForm {
  region: string; // 都道府県・地域
  industry: string; // 業種
  purpose: string; // 使い道・投資内容 (設備投資、IT導入、省エネ、賃上げ、人材育成など)
  businessType: 'sole_proprietor' | 'small_business' | 'medium_business' | 'startup'; // 事業形態
  employeeCount: string; // 従業員数
  capital: string; // 資本金
  investmentBudget: string; // 予定投資額
  timing: string; // 実施時期
  isWageIncreasePlanned: boolean; // 賃上げ予定あり
  hasGBizId: boolean; // gBizIDプライム取得済みか
  freeTextDetail: string; // 自由記述・課題
}

export interface MajorSubsidyInfo {
  id: string;
  name: string;
  category: 'it' | 'equipment' | 'sme_support' | 'wage_increase' | 'energy' | 'restructuring' | 'startup' | 'local';
  organizer: string; // 主管官庁・事務局 (経済産業省、中小企業庁、厚生労働省 等)
  target: string;
  maxAmount: string;
  subsidyRate: string;
  description: string;
  keyRequirements: string[];
  bonusPoints: string[]; // 加点項目
  eligibleExpenses: string[]; // 対象経費
  officialUrl: string;
  currentStatus: string;
  typicalTimeline: string;
  targetInvestments: string[];
}
