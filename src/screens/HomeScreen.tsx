import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { RecipeArtwork } from '../components/RecipeArtwork';
import { familyMembers } from '../data';
import { colors, radii } from '../theme';
import { TopBar } from '../components/TopBar';
import type { Recipe } from '../types';

type HomeScreenProps = {
  featuredRecipe: Recipe;
  onCapture: () => void;
  onElderMode: () => void;
  onOpenRecipe: (recipeId: string) => void;
  onLearn: (recipeId: string) => void;
  onRecipes: () => void;
  onTogether: () => void;
};

export function HomeScreen({ featuredRecipe, onCapture, onElderMode, onOpenRecipe, onLearn, onRecipes, onTogether }: HomeScreenProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      style={styles.screen}
    >
      <TopBar />

      <View style={styles.welcome}>
        <Text style={styles.heroTitle}>Good afternoon, Amanah</Text>
        <Text style={styles.heroCopy}>What would you like to cook today?</Text>
      </View>

      <Pressable accessibilityRole="button" onPress={onElderMode} style={({ pressed }) => [styles.elderModeCard, pressed && styles.pressed]}>
        <View style={styles.elderModeIcon}><Text style={styles.elderModeIconText}>ح</Text></View>
        <View style={styles.flexOne}>
          <Text style={styles.elderModeTitle}>Easy Mode</Text>
          <Text style={styles.elderModeCopy}>Large text · fewer choices · voice-first · العربية</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>

      <View style={styles.captureHero}>
        <View style={[styles.orbit, styles.orbitLarge]} />
        <View style={[styles.orbit, styles.orbitSmall]} />
        <Text style={[styles.eyebrow, styles.goldEyebrow]}>ADD A RECIPE</Text>
        <Text style={styles.captureTitle}>Record a family recipe</Text>
        <Text style={styles.captureCopy}>
          We'll turn the family cook's explanation into clear steps for them to review.
        </Text>
        <Pressable onPress={onCapture} style={({ pressed }) => [styles.lightButton, pressed && styles.pressed]}>
          <View style={styles.cameraGlyph}><View style={styles.cameraDot} /></View>
          <Text style={styles.lightButtonText}>Record a lesson</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <SectionHeading
          title="From your family table"
          subtitle="Recipes carrying a voice and a story"
          action="View all"
          onAction={onRecipes}
        />
        <Pressable onPress={() => onOpenRecipe(featuredRecipe.id)} style={({ pressed }) => [styles.recipeCard, pressed && styles.pressed]}>
          <View style={styles.recipeArt}>
            <RecipeArtwork recipe={featuredRecipe} />
            <Text style={styles.recipeBadge}>{featuredRecipe.keeper} · {featuredRecipe.year}</Text>
          </View>
          <View style={styles.recipeBody}>
            <View style={styles.recipeTopline}>
              <View style={styles.flexOne}>
                <Text style={styles.recipeTitle}>{featuredRecipe.name} <Text style={styles.arabic}>{featuredRecipe.arabicName}</Text></Text>
                <Text style={styles.recipeCopy}>{featuredRecipe.summary}</Text>
              </View>
              <View style={styles.playButton}><Text style={styles.playIcon}>▶</Text></View>
            </View>
            <View style={styles.chipRow}>
              <Chip label={`${featuredRecipe.checkpointCount} visual checkpoints`} />
              <Chip label={`${featuredRecipe.confirmedSteps} of 5 steps confirmed`} />
            </View>
          </View>
        </Pressable>
      </View>

      <View style={styles.section}>
        <SectionHeading title="Cook together" subtitle="Your next family cooking time" />
        <Pressable onPress={onTogether} style={({ pressed }) => [styles.togetherCard, pressed && styles.pressed]}>
          <View style={styles.calendarBox}>
            <Text style={styles.calendarDay}>FRI</Text>
            <Text style={styles.calendarDate}>6:30</Text>
          </View>
          <View style={styles.flexOne}>
            <Text style={styles.togetherTitle}>{featuredRecipe.name} with {featuredRecipe.keeper}</Text>
            <Text style={styles.togetherCopy}>Amanah and Saeed joined · roles ready</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <SectionHeading title="Continue learning" subtitle={`Pick up where ${featuredRecipe.keeper} left you`} />
        <Pressable onPress={() => onLearn(featuredRecipe.id)} style={({ pressed }) => [styles.learnCard, pressed && styles.pressed]}>
          <View style={styles.sparkBox}><Text style={styles.spark}>✦</Text></View>
          <View style={styles.flexOne}>
            <Text style={styles.learnTitle}>{featuredRecipe.lesson.title}</Text>
            <Text style={styles.learnCopy}>Next: recognise the perfect ribbon texture</Text>
          </View>
          <View style={styles.progressCircle}><Text style={styles.progressText}>3/5</Text></View>
        </Pressable>
      </View>

      <View style={styles.section}>
        <SectionHeading title="Your family circle" subtitle="Every person holds a piece of the story" />
        <View style={styles.familyRow}>
          {familyMembers.map((person) => (
            <View key={person.name} style={styles.familyPerson}>
              <View style={[styles.familyFace, { backgroundColor: person.color }]}>
                <Text style={[styles.familyInitial, { color: person.ink }]}>{person.initials}</Text>
              </View>
              <Text style={styles.familyName}>{person.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function SectionHeading({
  title,
  subtitle,
  action,
  onAction,
}: {
  title: string;
  subtitle: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeading}>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>
      {action && onAction ? (
        <Pressable onPress={onAction}><Text style={styles.sectionAction}>{action}</Text></Pressable>
      ) : null}
    </View>
  );
}

function Chip({ label }: { label: string }) {
  return <View style={styles.chip}><Text style={styles.chipText}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 32 },
  welcome: { marginBottom: 23 },
  eyebrow: { color: colors.clay, fontSize: 11, fontWeight: '800', letterSpacing: 1.7 },
  heroTitle: { maxWidth: 340, color: colors.forestDeep, fontFamily: 'serif', fontSize: 32, lineHeight: 36, letterSpacing: -0.8 },
  heroCopy: { maxWidth: 360, marginTop: 6, color: colors.inkMuted, fontSize: 14, lineHeight: 21 },
  elderModeCard: { minHeight: 78, marginBottom: 18, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: colors.line, borderRadius: 21, backgroundColor: colors.paper },
  elderModeIcon: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 17, backgroundColor: colors.sagePale },
  elderModeIconText: { color: colors.forest, fontSize: 22, fontWeight: '800' },
  elderModeTitle: { color: colors.forestDeep, fontSize: 15, fontWeight: '800' },
  elderModeCopy: { marginTop: 5, color: colors.inkMuted, fontSize: 11 },
  captureHero: { minHeight: 238, padding: 24, overflow: 'hidden', borderRadius: radii.hero, backgroundColor: colors.forest },
  orbit: { position: 'absolute', borderWidth: 1, borderColor: 'rgba(255,250,242,0.16)', borderRadius: radii.round },
  orbitLarge: { width: 250, height: 250, right: -88, top: -100 },
  orbitSmall: { width: 174, height: 174, right: -27, top: -35 },
  goldEyebrow: { color: '#D8B775' },
  captureTitle: { maxWidth: 275, marginTop: 12, color: colors.paper, fontFamily: 'serif', fontSize: 29, lineHeight: 31 },
  captureCopy: { maxWidth: 280, marginTop: 10, color: 'rgba(255,250,242,0.72)', fontSize: 13, lineHeight: 19 },
  lightButton: { alignSelf: 'flex-start', minHeight: 50, marginTop: 20, paddingHorizontal: 17, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 16, backgroundColor: colors.paper },
  lightButtonText: { color: colors.forest, fontSize: 14, fontWeight: '800' },
  cameraGlyph: { width: 22, height: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.forest, borderRadius: 6 },
  cameraDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.forest },
  section: { marginTop: 30 },
  sectionHeading: { marginBottom: 14, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  sectionTitle: { color: colors.forestDeep, fontSize: 16, fontWeight: '800' },
  sectionSubtitle: { marginTop: 4, color: colors.inkMuted, fontSize: 11 },
  sectionAction: { paddingVertical: 5, color: colors.clay, fontSize: 12, fontWeight: '800' },
  recipeCard: { overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, borderRadius: radii.large, backgroundColor: colors.paper },
  recipeArt: { height: 194, overflow: 'hidden' },
  recipeBadge: { position: 'absolute', left: 14, top: 14, zIndex: 2, paddingHorizontal: 10, paddingVertical: 8, overflow: 'hidden', borderRadius: 10, color: colors.forest, backgroundColor: 'rgba(255,250,242,0.92)', fontSize: 10, fontWeight: '800' },
  recipeBody: { padding: 18 },
  recipeTopline: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  flexOne: { flex: 1 },
  recipeTitle: { color: colors.forestDeep, fontFamily: 'serif', fontSize: 23, fontWeight: '600' },
  arabic: { fontSize: 20 },
  recipeCopy: { marginTop: 6, color: colors.inkMuted, fontSize: 12, lineHeight: 18 },
  playButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: colors.forest },
  playIcon: { marginLeft: 2, color: colors.white, fontSize: 14 },
  chipRow: { marginTop: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: radii.round, backgroundColor: colors.sagePale },
  chipText: { color: colors.forest, fontSize: 10, fontWeight: '700' },
  togetherCard: { minHeight: 82, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 21, backgroundColor: colors.sagePale },
  calendarBox: { width: 55, height: 55, alignItems: 'center', justifyContent: 'center', borderRadius: 17, backgroundColor: colors.paper },
  calendarDay: { color: colors.clay, fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  calendarDate: { marginTop: 2, color: colors.forestDeep, fontSize: 14, fontWeight: '800' },
  togetherTitle: { color: colors.forestDeep, fontSize: 13, fontWeight: '800' },
  togetherCopy: { marginTop: 4, color: colors.inkMuted, fontSize: 10 },
  chevron: { color: colors.forest, fontSize: 24 },
  learnCard: { padding: 17, flexDirection: 'row', alignItems: 'center', gap: 13, borderRadius: 22, backgroundColor: colors.clayPale },
  sparkBox: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 18, backgroundColor: colors.paper },
  spark: { color: colors.clay, fontSize: 25 },
  learnTitle: { color: colors.forestDeep, fontSize: 14, fontWeight: '800' },
  learnCopy: { marginTop: 5, color: '#7D5A49', fontSize: 11, lineHeight: 15 },
  progressCircle: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 5, borderColor: colors.clay, borderRightColor: 'rgba(189,108,69,0.2)', borderRadius: 22 },
  progressText: { color: colors.clay, fontSize: 9, fontWeight: '800' },
  familyRow: { flexDirection: 'row', justifyContent: 'space-between' },
  familyPerson: { width: 70, alignItems: 'center' },
  familyFace: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
  familyInitial: { fontFamily: 'serif', fontSize: 18, fontWeight: '700' },
  familyName: { marginTop: 8, color: colors.inkMuted, fontSize: 11 },
  pressed: { opacity: 0.84, transform: [{ scale: 0.99 }] },
});
