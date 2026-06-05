import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {EmptyState} from '@components/common/EmptyState/EmptyState';
import {TrendLine} from '@components/charts/TrendLine';
import {SimpleBarChart} from '@components/charts/SimpleBarChart';
import {useWeeklyTrend} from '@hooks/attendance/useAttendanceAnalysis';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';

export default function TrendsTab() {
  const {data: trend = [], isLoading} = useWeeklyTrend(6);

  if (isLoading) return <ListSkeleton count={4} />;

  if (!trend.length || trend.every(t => t.avgPct === 0)) {
    return (
      <EmptyState
        icon="trending_up"
        title="Not Enough Data"
        message="Trends will appear after a few weeks of attendance data."
      />
    );
  }

  const latestPct = trend[trend.length - 1]?.avgPct ?? 0;
  const previousPct = trend[trend.length - 2]?.avgPct ?? latestPct;
  const trendDelta = latestPct - previousPct;
  const trendUp = trendDelta >= 0;

  const avgAll = trend.reduce((a, t) => a + t.avgPct, 0) / (trend.length || 1);
  const best = Math.max(...trend.map(t => t.avgPct));
  const worst = Math.min(...trend.map(t => t.avgPct));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* KPI strip */}
      <View style={styles.kpiRow}>
        <View style={styles.kpi}>
          <Text variant="display-sm" color="primary">{Math.round(avgAll)}%</Text>
          <Text variant="label-sm" color="onSurfaceVariant">6-Week Avg</Text>
        </View>
        <View style={styles.kpi}>
          <Text variant="display-sm" color="success">{best}%</Text>
          <Text variant="label-sm" color="onSurfaceVariant">Best Week</Text>
        </View>
        <View style={styles.kpi}>
          <Text
            variant="display-sm"
            style={{color: trendUp ? COLORS.success : COLORS.secondary}}>
            {trendDelta >= 0 ? '+' : ''}{trendDelta}%
          </Text>
          <Text variant="label-sm" color="onSurfaceVariant">vs Last Week</Text>
        </View>
      </View>

      {/* Trend line chart */}
      <View style={styles.card}>
        <Text variant="title-md" style={{marginBottom: SPACING.md}}>
          6-Week Attendance Trend
        </Text>
        <TrendLine
          data={trend.map(t => ({
            label: t.weekString.slice(5),
            value: t.avgPct,
          }))}
          height={100}
          color={COLORS.primary}
        />
      </View>

      {/* Bar chart comparison */}
      <View style={styles.card}>
        <Text variant="title-md" style={{marginBottom: SPACING.md}}>
          Week-by-Week Attendance %
        </Text>
        <SimpleBarChart
          data={trend.map(t => ({
            label: t.weekString.slice(5),
            value: t.avgPct,
            color: t.avgPct >= 80
              ? COLORS.success
              : t.avgPct >= 60
              ? COLORS.tertiary
              : COLORS.secondary,
          }))}
          maxValue={100}
          height={120}
        />
      </View>

      {/* Insights */}
      <View style={styles.card}>
        <Text variant="title-md" style={{marginBottom: SPACING.sm}}>Insights</Text>
        <View style={styles.insightRow}>
          <Text variant="body-md" style={{flex: 1}}>Average attendance over 6 weeks</Text>
          <Text variant="title-md" color="primary">{Math.round(avgAll)}%</Text>
        </View>
        <View style={styles.insightRow}>
          <Text variant="body-md" style={{flex: 1}}>Best week attendance</Text>
          <Text variant="title-md" style={{color: COLORS.success}}>{best}%</Text>
        </View>
        <View style={styles.insightRow}>
          <Text variant="body-md" style={{flex: 1}}>Lowest week attendance</Text>
          <Text variant="title-md" color="secondary">{worst}%</Text>
        </View>
        <View style={styles.insightRow}>
          <Text variant="body-md" style={{flex: 1}}>Current trend</Text>
          <Text
            variant="title-md"
            style={{color: trendUp ? COLORS.success : COLORS.secondary}}>
            {trendUp ? '↑ Improving' : '↓ Declining'}
          </Text>
        </View>
      </View>
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
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
  },
});
