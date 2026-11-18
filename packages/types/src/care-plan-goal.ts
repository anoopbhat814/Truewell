export interface CarePlanGoal {
  id: string;
  carePlanId: string;
  description: string;
  metric: string | null;
  targetValue: number | null;
  targetDate: string | null;
  achievedAt: string | null;
}

export interface CarePlanGoalInput {
  carePlanId: string;
  description: string;
  metric?: string | null;
  targetValue?: number | null;
  targetDate?: string | null;
  achievedAt?: string | null;
}

export type CarePlanGoalPatch = Partial<CarePlanGoalInput>;
