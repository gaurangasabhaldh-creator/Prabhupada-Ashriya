import React, {useState} from 'react';
import {View, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Icon} from '@components/common/Icon/Icon';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {EmptyState} from '@components/common/EmptyState/EmptyState';
import {SimpleBarChart} from '@components/charts/SimpleBarChart';
import {DonutChart} from '@components/charts/DonutChart';
import {TrendLine} from '@components/charts/TrendLine';
import {useAttendanceAnalysis, useWeeklyTrend} from '@hooks/attendance/useAttendanceAnalysis';
import {useCallingListsForWeek, useCurrentWeekString} from '@hooks/calling/useCallingList';
import {useFollowUps} from '@hooks/care/useFollowUps';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';

const NavCard = ({
  icon,
  label,
  desc,
  color,
  onPress,
}: {
  icon: string;
  label: string;
  desc: string;
  color: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={[styles.navCard, {borderLeftColor: color}]} onPress={onPress}>
    <Icon name={icon} size={24} color={color} filled />
    <View style={{flex: 1}}>
      <Text variant="title-md">{label}</Text>
      <Text variant="body-sm" color="onSurfaceVariant">{desc}</Text>
    </View>
    <Icon name="chevron_right" size={20} color={COLORS.onSurfaceVariant} />
  </TouchableOpacity>
);

export default function ReportsScreen() {
  const navigation = useNavigation<any>();
  const weekString = useCurrentWeekString();
  const {data: analysis, isLoading} = useAttendanceAnalysis(0);
  const {data: trend = []} = useWeeklyTrend(6);
  const {data: callingLists = []} = useCallingListsForWeek(weekString);
  const {data: followUps = []} = useFollowUps();

  if (isLoading) return <ListSkeleton count={4} />;

  const confirmedComing = callingLists.reduce((a, l) => a + l.confirmedComing, 0);
  const totalAssigned = callingLists.reduce((a, l) => a + l.totalAssigned, 0);
  const activeFollowUps = followUps.filter(f => f.isActive).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headline-md" color="secondary" style={{marginBottom: SPACING.sm}}>
          Reports & Analytics
        </Text>

        {/* Weekly snapshot */}
        {analysis && (
          <View style={styles.card}>
            <Text variant="title-lg" style={{marginBottom: SPACING.md}}>This Week Snapshot</Text>
            <View style={styles.snapshotRow}>
              <View style={styles.snap}>
                <Text variant="display-sm" color="primary">{analysis.avgPct}%</Text>
                <Text variant="label-sm" color="onSurfaceVariant">Attendance</Text>
              </View>
              <View style={styles.snap}>
                <Text variant="display-sm" style={{color: COLORS.success}}>{confirmedComing}</Text>
                <Text variant="label-sm" color="onSurfaceVariant">Confirmed</Text>
              </View>
              <View style={styles.snap}>
                <Text variant="display-sm" color="secondary">{activeFollowUps}</Text>
                <Text variant="label-sm" color="onSurfaceVariant">Follow-Ups</Text>
              </View>
            </View>
          </View>
        )}

        {/* 6-week trend */}
        {trend.length > 0 && (
          <View style={styles.card}>
            <Text variant="title-md" style={{marginBottom: SPACING.md}}>6-Week Trend</Text>
            <TrendLine
              data={trend.map(t => ({label: t.weekString.slice(5), value: t.avgPct}))}
              height={80}
              color={COLORS.primary}
            />
          </View>
        )}

        {/* Donut breakdown */}
        {analysis && (
          <View style={styles.card}>
            <Text variant="title-md" style={{marginBottom: SPACING.md}}>This Week Breakdown</Text>
            <DonutChart
              segments={[
                {label: 'Present', value: analysis.totalPresent, color: COLORS.primary},
                {label: 'Absent', value: analysis.totalAbsent, color: COLORS.secondary},
                {
                  label: 'Excused',
                  value: analysis.records.filter(r => r.status === 'excused').length,
                  color: COLORS.tertiary,
                },
              ]}
              centerValue={`${analysis.avgPct}%`}
              centerLabel="avg"
            />
          </View>
        )}

        {/* Admin navigation cards */}
        <Text variant="title-sm" color="onSurfaceVariant" style={styles.navLabel}>
          Management
        </Text>
        <NavCard
          icon="group"
          label="Team Management"
          desc="Create and manage seva teams"
          color={COLORS.primary}
          onPress={() => navigation.navigate('TeamManagement')}
        />
        <NavCard
          icon="manage_accounts"
          label="User Management"
          desc="Manage roles and access"
          color={COLORS.secondary}
          onPress={() => navigation.navigate('UserManagement')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  content: {padding: SPACING.marginMobile, gap: SPACING.md, paddingBottom: SPACING.xxl},
  card: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  snapshotRow: {flexDirection: 'row', justifyContent: 'space-around'},
  snap: {alignItems: 'center', gap: 4},
  navLabel: {marginTop: SPACING.sm},
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
  },
});
