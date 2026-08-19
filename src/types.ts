export type AppScreen = 'home' | 'recipes' | 'capture' | 'family' | 'recipe' | 'lesson';

export type CapturePhase = 'intro' | 'camera' | 'analysis' | 'result';

export type FamilyMember = {
  initials: string;
  name: string;
  color: string;
  ink: string;
};

export type RecipeStep = {
  index: string;
  title: string;
  detail: string;
  insight: string;
};

