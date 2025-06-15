
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Date;
}

export interface Interview {
  id: string;
  userId: string;
  role: string;
  level: 'junior' | 'mid' | 'senior';
  techStack: string[];
  numberOfQuestions: number;
  status: 'pending' | 'in-progress' | 'completed';
  finalized: boolean;
  createdAt: Date;
  completedAt?: Date;
  transcript?: Transcript[];
  feedback?: Feedback;
  score?: number;
  coverImage: string;
}

export interface Transcript {
  id: string;
  speaker: 'interviewer' | 'candidate';
  text: string;
  timestamp: Date;
}

export interface Feedback {
  overallScore: number;
  categories: {
    communication: number;
    problemSolving: number;
    technicalKnowledge: number;
    codeQuality: number;
  };
  strengths: string[];
  improvements: string[];
  summary: string;
}

export interface InterviewTemplate {
  id: string;
  role: string;
  level: string;
  techStack: string[];
  description: string;
  estimatedDuration: string;
  coverImage: string;
}
