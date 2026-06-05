import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {COLORS} from '@constants/colors';
import {SPACING} from '@constants/spacing';

interface Point {
  label: string;
  value: number;
}

interface Props {
  data: Point[];
  height?: number;
  color?: string;
  showDots?: boolean;
}

export const TrendLine = ({data, height = 80, color = COLORS.primary, showDots = true}: Props) => {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d.value), 1);
  const min = Math.min(...data.map(d => d.value), 0);
  const range = max - min || 1;

  return (
    <View style={styles.container}>
      <View style={[styles.chart, {height}]}>
        {/* Horizontal grid lines */}
        {[0, 0.5, 1].map(pct => (
          <View
            key={pct}
            style={[styles.gridLine, {bottom: pct * height}]}
          />
        ))}

        {/* Points and connecting lines */}
        {data.map((point, i) => {
          const x = i / (data.length - 1 || 1);
          const y = (point.value - min) / range;
          const dotBottom = y * (height - 12);
          const dotLeft = `${x * 100}%` as any;

          return (
            <React.Fragment key={i}>
              {showDots && (
                <View
                  style={[
                    styles.dot,
                    {
                      bottom: dotBottom,
                      left: dotLeft,
                      backgroundColor: color,
                      transform: [{translateX: -5}],
                    },
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* X labels */}
      <View style={styles.labels}>
        {data.map((point, i) => (
          <Text
            key={i}
            variant="label-sm"
            color="onSurfaceVariant"
            style={styles.label}
            numberOfLines={1}>
            {point.label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {gap: SPACING.xs},
  chart: {position: 'relative'},
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.outlineVariant,
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: COLORS.surfaceContainerLowest,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontSize: 9,
  },
});
