import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {AttendanceSheetTable} from '@components/attendance/AttendanceSheetTable';
import {Chip} from '@components/common/Chip/Chip';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {EmptyState} from '@components/common/EmptyState/EmptyState';
import {useAttendanceSheet} from '@hooks/attendance/useAttendanceSheet';
import {useDevotees} from '@hooks/devotees/useDevotees';
import {toWeekString} from '@utils/date.utils';
import {SPACING} from '@constants/spacing';
import {COLORS} from '@constants/colors';

const THIS_WEEK = toWeekString(new Date());
const LAST_WEEK = toWeekString(new Date(Date.now() - 7 * 86400_000));

const WEEK_OPTIONS = [
  {label: 'This Week', value: THIS_WEEK},
  {label: 'Last Week', value: LAST_WEEK},
];

export default function AttendanceSheetTab() {
  const [weekString, setWeekString] = useState(THIS_WEEK);

  const {sheetMap, dates, isLoading: sheetLoading} = useAttendanceSheet(weekString);
  const {data: pages, isLoading: devLoading} = useDevotees();
  const devotees = pages?.pages.flatMap(p => p.data) ?? [];

  const isLoading = sheetLoading || devLoading;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}>
        {WEEK_OPTIONS.map(opt => (
          <Chip
            key={opt.value}
            label={opt.label}
            selected={weekString === opt.value}
            onPress={() => setWeekString(opt.value)}
          />
        ))}
      </ScrollView>

      {isLoading ? (
        <ListSkeleton count={8} />
      ) : dates.length === 0 ? (
        <EmptyState
          icon="calendar_today"
          title="No sessions this week"
          message="No attendance sessions were found for the selected week."
        />
      ) : (
        <View style={styles.tableWrapper}>
          <AttendanceSheetTable
            devotees={devotees}
            dates={dates}
            sheetMap={sheetMap}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  filterRow: {
    paddingHorizontal: SPACING.marginMobile,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  tableWrapper: {flex: 1},
});
