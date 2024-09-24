interface User {
  currentWeight: number;
  height: number;
  sex: 'Male' | 'Female';
  activityLevel: 'Sedentary' | 'LightActive' | 'ModeratelyActive' | 'Active' | 'VeryActive';
  goalWeight: number;
  mainGoal: 'LoseWeight' | 'MaintainWeight' | 'GainWeight' | 'BuildMuscle' | 'SomethingElse';
  birthday: string;
}

interface MacrosDistribution {
  protein: number;
  fat: number;
  carbs: number;
}

interface MealDistribution {
  Breakfast: number;
  Lunch: number;
  Dinner: number;
  Snack: number;
}

interface NutritionData {
  tdee: number;
  calorieNeeds: number;
  macrosDistribution: MacrosDistribution;
  mealDistribution: MealDistribution;
  dailyWaterIntake: number;
  fiberRecommendation: number;
  age: number;
}

export function calculateNutrition(user: User): NutritionData {
  const { currentWeight, height, sex, activityLevel, goalWeight, mainGoal, birthday } = user;

  // Basic calculations
  const age = new Date().getFullYear() - new Date(birthday).getFullYear();
  const bmr = sex === 'Male'
    ? 10 * currentWeight + 6.25 * height - 5 * age + 5
    : 10 * currentWeight + 6.25 * height - 5 * age - 161;

  // Activity multiplier
  const activityMultipliers: { [key in User['activityLevel']]: number } = {
    Sedentary: 1.2,
    LightActive: 1.375,
    ModeratelyActive: 1.55,
    Active: 1.725,
    VeryActive: 1.9
  };

  const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

  // Adjust calorie needs based on goal
  const goalAdjustments: { [key in User['mainGoal']]: number } = {
    LoseWeight: -780,  // Reduce calories for weight loss
    MaintainWeight: 0,
    GainWeight: 500,   // Increase calories for weight gain
    BuildMuscle: 500,  // Increase calories for muscle building
    SomethingElse: 0
  };

  const calorieNeeds = tdee + (goalAdjustments[mainGoal] || 0);

  // Macros distribution (assumed percentage of total calories)
  const macros = {
    protein: 0.30,
    fat: 0.25,
    carbs: 0.45
  };

  const proteinCalories = calorieNeeds * macros.protein;
  const fatCalories = calorieNeeds * macros.fat;
  const carbCalories = calorieNeeds * macros.carbs;

  const gramsPerCalorie = {
    protein: 4,
    fat: 9,
    carbs: 4
  };

  const macrosDistribution: MacrosDistribution = {
    protein: proteinCalories / gramsPerCalorie.protein,
    fat: fatCalories / gramsPerCalorie.fat,
    carbs: carbCalories / gramsPerCalorie.carbs
  };

  // Distribute calories across meals
  const mealDistribution: MealDistribution = {
    Breakfast: calorieNeeds * 0.25,
    Lunch: calorieNeeds * 0.35,
    Dinner: calorieNeeds * 0.30,
    Snack: calorieNeeds * 0.10
  };

  // Additional information
  const dailyWaterIntake = currentWeight * 35; // In milliliters
  const fiberRecommendation = 14 * (currentWeight / 1000); // In grams

  return {
    tdee: Math.round(tdee),
    calorieNeeds: Math.round(calorieNeeds),
    macrosDistribution: {
      protein: Math.round(macrosDistribution.protein),
      fat: Math.round(macrosDistribution.fat),
      carbs: Math.round(macrosDistribution.carbs)
    },
    mealDistribution: {
      Breakfast: Math.round(mealDistribution.Breakfast),
      Lunch: Math.round(mealDistribution.Lunch),
      Dinner: Math.round(mealDistribution.Dinner),
      Snack: Math.round(mealDistribution.Snack)
    },
    dailyWaterIntake: Math.round(dailyWaterIntake),
    fiberRecommendation: Math.round(fiberRecommendation),
    age
  };
}