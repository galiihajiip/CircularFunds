export interface User {
  id: string;
  email: string;
  role: 'UMKM' | 'INVESTOR';
}

export interface UmkmProfile {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  description?: string;
  location?: string;
  foundedYear?: number;
  employeeCount?: number;
  annualRevenue?: number;
  circularScore?: number;
  isVerified: boolean;
}

export interface ScoreResult {
  totalScore: number;
  breakdown: {
    operationalCircularity: number;
    ethics: number;
    impact: number;
  };
  indicators: {
    [key: string]: {
      score: number;
      confidence: number;
    };
  };
  flags: string[];
  recommendation: string;
}

export interface Submission {
  id: string;
  umkmId: string;
  period: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  score?: number;
  createdAt: string;
}
