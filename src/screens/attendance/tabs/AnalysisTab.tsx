import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Avatar} from '@components/common/Avatar/Avatar';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {EmptyState} from '@components/common/EmptyState/EmptyState';
import {DonutChart} from '@components/charts/DonutChart';
import {SimpleBarChart} from '@components/charts/SimpleBarChart';
import {useAttendanceAnalysis} from '@hooks/attendance/useAttendanceAnalysis';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';

export default function AnalysisTab() {
  const {data, isLoading} = useAttendanceAnalysis(0);

  if (isLoading) return <ListSkeleton count={5} />;

  if (!data || !data.records.length) {
    return (
      <EmptyState
        icon="insights"
        title="No Data This Week"
        message="Attendance analysis will appear once marks are recorded."
      />
    );
  }

  const donutSegments = [
    {label: 'Present', value: data.totalPresent, color: COLORS.primary},
    {label: 'Absent', value: data.totalAbsent, color: COLORS.secondary},
    {label: 'Excused', value: data.records.filter(r => r.status === 'excused').length, color: COLORS.tertiary},
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* KPIs */}
      <View style={styles.kpiRow}>
        <View style={styles.kpi}>
          <Text variant="display-sm" color="primary">{data.avgPct}%</Text>
          <Text variant="label-sm" color="onSurfaceVariant">Avg Attendance</Text>
        </View>
        <View style={styles.kpi}>
          <Text variant="display-sm" color="success">{data.consistent.length}</Text>
          <Text variant="label-sm" color="onSurfaceVariant">Consistent (80%+)</Text>
        </View>
        <View style={styles.kpi}>
          <Text variant="display-sm" color="secondary">{data.atRisk.length}</Text>
          <Text variant="label-sm" color="onSurfaceVariant">At Risk (2+ absent)</Text>
        </View>
      </View>

      {/* Donut */}
      <View style={styles.card}>
        <Text variant="title-md" style={{marginBottom: SPACING.md}}>This Week Overview</Text>
        <DonutChart
          segments={donutSegments}
          centerValue={`${data.avgPct}%`}
          centerLabel="avg"
        />
      </View>

      {/* Day-by-day bar */}
      {data.dayStats.length > 0 && (
        <View style={styles.card}>
          <Text variant="title-md" style={{marginBottom: SPACING.md}}>Daily Attendance %</Text>
          <SimpleBarChart
            data={data.dayStats.map(d => ({
              label: d.dateString.slice(5),
              value: d.pct,
              color: d.pct >= 80 ? COLORS.success : d.pct >= 60 ? COLORS.tertiary : COLORS.secondary,
            }))}
            maxValue={100}
            height={100}
          />
        </View>
      )}

      {/* At-risk devotees */}
      {data.atRisk.length > 0 && (
        <View style={styles.card}>
          <Text variant="title-md" style={{marginBottom: SPACING.sm}}>Needs Attention</Text>
          {data.atRisk.slice(0, 5).map(d => (
            <View key={d.devoteeId} style={styles.devoteeRow}>
              <Avatar name={d.name || d.devoteeId.slice(0, 2)} size="sm" />
              <Text variant="body-md" style={{flex: 1}}>{d.name || d.devoteeId}</Text>
              <Text variant="label-md" color="secondary">{d.absent} absent</Text>
            </View>
          ))}
        </View>
      )}

      {/* Consistent devotees */}
      {data.consistent.length > 0 && (
        <View style={styles.card}>
          <Text variant="title-md" style={{marginBottom: SPACING.sm}}>Consistent Devotees</Text>
          {data.consistent.slice(0, 5).map(d => (
            <View key={d.devoteeId} style={styles.devoteeRow}>
              <Avatar name={d.name || d.devoteeId.slice(0, 2)} size="sm" />
              <Text variant="body-md" style={{flex: 1}}>{d.name || d.devoteeId}</Text>
              <Text variant="label-md" color="primary">{d.pct}%</Text>
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
    gap: SPACING.xs,
  },
  devoteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
  },
});
