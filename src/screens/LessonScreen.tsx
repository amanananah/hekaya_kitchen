import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandMark } from '../components/BrandMark';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { RecipeArtwork } from '../components/RecipeArtwork';
import { SubscreenHeader } from '../components/SubscreenHeader';
import { colors } from '../theme';
import type { Recipe } from '../types';

type LessonScreenProps = {
  recipe: Recipe;
  step: number;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
};

export function LessonScreen({ recipe, step, onBack, onNext, onFinish }: LessonScreenProps) {
  if (step >= 5) {
    return (
      <View style={styles.completeScreen}>
        <BrandMark size={76} />
        <Text style={styles.completeTitle}>You carried it forward.</Text>
        <Text style={styles.completeCopy}>
          Your first {recipe.name} attempt is ready to send to {recipe.keeper} for a voice review.
        </Text>
        <View style={styles.buttonRow}>
          <SecondaryButton onPress={onFinish} style={styles.flexOne}>Home</SecondaryButton>
          <PrimaryButton onPress={onFinish} style={styles.flexOne}>Ask Grandma</PrimaryButton>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <SubscreenHeader title="Grandchild Mode" subtitle={`${recipe.name} · Step ${step} of 5`} onBack={onBack} />
      <View style={styles.progressRow}>
        {[1, 2, 3, 4, 5].map((item) => <View key={item} style={[styles.progress, item <= step && styles.progressComplete]} />)}
      </View>
      <View style={styles.checkpoint}>
        <Text style={styles.eyebrow}>{recipe.keeper.toLocaleUpperCase()}'S VISUAL CHECKPOINT</Text>
        <Text style={styles.checkpointTitle}>{recipe.lesson.checkpoint}</Text>
        <View style={styles.textureWindow}>
          <View style={styles.artFrame}><RecipeArtwork recipe={recipe} /></View>
        </View>
      </View>
      <View style={styles.coachNote}>
        <View style={styles.sparkBox}><Text style={styles.spark}>✦</Text></View>
        <Text style={styles.coachCopy}>
          <Text style={styles.coachStrong}>Mirath sees a close match.{`\n`}</Text>
          {recipe.lesson.coach}
        </Text>
      </View>
      <View style={styles.buttonRow}>
        <SecondaryButton onPress={() => {}} style={styles.flexOne}>Hear their voice</SecondaryButton>
        <PrimaryButton onPress={onNext} style={styles.flexOne}>Looks right</PrimaryButton>
      </View>
      <Pressable accessibilityRole="button" onPress={onNext} style={styles.accessibleHint}>
        <Text style={styles.accessibleHintText}>Continue without camera comparison</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, paddingTop: 18, backgroundColor: colors.cream },
  progressRow: { flexDirection: 'row', gap: 6, marginBottom: 24 },
  progress: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.sagePale },
  progressComplete: { backgroundColor: colors.forest },
  checkpoint: { minHeight: 330, padding: 24, overflow: 'hidden', borderRadius: 29, backgroundColor: colors.forest },
  eyebrow: { color: '#D8B775', fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  checkpointTitle: { maxWidth: 280, marginTop: 12, color: colors.paper, fontFamily: 'serif', fontSize: 31, lineHeight: 34 },
  textureWindow: { flex: 1, marginTop: 18, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 20 },
  artFrame: { width: '100%', height: 176, overflow: 'hidden', borderRadius: 20 },
  coachNote: { marginTop: 15, padding: 15, flexDirection: 'row', alignItems: 'flex-start', gap: 11, borderRadius: 17, backgroundColor: colors.clayPale },
  sparkBox: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: colors.paper },
  spark: { color: colors.clay, fontSize: 24 },
  coachCopy: { flex: 1, color: '#765542', fontSize: 12, lineHeight: 18 },
  coachStrong: { color: colors.forestDeep, fontWeight: '800' },
  buttonRow: { marginTop: 18, flexDirection: 'row', gap: 10 },
  flexOne: { flex: 1 },
  accessibleHint: { alignSelf: 'center', padding: 14 },
  accessibleHintText: { color: colors.inkMuted, fontSize: 11, textDecorationLine: 'underline' },
  completeScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, backgroundColor: colors.cream },
  completeTitle: { marginTop: 24, color: colors.forestDeep, fontFamily: 'serif', fontSize: 36, textAlign: 'center' },
  completeCopy: { maxWidth: 330, marginTop: 12, color: colors.inkMuted, fontSize: 14, lineHeight: 22, textAlign: 'center' },
});
