import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/Buttons';
import { SubscreenHeader } from '../components/SubscreenHeader';
import { colors, radii } from '../theme';

type RecipeScreenProps = {
  onBack: () => void;
  onLearn: () => void;
};

export function RecipeScreen({ onBack, onLearn }: RecipeScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} style={styles.screen}>
      <SubscreenHeader title="Luqaimat · لقيمات" subtitle="Grandma Fatima's living recipe" onBack={onBack} />
      <View style={styles.recipeArt}>
        <View style={styles.artRing} />
        <Text style={styles.recipeBadge}>Original demonstration · 6:42</Text>
        <View style={styles.plate}>
          <View style={[styles.luqaimat, styles.one]} />
          <View style={[styles.luqaimat, styles.two]} />
          <View style={[styles.luqaimat, styles.three]} />
        </View>
      </View>
      <View style={styles.chipRow}>
        <Chip text="5 visual checkpoints" />
        <Chip text="Arabic + English" />
        <Chip text="86% confirmed" />
      </View>

      <View style={styles.quote}>
        <Text style={styles.quoteText}>“My mother always made the first batch small. She said the oil also needs to learn.”</Text>
        <Text style={styles.quoteSource}>Grandma Fatima · memory attached to Step 4</Text>
      </View>

      <Text style={styles.sectionTitle}>What makes this version ours</Text>
      <Text style={styles.sectionSubtitle}>Knowledge a normal recipe would miss</Text>
      <View style={styles.knowledgeList}>
        <KnowledgeCard label="TEXTURE" title="The ribbon test" detail="The dough folds back into itself in roughly three seconds." />
        <KnowledgeCard label="SOUND" title="Listen for the softer sizzle" detail="Grandma lowers the heat when the oil changes from a sharp crackle." />
      </View>
      <PrimaryButton onPress={onLearn} style={styles.button}>Cook with Grandma's guidance</PrimaryButton>
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
  recipeArt: { height: 250, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 28, backgroundColor: '#D9B68E' },
  artRing: { position: 'absolute', width: 320, height: 320, borderWidth: 52, borderColor: 'rgba(255,255,255,0.22)', borderRadius: 160 },
  recipeBadge: { position: 'absolute', left: 14, top: 14, zIndex: 2, paddingHorizontal: 10, paddingVertical: 8, overflow: 'hidden', borderRadius: 10, color: colors.forest, backgroundColor: 'rgba(255,250,242,0.92)', fontSize: 10, fontWeight: '800' },
  plate: { width: 170, height: 170, borderWidth: 14, borderColor: '#FFF8ED', borderRadius: 85, backgroundColor: '#F3E1C6' },
  luqaimat: { position: 'absolute', width: 46, height: 46, borderWidth: 5, borderColor: '#D88A4F', borderRadius: 23, backgroundColor: '#B96534' },
  one: { left: 28, top: 32 },
  two: { right: 24, top: 53 },
  three: { left: 57, bottom: 22 },
  chipRow: { marginTop: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: radii.round, backgroundColor: colors.sagePale },
  chipText: { color: colors.forest, fontSize: 10, fontWeight: '700' },
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

