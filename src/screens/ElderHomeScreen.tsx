import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandMark } from '../components/BrandMark';
import { colors, radii } from '../theme';

type ElderHomeScreenProps = {
  arabic: boolean;
  hasReply: boolean;
  onLanguageChange: (arabic: boolean) => void;
  onExit: () => void;
  onRecord: () => void;
  onReply: () => void;
  onReview: () => void;
};

export function ElderHomeScreen({ arabic, hasReply, onExit, onLanguageChange, onRecord, onReply, onReview }: ElderHomeScreenProps) {
  const copy = arabic ? {
    hello: 'مرحباً يا فاطمة',
    prompt: 'ماذا تريدين أن تفعلي؟',
    record: 'تسجيل وصفة',
    recordNote: 'اطبخي وتكلمي بطريقتك المعتادة',
    review: 'مراجعة الوصفة',
    reviewNote: 'تفصيلان يحتاجان تأكيدك',
    reply: 'الرد على أمانة',
    replyNote: hasReply ? 'تم إرسال ردك' : 'شاهدت أمانة وهي تطبخ اللقيمات',
    helper: 'يمكن لأمانة تجهيز الكاميرا. أنتِ فقط اطبخي وتكلمي.',
    exit: 'الخروج من الوضع السهل',
    language: 'English',
  } : {
    hello: 'Hello, Fatima',
    prompt: 'What would you like to do?',
    record: 'Record a recipe',
    recordNote: 'Cook and speak as you normally do',
    review: 'Review the recipe',
    reviewNote: '2 details need your answer',
    reply: 'Reply to Amanah',
    replyNote: hasReply ? 'Your reply was sent' : 'Amanah tried your luqaimat',
    helper: 'Amanah can set up the camera. You only need to cook and talk.',
    exit: 'Exit Easy Mode',
    language: 'العربية',
  };

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.topRow}>
        <BrandMark size={54} />
        <Pressable accessibilityRole="button" onPress={() => onLanguageChange(!arabic)} style={styles.languageButton}>
          <Text style={styles.languageText}>{copy.language}</Text>
        </Pressable>
      </View>

      <View style={arabic && styles.rtlBlock}>
        <Text style={[styles.hello, arabic && styles.rtlText]}>{copy.hello}</Text>
        <Text style={[styles.prompt, arabic && styles.rtlText]}>{copy.prompt}</Text>
      </View>

      <View style={styles.actions}>
        <ElderAction icon="●" title={copy.record} note={copy.recordNote} onPress={onRecord} rtl={arabic} />
        <ElderAction badge={arabic ? 'تفصيلان' : '2 details'} icon="✓" title={copy.review} note={copy.reviewNote} onPress={onReview} rtl={arabic} />
        <ElderAction badge={!hasReply ? (arabic ? 'جديد' : 'New') : undefined} icon="♥" title={copy.reply} note={copy.replyNote} onPress={onReply} rtl={arabic} />
      </View>

      <View style={[styles.helperCard, arabic && styles.rtlRow]}>
        <Text style={styles.helperIcon}>👋</Text>
        <Text style={[styles.helperText, arabic && styles.rtlText]}>{copy.helper}</Text>
      </View>

      <Pressable accessibilityRole="button" onPress={onExit} style={styles.exitButton}>
        <Text style={styles.exitText}>{copy.exit}</Text>
      </Pressable>
    </ScrollView>
  );
}

function ElderAction({ badge, icon, note, onPress, rtl, title }: { badge?: string; icon: string; note: string; onPress: () => void; rtl: boolean; title: string }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.action, rtl && styles.rtlRow, pressed && styles.pressed]}>
      <View style={styles.actionIcon}><Text style={styles.actionIconText}>{icon}</Text></View>
      <View style={styles.actionCopy}>
        <Text style={[styles.actionTitle, rtl && styles.rtlText]}>{title}</Text>
        <Text style={[styles.actionNote, rtl && styles.rtlText]}>{note}</Text>
      </View>
      {badge ? <Text style={styles.badge}>{badge}</Text> : <Text style={styles.arrow}>{rtl ? '‹' : '›'}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 34 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  languageButton: { minWidth: 94, minHeight: 52, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: 17, backgroundColor: colors.paper },
  languageText: { color: colors.forestDeep, fontSize: 17, fontWeight: '800' },
  hello: { marginTop: 30, color: colors.forestDeep, fontFamily: 'serif', fontSize: 38, lineHeight: 43 },
  prompt: { marginTop: 8, color: colors.inkMuted, fontSize: 20, lineHeight: 28 },
  actions: { marginTop: 25, gap: 14 },
  action: { minHeight: 104, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderColor: colors.line, borderRadius: radii.large, backgroundColor: colors.paper },
  actionIcon: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: colors.sagePale },
  actionIconText: { color: colors.forest, fontSize: 27, fontWeight: '800' },
  actionCopy: { flex: 1 },
  actionTitle: { color: colors.forestDeep, fontSize: 21, lineHeight: 27, fontWeight: '800' },
  actionNote: { marginTop: 5, color: colors.inkMuted, fontSize: 14, lineHeight: 20 },
  badge: { paddingHorizontal: 10, paddingVertical: 7, overflow: 'hidden', borderRadius: 11, color: colors.clay, backgroundColor: colors.clayPale, fontSize: 11, fontWeight: '800' },
  arrow: { color: colors.forest, fontSize: 32 },
  helperCard: { marginTop: 22, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 20, backgroundColor: colors.sagePale },
  helperIcon: { fontSize: 25 },
  helperText: { flex: 1, color: colors.forestDeep, fontSize: 15, lineHeight: 22, fontWeight: '700' },
  exitButton: { minHeight: 56, marginTop: 18, alignItems: 'center', justifyContent: 'center' },
  exitText: { color: colors.inkMuted, fontSize: 15, textDecorationLine: 'underline' },
  rtlBlock: { alignItems: 'flex-end' },
  rtlRow: { flexDirection: 'row-reverse' },
  rtlText: { textAlign: 'right', writingDirection: 'rtl' },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
});
