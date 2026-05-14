import { PercentilePoint, Sex, ChartType } from '@/types';

// OMS Weight-for-age (kg) boys 0-60 months (selected points)
const weightForAgeBoys: PercentilePoint[] = [
  { ageMonths: 0,  p3: 2.5,  p15: 2.9,  p50: 3.3,  p85: 3.9,  p97: 4.4 },
  { ageMonths: 1,  p3: 3.4,  p15: 3.9,  p50: 4.5,  p85: 5.1,  p97: 5.8 },
  { ageMonths: 2,  p3: 4.3,  p15: 4.9,  p50: 5.6,  p85: 6.3,  p97: 7.1 },
  { ageMonths: 3,  p3: 5.0,  p15: 5.7,  p50: 6.4,  p85: 7.2,  p97: 8.0 },
  { ageMonths: 4,  p3: 5.6,  p15: 6.2,  p50: 7.0,  p85: 7.8,  p97: 8.7 },
  { ageMonths: 5,  p3: 6.0,  p15: 6.7,  p50: 7.5,  p85: 8.4,  p97: 9.3 },
  { ageMonths: 6,  p3: 6.4,  p15: 7.1,  p50: 7.9,  p85: 8.8,  p97: 9.8 },
  { ageMonths: 7,  p3: 6.7,  p15: 7.4,  p50: 8.3,  p85: 9.2,  p97: 10.3 },
  { ageMonths: 8,  p3: 6.9,  p15: 7.7,  p50: 8.6,  p85: 9.6,  p97: 10.7 },
  { ageMonths: 9,  p3: 7.1,  p15: 7.9,  p50: 8.9,  p85: 9.9,  p97: 11.0 },
  { ageMonths: 10, p3: 7.4,  p15: 8.2,  p50: 9.2,  p85: 10.2, p97: 11.4 },
  { ageMonths: 11, p3: 7.6,  p15: 8.4,  p50: 9.4,  p85: 10.5, p97: 11.7 },
  { ageMonths: 12, p3: 7.7,  p15: 8.6,  p50: 9.6,  p85: 10.8, p97: 12.0 },
  { ageMonths: 15, p3: 8.1,  p15: 9.0,  p50: 10.1, p85: 11.3, p97: 12.6 },
  { ageMonths: 18, p3: 8.4,  p15: 9.4,  p50: 10.5, p85: 11.8, p97: 13.2 },
  { ageMonths: 21, p3: 8.8,  p15: 9.8,  p50: 11.0, p85: 12.4, p97: 13.9 },
  { ageMonths: 24, p3: 9.1,  p15: 10.2, p50: 11.5, p85: 12.9, p97: 14.5 },
  { ageMonths: 27, p3: 9.4,  p15: 10.5, p50: 11.9, p85: 13.4, p97: 15.1 },
  { ageMonths: 30, p3: 9.7,  p15: 10.9, p50: 12.3, p85: 13.9, p97: 15.7 },
  { ageMonths: 33, p3: 10.0, p15: 11.2, p50: 12.7, p85: 14.4, p97: 16.3 },
  { ageMonths: 36, p3: 10.2, p15: 11.5, p50: 13.0, p85: 14.8, p97: 16.8 },
  { ageMonths: 42, p3: 10.7, p15: 12.1, p50: 13.7, p85: 15.7, p97: 17.9 },
  { ageMonths: 48, p3: 11.2, p15: 12.7, p50: 14.4, p85: 16.5, p97: 18.9 },
  { ageMonths: 54, p3: 11.7, p15: 13.2, p50: 15.1, p85: 17.4, p97: 20.0 },
  { ageMonths: 60, p3: 12.1, p15: 13.7, p50: 15.8, p85: 18.3, p97: 21.2 },
];

// OMS Weight-for-age (kg) girls 0-60 months
const weightForAgeGirls: PercentilePoint[] = [
  { ageMonths: 0,  p3: 2.4,  p15: 2.8,  p50: 3.2,  p85: 3.7,  p97: 4.2 },
  { ageMonths: 1,  p3: 3.2,  p15: 3.6,  p50: 4.2,  p85: 4.8,  p97: 5.5 },
  { ageMonths: 2,  p3: 3.9,  p15: 4.5,  p50: 5.1,  p85: 5.8,  p97: 6.6 },
  { ageMonths: 3,  p3: 4.5,  p15: 5.2,  p50: 5.8,  p85: 6.6,  p97: 7.5 },
  { ageMonths: 4,  p3: 5.0,  p15: 5.7,  p50: 6.4,  p85: 7.3,  p97: 8.2 },
  { ageMonths: 5,  p3: 5.4,  p15: 6.1,  p50: 6.9,  p85: 7.8,  p97: 8.8 },
  { ageMonths: 6,  p3: 5.7,  p15: 6.5,  p50: 7.3,  p85: 8.2,  p97: 9.3 },
  { ageMonths: 7,  p3: 6.0,  p15: 6.8,  p50: 7.6,  p85: 8.6,  p97: 9.8 },
  { ageMonths: 8,  p3: 6.3,  p15: 7.0,  p50: 7.9,  p85: 9.0,  p97: 10.2 },
  { ageMonths: 9,  p3: 6.5,  p15: 7.3,  p50: 8.2,  p85: 9.3,  p97: 10.5 },
  { ageMonths: 10, p3: 6.7,  p15: 7.5,  p50: 8.5,  p85: 9.6,  p97: 10.9 },
  { ageMonths: 11, p3: 6.9,  p15: 7.7,  p50: 8.7,  p85: 9.9,  p97: 11.2 },
  { ageMonths: 12, p3: 7.0,  p15: 7.9,  p50: 8.9,  p85: 10.1, p97: 11.5 },
  { ageMonths: 15, p3: 7.4,  p15: 8.3,  p50: 9.4,  p85: 10.7, p97: 12.2 },
  { ageMonths: 18, p3: 7.8,  p15: 8.7,  p50: 9.9,  p85: 11.3, p97: 12.9 },
  { ageMonths: 21, p3: 8.1,  p15: 9.1,  p50: 10.4, p85: 11.9, p97: 13.7 },
  { ageMonths: 24, p3: 8.5,  p15: 9.5,  p50: 10.9, p85: 12.5, p97: 14.4 },
  { ageMonths: 27, p3: 8.8,  p15: 9.9,  p50: 11.3, p85: 13.1, p97: 15.1 },
  { ageMonths: 30, p3: 9.1,  p15: 10.2, p50: 11.8, p85: 13.7, p97: 15.8 },
  { ageMonths: 33, p3: 9.4,  p15: 10.6, p50: 12.2, p85: 14.2, p97: 16.5 },
  { ageMonths: 36, p3: 9.6,  p15: 10.9, p50: 12.6, p85: 14.7, p97: 17.2 },
  { ageMonths: 42, p3: 10.1, p15: 11.5, p50: 13.4, p85: 15.8, p97: 18.6 },
  { ageMonths: 48, p3: 10.6, p15: 12.1, p50: 14.2, p85: 16.8, p97: 19.9 },
  { ageMonths: 54, p3: 11.1, p15: 12.7, p50: 15.0, p85: 17.9, p97: 21.4 },
  { ageMonths: 60, p3: 11.5, p15: 13.3, p50: 15.8, p85: 19.0, p97: 22.9 },
];

// OMS Height-for-age (cm) boys 0-60 months
const heightForAgeBoys: PercentilePoint[] = [
  { ageMonths: 0,  p3: 46.1, p15: 47.5, p50: 49.9, p85: 52.3, p97: 53.7 },
  { ageMonths: 1,  p3: 50.8, p15: 52.4, p50: 54.7, p85: 57.0, p97: 58.6 },
  { ageMonths: 2,  p3: 54.4, p15: 56.1, p50: 58.4, p85: 60.8, p97: 62.4 },
  { ageMonths: 3,  p3: 57.3, p15: 59.1, p50: 61.4, p85: 63.8, p97: 65.5 },
  { ageMonths: 4,  p3: 59.7, p15: 61.5, p50: 63.9, p85: 66.3, p97: 68.0 },
  { ageMonths: 5,  p3: 61.7, p15: 63.5, p50: 65.9, p85: 68.4, p97: 70.1 },
  { ageMonths: 6,  p3: 63.3, p15: 65.2, p50: 67.6, p85: 70.1, p97: 71.9 },
  { ageMonths: 7,  p3: 64.8, p15: 66.7, p50: 69.2, p85: 71.7, p97: 73.5 },
  { ageMonths: 8,  p3: 66.2, p15: 68.1, p50: 70.6, p85: 73.2, p97: 75.0 },
  { ageMonths: 9,  p3: 67.5, p15: 69.4, p50: 72.0, p85: 74.6, p97: 76.5 },
  { ageMonths: 10, p3: 68.7, p15: 70.7, p50: 73.3, p85: 75.9, p97: 77.9 },
  { ageMonths: 11, p3: 69.9, p15: 71.9, p50: 74.5, p85: 77.2, p97: 79.2 },
  { ageMonths: 12, p3: 71.0, p15: 73.1, p50: 75.7, p85: 78.4, p97: 80.5 },
  { ageMonths: 15, p3: 73.9, p15: 76.0, p50: 78.7, p85: 81.5, p97: 83.6 },
  { ageMonths: 18, p3: 76.5, p15: 78.7, p50: 81.5, p85: 84.4, p97: 86.6 },
  { ageMonths: 21, p3: 78.9, p15: 81.2, p50: 84.2, p85: 87.2, p97: 89.5 },
  { ageMonths: 24, p3: 81.2, p15: 83.6, p50: 86.8, p85: 89.9, p97: 92.3 },
  { ageMonths: 27, p3: 83.3, p15: 85.8, p50: 89.1, p85: 92.4, p97: 94.9 },
  { ageMonths: 30, p3: 85.3, p15: 87.9, p50: 91.3, p85: 94.8, p97: 97.4 },
  { ageMonths: 33, p3: 87.2, p15: 89.9, p50: 93.4, p85: 97.0, p97: 99.7 },
  { ageMonths: 36, p3: 89.0, p15: 91.8, p50: 95.4, p85: 99.1, p97: 101.9 },
  { ageMonths: 42, p3: 92.4, p15: 95.4, p50: 99.1, p85: 103.0, p97: 105.9 },
  { ageMonths: 48, p3: 95.6, p15: 98.7, p50: 102.6, p85: 106.7, p97: 109.7 },
  { ageMonths: 54, p3: 98.6, p15: 101.8, p50: 105.9, p85: 110.2, p97: 113.3 },
  { ageMonths: 60, p3: 101.5, p15: 104.9, p50: 109.2, p85: 113.7, p97: 116.9 },
];

// OMS Height-for-age (cm) girls 0-60 months
const heightForAgeGirls: PercentilePoint[] = [
  { ageMonths: 0,  p3: 45.6, p15: 47.0, p50: 49.1, p85: 51.5, p97: 52.9 },
  { ageMonths: 1,  p3: 49.8, p15: 51.3, p50: 53.7, p85: 56.0, p97: 57.6 },
  { ageMonths: 2,  p3: 53.0, p15: 54.6, p50: 57.1, p85: 59.5, p97: 61.1 },
  { ageMonths: 3,  p3: 55.6, p15: 57.3, p50: 59.8, p85: 62.3, p97: 64.0 },
  { ageMonths: 4,  p3: 57.8, p15: 59.5, p50: 62.1, p85: 64.6, p97: 66.4 },
  { ageMonths: 5,  p3: 59.6, p15: 61.4, p50: 64.0, p85: 66.6, p97: 68.5 },
  { ageMonths: 6,  p3: 61.2, p15: 63.0, p50: 65.7, p85: 68.4, p97: 70.3 },
  { ageMonths: 7,  p3: 62.7, p15: 64.5, p50: 67.3, p85: 70.0, p97: 72.0 },
  { ageMonths: 8,  p3: 64.0, p15: 65.9, p50: 68.7, p85: 71.5, p97: 73.5 },
  { ageMonths: 9,  p3: 65.3, p15: 67.2, p50: 70.1, p85: 73.0, p97: 75.0 },
  { ageMonths: 10, p3: 66.5, p15: 68.5, p50: 71.5, p85: 74.4, p97: 76.5 },
  { ageMonths: 11, p3: 67.7, p15: 69.7, p50: 72.8, p85: 75.7, p97: 77.8 },
  { ageMonths: 12, p3: 68.9, p15: 70.9, p50: 74.0, p85: 77.0, p97: 79.2 },
  { ageMonths: 15, p3: 71.9, p15: 74.0, p50: 77.3, p85: 80.5, p97: 82.8 },
  { ageMonths: 18, p3: 74.7, p15: 76.9, p50: 80.4, p85: 83.8, p97: 86.2 },
  { ageMonths: 21, p3: 77.2, p15: 79.6, p50: 83.2, p85: 86.8, p97: 89.3 },
  { ageMonths: 24, p3: 79.6, p15: 82.1, p50: 85.7, p85: 89.4, p97: 92.0 },
  { ageMonths: 27, p3: 81.9, p15: 84.4, p50: 88.2, p85: 92.0, p97: 94.7 },
  { ageMonths: 30, p3: 84.0, p15: 86.7, p50: 90.6, p85: 94.6, p97: 97.4 },
  { ageMonths: 33, p3: 86.1, p15: 88.9, p50: 92.9, p85: 97.0, p97: 99.9 },
  { ageMonths: 36, p3: 88.0, p15: 90.9, p50: 95.1, p85: 99.3, p97: 102.3 },
  { ageMonths: 42, p3: 91.7, p15: 94.8, p50: 99.2, p85: 103.7, p97: 106.9 },
  { ageMonths: 48, p3: 95.1, p15: 98.4, p50: 103.0, p85: 107.8, p97: 111.2 },
  { ageMonths: 54, p3: 98.3, p15: 101.8, p50: 106.7, p85: 111.7, p97: 115.3 },
  { ageMonths: 60, p3: 101.4, p15: 105.0, p50: 110.2, p85: 115.5, p97: 119.2 },
];

// OMS Head Circumference-for-age (cm) boys 0-60 months
const headCircumferenceForAgeBoys: PercentilePoint[] = [
  { ageMonths: 0,  p3: 31.9, p15: 33.0, p50: 34.5, p85: 35.9, p97: 37.0 },
  { ageMonths: 1,  p3: 34.9, p15: 36.0, p50: 37.3, p85: 38.7, p97: 39.8 },
  { ageMonths: 2,  p3: 36.8, p15: 37.9, p50: 39.1, p85: 40.5, p97: 41.5 },
  { ageMonths: 3,  p3: 38.1, p15: 39.2, p50: 40.5, p85: 41.8, p97: 42.9 },
  { ageMonths: 4,  p3: 39.2, p15: 40.3, p50: 41.6, p85: 42.9, p97: 44.0 },
  { ageMonths: 5,  p3: 40.1, p15: 41.2, p50: 42.6, p85: 43.9, p97: 45.0 },
  { ageMonths: 6,  p3: 40.9, p15: 42.0, p50: 43.3, p85: 44.7, p97: 45.8 },
  { ageMonths: 7,  p3: 41.5, p15: 42.7, p50: 44.0, p85: 45.4, p97: 46.5 },
  { ageMonths: 8,  p3: 42.1, p15: 43.2, p50: 44.6, p85: 46.0, p97: 47.1 },
  { ageMonths: 9,  p3: 42.6, p15: 43.7, p50: 45.1, p85: 46.5, p97: 47.6 },
  { ageMonths: 10, p3: 43.0, p15: 44.2, p50: 45.6, p85: 47.0, p97: 48.1 },
  { ageMonths: 11, p3: 43.4, p15: 44.6, p50: 46.0, p85: 47.4, p97: 48.5 },
  { ageMonths: 12, p3: 43.8, p15: 44.9, p50: 46.3, p85: 47.7, p97: 48.8 },
  { ageMonths: 15, p3: 44.4, p15: 45.6, p50: 47.0, p85: 48.5, p97: 49.6 },
  { ageMonths: 18, p3: 44.9, p15: 46.1, p50: 47.6, p85: 49.1, p97: 50.2 },
  { ageMonths: 21, p3: 45.4, p15: 46.6, p50: 48.1, p85: 49.6, p97: 50.7 },
  { ageMonths: 24, p3: 45.8, p15: 47.0, p50: 48.5, p85: 50.0, p97: 51.1 },
  { ageMonths: 30, p3: 46.5, p15: 47.7, p50: 49.2, p85: 50.7, p97: 51.9 },
  { ageMonths: 36, p3: 47.0, p15: 48.2, p50: 49.7, p85: 51.3, p97: 52.4 },
  { ageMonths: 48, p3: 47.8, p15: 49.1, p50: 50.6, p85: 52.2, p97: 53.4 },
  { ageMonths: 60, p3: 48.4, p15: 49.7, p50: 51.3, p85: 52.9, p97: 54.1 },
];

// OMS Head Circumference-for-age (cm) girls 0-60 months
const headCircumferenceForAgeGirls: PercentilePoint[] = [
  { ageMonths: 0,  p3: 31.5, p15: 32.5, p50: 33.9, p85: 35.2, p97: 36.2 },
  { ageMonths: 1,  p3: 34.2, p15: 35.2, p50: 36.5, p85: 37.9, p97: 38.9 },
  { ageMonths: 2,  p3: 35.8, p15: 36.9, p50: 38.3, p85: 39.7, p97: 40.7 },
  { ageMonths: 3,  p3: 37.1, p15: 38.2, p50: 39.5, p85: 41.0, p97: 42.0 },
  { ageMonths: 4,  p3: 38.1, p15: 39.2, p50: 40.6, p85: 42.0, p97: 43.1 },
  { ageMonths: 5,  p3: 39.0, p15: 40.1, p50: 41.5, p85: 43.0, p97: 44.0 },
  { ageMonths: 6,  p3: 39.7, p15: 40.9, p50: 42.2, p85: 43.7, p97: 44.8 },
  { ageMonths: 7,  p3: 40.4, p15: 41.5, p50: 42.9, p85: 44.4, p97: 45.5 },
  { ageMonths: 8,  p3: 40.9, p15: 42.1, p50: 43.5, p85: 45.0, p97: 46.1 },
  { ageMonths: 9,  p3: 41.4, p15: 42.6, p50: 44.0, p85: 45.5, p97: 46.6 },
  { ageMonths: 10, p3: 41.9, p15: 43.0, p50: 44.5, p85: 46.0, p97: 47.1 },
  { ageMonths: 11, p3: 42.3, p15: 43.4, p50: 44.9, p85: 46.4, p97: 47.5 },
  { ageMonths: 12, p3: 42.6, p15: 43.8, p50: 45.2, p85: 46.8, p97: 47.9 },
  { ageMonths: 15, p3: 43.3, p15: 44.5, p50: 46.0, p85: 47.5, p97: 48.7 },
  { ageMonths: 18, p3: 43.9, p15: 45.1, p50: 46.6, p85: 48.1, p97: 49.3 },
  { ageMonths: 21, p3: 44.4, p15: 45.6, p50: 47.1, p85: 48.7, p97: 49.9 },
  { ageMonths: 24, p3: 44.8, p15: 46.0, p50: 47.5, p85: 49.1, p97: 50.3 },
  { ageMonths: 30, p3: 45.5, p15: 46.7, p50: 48.3, p85: 49.9, p97: 51.1 },
  { ageMonths: 36, p3: 46.0, p15: 47.3, p50: 48.9, p85: 50.5, p97: 51.7 },
  { ageMonths: 48, p3: 46.9, p15: 48.2, p50: 49.8, p85: 51.5, p97: 52.7 },
  { ageMonths: 60, p3: 47.5, p15: 48.9, p50: 50.5, p85: 52.2, p97: 53.5 },
];

export function getWHOData(chartType: ChartType, sex: Sex): PercentilePoint[] {
  if (chartType === 'weight') {
    return sex === 'male' ? weightForAgeBoys : weightForAgeGirls;
  }
  if (chartType === 'height') {
    return sex === 'male' ? heightForAgeBoys : heightForAgeGirls;
  }
  if (chartType === 'headCircumference') {
    return sex === 'male' ? headCircumferenceForAgeBoys : headCircumferenceForAgeGirls;
  }
  return sex === 'male' ? weightForAgeBoys : weightForAgeGirls;
}

export function interpolatePercentile(data: PercentilePoint[], ageMonths: number): PercentilePoint | null {
  if (data.length === 0) return null;
  const sorted = [...data].sort((a, b) => a.ageMonths - b.ageMonths);
  if (ageMonths <= sorted[0].ageMonths) return sorted[0];
  if (ageMonths >= sorted[sorted.length - 1].ageMonths) return sorted[sorted.length - 1];

  let lower = sorted[0];
  let upper = sorted[sorted.length - 1];
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].ageMonths <= ageMonths && sorted[i + 1].ageMonths >= ageMonths) {
      lower = sorted[i];
      upper = sorted[i + 1];
      break;
    }
  }

  const t = (ageMonths - lower.ageMonths) / (upper.ageMonths - lower.ageMonths);
  return {
    ageMonths,
    p3:  lower.p3  + t * (upper.p3  - lower.p3),
    p15: lower.p15 + t * (upper.p15 - lower.p15),
    p50: lower.p50 + t * (upper.p50 - lower.p50),
    p85: lower.p85 + t * (upper.p85 - lower.p85),
    p97: lower.p97 + t * (upper.p97 - lower.p97),
  };
}

export function getPercentileCategory(value: number, percentiles: PercentilePoint): import('@/types').PercentileResult {
  if (value < percentiles.p3) {
    return { category: 'critical-low', label: 'Muy bajo', percentileApprox: '< P3' };
  } else if (value < percentiles.p15) {
    return { category: 'low', label: 'Bajo', percentileApprox: 'P3-P15' };
  } else if (value <= percentiles.p85) {
    return { category: 'normal', label: 'Normal', percentileApprox: 'P15-P85' };
  } else if (value <= percentiles.p97) {
    return { category: 'high', label: 'Alto', percentileApprox: 'P85-P97' };
  } else {
    return { category: 'critical-high', label: 'Muy alto', percentileApprox: '> P97' };
  }
}

export function getAgeInMonths(birthDate: string, measureDate?: string): number {
  const birth = new Date(birthDate);
  const measure = measureDate ? new Date(measureDate) : new Date();
  const diffMs = measure.getTime() - birth.getTime();
  return Math.max(0, diffMs / (1000 * 60 * 60 * 24 * 30.4375));
}
