import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Icon} from '@components/common/Icon/Icon';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {useFollowUps} from '@hooks/care/useFollowUps';
import {useInactiveDevotees} from '@hooks/care/useInactiveDevotees';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {FOLLOW_UP_STATUS, FOLLOW_UP_STATUS_LABELS, PRIORITY_COLORS, Priority} from '@constants/callStatus';

const MetricRow = ({label, value, color}: {label: string; value: number; color: string}) => (
  <View style={styles.metricRow}>
    <View style={[styles.dot, {backgroundColor: color}]} />
    <Text variant="body-md" style={{flex: 1}}>{label}</Text>
    <Text variant="title-md">{value}</Text>
  </View>
);

export default function CareAnalyticsTab() {
  const {data: followUps = [], isLoading: followUpsLoading} = useFollowUps();
  const {data: inactive = [], isLoading: inactiveLoading} = useInactiveDevotees();

  if (followUpsLoading || inactiveLoading) return <ListSkeleton count={4} />;

  const total = followUps.length;
  const active = followUps.filter(f => f.isActive).length;
  const resolved = followUps.filter(f => !f.isActive).length;
  const high = followUps.filter(f => f.priority === 'high').length;
  const medium = followUps.filter(f => f.priority === 'medium').length;
  const low = followUps.filter(f => f.priority === 'low').length;

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const avgAttempts =
    followUps.length > 0
      ? (followUps.reduce((a, f) => a + f.contactAttempts, 0) / followUps.length).toFixed(1)
      : '0';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* KPI strip */}
      <View style={styles.kpiRow}>
        <View style={styles.kpi}>
          <Text variant="display-sm" color="primary">{resolutionRate}%</Text>
          <Text variant="label-sm" color="onSurfaceVariant">Resolution Rate</Text>
        </View>
        <View style={styles.kpi}>
          <Text variant="display-sm" color="tertiary">{avgAttempts}</Text>
          <Text variant="label-sm" color="onSurfaceVariant">Avg Attempts</Text>
        </View>
        <View style={styles.kpi}>
          <Text variant="display-sm" color="secondary">{inactive.length}</Text>
          <Text variant="label-sm" color="onSurfaceVariant">Inactive</Text>
        </View>
      </View>

      {/* Follow-up status breakdown */}
      <View style={styles.card}>
        <Text variant="title-md" style={{marginBottom: SPACING.md}}>Follow-Up Status</Text>
        <MetricRow label="Active" value={active} color={COLORS.primary} />
        <MetricRow label="Resolved" value={resolved} color={COLORS.success} />
        <MetricRow label="Total" value={total} color={COLORS.outline} />
      </View>

      {/* Priority breakdown */}
      <View style={styles.card}>
        <Text variant="title-md" style={{marginBottom: SPACING.md}}>Priority Breakdown</Text>
        <MetricRow label="High Priority" value={high} color={PRIORITY_COLORS.high} />
        <MetricRow label="Medium Priority" value={medium} color={PRIORITY_COLORS.medium} />
        <MetricRow label="Low Priority" value={low} color={PRIORITY_COLORS.low} />
      </View>

      {/* Inactivity severity */}
      {inactive.length > 0 && (
        <View style={styles.card}>
          <Text variant="title-md" style={{marginBottom: SPACING.md}}>Inactivity Severity</Text>
          <MetricRow
            label="3-4 absences"
            value={inactive.filter(d => d.absences >= 3 && d.absences < 5).length}
            color={COLORS.tertiary}
          />
          <MetricRow
            label="5+ absences (critical)"
            value={inactive.filter(d => d.absences >= 5).length}
            color={COLORS.secondary}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  content: {padding: SPACING.marginMobile, gap: SPACING.md},
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  kpi: {alignItems: 'center', gap: 4},
  card: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    gap: SPACING.sm,
  },
  metricRow: {flexDirection: 'row', alignItems: 'center', gap: SPACING.sm},
  dot: {width: 8, height: 8, borderRadius: 4},
});
