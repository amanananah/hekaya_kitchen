import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii } from '../theme';
import type { AppScreen } from '../types';

type BottomNavProps = {
  active: AppScreen;
  onNavigate: (screen: AppScreen) => void;
};

const items: Array<{ id: AppScreen; symbol: string; label: string }> = [
  { id: 'home', symbol: '⌂', label: 'Home' },
  { id: 'recipes', symbol: '▤', label: 'Recipes' },
  { id: 'capture', symbol: '◎', label: 'Capture' },
  { id: 'family', symbol: '◌', label: 'Family' },
];

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <View style={styles.container}>
      {items.map((item) => {
        const selected = active === item.id;
        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            key={item.id}
            onPress={() => onNavigate(item.id)}
            style={[styles.item, selected && styles.itemActive]}
          >
            <Text style={[styles.symbol, selected && styles.activeText]}>{item.symbol}</Text>
            <Text style={[styles.label, selected && styles.activeText]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    backgroundColor: colors.paper,
  },
  item: {
    flex: 1,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderRadius: radii.medium,
  },
  itemActive: {
    backgroundColor: colors.sagePale,
  },
  symbol: {
    color: '#859087',
    fontSize: 21,
    fontWeight: '600',
  },
  label: {
    color: '#859087',
    fontSize: 11,
    fontWeight: '600',
  },
  activeText: {
    color: colors.forest,
  },
});

