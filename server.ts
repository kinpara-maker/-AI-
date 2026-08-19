import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy/safe initialization for Gemini AI
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Subsidy Consultation Endpoint with Google Search Grounding
app.post('/api/consult', async (req, res) => {
  try {
    const {
      message,
      conditions,
      history = [],
    } = req.body;

    const ai = getGeminiClient();

    const systemInstruction = `
あなたは日本の中小企業や個人事業主、スタートアップを支援する「補助金・助成金専門の敏腕コンサルタントAI」です。
ユーザーから提供された条件（地域・都道府県、業種、使い道・設備投資内容・DX・人件費・省エネ等、従業員数、事業形態など）をもとに、活用できる可能性のある最新の補助金・助成金制度をわかりやすく親身に提案してください。

【基本動作と回答ルール】
1. 必ずGoogle検索ツールを活用し、現在または直近で公募されている（または最新の公募要領・予定）制度を探して最新の正確な情報を提供してください。
2. 提案する制度ごとに、必ず以下の構成でわかりやすく整理してください：
   ### 1. 【制度名】（正式名称）
   - **主管・事務局**: （例: 中小企業庁、厚生労働省、〇〇県振興公社 等）
   - **主な対象要件**: （どんな事業者が対象か、規模や対象業種、条件）
   - **補助上限額および補助率**: （最大金額、補助率 1/2〜4/5、賃上げ等の上乗せ枠など）
   - **公募期間・申請期限**: （現在の公募回、受付期間、次回予定など判明している最新情報）
   - **提案の理由・活用ポイント**: （なぜこのユーザーの計画に最適か、採択率を高めるポイントや注意点）
   - **公式参照元URL**: （参照した公的機関や事務局のWebサイトURL）

3. 情報の信頼性を担保するため、回答内にも参照した公的機関や事務局の公式URLを必ず記載してください。
4. ユーザーからの情報が不足している場合や、さらに適合度を高めるために、回答の最後に必ず「💡 追加で確認したい質問（2〜3点）」を添えてください。（例：従業員数、過去の決算状況、賃上げ予定の有無、gBizIDプライムの取得状況、導入希望時期など）
5. 専門用語（例: 交付決定前発注の禁止、付加価値額要件、gBizID、補助金と助成金の違いなど）は平易に解説し、親しみやすく丁寧なトーン（です・ます調）で回答してください。
`;

    // Construct conversation payload
    let userPromptText = '';
    if (conditions) {
      userPromptText += `【相談者の事業条件プロファイル】
- 地域・所在地: ${conditions.region || '未指定'}
- 業種: ${conditions.industry || '未指定'}
- 事業形態: ${conditions.businessType === 'sole_proprietor' ? '個人事業主' : conditions.businessType === 'small_business' ? '小規模事業者' : conditions.businessType === 'medium_business' ? '中小企業' : 'スタートアップ・設立予定'}
- 従業員数: ${conditions.employeeCount || '未指定'}
- 投資目的・使い道: ${conditions.purpose || '未指定'}
- 予定投資額・予算: ${conditions.investmentBudget || '未定'}
- 実施予定時期: ${conditions.timing || '未定'}
- 賃上げ予定: ${conditions.isWageIncreasePlanned ? 'あり（加点・上限引き上げ対象）' : 'なし/未定'}
- gBizIDプライム: ${conditions.hasGBizId ? '取得済み' : '未取得/これから'}
- 相談内容・詳細課題: ${conditions.freeTextDetail || ''}
`;
    }

    if (message) {
      userPromptText += `\n【相談メッセージ】\n${message}`;
    }

    // Build history if available
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history.slice(-6)) {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }],
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: userPromptText }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: contents,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const responseText = response.text || '申し訳ございません。提案の生成中に一時的な問題が発生しました。もう一度お試しください。';
    
    // Extract grounding sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources: { title: string; url: string }[] = [];
    const seenUrls = new Set<string>();

    for (const chunk of groundingChunks) {
      if (chunk.web?.uri) {
        const url = chunk.web.uri;
        const title = chunk.web.title || new URL(url).hostname;
        if (!seenUrls.has(url)) {
          seenUrls.add(url);
          webSources.push({ title, url });
        }
      }
    }

    res.json({
      success: true,
      text: responseText,
      sources: webSources,
    });
  } catch (error: any) {
    console.error('Error in /api/consult:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'コンサルティング応答の生成に失敗しました。',
    });
  }
});

// Application Roadmap & Checklist Generator Endpoint
app.post('/api/generate-roadmap', async (req, res) => {
  try {
    const { subsidyName, userConditions } = req.body;
    const ai = getGeminiClient();

    const prompt = `
【対象補助金・助成金】: ${subsidyName}
【事業者プロファイル】:
- 地域: ${userConditions?.region || '全国'}
- 業種: ${userConditions?.industry || '一般'}
- 使い道: ${userConditions?.purpose || '設備導入・DX等'}
- 従業員数: ${userConditions?.employeeCount || '少人数'}

上記の補助金・助成金について、採択率を最大限に高めて受給に至るまでの「具体的な申請ロードマップ」「必要書類チェックリスト」「採択率アップの3大ポイント」をステップ形式で詳しく作成してください。最新の公式情報を踏まえてMarkdown形式で回答してください。
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.5,
      },
    });

    res.json({
      success: true,
      roadmap: response.text || '',
    });
  } catch (error: any) {
    console.error('Error in /api/generate-roadmap:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'ロードマップの生成に失敗しました。',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
