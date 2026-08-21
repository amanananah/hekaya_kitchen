import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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
  const [showFamilyTip, setShowFamilyTip] = useState(false);
  const totalSteps = recipe.lesson.steps.length;
  const currentStep = recipe.lesson.steps[Math.min(step - 1, totalSteps - 1)]!;

  useEffect(() => {
    setShowFamilyTip(false);
  }, [recipe.id, step]);

  if (step > totalSteps) {
    return (
      <View style={styles.completeScreen}>
        <BrandMark size={76} />
        <Text style={styles.completeEyebrow}>GUIDED COOK COMPLETE</Text>
        <Text style={styles.completeTitle}>You carried it forward.</Text>
        <Text style={styles.completeCopy}>
          Your first {recipe.name} attempt is ready to send to {recipe.keeper} for a voice review.
        </Text>
        <View style={styles.buttonRow}>
          <SecondaryButton onPress={onBack} style={styles.flexOne}>Back to recipe</SecondaryButton>
          <PrimaryButton onPress={onFinish} style={styles.flexOne}>Save attempt</PrimaryButton>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false} style={styles.screen}>
      <SubscreenHeader title="Guided Cook" subtitle={`Learning from ${recipe.keeper} · Step ${step} of ${totalSteps}`} onBack={onBack} />
      <View style={styles.progressRow}>
        {recipe.lesson.steps.map((item, index) => (
          <View key={item.title} style={[styles.progress, index < step && styles.progressComplete]} />
        ))}
      </View>
      <View style={styles.checkpoint}>
        <Text style={styles.eyebrow}>{recipe.keeper.toLocaleUpperCase()}'S VISUAL CHECKPOINT</Text>
        <Text style={styles.stepTitle}>{currentStep.title}</Text>
        <Text style={styles.checkpointTitle}>{currentStep.checkpoint}</Text>
        <View style={styles.textureWindow}>
          <View style={styles.artFrame}><RecipeArtwork recipe={recipe} /></View>
        </View>
      </View>
      <View style={styles.coachNote}>
        <View style={styles.sparkBox}><Text style={styles.spark}>✦</Text></View>
        <Text style={styles.coachCopy}>
          <Text style={styles.coachStrong}>Mirath sees a close match.{`\n`}</Text>
          {currentStep.coach}
        </Text>
      </View>
      {showFamilyTip ? (
        <View style={styles.familyTip}>
          <Text style={styles.familyTipLabel}>FROM {recipe.keeper.toLocaleUpperCase()}</Text>
          <Text style={styles.familyTipText}>“{currentStep.familyTip}”</Text>
        </View>
      ) : null}
      <View style={styles.buttonRow}>
        <SecondaryButton onPress={() => setShowFamilyTip((value) => !value)} style={styles.flexOne}>
          {showFamilyTip ? 'Hide family tip' : 'Show family tip'}
        </SecondaryButton>
        <PrimaryButton onPress={onNext} style={styles.flexOne}>{step === totalSteps ? 'Finish lesson' : 'Looks right'}</PrimaryButton>
      </View>
      <Pressable accessibilityRole="button" onPress={onNext} style={styles.accessibleHint}>
        <Text style={styles.accessibleHintText}>Continue without camera comparison</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  screenContent: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28 },
  progressRow: { flexDirection: 'row', gap: 6, marginBottom: 24 },
  progress: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.sagePale },
  progressComplete: { backgroundColor: colors.forest },
  checkpoint: { minHeight: 330, padding: 24, overflow: 'hidden', borderRadius: 29, backgroundColor: colors.forest },
  eyebrow: { color: '#D8B775', fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  stepTitle: { marginTop: 11, color: 'rgba(255,250,242,0.66)', fontSize: 11, fontWeight: '700' },
  checkpointTitle: { maxWidth: 290, marginTop: 5, color: colors.paper, fontFamily: 'serif', fontSize: 27, lineHeight: 31 },
  textureWindow: { flex: 1, marginTop: 18, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 20 },
  artFrame: { width: '100%', height: 176, overflow: 'hidden', borderRadius: 20 },
  coachNote: { marginTop: 15, padding: 15, flexDirection: 'row', alignItems: 'flex-start', gap: 11, borderRadius: 17, backgroundColor: colors.clayPale },
  sparkBox: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: colors.paper },
  spark: { color: colors.clay, fontSize: 24 },
  coachCopy: { flex: 1, color: '#765542', fontSize: 12, lineHeight: 18 },
  coachStrong: { color: colors.forestDeep, fontWeight: '800' },
  familyTip: { marginTop: 11, padding: 15, borderLeftWidth: 3, borderLeftColor: colors.clay, borderRadius: 16, backgroundColor: colors.paper },
  familyTipLabel: { color: colors.clay, fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  familyTipText: { marginTop: 7, color: colors.forestDeep, fontFamily: 'serif', fontSize: 15, lineHeight: 21 },
  buttonRow: { marginTop: 18, flexDirection: 'row', gap: 10 },
  flexOne: { flex: 1 },
  accessibleHint: { alignSelf: 'center', padding: 14 },
  accessibleHintText: { color: colors.inkMuted, fontSize: 11, textDecorationLine: 'underline' },
  completeScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, backgroundColor: colors.cream },
  completeEyebrow: { marginTop: 22, color: colors.clay, fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  completeTitle: { marginTop: 10, color: colors.forestDeep, fontFamily: 'serif', fontSize: 36, textAlign: 'center' },
  completeCopy: { maxWidth: 330, marginTop: 12, color: colors.inkMuted, fontSize: 14, lineHeight: 22, textAlign: 'center' },
});
