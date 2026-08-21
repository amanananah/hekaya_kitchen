import { StyleSheet, View } from 'react-native';

import type { Recipe } from '../types';

type RecipeArtworkProps = {
  recipe: Recipe;
  compact?: boolean;
};

export function RecipeArtwork({ recipe, compact = false }: RecipeArtworkProps) {
  return (
    <View style={[styles.art, compact && styles.artCompact, { backgroundColor: recipe.accent }]}>
      <View style={[styles.ring, compact && styles.ringCompact]} />
      <View style={[styles.plate, compact && styles.plateCompact]}>
        <FoodShape recipe={recipe} compact={compact} />
      </View>
    </View>
  );
}

function FoodShape({ recipe, compact }: { recipe: Recipe; compact: boolean }) {
  const deep = recipe.accentDeep;

  if (recipe.art === 'bread') {
    return (
      <View style={[styles.bread, compact && styles.breadCompact, { backgroundColor: deep }]}>
        <View style={styles.breadMark} />
        <View style={[styles.breadMark, styles.breadMarkTwo]} />
      </View>
    );
  }

  if (recipe.art === 'grain') {
    return (
      <View style={[styles.bowl, compact && styles.bowlCompact, { borderColor: deep }]}>
        <View style={[styles.grainSurface, { backgroundColor: deep }]} />
        <View style={[styles.spoon, { backgroundColor: deep }]} />
      </View>
    );
  }

  if (recipe.art === 'rice') {
    return (
      <View style={[styles.riceMound, compact && styles.riceMoundCompact, { backgroundColor: deep }]}>
        <View style={styles.riceHighlight} />
        <View style={[styles.riceHighlight, styles.riceHighlightTwo]} />
        <View style={[styles.riceHighlight, styles.riceHighlightThree]} />
      </View>
    );
  }

  if (recipe.art === 'noodles') {
    return (
      <View style={[styles.noodleNest, compact && styles.noodleNestCompact]}>
        {[0, 1, 2, 3].map((index) => (
          <View key={index} style={[styles.noodle, { borderColor: deep }, { transform: [{ rotate: `${index * 18 - 28}deg` }] }]} />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.dumplings}>
      <View style={[styles.dumpling, compact && styles.dumplingCompact, styles.dumplingOne, { backgroundColor: deep }]} />
      <View style={[styles.dumpling, compact && styles.dumplingCompact, styles.dumplingTwo, { backgroundColor: deep }]} />
      <View style={[styles.dumpling, compact && styles.dumplingCompact, styles.dumplingThree, { backgroundColor: deep }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  art: { height: 250, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  artCompact: { width: 116, height: 136 },
  ring: { position: 'absolute', width: 320, height: 320, borderWidth: 52, borderColor: 'rgba(255,255,255,0.22)', borderRadius: 160 },
  ringCompact: { width: 162, height: 162, borderWidth: 24, borderRadius: 81 },
  plate: { width: 170, height: 170, alignItems: 'center', justifyContent: 'center', borderWidth: 14, borderColor: '#FFF8ED', borderRadius: 85, backgroundColor: '#F3E1C6' },
  plateCompact: { width: 86, height: 86, borderWidth: 8, borderRadius: 43 },
  dumplings: { width: '100%', height: '100%' },
  dumpling: { position: 'absolute', width: 46, height: 46, borderWidth: 5, borderColor: 'rgba(255,255,255,0.18)', borderRadius: 23 },
  dumplingCompact: { width: 25, height: 25, borderWidth: 3, borderRadius: 13 },
  dumplingOne: { left: '13%', top: '18%' },
  dumplingTwo: { right: '10%', top: '36%' },
  dumplingThree: { left: '36%', bottom: '10%' },
  bread: { width: 112, height: 74, borderRadius: 37, transform: [{ rotate: '-8deg' }] },
  breadCompact: { width: 58, height: 38, borderRadius: 20 },
  breadMark: { position: 'absolute', left: '27%', top: '18%', width: 5, height: '64%', borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.42)', transform: [{ rotate: '25deg' }] },
  breadMarkTwo: { left: '58%' },
  bowl: { width: 112, height: 68, marginTop: 22, overflow: 'hidden', borderWidth: 9, borderTopWidth: 0, borderBottomLeftRadius: 48, borderBottomRightRadius: 48 },
  bowlCompact: { width: 58, height: 36, marginTop: 11, borderWidth: 5, borderTopWidth: 0, borderBottomLeftRadius: 26, borderBottomRightRadius: 26 },
  grainSurface: { position: 'absolute', left: 2, right: 2, top: 2, height: 12, borderRadius: 8, opacity: 0.66 },
  spoon: { position: 'absolute', width: 7, height: 75, right: '22%', top: -47, borderRadius: 4, transform: [{ rotate: '13deg' }] },
  riceMound: { width: 112, height: 72, marginTop: 28, borderTopLeftRadius: 58, borderTopRightRadius: 58, borderBottomLeftRadius: 22, borderBottomRightRadius: 22 },
  riceMoundCompact: { width: 58, height: 38, marginTop: 14, borderTopLeftRadius: 30, borderTopRightRadius: 30, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  riceHighlight: { position: 'absolute', width: 19, height: 5, left: '22%', top: '32%', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.45)', transform: [{ rotate: '-18deg' }] },
  riceHighlightTwo: { left: '55%', top: '25%', transform: [{ rotate: '22deg' }] },
  riceHighlightThree: { left: '44%', top: '57%', transform: [{ rotate: '-4deg' }] },
  noodleNest: { width: 120, height: 100, alignItems: 'center', justifyContent: 'center' },
  noodleNestCompact: { width: 62, height: 52 },
  noodle: { position: 'absolute', width: '86%', height: '44%', borderWidth: 7, borderColor: '#9A7428', borderRadius: 50 },
});
