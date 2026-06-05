import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {OfflineBanner} from '@components/common/OfflineBanner/OfflineBanner';
import {COLORS} from '@constants/colors';
import {SPACING} from '@constants/spacing';
import ThisWeekTab from './tabs/ThisWeekTab';
import AbsentDevoteesTab from './tabs/AbsentDevoteesTab';
import InactiveDevoteesTab from './tabs/InactiveDevoteesTab';
import FollowUpTrackerTab from './tabs/FollowUpTrackerTab';
import CareAnalyticsTab from './tabs/CareAnalyticsTab';

const TABS = [
  {id: 'overview', label: 'This Week'},
  {id: 'absent', label: 'Absent'},
  {id: 'inactive', label: 'Inactive'},
  {id: 'followups', label: 'Follow-Ups'},
  {id: 'analytics', label: 'Analytics'},
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function CareScreen() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const tabScrollRef = useRef<ScrollView>(null);

  const handleTabPress = useCallback((tabId: TabId, index: number) => {
    setActiveTab(tabId);
    tabScrollRef.current?.scrollTo({x: Math.max(0, index * 120 - 60), animated: true});
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <OfflineBanner />

      <View style={styles.pageHeader}>
        <Text variant="headline-md" color="secondary">Care Module</Text>
        <Text variant="body-sm" color="onSurfaceVariant">Devotee wellbeing tracker</Text>
      </View>

      <View style={styles.tabBarWrapper}>
        <ScrollView
          ref={tabScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBar}>
          {TABS.map((tab, i) => {
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
        <View style={styles.fadeRight} pointerEvents="none" />
      </View>

      <View style={styles.content}>
        {activeTab === 'overview' && <ThisWeekTab />}
        {activeTab === 'absent' && <AbsentDevoteesTab />}
        {activeTab === 'inactive' && <InactiveDevoteesTab />}
        {activeTab === 'followups' && <FollowUpTrackerTab />}
        {activeTab === 'analytics' && <CareAnalyticsTab />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  pageHeader: {
    paddingHorizontal: SPACING.marginMobile,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
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
    backgroundColor: COLORS.background,
    opacity: 0.7,
  },
  content: {flex: 1},
});
