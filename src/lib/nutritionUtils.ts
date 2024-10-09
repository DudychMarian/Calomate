// src/utils/nutritionUtils.ts
export const parseServingSize = (servingSize: string | undefined): number => {
  if (!servingSize) return 100;
  const match = servingSize.match(/(\d+(\.\d+)?)\s*g/);
  return match ? parseFloat(match[1]) : 100;
};

export const calculateNutritionForServing = (value: number, servingSize: number): number => {
  return (value * servingSize) / 100;
};

export const getNutritionGradeColor = (grade: string): string => {
  const colors: { [key: string]: string } = {
    a: 'bg-green-500',
    b: 'bg-green-500',
    c: 'bg-yellow-500',
    d: 'bg-orange-500',
    e: 'bg-red-500',
  };
  return colors[grade.toLowerCase()] || 'bg-gray-500';
};

export const getAdditiveColor = (additive: string): string => {
  const riskLevels: { [key: string]: string } = {
    'en:e100': 'bg-green-500',
    'en:e150a': 'bg-yellow-500',
    'en:e250': 'bg-orange-500',
    'en:e621': 'bg-red-500',
  };
  return riskLevels[additive] || 'bg-gray-500';
};

export const getNovaGroupColor = (group: number): string => {
  const colors: { [key: number]: string } = {
    1: 'bg-green-500',
    2: 'bg-yellow-500',
    3: 'bg-orange-500',
    4: 'bg-red-500',
  };
  return colors[group] || 'bg-gray-500';
};

export const getEcoScoreColor = (grade: string) => {
  return getNutritionGradeColor(grade)
}