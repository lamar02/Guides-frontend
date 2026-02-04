export interface GuideStep {
  number: number;
  title: string;
  description: string;
  tips?: string[];
  warnings?: string[];
}

export interface GuideTroubleshooting {
  problem: string;
  solution: string;
}

export interface GuideContent {
  title: string;
  introduction: string;
  steps: GuideStep[];
  troubleshooting: GuideTroubleshooting[];
  conclusion: string;
}

export interface Guide {
  id: string;
  title: string;
  productName: string;
  productCategory: string;
  content: GuideContent | null;
  hasFullAccess: boolean;
  status: 'generating' | 'generated' | 'error';
  createdAt: string;
}

export interface GenerateGuideParams {
  fileUrl: string;
  productName: string;
  productCategory: string;
  userContext?: Record<string, string>;
  title?: string;
}

export interface GuideRating {
  guideId: string;
  rating: number;
  feedback?: string;
}
