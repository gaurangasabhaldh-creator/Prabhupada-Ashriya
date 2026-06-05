import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {EmptyState} from '@components/common/EmptyState/EmptyState';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {useCallingListsForWeek, useCurrentWeekString} from '@hooks/calling/useCallingList';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {CallingListDocument} from '@mytypes/calling.types';
import {CALL_STATUS_COLORS} from '@constants/callStatus';

const StatRow = ({label, value, color}: {label: string; value: number; color: string}) => (
  <View style={styles.statRow}>
    <View style={[styles.dot, {backgroundColor: color}]} />
    <Text variant="body-md" style={{flex: 1}}>{label}</Text>
    <Text variant="title-md">{value}</Text>
  </View>
);

const TeamReport = ({list}: {list: CallingListDocument}) => {
  const total = list.totalAssigned || 1;
  const confirmedPct = Math.round((list.confirmedComing / total) * 100);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text variant="title-lg">{list.teamName}</Text>
        <View style={styles.pctBadge}>
          <Text variant="label-lg" color="primary">{confirmedPct}%</Text>
          <Text variant="label-sm" color="onSurfaceVariant">confirmed</Text>
        </View>
      </View>

      <StatRow label="Confirmed Coming" value={list.confirmedComing} color={COLORS.primary} />
      <StatRow label="Not Coming" value={list.notComing} color={COLORS.secondary} />
      <StatRow label="Maybe" value={list.maybe} color={COLORS.tertiary} />
      <StatRow label="No Response" value={list.noResponse} color={COLORS.outline} />
      <StatRow label="Not Reachable" value={list.notReachable} color={COLORS.error} />
      <StatRow label="Call Back Later" value={list.callBackLater} color={COLORS.warning} />
      <StatRow label="Pending" value={list.pendingCalls} color={COLORS.outlineVariant} />
    </View>
  );
};

export default function CallingReportTab() {
  const weekString = useCurrentWeekString();
  const {data: lists = [], isLoading} = useCallingListsForWeek(weekString);

  if (isLoading) return <ListSkeleton count={4} />;

  if (!lists.length) {
    return (
      <EmptyState
        icon="bar_chart"
        title="No Data This Week"
        message="Calling data will appear once teams start making calls."
      />
    );
  }

  const totalConfirmed = lists.reduce((a, l) => a + l.confirmedComing, 0);
  const totalNotComing = lists.reduce((a, l) => a + l.notComing, 0);
  const totalPending = lists.reduce((a, l) => a + l.pendingCalls, 0);
  const totalAssigned = lists.reduce((a, l) => a + l.totalAssigned, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Org-wide summary */}
      <View style={styles.orgSummary}>
        <Text variant="title-lg" style={{marginBottom: SPACING.md}}>This Week's Summary</Text>
        <View style={styles.orgRow}>
          <View style={styles.orgStat}>
            <Text variant="display-sm" color="primary">{totalConfirmed}</Text>
            <Text variant="label-sm" color="onSurfaceVariant">Confirmed</Text>
          </View>
          <View style={styles.orgStat}>
            <Text variant="display-sm" color="secondary">{totalNotComing}</Text>
            <Text variant="label-sm" color="onSurfaceVariant">Not Coming</Text>
          </View>
          <View style={styles.orgStat}>
            <Text variant="display-sm" color="onSurfaceVariant">{totalPending}</Text>
            <Text variant="label-sm" color="onSurfaceVariant">Pending</Text>
          </View>
          <View style={styles.orgStat}>
            <Text variant="display-sm" color="tertiary">{totalAssigned}</Text>
            <Text variant="label-sm" color="onSurfaceVariant">Total</Text>
          </View>
        </View>
      </View>

      {/* Per-team cards */}
      <Text variant="title-sm" color="onSurfaceVariant" style={styles.sectionLabel}>
        By Team
      </Text>
      {lists.map(l => <TeamReport key={l.id} list={l} />)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  content: {padding: SPACING.marginMobile, gap: SPACING.md},
  orgSummary: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  orgRow: {flexDirection: 'row', justifyContent: 'space-around'},
  orgStat: {alignItems: 'center', gap: 2},
  sectionLabel: {marginTop: SPACING.xs},
  card: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    gap: SPACING.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
  },
  pctBadge: {alignItems: 'center'},
  statRow: {flexDirection: 'row', alignItems: 'center', gap: SPACING.sm},
  dot: {width: 8, height: 8, borderRadius: 4},
});
