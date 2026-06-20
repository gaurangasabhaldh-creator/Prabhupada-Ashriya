import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {OfflineBanner} from '@components/common/OfflineBanner/OfflineBanner';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {useAuth} from '@hooks/auth/useAuth';
import {ROLE_ATTENDANCE_TAB_ACCESS} from '@constants/roles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import LiveAttendanceTab from './tabs/LiveAttendanceTab';
import AttendanceSheetTab from './tabs/AttendanceSheetTab';
import LateComersTab from './tabs/LateComersTab';
import NewComersTab from './tabs/NewComersTab';
import AnalysisTab from './tabs/AnalysisTab';
import LeaderboardTab from './tabs/LeaderboardTab';
import TrendsTab from './tabs/TrendsTab';

const ALL_TABS = [
  {id: 'live', label: 'Live Attendance', icon: 'broadcast'},
  {id: 'sheet', label: 'Sheet', icon: 'table'},
  {id: 'late', label: 'Late Comers', icon: 'clock-alert-outline'},
  {id: 'new', label: 'New Comers', icon: 'account-plus-outline'},
  {id: 'analysis', label: 'Analysis', icon: 'chart-bar'},
  {id: 'leaderboard', label: 'Leaderboard', icon: 'trophy-outline'},
  {id: 'trends', label: 'Trends', icon: 'trending-up'},
] as const;

type TabId = (typeof ALL_TABS)[number]['id'];

export default function AttendanceScreen() {
  const [activeTab, setActiveTab] = useState<TabId>('live');
  const tabScrollRef = useRef<ScrollView>(null);
  const {role} = useAuth();

  const visibleTabs = ALL_TABS.filter(t =>
    ROLE_ATTENDANCE_TAB_ACCESS[role ?? 'volunteer'].includes(t.id),
  );

  const handleTabPress = useCallback((tabId: TabId, index: number) => {
    setActiveTab(tabId);
    tabScrollRef.current?.scrollTo({
      x: Math.max(0, index * 130 - 40),
      animated: true,
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1A1A2E" barStyle="light-content" />
      <OfflineBanner />

      {/* Premium Header */}
      <View style={styles.pageHeader}>
        <View style={styles.headerRow}>
          <Icon name="calendar-check" size={24} color="#FF8F00" />
          <Text style={styles.headerTitle}>ATTENDANCE TRACKER</Text>
        </View>
        <Text style={styles.headerSubtitle}>Live Devotee Attendance Management</Text>
      </View>

      {/* Premium Tab Bar */}
      <View style={styles.tabBarWrapper}>
        <ScrollView
          ref={tabScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBar}>
          {visibleTabs.map((tab, i) => {
            const active = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => handleTabPress(tab.id, i)}
                activeOpacity={0.7}
                accessibilityRole="tab"
                accessibilityState={{selected: active}}>
                {active ? (
                  <LinearGradient
                    colors={['#FF8F00', '#E65100']}
                    style={styles.tabActive}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}>
                    <Icon name={tab.icon} size={16} color="#FFFFFF" />
                    <Text style={styles.tabActiveText}>{tab.label}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.tabInactive}>
                    <Icon name={tab.icon} size={16} color="#B0A89A" />
                    <Text style={styles.tabInactiveText}>{tab.label}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {activeTab === 'live' && <LiveAttendanceTab />}
        {activeTab === 'sheet' && <AttendanceSheetTab />}
        {activeTab === 'late' && <LateComersTab />}
        {activeTab === 'new' && <NewComersTab />}
        {activeTab === 'analysis' && <AnalysisTab />}
        {activeTab === 'leaderboard' && <LeaderboardTab />}
        {activeTab === 'trends' && <TrendsTab />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#1A1A2E'},
  pageHeader: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FF8F00',
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#B0A89A',
    fontWeight: '500',
  },
  tabBarWrapper: {
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D4A',
  },
  tabBar: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    alignItems: 'center',
  },
  tabActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.full,
    elevation: 4,
    shadowColor: '#FF8F00',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tabActiveText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  tabInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: '#25253E',
    borderWidth: 1,
    borderColor: '#353555',
  },
  tabInactiveText: {
    color: '#B0A89A',
    fontSize: 13,
    fontWeight: '600',
  },
  content: {flex: 1},
});
