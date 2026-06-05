import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Icon} from '@components/common/Icon/Icon';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {useAbsentDevotees} from '@hooks/care/useAbsentDevotees';
import {useInactiveDevotees} from '@hooks/care/useInactiveDevotees';
import {useFollowUps} from '@hooks/care/useFollowUps';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {FOLLOW_UP_STATUS} from '@constants/callStatus';

const SummaryCard = ({
  icon,
  count,
  label,
  color,
}: {
  icon: string;
  count: number;
  label: string;
  color: string;
}) => (
  <View style={[styles.summaryCard, {borderTopColor: color}]}>
    <Icon name={icon} size={24} color={color} filled />
    <Text variant="display-sm" style={{color}}>{count}</Text>
    <Text variant="label-sm" color="onSurfaceVariant" style={{textAlign: 'center'}}>
      {label}
    </Text>
  </View>
);

export default function ThisWeekTab() {
  const today = new Date();
  const {data: absent = [], isLoading: absentLoading} = useAbsentDevotees(today);
  const {data: inactive = [], isLoading: inactiveLoading} = useInactiveDevotees();
  const {data: followUps = [], isLoading: followUpsLoading} = useFollowUps();

  const activeFollowUps = followUps.filter(f => f.isActive).length;
  const urgentFollowUps = followUps.filter(
    f => f.isActive && f.priority === 'high',
  ).length;
  const resolvedThisWeek = followUps.filter(
    f => !f.isActive && f.status === FOLLOW_UP_STATUS.RESOLVED,
  ).length;

  const isLoading = absentLoading || inactiveLoading || followUpsLoading;
  if (isLoading) return <ListSkeleton count={4} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="title-lg" style={{marginBottom: SPACING.md}}>Care Overview</Text>

      {/* Summary grid */}
      <View style={styles.grid}>
        <SummaryCard
          icon="person_off"
          count={absent.length}
          label="Absent Today"
          color={COLORS.secondary}
        />
        <SummaryCard
          icon="trending_down"
          count={inactive.length}
          label="Inactive (3+ absent)"
          color={COLORS.tertiary}
        />
        <SummaryCard
          icon="assignment_late"
          count={activeFollowUps}
          label="Active Follow-Ups"
          color={COLORS.primary}
        />
        <SummaryCard
          icon="priority_high"
          count={urgentFollowUps}
          label="High Priority"
          color={COLORS.error}
        />
      </View>

      {/* Attention needed */}
      {urgentFollowUps > 0 && (
        <View style={styles.alertCard}>
          <Icon name="warning" size={20} color={COLORS.secondary} filled />
          <Text variant="body-md" style={{flex: 1}}>
            {urgentFollowUps} high-priority follow-up{urgentFollowUps !== 1 ? 's' : ''} need{urgentFollowUps === 1 ? 's' : ''} immediate attention.
          </Text>
        </View>
      )}

      {resolvedThisWeek > 0 && (
        <View style={styles.successCard}>
          <Icon name="check_circle" size={20} color={COLORS.success} filled />
          <Text variant="body-md" style={{flex: 1}}>
            {resolvedThisWeek} follow-up{resolvedThisWeek !== 1 ? 's' : ''} resolved this week.
          </Text>
        </View>
      )}

      {/* Top inactive devotees preview */}
      {inactive.length > 0 && (
        <View style={styles.section}>
          <Text variant="title-sm" color="onSurfaceVariant" style={{marginBottom: SPACING.sm}}>
            Most Inactive Devotees
          </Text>
          {inactive.slice(0, 3).map(d => (
            <View key={d.devoteeId} style={styles.inactiveRow}>
              <Text variant="body-md" style={{flex: 1}}>
                {d.devoteeName || d.devoteeId}
              </Text>
              <Text variant="label-md" color="secondary">{d.absences} absences</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  content: {padding: SPACING.marginMobile, gap: SPACING.md},
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  summaryCard: {
    width: '47.5%',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.xs,
    borderTopWidth: 3,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.secondaryFixed,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.successContainer,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  section: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  inactiveRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
  },
});
