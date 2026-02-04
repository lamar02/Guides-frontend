const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://guide-backend-tau.vercel.app/api';

export interface AnalyzeResult {
  previewId: string;
  sessionToken: string;
  title: string;
  status: string;
}

export interface PreviewData {
  id: string;
  sessionToken: string;
  title: string;
  productName: string;
  productCategory: string;
  status: string;
  content: {
    title: string;
    introduction: string;
    steps: Array<{
      number: number;
      title: string;
      description: string;
      tips?: string[];
      warnings?: string[];
    }>;
  } | null;
  createdAt: string;
  expiresAt: string;
}

export const publicService = {
  async analyzeDocument(fileUrl: string, title?: string, language: 'en' | 'fr' = 'en'): Promise<AnalyzeResult> {
    const response = await fetch(`${API_URL}/public/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileUrl,
        title,
        productName: title || 'Document',
        productCategory: 'general',
        language,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to analyze document');
    }

    return data.data;
  },

  async getPreview(id: string): Promise<PreviewData> {
    const response = await fetch(`${API_URL}/public/preview/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Preview not found');
    }

    return data.data;
  },

  async claimPreview(id: string, apiKey: string): Promise<{ guideId: string; alreadyClaimed: boolean }> {
    const response = await fetch(`${API_URL}/public/preview/${id}/claim`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to claim preview');
    }

    return data.data;
  },
};
