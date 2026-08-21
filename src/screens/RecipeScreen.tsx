import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/Buttons';
import { RecipeArtwork } from '../components/RecipeArtwork';
import { SubscreenHeader } from '../components/SubscreenHeader';
import { colors, radii } from '../theme';
import type { Recipe } from '../types';

type RecipeScreenProps = {
  recipe: Recipe;
  onBack: () => void;
  onLearn: () => void;
};

export function RecipeScreen({ recipe, onBack, onLearn }: RecipeScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} style={styles.screen}>
      <SubscreenHeader title={`${recipe.name} · ${recipe.arabicName}`} subtitle={`${recipe.keeper}'s living recipe`} onBack={onBack} />
      <View style={styles.recipeArt}>
        <RecipeArtwork recipe={recipe} />
        <Text style={styles.recipeBadge}>Original demonstration · {recipe.duration}</Text>
        <Text style={styles.yearBadge}>Family archive · {recipe.year}</Text>
      </View>
      <View style={styles.chipRow}>
        <Chip text={`${recipe.checkpointCount} visual checkpoints`} />
        <Chip text="Arabic + English" />
        <Chip text={`${recipe.confidence}% confirmed`} />
      </View>

      <Text style={styles.summary}>{recipe.summary}</Text>

      <View style={styles.quote}>
        <Text style={styles.quoteText}>“{recipe.quote}”</Text>
        <Text style={styles.quoteSource}>{recipe.keeper} · {recipe.quoteStep}</Text>
      </View>

      <Text style={styles.sectionTitle}>What makes this version ours</Text>
      <Text style={styles.sectionSubtitle}>Knowledge a normal recipe would miss</Text>
      <View style={styles.knowledgeList}>
        {recipe.knowledge.map((item) => (
          <KnowledgeCard detail={item.detail} key={item.title} label={item.label} title={item.title} />
        ))}
      </View>
      <PrimaryButton onPress={onLearn} style={styles.button}>Cook with {recipe.keeper}'s guidance</PrimaryButton>
    </ScrollView>
  );
}

function Chip({ text }: { text: string }) {
  return <View style={styles.chip}><Text style={styles.chipText}>{text}</Text></View>;
}

function KnowledgeCard({ label, title, detail }: { label: string; title: string; detail: string }) {
  return (
    <View style={styles.knowledgeCard}>
      <Text style={styles.knowledgeLabel}>{label}</Text>
      <Text style={styles.knowledgeTitle}>{title}</Text>
      <Text style={styles.knowledgeDetail}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 42 },
  recipeArt: { height: 250, overflow: 'hidden', borderRadius: 28 },
  recipeBadge: { position: 'absolute', left: 14, top: 14, zIndex: 2, paddingHorizontal: 10, paddingVertical: 8, overflow: 'hidden', borderRadius: 10, color: colors.forest, backgroundColor: 'rgba(255,250,242,0.92)', fontSize: 10, fontWeight: '800' },
  yearBadge: { position: 'absolute', right: 14, bottom: 14, paddingHorizontal: 10, paddingVertical: 8, overflow: 'hidden', borderRadius: 10, color: colors.paper, backgroundColor: 'rgba(23,54,43,0.78)', fontSize: 9, fontWeight: '800' },
  chipRow: { marginTop: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: radii.round, backgroundColor: colors.sagePale },
  chipText: { color: colors.forest, fontSize: 10, fontWeight: '700' },
  summary: { marginTop: 17, color: colors.inkMuted, fontSize: 13, lineHeight: 20 },
  quote: { marginVertical: 22, padding: 20, borderLeftWidth: 3, borderLeftColor: colors.clay, borderRadius: 16, backgroundColor: colors.paper },
  quoteText: { color: colors.forestDeep, fontFamily: 'serif', fontSize: 18, lineHeight: 27 },
  quoteSource: { marginTop: 11, color: colors.inkMuted, fontSize: 10 },
  sectionTitle: { color: colors.forestDeep, fontSize: 16, fontWeight: '800' },
  sectionSubtitle: { marginTop: 4, color: colors.inkMuted, fontSize: 11 },
  knowledgeList: { marginTop: 14, gap: 11 },
  knowledgeCard: { padding: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, borderRadius: 18, backgroundColor: colors.paper },
  knowledgeLabel: { color: colors.clay, fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  knowledgeTitle: { marginTop: 8, color: colors.forestDeep, fontSize: 14, fontWeight: '800' },
  knowledgeDetail: { marginTop: 5, color: colors.inkMuted, fontSize: 12, lineHeight: 18 },
  button: { marginTop: 22 },
});
