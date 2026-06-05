import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, ViewStyle} from 'react-native';
import {Text} from '../Typography/Text';
import {COLORS, ColorKey} from '@constants/colors';
import {BORDER_RADIUS, SPACING} from '@constants/spacing';

interface Props {
  label: string;
  value: number;
  color?: ColorKey | string;
  trend?: string;
  style?: ViewStyle;
}

export const StatCard: React.FC<Props> = ({label, value, color = 'primary', trend, style}) => {
  const resolvedColor = color in COLORS ? COLORS[color as ColorKey] : (color as string);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      Animated.sequence([
        Animated.timing(scaleAnim, {toValue: 1.08, duration: 120, useNativeDriver: true}),
        Animated.spring(scaleAnim, {toValue: 1, useNativeDriver: true, tension: 200}),
      ]).start();
      prevValue.current = value;
    }
  }, [value, scaleAnim]);

  return (
    <View
      style={[
        styles.card,
        {backgroundColor: resolvedColor + '12', borderColor: resolvedColor + '30'},
        style,
      ]}
      accessibilityLabel={`${label}: ${value}`}>
      <Text variant="label-lg" style={{color: resolvedColor + 'cc'}}>{label.toUpperCase()}</Text>
      <Animated.Text
        style={[
          {
            fontFamily: 'PlusJakartaSans',
            fontSize: 36,
            fontWeight: '700',
            lineHeight: 44,
            color: resolvedColor,
          },
          {transform: [{scale: scaleAnim}]},
        ]}>
        {value}
      </Animated.Text>
      {trend && (
        <Text variant="label-md" style={{color: resolvedColor + '99', marginTop: 2}}>
          {trend}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    minHeight: 88,
  },
});
