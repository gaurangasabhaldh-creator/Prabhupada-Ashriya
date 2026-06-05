import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface Props {
  segments: Segment[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}

// Pure CSS donut (no SVG dependency)
export const DonutChart = ({segments, size = 120, centerLabel, centerValue}: Props) => {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;

  return (
    <View style={styles.container}>
      {/* Visual donut approximation using stacked progress rings */}
      <View style={[styles.donut, {width: size, height: size, borderRadius: size / 2}]}>
        {segments.map((seg, i) => {
          const pct = (seg.value / total) * 100;
          return (
            <View
              key={i}
              style={[
                styles.segment,
                {
                  backgroundColor: seg.color,
                  flex: pct,
                },
              ]}
            />
          );
        })}
        {/* Center hole */}
        <View
          style={[
            styles.hole,
            {
              width: size * 0.55,
              height: size * 0.55,
              borderRadius: (size * 0.55) / 2,
            },
          ]}>
          {centerValue ? (
            <>
              <Text variant="title-lg" color="primary">{centerValue}</Text>
              {centerLabel ? (
                <Text variant="label-sm" color="onSurfaceVariant">{centerLabel}</Text>
              ) : null}
            </>
          ) : null}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {segments.map((seg, i) => (
          <View key={i} style={styles.legendRow}>
            <View style={[styles.dot, {backgroundColor: seg.color}]} />
            <Text variant="label-sm" style={{flex: 1}}>{seg.label}</Text>
            <Text variant="label-sm" color="onSurfaceVariant">
              {total > 0 ? Math.round((seg.value / total) * 100) : 0}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  donut: {
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  segment: {
    height: '100%',
  },
  hole: {
    position: 'absolute',
    top: '22.5%',
    left: '22.5%',
    backgroundColor: COLORS.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    width: '100%',
    gap: SPACING.xs,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  dot: {width: 8, height: 8, borderRadius: 4},
});
