import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii } from '../theme';
import { BrandMark } from './BrandMark';

export function TopBar() {
  return (
    <View style={styles.topbar}>
      <View style={styles.brand}>
        <BrandMark />
        <View>
          <Text style={styles.title}>Mirath <Text style={styles.arabic}>ميراث</Text></Text>
          <Text style={styles.subtitle}>A living family cookbook</Text>
        </View>
      </View>
      <Pressable accessibilityLabel="Open profile" style={styles.avatar}>
        <Text style={styles.avatarText}>AF</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  title: {
    color: colors.forestDeep,
    fontSize: 18,
    fontWeight: '700',
  },
  arabic: {
    fontSize: 16,
  },
  subtitle: {
    marginTop: 3,
    color: colors.inkMuted,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  avatar: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.round,
    backgroundColor: colors.clayPale,
  },
  avatarText: {
    color: colors.clay,
    fontWeight: '700',
  },
});

