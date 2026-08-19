import { StyleSheet, Text, View } from 'react-native';

import { colors, radii } from '../theme';

type BrandMarkProps = {
  size?: number;
  inverse?: boolean;
};

export function BrandMark({ size = 44, inverse = false }: BrandMarkProps) {
  return (
    <View
      style={[
        styles.mark,
        {
          width: size,
          height: size,
          borderRadius: size * 0.32,
          backgroundColor: inverse ? colors.paper : colors.forest,
        },
      ]}
    >
      <Text style={[styles.letter, { color: inverse ? colors.forest : colors.paper }]}>م</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontSize: 15,
    fontWeight: '700',
  },
});

