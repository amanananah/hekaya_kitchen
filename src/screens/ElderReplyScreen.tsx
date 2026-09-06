import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { RecipeArtwork } from '../components/RecipeArtwork';
import { colors, radii } from '../theme';
import type { Recipe } from '../types';

type ElderReplyScreenProps = {
  arabic: boolean;
  onBack: () => void;
  onSend: (message: string) => void;
  recipe: Recipe;
};

const replies = [
  'Beautiful! Make the next batch a little smaller.',
  'You found the right colour. I am proud of you.',
];

export function ElderReplyScreen({ arabic, onBack, onSend, recipe }: ElderReplyScreenProps) {
  const [recording, setRecording] = useState(false);
  const text = arabic ? {
    back: 'رجوع', title: 'أمانة طبخت وصفتك', subtitle: 'لقيمات · مشاركة خاصة مع العائلة', first: 'تجربة أمانة الأولى', note: '«جدتي، هل اللون صحيح؟»', play: 'تشغيل رسالة أمانة', question: 'ماذا تريدين أن تقولي؟', record: recording ? 'أستمع إليكِ… اضغطي عند الانتهاء' : 'سجلي ردك بصوتك', recordNote: recording ? 'سيُرسل صوتك للعائلة فقط' : 'تكلمي فقط — لا حاجة للكتابة', send: 'إرسال ردي الصوتي', replies: ['جميلة! اجعلي الحبات أصغر قليلاً في المرة القادمة.', 'وصلتِ إلى اللون الصحيح. أنا فخورة بكِ.'],
  } : {
    back: 'Back', title: 'Amanah cooked your recipe', subtitle: 'Luqaimat · shared privately with family', first: 'Amanah’s first try', note: '“Did I get the colour right?”', play: 'Play Amanah’s message', question: 'What would you like to say?', record: recording ? 'Listening… tap when finished' : 'Record your own reply', recordNote: recording ? 'Your voice will be sent only to family' : 'Just speak—no typing needed', send: 'Send my voice reply', replies,
  };

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>{arabic ? '›' : '‹'} {text.back}</Text>
      </Pressable>
      <Text style={[styles.title, arabic && styles.rtlText]}>{text.title}</Text>
      <Text style={[styles.subtitle, arabic && styles.rtlText]}>{text.subtitle}</Text>

      <View style={styles.attemptCard}>
        <View style={styles.art}><RecipeArtwork compact recipe={recipe} /></View>
        <View style={styles.attemptCopy}>
          <Text style={[styles.attemptTitle, arabic && styles.rtlText]}>{text.first}</Text>
          <Text style={[styles.attemptNote, arabic && styles.rtlText]}>{text.note}</Text>
        </View>
      </View>

      <Pressable accessibilityRole="button" style={styles.playButton}>
        <View style={styles.playCircle}><Text style={styles.playIcon}>▶</Text></View>
        <Text style={styles.playText}>{text.play}</Text>
      </Pressable>

      <Text style={[styles.question, arabic && styles.rtlText]}>{text.question}</Text>
      {text.replies.map((reply) => (
        <Pressable accessibilityRole="button" key={reply} onPress={() => onSend(reply)} style={({ pressed }) => [styles.replyButton, pressed && styles.pressed]}>
          <Text style={styles.replyText}>{reply}</Text>
          <Text style={styles.sendArrow}>›</Text>
        </Pressable>
      ))}

      <Pressable accessibilityRole="button" onPress={() => setRecording((value) => !value)} style={[styles.recordButton, recording && styles.recordingButton]}>
        <View style={styles.micCircle}><Text style={styles.mic}>{recording ? '■' : '●'}</Text></View>
        <View style={styles.flexOne}>
          <Text style={[styles.recordTitle, arabic && styles.rtlText]}>{text.record}</Text>
          <Text style={[styles.recordNote, arabic && styles.rtlText]}>{text.recordNote}</Text>
        </View>
      </Pressable>
      {recording ? (
        <Pressable accessibilityRole="button" onPress={() => onSend(`Voice reply from ${recipe.keeper}`)} style={styles.sendVoice}>
          <Text style={styles.sendVoiceText}>{text.send}</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 36 },
  backButton: { alignSelf: 'flex-start', minHeight: 52, paddingHorizontal: 5, justifyContent: 'center' },
  backText: { color: colors.forest, fontSize: 18, fontWeight: '800' },
  title: { marginTop: 10, color: colors.forestDeep, fontFamily: 'serif', fontSize: 35, lineHeight: 40 },
  subtitle: { marginTop: 7, color: colors.inkMuted, fontSize: 16, lineHeight: 23 },
  attemptCard: { minHeight: 136, marginTop: 22, overflow: 'hidden', flexDirection: 'row', borderRadius: radii.large, backgroundColor: colors.paper },
  art: { width: 116 },
  attemptCopy: { flex: 1, padding: 16, justifyContent: 'center' },
  attemptTitle: { color: colors.forestDeep, fontSize: 18, fontWeight: '800' },
  attemptNote: { marginTop: 8, color: colors.inkMuted, fontSize: 14, lineHeight: 21 },
  playButton: { minHeight: 74, marginTop: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 13, borderRadius: 21, backgroundColor: colors.forest },
  playCircle: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 23, backgroundColor: colors.paper },
  playIcon: { marginLeft: 2, color: colors.forest, fontSize: 14 },
  playText: { color: colors.white, fontSize: 17, fontWeight: '800' },
  question: { marginTop: 27, marginBottom: 12, color: colors.forestDeep, fontSize: 21, fontWeight: '800' },
  replyButton: { minHeight: 84, marginBottom: 12, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: colors.line, borderRadius: 21, backgroundColor: colors.paper },
  replyText: { flex: 1, color: colors.forestDeep, fontSize: 16, lineHeight: 23, fontWeight: '700' },
  sendArrow: { color: colors.clay, fontSize: 31 },
  recordButton: { minHeight: 86, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 13, borderRadius: 22, backgroundColor: colors.clayPale },
  recordingButton: { borderWidth: 2, borderColor: colors.clay },
  micCircle: { width: 54, height: 54, alignItems: 'center', justifyContent: 'center', borderRadius: 27, backgroundColor: colors.paper },
  mic: { color: colors.danger, fontSize: 20 },
  flexOne: { flex: 1 },
  recordTitle: { color: colors.forestDeep, fontSize: 17, fontWeight: '800' },
  recordNote: { marginTop: 5, color: colors.inkMuted, fontSize: 13 },
  sendVoice: { minHeight: 64, marginTop: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: colors.forest },
  sendVoiceText: { color: colors.white, fontSize: 17, fontWeight: '800' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.99 }] },
  rtlText: { textAlign: 'right', writingDirection: 'rtl' },
});
