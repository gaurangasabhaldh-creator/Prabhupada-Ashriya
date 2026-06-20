import React, {useState} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Alert,
  StatusBar,
} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Avatar} from '@components/common/Avatar/Avatar';
import {OfflineBanner} from '@components/common/OfflineBanner/OfflineBanner';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {useAuth} from '@hooks/auth/useAuth';
import {useAttendanceAnalysis} from '@hooks/attendance/useAttendanceAnalysis';
import {useFollowUps} from '@hooks/care/useFollowUps';
import {useCallingListsForWeek, useCurrentWeekString} from '@hooks/calling/useCallingList';
import {useNavigation} from '@react-navigation/native';
import {signOut} from '@services/firebase/auth.service';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {formatDate} from '@utils/date.utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

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
  <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.quickActionIconWrap, {backgroundColor: color + '18'}]}>
      <Icon name={icon} size={26} color={color} />
    </View>
    <Text variant="label-md" style={{textAlign: 'center', color: COLORS.onSurface, fontWeight: '600'}}>
      {label}
    </Text>
  </TouchableOpacity>
);

const StatTile = ({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}) => (
  <View style={styles.statTile}>
    <View style={[styles.statIconWrap, {backgroundColor: color + '18'}]}>
      <Icon name={icon} size={20} color={color} />
    </View>
    <Text style={[styles.statValue, {color}]}>{value}</Text>
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
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const activeFollowUps = followUps.filter(f => f.isActive).length;
  const pendingCalling = callingLists.reduce((a, l) => a + l.pendingCalls, 0);
  const submittedCount = callingLists.filter(l => l.isSubmitted).length;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          setShowProfileMenu(false);
          await signOut();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <OfflineBanner />

      {/* Profile Menu Modal */}
      <Modal visible={showProfileMenu} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowProfileMenu(false)}>
          <View style={styles.profileMenu}>
            <View style={styles.profileMenuHeader}>
              <Avatar name={user?.displayName ?? 'D'} size="lg" />
              <View style={{marginLeft: SPACING.md, flex: 1}}>
                <Text variant="title-md" style={{color: '#fff', fontWeight: '700'}}>
                  {user?.displayName ?? 'Devotee'}
                </Text>
                <Text variant="body-sm" style={{color: 'rgba(255,255,255,0.7)'}}>
                  {user?.email ?? ''}
                </Text>
              </View>
            </View>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem}>
              <Icon name="camera-outline" size={22} color={COLORS.primary} />
              <Text variant="body-md" style={{flex: 1}}>Change Photo</Text>
              <Icon name="chevron-right" size={20} color={COLORS.outline} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowProfileMenu(false);
                navigation.navigate('ChangePassword');
              }}>
              <Icon name="lock-reset" size={22} color={COLORS.primary} />
              <Text variant="body-md" style={{flex: 1}}>Change Password</Text>
              <Icon name="chevron-right" size={20} color={COLORS.outline} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Icon name="information-outline" size={22} color={COLORS.primary} />
              <Text variant="body-md" style={{flex: 1}}>About App</Text>
              <Icon name="chevron-right" size={20} color={COLORS.outline} />
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Icon name="logout" size={22} color={COLORS.error} />
              <Text variant="body-md" style={{color: COLORS.error, flex: 1}}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header with gradient */}
        <LinearGradient
          colors={[COLORS.primary, '#1565C0']}
          style={styles.headerGradient}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text variant="body-md" style={{color: 'rgba(255,255,255,0.8)'}}>{greeting},</Text>
              <Text variant="headline-md" style={{color: '#FFD700', fontWeight: '700'}}>
                {user?.displayName?.split(' ')[0] ?? 'Devotee'}
              </Text>
              <Text variant="label-sm" style={{color: 'rgba(255,255,255,0.7)'}}>
                {formatDate(new Date())}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setShowProfileMenu(true)} activeOpacity={0.7}>
              <Avatar name={user?.displayName ?? 'D'} size="lg" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Attendance KPIs */}
        {analysisLoading ? (
          <ListSkeleton count={1} />
        ) : analysis ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="chart-bar" size={22} color={COLORS.primary} />
              <Text variant="title-md" style={styles.sectionTitle}>This Week's Attendance</Text>
            </View>
            <View style={styles.statsGrid}>
              <StatTile label="Avg Attendance" value={`${analysis.avgPct}%`} icon="percent" color={COLORS.primary} />
              <StatTile label="Total Present" value={analysis.totalPresent} icon="check-circle" color={COLORS.success} />
              <StatTile label="At Risk" value={analysis.atRisk.length} icon="alert-circle" color={COLORS.error} />
              <StatTile label="Sessions" value={analysis.sessions.length} icon="calendar-clock" color={COLORS.secondary} />
            </View>
          </View>
        ) : null}

        {/* Calling summary */}
        {callingLists.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="phone-in-talk" size={22} color={COLORS.primary} />
              <Text variant="title-md" style={styles.sectionTitle}>Calling Seva</Text>
            </View>
            <View style={styles.callingCard}>
              <View style={styles.callingRow}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: SPACING.sm}}>
                  <Icon name="phone-alert" size={20} color={COLORS.secondary} />
                  <Text variant="body-md">Pending calls</Text>
                </View>
                <Text style={[styles.callingValue, {color: COLORS.secondary}]}>{pendingCalling}</Text>
              </View>
              <View style={[styles.callingRow, {borderBottomWidth: 0}]}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: SPACING.sm}}>
                  <Icon name="check-decagram" size={20} color={COLORS.primary} />
                  <Text variant="body-md">Lists submitted</Text>
                </View>
                <Text style={[styles.callingValue, {color: COLORS.primary}]}>{submittedCount}/{callingLists.length}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Care alerts */}
        {activeFollowUps > 0 && (
          <TouchableOpacity
            style={styles.alertCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('CareTab')}>
            <Icon name="alert-decagram" size={24} color={COLORS.error} />
            <View style={{flex: 1}}>
              <Text variant="title-md" style={{fontWeight: '700'}}>{activeFollowUps} active follow-up{activeFollowUps !== 1 ? 's' : ''}</Text>
              <Text variant="body-sm" color="onSurfaceVariant">Tap to view Care module</Text>
            </View>
            <Icon name="chevron-right" size={22} color={COLORS.onSurfaceVariant} />
          </TouchableOpacity>
        )}

        {/* Quick actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="lightning-bolt" size={22} color={COLORS.primary} />
            <Text variant="title-md" style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            <QuickAction
              icon="clipboard-check-outline"
              label="Mark Attendance"
              color={COLORS.primary}
              onPress={() => navigation.navigate('AttendanceTab')}
            />
            <QuickAction
              icon="phone-in-talk-outline"
              label="Calling Seva"
              color={COLORS.secondary}
              onPress={() => navigation.navigate('CallingTab')}
            />
            <QuickAction
              icon="heart-pulse"
              label="Care Module"
              color={COLORS.error}
              onPress={() => navigation.navigate('CareTab')}
            />
            <QuickAction
              icon="account-group-outline"
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
    paddingBottom: SPACING.xxl,
  },
  headerGradient: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {gap: 2},
  section: {
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.onSurface,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  statTile: {
    width: '47.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    alignItems: 'center',
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  callingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  callingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
  },
  callingValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.errorContainer,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.error + '30',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  quickAction: {
    width: '47.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  quickActionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Profile menu
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 80,
    paddingRight: SPACING.lg,
  },
  profileMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.lg,
    width: 280,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  profileMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.outlineVariant,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
});
