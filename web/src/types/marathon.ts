export interface Marathon {
  _id: string;
  title: string;
  startDate: string;
  numberOfDays: number;
  tenure: number;
  cost: number;
  isPaid: boolean;
  isPublic: boolean;
  isDisplay: boolean;
  hasContest: boolean;
  language: string;
  welcomeMessage?: string;
  courseDescription?: string;
  rules?: string;
  contestStartDate?: string;
  contestEndDate?: string;
  votingStartDate?: string;
  votingEndDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarathonDay {
  _id: string;
  marathonId: string;
  dayNumber: number;
  dayType: 'learning' | 'practice';
  description?: string;
  exercises: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface MarathonEnrollment {
  _id: string;
  userId: string;
  marathonId: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  currentDay: number;
  lastAccessedDay: number;
  completedDays: number[];
  paymentId?: string;
  isPaid: boolean;
  expiresAt?: string;
  enrolledAt: string;
  createdAt: string;
  updatedAt: string;
}
