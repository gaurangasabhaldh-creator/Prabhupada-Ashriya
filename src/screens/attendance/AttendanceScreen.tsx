import React, {useState, useRef, useCallback} from 'react';
import {View, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {OfflineBanner} from '@components/common/OfflineBanner/OfflineBanner';
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
    tabScrollRef.current?.scrollTo({x: Math.max(0, index * 130 - 40), animated: true});
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8F00" barStyle="light-content" />
      <OfflineBanner />

      {/* Header */}
      <LinearGradient colors={['#FF8F00', '#D4AF37']} style={styles.header}>
        <Icon name="calendar-check" size={26} color="#FFFFFF" />
        <Text style={styles.headerTitle}>ATTENDANCE TRACKER</Text>
        <Text style={styles.headerSubtitle}>Live Devotee Attendance Management</Text>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabBarWrapper}>
        <ScrollView ref={tabScrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
          {visibleTabs.map((tab, i) => {
            const active = activeTab === tab.id;
            return (
              <TouchableOpacity key={tab.id} onPress={() => handleTabPress(tab.id, i)} activeOpacity={0.7}>
                {active ? (
                  <LinearGradient colors={['#FF8F00', '#F57C00']} style={styles.tabActive} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
                    <Icon name={tab.icon} size={16} color="#FFFFFF" />
                    <Text style={styles.tabActiveText}>{tab.label}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.tabInactive}>
                    <Icon name={tab.icon} size={16} color="#9E9E9E" />
                    <Text style={styles.tabInactiveText}>{tab.label}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

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
  container: {flex: 1, backgroundColor: '#FFF8E1'},
  header: {paddingTop: 32, paddingBottom: 20, alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24},
  headerTitle: {fontSize: 22, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1.5, marginTop: 6},
  headerSubtitle: {fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500', marginTop: 2},
  tabBarWrapper: {paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E0E0E0', backgroundColor: '#FFF8E1'},
  tabBar: {paddingHorizontal: 16, gap: 8},
  tabActive: {flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 50, elevation: 3, shadowColor: '#FF8F00', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.25, shadowRadius: 4},
  tabActiveText: {color: '#FFFFFF', fontSize: 13, fontWeight: '700'},
  tabInactive: {flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 50, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0E0'},
  tabInactiveText: {color: '#9E9E9E', fontSize: 13, fontWeight: '600'},
  content: {flex: 1},
});
