import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/Buttons';
import { RecipeArtwork } from '../components/RecipeArtwork';
import { SubscreenHeader } from '../components/SubscreenHeader';
import { colors } from '../theme';
import type { Recipe } from '../types';

type TogetherScreenProps = {
  recipe: Recipe;
  onBack: () => void;
  onStart: () => void;
};

export function TogetherScreen({ recipe, onBack, onStart }: TogetherScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} style={styles.screen}>
      <SubscreenHeader title="Cook together" subtitle="Friday · 6:30 PM" onBack={onBack} />

      <View style={styles.hero}>
        <View style={styles.art}><RecipeArtwork compact recipe={recipe} /></View>
        <View style={styles.heroCopy}>
          <Text style={styles.recipeName}>{recipe.name}</Text>
          <Text style={styles.arabic}>{recipe.arabicName}</Text>
          <Text style={styles.teacher}>{recipe.keeper} is leading</Text>
        </View>
      </View>

      <View style={styles.joinedRow}>
        <View style={styles.faces}>
          <Face initials="F" color={colors.sagePale} />
          <Face initials="A" color={colors.clayPale} />
          <Face initials="S" color="#EEE0AD" />
        </View>
        <View style={styles.flexOne}>
          <Text style={styles.joinedTitle}>3 family members joined</Text>
          <Text style={styles.joinedCopy}>Everyone gets a small job in the kitchen.</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Tonight's roles</Text>
      <View style={styles.roleList}>
        <Role initials={recipe.keeper.charAt(recipe.keeper.lastIndexOf(' ') + 1)} name={recipe.keeper} role="Teach and share the family tips" />
        <Role initials="A" name="Amanah" role="Mix and check the dough" />
        <Role initials="S" name="Saeed" role="Prepare the syrup and serve" />
      </View>

      <View style={styles.readyNote}>
        <Text style={styles.readyTitle}>Before you start</Text>
        <Text style={styles.readyCopy}>Put the phone where everyone can hear {recipe.keeper}. Each cooking step will show who is helping.</Text>
      </View>

      <PrimaryButton onPress={onStart} style={styles.startButton}>Start cooking together</PrimaryButton>
    </ScrollView>
  );
}

function Face({ initials, color }: { initials: string; color: string }) {
  return <View style={[styles.face, { backgroundColor: color }]}><Text style={styles.faceText}>{initials}</Text></View>;
}

function Role({ initials, name, role }: { initials: string; name: string; role: string }) {
  return (
    <View style={styles.roleCard}>
      <View style={styles.roleAvatar}><Text style={styles.roleInitial}>{initials}</Text></View>
      <View style={styles.flexOne}>
        <Text style={styles.roleName}>{name}</Text>
        <Text style={styles.roleCopy}>{role}</Text>
      </View>
      <Text style={styles.check}>✓</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 40 },
  hero: { height: 150, flexDirection: 'row', overflow: 'hidden', borderRadius: 24, backgroundColor: colors.paper },
  art: { width: 142, overflow: 'hidden' },
  heroCopy: { flex: 1, justifyContent: 'center', paddingHorizontal: 18 },
  recipeName: { color: colors.forestDeep, fontFamily: 'serif', fontSize: 25, fontWeight: '700' },
  arabic: { marginTop: 2, color: colors.clay, fontSize: 16 },
  teacher: { marginTop: 9, color: colors.inkMuted, fontSize: 11 },
  joinedRow: { marginTop: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 19, backgroundColor: colors.sagePale },
  faces: { width: 88, flexDirection: 'row' },
  face: { width: 38, height: 38, marginRight: -9, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.cream, borderRadius: 19 },
  faceText: { color: colors.forestDeep, fontFamily: 'serif', fontSize: 12, fontWeight: '800' },
  flexOne: { flex: 1 },
  joinedTitle: { color: colors.forestDeep, fontSize: 13, fontWeight: '800' },
  joinedCopy: { marginTop: 3, color: colors.inkMuted, fontSize: 10 },
  sectionTitle: { marginTop: 24, marginBottom: 11, color: colors.forestDeep, fontSize: 16, fontWeight: '800' },
  roleList: { gap: 9 },
  roleCard: { minHeight: 69, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 11, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, borderRadius: 18, backgroundColor: colors.paper },
  roleAvatar: { width: 43, height: 43, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: colors.clayPale },
  roleInitial: { color: colors.clay, fontFamily: 'serif', fontSize: 15, fontWeight: '800' },
  roleName: { color: colors.forestDeep, fontSize: 12, fontWeight: '800' },
  roleCopy: { marginTop: 3, color: colors.inkMuted, fontSize: 10 },
  check: { color: colors.forest, fontSize: 15, fontWeight: '800' },
  readyNote: { marginTop: 17, padding: 15, borderRadius: 17, backgroundColor: colors.clayPale },
  readyTitle: { color: colors.forestDeep, fontSize: 12, fontWeight: '800' },
  readyCopy: { marginTop: 5, color: colors.inkMuted, fontSize: 11, lineHeight: 16 },
  startButton: { marginTop: 18 },
});
