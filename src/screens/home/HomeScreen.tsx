import React from 'react';
import {View, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Icon} from '@components/common/Icon/Icon';
import {Avatar} from '@components/common/Avatar/Avatar';
import {OfflineBanner} from '@components/common/OfflineBanner/OfflineBanner';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {useAuth} from '@hooks/auth/useAuth';
import {useAttendanceAnalysis} from '@hooks/attendance/useAttendanceAnalysis';
import {useFollowUps} from '@hooks/care/useFollowUps';
import {useCallingListsForWeek, useCurrentWeekString} from '@hooks/calling/useCallingList';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {formatDate} from '@utils/date.utils';

const QuickAction = ({
  icon,
  label,
  color,
  onPress,
}: {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={[styles.quickAction, {borderTopColor: color}]} onPress={onPress}>
    <Icon name={icon} size={28} color={color} filled />
    <Text variant="label-md" style={{textAlign: 'center', color: COLORS.onSurface}}>
      {label}
    </Text>
  </TouchableOpacity>
);

const StatTile = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) => (
  <View style={[styles.statTile, {borderLeftColor: color}]}>
    <Text variant="display-sm" style={{color}}>{value}</Text>
    <Text variant="label-sm" color="onSurfaceVariant">{label}</Text>
  </View>
);

export default function HomeScreen() {
  const {user} = useAuth();
  const navigation = useNavigation<any>();
  const weekString = useCurrentWeekString();
  const {data: analysis, isLoading: analysisLoading} = useAttendanceAnalysis(0);
  const {data: followUps = []} = useFollowUps();
  const {data: callingLists = []} = useCallingListsForWeek(weekString);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const activeFollowUps = followUps.filter(f => f.isActive).length;
  const pendingCalling = callingLists.reduce((a, l) => a + l.pendingCalls, 0);
  const submittedCount = callingLists.filter(l => l.isSubmitted).length;

  return (
    <SafeAreaView style={styles.container}>
      <OfflineBanner />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Greeting header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text variant="body-md" color="onSurfaceVariant">{greeting},</Text>
            <Text variant="headline-sm" color="primary">
              {user?.displayName?.split(' ')[0] ?? 'Devotee'}
            </Text>
            <Text variant="label-sm" color="onSurfaceVariant">
              {formatDate(new Date())}
            </Text>
          </View>
          <Avatar name={user?.displayName ?? 'D'} size="lg" />
        </View>

        {/* Attendance KPIs */}
        {analysisLoading ? (
          <ListSkeleton count={1} />
        ) : analysis ? (
          <View style={styles.section}>
            <Text variant="title-md" style={styles.sectionTitle}>This Week's Attendance</Text>
            <View style={styles.statsGrid}>
              <StatTile label="Avg Attendance" value={`${analysis.avgPct}%`} color={COLORS.primary} />
              <StatTile label="Total Present" value={analysis.totalPresent} color={COLORS.success} />
              <StatTile label="At Risk" value={analysis.atRisk.length} color={COLORS.secondary} />
              <StatTile label="Sessions" value={analysis.sessions.length} color={COLORS.tertiary} />
            </View>
          </View>
        ) : null}

        {/* Calling summary */}
        {callingLists.length > 0 && (
          <View style={styles.section}>
            <Text variant="title-md" style={styles.sectionTitle}>Calling Seva</Text>
            <View style={styles.callingCard}>
              <View style={styles.callingRow}>
                <Text variant="body-md">Pending calls this week</Text>
                <Text variant="title-lg" color="tertiary">{pendingCalling}</Text>
              </View>
              <View style={styles.callingRow}>
                <Text variant="body-md">Lists submitted</Text>
                <Text variant="title-lg" color="primary">{submittedCount}/{callingLists.length}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Care alerts */}
        {activeFollowUps > 0 && (
          <TouchableOpacity
            style={styles.alertCard}
            onPress={() => navigation.navigate('CareTab')}>
            <Icon name="assignment_late" size={24} color={COLORS.secondary} filled />
            <View style={{flex: 1}}>
              <Text variant="title-md">{activeFollowUps} active follow-up{activeFollowUps !== 1 ? 's' : ''}</Text>
              <Text variant="body-sm" color="onSurfaceVariant">Tap to view Care module</Text>
            </View>
            <Icon name="chevron_right" size={20} color={COLORS.onSurfaceVariant} />
          </TouchableOpacity>
        )}

        {/* Quick actions */}
        <View style={styles.section}>
          <Text variant="title-md" style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickAction
              icon="how_to_reg"
              label="Mark Attendance"
              color={COLORS.primary}
              onPress={() => navigation.navigate('AttendanceTab')}
            />
            <QuickAction
              icon="call"
              label="Calling Seva"
              color={COLORS.secondary}
              onPress={() => navigation.navigate('CallingTab')}
            />
            <QuickAction
              icon="favorite"
              label="Care Module"
              color={COLORS.tertiary}
              onPress={() => navigation.navigate('CareTab')}
            />
            <QuickAction
              icon="group"
              label="Devotees"
              color={COLORS.success}
              onPress={() => navigation.navigate('ProfilesTab')}
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  content: {
    padding: SPACING.marginMobile,
    gap: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
  },
  headerLeft: {gap: 2},
  section: {gap: SPACING.sm},
  sectionTitle: {color: COLORS.onSurfaceVariant},
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  statTile: {
    width: '47.5%',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    gap: 4,
    borderLeftWidth: 4,
  },
  callingCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  callingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.secondaryFixed + '30',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.secondaryFixed,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  quickAction: {
    width: '47.5%',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.sm,
    borderTopWidth: 3,
  },
});
