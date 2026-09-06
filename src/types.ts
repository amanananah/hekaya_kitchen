export type AppScreen = 'home' | 'recipes' | 'capture' | 'family' | 'recipe' | 'lesson' | 'attempt' | 'together' | 'elder' | 'elderReply';

export type CapturePhase = 'intro' | 'camera' | 'analysis' | 'result';

export type FamilyMember = {
  initials: string;
  name: string;
  color: string;
  ink: string;
};

export type RecipeCategory = 'Mains' | 'Bread' | 'Sweets' | 'Breakfast';

export type RecipeKnowledge = {
  label: string;
  title: string;
  detail: string;
};

export type Recipe = {
  id: string;
  name: string;
  arabicName: string;
  keeper: string;
  year: string;
  category: RecipeCategory;
  summary: string;
  duration: string;
  checkpointCount: number;
  storyCount: number;
  confirmedSteps: number;
  detailsToConfirm: number;
  accent: string;
  accentDeep: string;
  art: 'dumplings' | 'grain' | 'rice' | 'bread' | 'noodles';
  quote: string;
  quoteStep: string;
  knowledge: RecipeKnowledge[];
  lesson: {
    title: string;
    steps: Array<{
      title: string;
      checkpoint: string;
      coach: string;
      familyTip: string;
    }>;
  };
};

export type RecipeStep = {
  index: string;
  title: string;
  detail: string;
  insight: string;
};
