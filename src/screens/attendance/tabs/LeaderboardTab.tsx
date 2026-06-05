import React, {useState} from 'react';
import {View, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Avatar} from '@components/common/Avatar/Avatar';
import {Icon} from '@components/common/Icon/Icon';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {EmptyState} from '@components/common/EmptyState/EmptyState';
import {useAttendanceAnalysis} from '@hooks/attendance/useAttendanceAnalysis';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';

export default function LeaderboardTab() {
  const [weekOffset, setWeekOffset] = useState(0);
  const {data, isLoading} = useAttendanceAnalysis(weekOffset);

  const leaderboard = [...(data?.devotees ?? [])]
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 20);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <View style={styles.container}>
      {/* Week selector */}
      <View style={styles.weekRow}>
        <TouchableOpacity
          style={styles.weekBtn}
          onPress={() => setWeekOffset(w => w + 1)}>
          <Icon name="chevron_left" size={20} color={COLORS.onSurfaceVariant} />
        </TouchableOpacity>
        <Text variant="label-lg" color="onSurfaceVariant">
          {weekOffset === 0 ? 'This Week' : `${weekOffset} week${weekOffset !== 1 ? 's' : ''} ago`}
        </Text>
        <TouchableOpacity
          style={styles.weekBtn}
          onPress={() => setWeekOffset(w => Math.max(0, w - 1))}
          disabled={weekOffset === 0}>
          <Icon
            name="chevron_right"
            size={20}
            color={weekOffset === 0 ? COLORS.outlineVariant : COLORS.onSurfaceVariant}
          />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ListSkeleton count={8} />
      ) : leaderboard.length === 0 ? (
        <EmptyState
          icon="leaderboard"
          title="No Data"
          message="No attendance data for this week."
        />
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={item => item.devoteeId}
          contentContainerStyle={{paddingBottom: 80}}
          renderItem={({item, index}) => (
            <View style={[styles.row, index < 3 && styles.topRow]}>
              <Text variant="title-md" style={{width: 28, textAlign: 'center'}}>
                {index < 3 ? medals[index] : `${index + 1}`}
              </Text>
              <Avatar name={item.name || item.devoteeId.slice(0, 2)} size="md" />
              <View style={styles.info}>
                <Text variant="title-md">{item.name || item.devoteeId}</Text>
                <Text variant="body-sm" color="onSurfaceVariant">
                  {item.present}P · {item.late}L · {item.absent}A
                </Text>
              </View>
              <View style={[
                styles.pctBadge,
                {backgroundColor: item.pct >= 80 ? COLORS.successContainer : COLORS.warningContainer},
              ]}>
                <Text
                  variant="title-md"
                  style={{color: item.pct >= 80 ? COLORS.success : COLORS.tertiary}}>
                  {item.pct}%
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.marginMobile,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
  },
  weekBtn: {padding: SPACING.xs},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.marginMobile,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
  },
  topRow: {backgroundColor: COLORS.primaryFixed + '20'},
  info: {flex: 1, gap: 2},
  pctBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
});
