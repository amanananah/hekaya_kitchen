import { StyleSheet, Text, View } from 'react-native';

import { BrandMark } from '../components/BrandMark';
import { colors } from '../theme';

type PlaceholderScreenProps = {
  kind: 'recipes' | 'family';
};

export function PlaceholderScreen({ kind }: PlaceholderScreenProps) {
  const content = kind === 'recipes'
    ? {
        title: 'Family recipe vault',
        body: 'Every recipe keeps its original voice, visual checkpoints and the people who shaped it.',
      }
    : {
        title: 'Your family circle',
        body: 'Invite relatives to teach, learn, review attempts and add their version of each story.',
      };

  return (
    <View style={styles.container}>
      <BrandMark size={62} />
      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.body}>{content.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    backgroundColor: colors.cream,
  },
  title: {
    marginTop: 18,
    color: colors.forestDeep,
    fontFamily: 'serif',
    fontSize: 30,
    textAlign: 'center',
  },
  body: {
    maxWidth: 320,
    marginTop: 10,
    color: colors.inkMuted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
});
