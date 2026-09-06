import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { SubscreenHeader } from '../components/SubscreenHeader';
import { colors } from '../theme';
import type { Recipe } from '../types';

type AttemptScreenProps = {
  recipe: Recipe;
  onBack: () => void;
  onSubmit: () => void;
  togetherMode?: boolean;
};

export function AttemptScreen({ recipe, onBack, onSubmit, togetherMode = false }: AttemptScreenProps) {
  const [attachment, setAttachment] = useState<'photo' | 'voice' | null>(null);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} style={styles.screen}>
      <SubscreenHeader title="Share your attempt" subtitle={`Send it privately to ${recipe.keeper}`} onBack={onBack} />
      <Text style={styles.copy}>{togetherMode ? 'Add a group photo from your family cooking time.' : `Add a photo or voice note so ${recipe.keeper} can see how it went.`}</Text>

      <View style={styles.options}>
        <AttachmentOption
          active={attachment === 'photo'}
          description="Take a picture of the finished result"
          icon="▣"
          label="Add a photo"
          onPress={() => setAttachment('photo')}
        />
        <AttachmentOption
          active={attachment === 'voice'}
          description={`Tell ${recipe.keeper} what felt easy or difficult`}
          icon="●"
          label="Record a voice message"
          onPress={() => setAttachment('voice')}
        />
      </View>

      {attachment ? (
        <View style={styles.readyCard}>
          <Text style={styles.readyIcon}>✓</Text>
          <View style={styles.flexOne}>
            <Text style={styles.readyTitle}>{attachment === 'photo' ? 'Photo attached' : 'Voice message attached'}</Text>
            <Text style={styles.readyCopy}>Ready for {recipe.keeper}'s review</Text>
          </View>
          <Pressable onPress={() => setAttachment(null)}><Text style={styles.remove}>Remove</Text></Pressable>
        </View>
      ) : null}

      <Text style={styles.privacyNote}>🔒 Only your family circle can see this attempt.</Text>

      <View style={styles.actions}>
        <SecondaryButton onPress={onBack} style={styles.flexOne}>Not now</SecondaryButton>
        <PrimaryButton disabled={!attachment} onPress={onSubmit} style={styles.flexOne}>Send to teacher</PrimaryButton>
      </View>
    </ScrollView>
  );
}

function AttachmentOption({ active, description, icon, label, onPress }: { active: boolean; description: string; icon: string; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.option, active && styles.optionActive]}>
      <View style={styles.optionIcon}><Text style={styles.optionIconText}>{icon}</Text></View>
      <View style={styles.flexOne}>
        <Text style={styles.optionTitle}>{label}</Text>
        <Text style={styles.optionCopy}>{description}</Text>
      </View>
      <Text style={styles.optionCheck}>{active ? '✓' : '›'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 40 },
  copy: { color: colors.inkMuted, fontSize: 14, lineHeight: 21 },
  options: { marginTop: 24, gap: 12 },
  option: { minHeight: 88, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 13, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, borderRadius: 21, backgroundColor: colors.paper },
  optionActive: { borderWidth: 2, borderColor: colors.forest, backgroundColor: colors.sagePale },
  optionIcon: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 17, backgroundColor: colors.clayPale },
  optionIconText: { color: colors.clay, fontSize: 20, fontWeight: '800' },
  optionTitle: { color: colors.forestDeep, fontSize: 15, fontWeight: '800' },
  optionCopy: { marginTop: 4, color: colors.inkMuted, fontSize: 11, lineHeight: 16 },
  optionCheck: { color: colors.forest, fontSize: 22, fontWeight: '800' },
  readyCard: { marginTop: 18, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 11, borderRadius: 18, backgroundColor: colors.sagePale },
  readyIcon: { color: colors.forest, fontSize: 20, fontWeight: '800' },
  readyTitle: { color: colors.forestDeep, fontSize: 13, fontWeight: '800' },
  readyCopy: { marginTop: 3, color: colors.inkMuted, fontSize: 10 },
  remove: { color: colors.clay, fontSize: 11, fontWeight: '800' },
  privacyNote: { marginTop: 20, color: colors.inkMuted, fontSize: 11 },
  actions: { marginTop: 24, flexDirection: 'row', gap: 10 },
  flexOne: { flex: 1 },
});
