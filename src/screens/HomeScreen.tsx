import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { familyMembers } from '../data';
import { colors, radii } from '../theme';
import { TopBar } from '../components/TopBar';

type HomeScreenProps = {
  onCapture: () => void;
  onOpenRecipe: () => void;
  onLearn: () => void;
  onRecipes: () => void;
};

export function HomeScreen({ onCapture, onOpenRecipe, onLearn, onRecipes }: HomeScreenProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      style={styles.screen}
    >
      <TopBar />

      <View style={styles.welcome}>
        <Text style={styles.eyebrow}>GOOD AFTERNOON, AMANAH</Text>
        <Text style={styles.heroTitle}>What shall we pass down today?</Text>
        <Text style={styles.heroCopy}>
          Record the gestures, stories and little secrets that make a family recipe yours.
        </Text>
      </View>

      <View style={styles.captureHero}>
        <View style={[styles.orbit, styles.orbitLarge]} />
        <View style={[styles.orbit, styles.orbitSmall]} />
        <Text style={[styles.eyebrow, styles.goldEyebrow]}>NEW FAMILY MEMORY</Text>
        <Text style={styles.captureTitle}>Let Grandma cook. Mirath will remember.</Text>
        <Text style={styles.captureCopy}>
          No scripts or measurements needed. Capture the recipe exactly as it happens.
        </Text>
        <Pressable onPress={onCapture} style={({ pressed }) => [styles.lightButton, pressed && styles.pressed]}>
          <View style={styles.cameraGlyph}><View style={styles.cameraDot} /></View>
          <Text style={styles.lightButtonText}>Start capturing</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <SectionHeading
          title="From your family table"
          subtitle="Recipes carrying a voice and a story"
          action="View all"
          onAction={onRecipes}
        />
        <Pressable onPress={onOpenRecipe} style={({ pressed }) => [styles.recipeCard, pressed && styles.pressed]}>
          <View style={styles.recipeArt}>
            <View style={styles.artRing} />
            <Text style={styles.recipeBadge}>Fatima's recipe · 1987</Text>
            <View style={styles.plate}>
              <View style={[styles.luqaimat, styles.luqaimatOne]} />
              <View style={[styles.luqaimat, styles.luqaimatTwo]} />
              <View style={[styles.luqaimat, styles.luqaimatThree]} />
            </View>
          </View>
          <View style={styles.recipeBody}>
            <View style={styles.recipeTopline}>
              <View style={styles.flexOne}>
                <Text style={styles.recipeTitle}>Luqaimat <Text style={styles.arabic}>لقيمات</Text></Text>
                <Text style={styles.recipeCopy}>Golden dumplings with date syrup, taught by Grandma Fatima.</Text>
              </View>
              <View style={styles.playButton}><Text style={styles.playIcon}>▶</Text></View>
            </View>
            <View style={styles.chipRow}>
              <Chip label="5 visual checkpoints" />
              <Chip label="3 family stories" />
            </View>
          </View>
        </Pressable>
      </View>

      <View style={styles.section}>
        <SectionHeading title="Continue learning" subtitle="Pick up where Grandma left you" />
        <Pressable onPress={onLearn} style={({ pressed }) => [styles.learnCard, pressed && styles.pressed]}>
          <View style={styles.sparkBox}><Text style={styles.spark}>✦</Text></View>
          <View style={styles.flexOne}>
            <Text style={styles.learnTitle}>Mastering the dough</Text>
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
  heroTitle: { maxWidth: 340, marginTop: 10, color: colors.forestDeep, fontFamily: 'serif', fontSize: 44, lineHeight: 46, letterSpacing: -1.7 },
  heroCopy: { maxWidth: 360, marginTop: 13, color: colors.inkMuted, fontSize: 15, lineHeight: 23 },
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
  recipeArt: { height: 194, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: '#D9B68E' },
  artRing: { position: 'absolute', width: 280, height: 280, borderWidth: 44, borderColor: 'rgba(255,255,255,0.22)', borderRadius: 140 },
  recipeBadge: { position: 'absolute', left: 14, top: 14, zIndex: 2, paddingHorizontal: 10, paddingVertical: 8, overflow: 'hidden', borderRadius: 10, color: colors.forest, backgroundColor: 'rgba(255,250,242,0.92)', fontSize: 10, fontWeight: '800' },
  plate: { width: 154, height: 154, borderWidth: 13, borderColor: '#FFF8ED', borderRadius: 77, backgroundColor: '#F3E1C6' },
  luqaimat: { position: 'absolute', width: 42, height: 42, borderWidth: 5, borderColor: '#D88A4F', borderRadius: 21, backgroundColor: '#B96534' },
  luqaimatOne: { left: 25, top: 28 },
  luqaimatTwo: { right: 21, top: 47 },
  luqaimatThree: { left: 51, bottom: 20 },
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

