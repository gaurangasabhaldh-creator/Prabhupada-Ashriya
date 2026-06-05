import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  SafeAreaView,
} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {OfflineBanner} from '@components/common/OfflineBanner/OfflineBanner';
import {COLORS} from '@constants/colors';
import {SPACING} from '@constants/spacing';
import {useAuth} from '@hooks/auth/useAuth';
import {ROLE_ATTENDANCE_TAB_ACCESS} from '@constants/roles';
import LiveAttendanceTab from './tabs/LiveAttendanceTab';
import AttendanceSheetTab from './tabs/AttendanceSheetTab';
import LateComersTab from './tabs/LateComersTab';
import NewComersTab from './tabs/NewComersTab';
import AnalysisTab from './tabs/AnalysisTab';
import LeaderboardTab from './tabs/LeaderboardTab';
import TrendsTab from './tabs/TrendsTab';

const ALL_TABS = [
  {id: 'live', label: 'Live Attendance'},
  {id: 'sheet', label: 'Attendance Sheet'},
  {id: 'late', label: 'Late Comers'},
  {id: 'new', label: 'New Comers'},
  {id: 'analysis', label: 'Analysis'},
  {id: 'leaderboard', label: 'Leaderboard'},
  {id: 'trends', label: 'Trends'},
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
    // Scroll tab into view
    tabScrollRef.current?.scrollTo({
      x: Math.max(0, index * 120 - 60),
      animated: true,
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <OfflineBanner />

      {/* Page header */}
      <View style={styles.pageHeader}>
        <Text variant="headline-md" color="secondary">Attendance Tracker</Text>
        <Text variant="body-sm" color="onSurfaceVariant">Manage devotee presence</Text>
      </View>

      {/* Scrollable tab bar */}
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
                style={[styles.tab, active && styles.activeTab]}
                accessibilityRole="tab"
                accessibilityState={{selected: active}}>
                <Text
                  variant="label-lg"
                  style={{
                    color: active ? COLORS.primary : COLORS.onSurfaceVariant,
                    fontWeight: active ? '700' : '600',
                  }}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {/* Right fade gradient hint */}
        <View style={styles.fadeRight} pointerEvents="none" />
      </View>

      {/* Tab content — only active tab rendered */}
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
  container: {flex: 1, backgroundColor: COLORS.background},
  pageHeader: {paddingHorizontal: SPACING.marginMobile, paddingTop: SPACING.md, paddingBottom: SPACING.sm},
  tabBarWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  tabBar: {paddingHorizontal: SPACING.marginMobile, gap: 0},
  tab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  activeTab: {borderBottomColor: COLORS.primary},
  fadeRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 32,
    // gradient hint — visual only
    backgroundColor: COLORS.background,
    opacity: 0.7,
  },
  content: {flex: 1},
});
