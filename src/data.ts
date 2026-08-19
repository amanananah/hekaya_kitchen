import { colors } from './theme';
import type { FamilyMember, RecipeStep } from './types';

export const familyMembers: FamilyMember[] = [
  { initials: 'F', name: 'Fatima', color: colors.sagePale, ink: colors.forest },
  { initials: 'M', name: 'Mariam', color: colors.clayPale, ink: colors.clay },
  { initials: 'S', name: 'Saeed', color: '#EEE0AD', ink: '#806522' },
  { initials: '+', name: 'Invite', color: '#D9DCED', ink: '#525A8D' },
];

export const extractedSteps: RecipeStep[] = [
  {
    index: 'Step 1',
    title: 'Mix the dough',
    detail: 'Flour, yeast, saffron and warm water were combined by hand.',
    insight: 'Visual checkpoint',
  },
  {
    index: 'Step 2',
    title: 'Wait for the ribbon',
    detail: 'The dough should fall slowly from the fingers without breaking.',
    insight: "Grandma's phrase",
  },
  {
    index: 'Step 3',
    title: 'Fry until deep gold',
    detail: 'Turn each piece once the lower edge becomes amber.',
    insight: 'Visual checkpoint',
  },
];

