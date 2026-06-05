import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Icon} from '@components/common/Icon/Icon';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {EmptyState} from '@components/common/EmptyState/EmptyState';
import {useAttendanceAnalysis} from '@hooks/attendance/useAttendanceAnalysis';
import {AttendanceScreenProps} from '@mytypes/navigation.types';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {ATTENDANCE_STATUS} from '@constants/attendance';

type Props = AttendanceScreenProps<'DevoteeAttendanceDetail'>;

const STATUS_COLORS: Record<string, string> = {
  present: COLORS.primary,
  absent: COLORS.secondary,
  late: COLORS.tertiary,
  excused: COLORS.outline,
};

const STATUS_ICONS: Record<string, string> = {
  present: 'check_circle',
  absent: 'cancel',
  late: 'schedule',
  excused: 'info',
};

export default function DevoteeAttendanceDetailScreen({route}: Props) {
  const {devoteeId, devoteeName} = route.params;
  const [weekOffset, setWeekOffset] = useState(0);
  const {data, isLoading} = useAttendanceAnalysis(weekOffset);

  const devoteeData = data?.devotees.find(d => d.devoteeId === devoteeId);
  const devoteeRecords = (data?.records ?? []).filter(r => r.devoteeId === devoteeId);

  if (isLoading) return <ListSkeleton count={5} />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
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

        {/* Summary stats */}
        {devoteeData ? (
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text variant="display-sm" color="primary">{devoteeData.pct}%</Text>
              <Text variant="label-sm" color="onSurfaceVariant">Attendance</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="display-sm" style={{color: COLORS.success}}>{devoteeData.present}</Text>
              <Text variant="label-sm" color="onSurfaceVariant">Present</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="display-sm" color="secondary">{devoteeData.absent}</Text>
              <Text variant="label-sm" color="onSurfaceVariant">Absent</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="display-sm" color="tertiary">{devoteeData.late}</Text>
              <Text variant="label-sm" color="onSurfaceVariant">Late</Text>
            </View>
          </View>
        ) : (
          <View style={styles.statsRow}>
            <Text variant="body-md" color="onSurfaceVariant">No data this week</Text>
          </View>
        )}

        {/* Record list */}
        {devoteeRecords.length === 0 ? (
          <EmptyState
            icon="calendar_today"
            title="No Records"
            message="No attendance records for this week."
          />
        ) : (
          <View style={styles.recordsList}>
            <Text variant="title-sm" color="onSurfaceVariant" style={{marginBottom: SPACING.sm}}>
              Session Records
            </Text>
            {devoteeRecords
              .sort((a, b) => a.dateString.localeCompare(b.dateString))
              .map(record => {
                const color = STATUS_COLORS[record.status] ?? COLORS.outline;
                const icon = STATUS_ICONS[record.status] ?? 'radio_button_unchecked';
                return (
                  <View key={record.id} style={[styles.recordRow, {borderLeftColor: color}]}>
                    <Icon name={icon} size={18} color={color} filled />
                    <View style={styles.recordInfo}>
                      <Text variant="body-md">{record.dateString}</Text>
                      <Text variant="label-sm" style={{color, textTransform: 'capitalize'}}>
                        {record.status}
                        {record.arrivalTime ? ` · ${record.arrivalTime}` : ''}
                      </Text>
                    </View>
                    <Text variant="label-sm" color="onSurfaceVariant">{record.category}</Text>
                  </View>
                );
              })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  content: {padding: SPACING.marginMobile, gap: SPACING.md},
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
  },
  weekBtn: {padding: SPACING.xs},
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  stat: {alignItems: 'center', gap: 4},
  recordsList: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
    borderLeftWidth: 3,
    paddingLeft: SPACING.sm,
    marginLeft: -SPACING.md,
  },
  recordInfo: {flex: 1, gap: 2},
});
