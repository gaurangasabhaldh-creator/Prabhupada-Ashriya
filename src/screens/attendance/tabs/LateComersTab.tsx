import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {Avatar} from '@components/common/Avatar/Avatar';
import {Text} from '@components/common/Typography/Text';
import {EmptyState} from '@components/common/EmptyState/EmptyState';
import {ListSkeleton} from '@components/common/LoadingSkeleton/ListSkeleton';
import {useQuery} from '@tanstack/react-query';
import {useAuth} from '@hooks/auth/useAuth';
import {QUERY_KEYS} from '@hooks/queryKeys';
import {useAttendanceStore} from '@store/attendance.store';
import {useAttendanceSession} from '@hooks/attendance/useAttendanceSession';
import {useAttendanceRecords} from '@hooks/attendance/useAttendanceRecords';
import {useDevotee} from '@hooks/devotees/useDevotee';
import {ATTENDANCE_STATUS} from '@constants/attendance';
import {COLORS} from '@constants/colors';
import {SPACING} from '@constants/spacing';
import {formatTime} from '@utils/date.utils';

const LateRow = ({devoteeId, arrivalTime}: {devoteeId: string; arrivalTime: Date | null}) => {
  const {data: devotee} = useDevotee(devoteeId);
  if (!devotee) return null;
  return (
    <View style={styles.row}>
      <Avatar uri={devotee.photoURL} name={devotee.fullName} size="md" />
      <View style={styles.info}>
        <Text variant="title-md">{devotee.fullName}</Text>
        <Text variant="body-sm" color="onSurfaceVariant">{devotee.teamId}</Text>
      </View>
      {arrivalTime && (
        <View style={styles.time}>
          <Text variant="label-lg" color="tertiary">{formatTime(arrivalTime)}</Text>
          <Text variant="label-md" color="onSurfaceVariant">Arrived</Text>
        </View>
      )}
    </View>
  );
};

export default function LateComersTab() {
  const {selectedDate, selectedCategory} = useAttendanceStore();
  const {data: session, isLoading: sessionLoading} = useAttendanceSession(selectedDate, selectedCategory);
  const {firestoreRecords} = useAttendanceRecords(session?.id ?? null);

  const lateRecords = firestoreRecords.filter(r => r.status === ATTENDANCE_STATUS.LATE);

  if (sessionLoading) return <ListSkeleton count={5} />;

  if (lateRecords.length === 0) {
    return (
      <EmptyState
        icon="schedule"
        title="No Late Comers"
        message="No late arrivals recorded for today's session."
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text variant="body-md" color="onSurfaceVariant">
          {lateRecords.length} late arrival{lateRecords.length > 1 ? 's' : ''} today
        </Text>
      </View>
      <FlatList
        data={lateRecords}
        keyExtractor={item => item.devoteeId}
        renderItem={({item}) => (
          <LateRow
            devoteeId={item.devoteeId}
            arrivalTime={item.arrivalTime ? item.arrivalTime.toDate() : null}
          />
        )}
        contentContainerStyle={{paddingBottom: 100}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  summary: {
    paddingHorizontal: SPACING.marginMobile,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.marginMobile,
    gap: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
  },
  info: {flex: 1},
  time: {alignItems: 'flex-end'},
});
