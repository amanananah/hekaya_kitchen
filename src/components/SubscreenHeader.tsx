import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii } from '../theme';

type SubscreenHeaderProps = {
  title: string;
  subtitle: string;
  onBack: () => void;
};

export function SubscreenHeader({ title, subtitle, onBack }: SubscreenHeaderProps) {
  return (
    <View style={styles.row}>
      <Pressable accessibilityLabel="Go back" onPress={onBack} style={styles.back}>
        <Text style={styles.chevron}>‹</Text>
      </Pressable>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 26,
  },
  back: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: radii.medium,
    backgroundColor: colors.paper,
  },
  chevron: {
    marginTop: -3,
    color: colors.forest,
    fontSize: 34,
    fontWeight: '300',
  },
  title: {
    color: colors.forestDeep,
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 3,
    color: colors.inkMuted,
    fontSize: 11,
  },
});
