import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { TopBar } from '../components/TopBar';
import { familyMembers } from '../data';
import { colors } from '../theme';
import type { Recipe } from '../types';

type FamilyScreenProps = {
  hasAttempt: boolean;
  feedback: string | null;
  onFeedback: (message: string) => void;
  onTogether: () => void;
  recipe: Recipe;
};

const responses = [
  'Beautiful first try — make the next batch a little smaller.',
  'You found the right colour. I am proud of you.',
];

export function FamilyScreen({ hasAttempt, feedback, onFeedback, onTogether, recipe }: FamilyScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} style={styles.screen}>
      <TopBar />
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.title}>Family</Text>
          <Text style={styles.copy}>Recipes, attempts and replies</Text>
        </View>
        <Pressable accessibilityRole="button" style={styles.inviteButton}>
          <Text style={styles.inviteText}>+ Invite</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Next cooking time</Text>
      <Pressable accessibilityRole="button" onPress={onTogether} style={styles.cookCard}>
        <View style={styles.cookDate}><Text style={styles.cookDay}>FRI</Text><Text style={styles.cookTime}>6:30</Text></View>
        <View style={styles.flexOne}>
          <Text style={styles.activityTitle}>{recipe.name} with {recipe.keeper}</Text>
          <Text style={styles.activityCopy}>3 people joined · tap to see everyone's role</Text>
        </View>
        <Text style={styles.cookArrow}>›</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Recent activity</Text>
      <View style={styles.activityCard}>
        <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
        <View style={styles.flexOne}>
          <Text style={styles.activityTitle}>{hasAttempt ? `Amanah shared ${recipe.name}` : 'No new attempts'}</Text>
          <Text style={styles.activityCopy}>{hasAttempt ? `${feedback ? 'Replied by' : 'Waiting for'} ${recipe.keeper} · private` : 'Family activity will appear here.'}</Text>
        </View>
      </View>

      {hasAttempt && !feedback ? (
        <View style={styles.responseCard}>
          <Text style={styles.responseTitle}>Reply to Amanah</Text>
          <Text style={styles.responseCopy}>Choose a saved voice reply.</Text>
          {responses.map((response) => (
            <Pressable accessibilityRole="button" key={response} onPress={() => onFeedback(response)} style={styles.responseOption}>
              <View style={styles.play}><Text style={styles.playText}>▶</Text></View>
              <Text style={styles.responseText}>{response}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {feedback ? (
        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackLabel}>FEEDBACK ON {recipe.name.toLocaleUpperCase()}</Text>
          <Text style={styles.feedbackText}>“{feedback}”</Text>
          <Text style={styles.feedbackSource}>Voice reply from {recipe.keeper} · just now</Text>
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>Family members</Text>
      <View style={styles.people}>
        {familyMembers.slice(0, 3).map((person) => (
          <View key={person.name} style={styles.person}>
            <View style={[styles.personAvatar, { backgroundColor: person.color }]}><Text style={[styles.personInitial, { color: person.ink }]}>{person.initials}</Text></View>
            <Text style={styles.personName}>{person.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 40 },
  pageHeader: { marginTop: 8, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: colors.forestDeep, fontFamily: 'serif', fontSize: 31, lineHeight: 35 },
  copy: { marginTop: 3, color: colors.inkMuted, fontSize: 12 },
  inviteButton: { minHeight: 42, paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: colors.sagePale },
  inviteText: { color: colors.forest, fontSize: 12, fontWeight: '800' },
  sectionTitle: { marginTop: 22, marginBottom: 12, color: colors.forestDeep, fontSize: 16, fontWeight: '800' },
  cookCard: { minHeight: 76, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 11, borderRadius: 19, backgroundColor: colors.sagePale },
  cookDate: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: colors.paper },
  cookDay: { color: colors.clay, fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  cookTime: { marginTop: 2, color: colors.forestDeep, fontSize: 13, fontWeight: '800' },
  cookArrow: { color: colors.forest, fontSize: 23 },
  activityCard: { padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 20, backgroundColor: colors.paper },
  avatar: { width: 50, height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 17, backgroundColor: colors.clayPale },
  avatarText: { color: colors.clay, fontFamily: 'serif', fontSize: 19, fontWeight: '700' },
  flexOne: { flex: 1 },
  activityTitle: { color: colors.forestDeep, fontSize: 13, fontWeight: '800' },
  activityCopy: { marginTop: 4, color: colors.inkMuted, fontSize: 10 },
  responseCard: { marginTop: 14, padding: 18, borderRadius: 22, backgroundColor: colors.clayPale },
  responseTitle: { color: colors.forestDeep, fontSize: 16, fontWeight: '800' },
  responseCopy: { marginTop: 4, color: colors.inkMuted, fontSize: 11 },
  responseOption: { marginTop: 11, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 15, backgroundColor: colors.paper },
  play: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 17, backgroundColor: colors.forest },
  playText: { marginLeft: 2, color: colors.white, fontSize: 10 },
  responseText: { flex: 1, color: colors.forestDeep, fontSize: 11, lineHeight: 16, fontWeight: '700' },
  feedbackCard: { marginTop: 14, padding: 18, borderLeftWidth: 3, borderLeftColor: colors.clay, borderRadius: 20, backgroundColor: colors.sagePale },
  feedbackLabel: { color: colors.clay, fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  feedbackText: { marginTop: 9, color: colors.forestDeep, fontFamily: 'serif', fontSize: 17, lineHeight: 24 },
  feedbackSource: { marginTop: 8, color: colors.inkMuted, fontSize: 9 },
  people: { flexDirection: 'row', gap: 18 },
  person: { alignItems: 'center' },
  personAvatar: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 19 },
  personInitial: { fontFamily: 'serif', fontSize: 18, fontWeight: '700' },
  personName: { marginTop: 7, color: colors.inkMuted, fontSize: 10 },
});
