import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';

interface Bar {
  label: string;
  value: number;
  color?: string;
}

interface Props {
  data: Bar[];
  maxValue?: number;
  height?: number;
  showValues?: boolean;
}

export const SimpleBarChart = ({data, maxValue, height = 120, showValues = true}: Props) => {
  const max = maxValue ?? Math.max(...data.map(d => d.value), 1);

  return (
    <View style={styles.container}>
      <View style={[styles.barsRow, {height}]}>
        {data.map((bar, i) => {
          const barHeight = Math.max((bar.value / max) * height, bar.value > 0 ? 4 : 0);
          const color = bar.color ?? COLORS.primary;
          return (
            <View key={i} style={styles.barWrapper}>
              {showValues && (
                <Text variant="label-sm" style={{color, marginBottom: 2, fontSize: 10}}>
                  {bar.value > 0 ? bar.value : ''}
                </Text>
              )}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {height: barHeight, backgroundColor: color},
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.labels}>
        {data.map((bar, i) => (
          <Text key={i} variant="label-sm" color="onSurfaceVariant" style={styles.label} numberOfLines={1}>
            {bar.label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {gap: SPACING.xs},
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.xs,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: '100%',
    justifyContent: 'flex-end',
    borderRadius: BORDER_RADIUS.xs,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: BORDER_RADIUS.xs,
  },
  labels: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontSize: 9,
  },
});
