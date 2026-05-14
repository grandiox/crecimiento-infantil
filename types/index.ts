export type Sex = 'male' | 'female';

export interface Child {
  id: string;
  name: string;
  birthDate: string; // ISO date string
  sex: Sex;
  createdAt: string;
}

export interface Measurement {
  id: string;
  childId: string;
  date: string; // ISO date string
  weight?: number; // kg
  height?: number; // cm
  headCircumference?: number; // cm
  notes?: string;
  createdAt: string;
}

export type ChartType = 'weight' | 'height' | 'bmi' | 'headCircumference';

export interface PercentilePoint {
  ageMonths: number;
  p3: number;
  p15: number;
  p50: number;
  p85: number;
  p97: number;
}

export interface ChildMeasurementPoint {
  ageMonths: number;
  value: number;
  date: string;
}

export type PercentileCategory = 'critical-low' | 'low' | 'normal' | 'high' | 'critical-high';

export interface PercentileResult {
  category: PercentileCategory;
  label: string;
  percentileApprox: string;
}
