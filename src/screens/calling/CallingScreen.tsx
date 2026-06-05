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
import {useCallingStore} from '@store/calling.store';
import {useCurrentWeekString} from '@hooks/calling/useCallingList';
import {useAuth} from '@hooks/auth/useAuth';
import TeamCallingTab from './tabs/TeamCallingTab';
import SubmissionReportTab from './tabs/SubmissionReportTab';
import CallingReportTab from './tabs/CallingReportTab';
import CallingHistoryTab from './tabs/CallingHistoryTab';

const TABS = [
  {id: 'my_list', label: 'My Calling List'},
  {id: 'submission', label: 'Submission Status'},
  {id: 'report', label: 'Calling Report'},
  {id: 'history', label: 'History'},
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function CallingScreen() {
  const [activeTab, setActiveTab] = useState<TabId>('my_list');
  const tabScrollRef = useRef<ScrollView>(null);
  const weekString = useCurrentWeekString();
  const {user, organizationId, teamIds} = useAuth();
  const activeListId = useCallingStore(s => s.activeListId);
  const setActiveListId = useCallingStore(s => s.setActiveListId);

  // Build the current week list ID from the user's first team
  const currentListId = activeListId ?? (
    organizationId && teamIds[0]
      ? `${organizationId}_${teamIds[0]}_${weekString}`
      : null
  );

  const handleTabPress = useCallback((tabId: TabId, index: number) => {
    setActiveTab(tabId);
    tabScrollRef.current?.scrollTo({x: Math.max(0, index * 140 - 60), animated: true});
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <OfflineBanner />

      <View style={styles.pageHeader}>
        <Text variant="headline-md" color="secondary">Calling Seva</Text>
        <Text variant="body-sm" color="onSurfaceVariant">
          Week: {weekString}
        </Text>
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
        {activeTab === 'my_list' && currentListId && (
          <TeamCallingTab listId={currentListId} />
        )}
        {activeTab === 'my_list' && !currentListId && (
          <View style={styles.noList}>
            <Text variant="body-md" color="onSurfaceVariant">
              No calling list assigned for this week.
            </Text>
          </View>
        )}
        {activeTab === 'submission' && <SubmissionReportTab />}
        {activeTab === 'report' && <CallingReportTab />}
        {activeTab === 'history' && (
          <CallingHistoryTab
            onSelectList={id => {
              setActiveListId(id);
              setActiveTab('my_list');
            }}
          />
        )}
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
  noList: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
});
