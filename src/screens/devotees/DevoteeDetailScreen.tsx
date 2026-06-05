import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DevoteeProfileHeader} from '@components/devotees/DevoteeProfileHeader';
import {Text} from '@components/common/Typography/Text';
import {IconButton} from '@components/common/Button/IconButton';
import {Button} from '@components/common/Button/Button';
import {Card} from '@components/common/Card/Card';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {EmptyState} from '@components/common/EmptyState/EmptyState';
import {useDevotee} from '@hooks/devotees/useDevotee';
import {useDeleteDevotee} from '@hooks/devotees/useDevoteeMutation';
import {usePermissions} from '@hooks/auth/usePermissions';
import {useUIStore} from '@store/ui.store';
import {ProfilesScreenProps} from '@mytypes/navigation.types';
import {PROFILES_ROUTES} from '@constants/routes';
import {COLORS} from '@constants/colors';
import {SPACING} from '@constants/spacing';
import {formatForDisplay, openDialer, openWhatsApp} from '@utils/phone.utils';
import {formatDate} from '@utils/date.utils';

type Props = ProfilesScreenProps<'DevoteeDetail'>;

const TABS = ['Info', 'Attendance', 'Calling', 'Care'] as const;
type Tab = (typeof TABS)[number];

export default function DevoteeDetailScreen({route, navigation}: Props) {
  const {devoteeId} = route.params;
  const [activeTab, setActiveTab] = useState<Tab>('Info');
  const {data: devotee, isLoading} = useDevotee(devoteeId);
  const {canEditDevotee, canDeleteDevotee} = usePermissions();
  const {showConfirm} = useUIStore();
  const deleteMutation = useDeleteDevotee();

  const handleDelete = () => {
    showConfirm({
      title: 'Remove Devotee',
      message: `Are you sure you want to remove ${devotee?.fullName}? This cannot be undone.`,
      confirmLabel: 'Remove',
      destructive: true,
      onConfirm: async () => {
        await deleteMutation.mutateAsync(devoteeId);
        navigation.goBack();
      },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ListSkeleton count={6} />
      </SafeAreaView>
    );
  }

  if (!devotee) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState icon="person_off" title="Not Found" message="This devotee profile could not be loaded." />
      </SafeAreaView>
    );
  }

  const canEdit = canEditDevotee(devotee.teamId);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Action buttons in nav header — handled by navigator, but also inline */}
      <View style={styles.navActions}>
        <IconButton name="arrow_back" onPress={() => navigation.goBack()} accessibilityLabel="Go back" />
        <View style={styles.navRight}>
          {canEdit && (
            <IconButton
              name="edit"
              onPress={() => navigation.navigate(PROFILES_ROUTES.EDIT_DEVOTEE, {devoteeId})}
              accessibilityLabel="Edit profile"
              color="primary"
            />
          )}
          {canDeleteDevotee && (
            <IconButton
              name="delete"
              onPress={handleDelete}
              accessibilityLabel="Delete devotee"
              color="error"
            />
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <DevoteeProfileHeader devotee={devotee} />

        {/* Quick actions */}
        <View style={styles.quickActions}>
          <Button
            label="Call"
            leftIcon="call"
            variant="secondary"
            onPress={() => openDialer(devotee.mobileNumber)}
            style={{flex: 1}}
          />
          <Button
            label="WhatsApp"
            leftIcon="chat"
            variant="outline"
            onPress={() => openWhatsApp(devotee.mobileNumber)}
            style={{flex: 1}}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
              accessibilityRole="tab"
              accessibilityState={{selected: activeTab === tab}}>
              <Text
                variant="label-lg"
                style={{color: activeTab === tab ? COLORS.primary : COLORS.onSurfaceVariant}}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab content */}
        <View style={styles.tabContent}>
          {activeTab === 'Info' && (
            <View style={styles.infoGrid}>
              <InfoRow icon="phone" label="Mobile" value={formatForDisplay(devotee.mobileNumber)} />
              {devotee.email && <InfoRow icon="email" label="Email" value={devotee.email} />}
              {devotee.city && <InfoRow icon="location_on" label="City" value={devotee.city} />}
              {devotee.occupation && <InfoRow icon="work" label="Occupation" value={devotee.occupation} />}
              {devotee.mentorName && <InfoRow icon="supervisor_account" label="Mentor" value={devotee.mentorName} />}
              <InfoRow icon="calendar_today" label="Joined" value={formatDate(devotee.joiningDate.toDate())} />
              {devotee.maritalStatus && (
                <InfoRow icon="favorite" label="Marital Status" value={devotee.maritalStatus} />
              )}

              <Card style={styles.statsCard}>
                <View style={styles.statsRow}>
                  <StatItem label="30d Attendance" value={`${devotee.attendancePct30d}%`} />
                  <StatItem label="Streak" value={`${devotee.attendanceStreak} sessions`} />
                  <StatItem label="Total Sessions" value={String(devotee.totalSessionsAttended)} />
                </View>
              </Card>
            </View>
          )}

          {activeTab === 'Attendance' && (
            <EmptyState icon="event_available" title="Attendance History" message="Attendance charts coming in Sprint 2." />
          )}
          {activeTab === 'Calling' && (
            <EmptyState icon="call" title="Call History" message="Call records coming in Sprint 3." />
          )}
          {activeTab === 'Care' && (
            <EmptyState icon="volunteer_activism" title="Care Cases" message="Care cases coming in Sprint 4." />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoRow = ({icon, label, value}: {icon: string; label: string; value: string}) => (
  <View style={infoStyles.row}>
    <Text variant="label-lg" color="onSurfaceVariant" style={infoStyles.label}>{label}</Text>
    <Text variant="body-md" color="onSurface" style={infoStyles.value}>{value}</Text>
  </View>
);

const StatItem = ({label, value}: {label: string; value: string}) => (
  <View style={{alignItems: 'center', flex: 1}}>
    <Text variant="title-lg" color="primary">{value}</Text>
    <Text variant="label-md" color="onSurfaceVariant" align="center">{label}</Text>
  </View>
);

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
  },
  label: {flex: 1},
  value: {flex: 2, textAlign: 'right'},
});

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  navActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.sm,
  },
  navRight: {flexDirection: 'row', gap: SPACING.xs},
  quickActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    padding: SPACING.marginMobile,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
    backgroundColor: COLORS.surfaceContainerLowest,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {borderBottomColor: COLORS.primary},
  tabContent: {padding: SPACING.marginMobile},
  infoGrid: {gap: SPACING.xs},
  statsCard: {marginTop: SPACING.md},
  statsRow: {flexDirection: 'row'},
});
