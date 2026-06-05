import React, {memo, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Avatar} from '@components/common/Avatar/Avatar';
import {Text} from '@components/common/Typography/Text';
import {AttendanceStatusToggle} from './AttendanceStatusToggle';
import {LateArrivalPicker} from './LateArrivalPicker';
import {DevoteeDocument} from '@mytypes/devotee.types';
import {AttendanceStatus, ATTENDANCE_STATUS} from '@constants/attendance';
import {COLORS} from '@constants/colors';
import {SPACING} from '@constants/spacing';

interface Props {
  devotee: DevoteeDocument;
  status: AttendanceStatus | null;
  onMark: (devotee: DevoteeDocument, status: AttendanceStatus, arrivalTime?: Date) => void;
  disabled?: boolean;
}

export const DevoteeAttendanceRow: React.FC<Props> = memo(
  ({devotee, status, onMark, disabled = false}) => {
    const [showLatePicker, setShowLatePicker] = useState(false);

    const handleChange = (newStatus: AttendanceStatus) => {
      onMark(devotee, newStatus);
    };

    const handleLateConfirm = (arrivalTime: Date) => {
      setShowLatePicker(false);
      onMark(devotee, ATTENDANCE_STATUS.LATE, arrivalTime);
    };

    return (
      <>
        <View
          style={[
            styles.row,
            status === ATTENDANCE_STATUS.PRESENT && styles.rowPresent,
            status === ATTENDANCE_STATUS.ABSENT && styles.rowAbsent,
            status === ATTENDANCE_STATUS.LATE && styles.rowLate,
          ]}
          accessibilityRole="listitem">
          <Avatar uri={devotee.photoURL} name={devotee.fullName} size="md" />

          <View style={styles.info}>
            <Text variant="title-md" color="onSurface" numberOfLines={1}>
              {devotee.fullName}
            </Text>
            <Text variant="body-sm" color="onSurfaceVariant" numberOfLines={1}>
              {devotee.teamId ?? 'No Team'}
            </Text>
          </View>

          <AttendanceStatusToggle
            value={status}
            onChange={handleChange}
            onLongPressPresent={() => setShowLatePicker(true)}
            disabled={disabled}
          />
        </View>

        <LateArrivalPicker
          visible={showLatePicker}
          devoteeName={devotee.fullName}
          onConfirm={handleLateConfirm}
          onCancel={() => setShowLatePicker(false)}
        />
      </>
    );
  },
);

DevoteeAttendanceRow.displayName = 'DevoteeAttendanceRow';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: SPACING.marginMobile,
    gap: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
    backgroundColor: COLORS.surfaceContainerLowest,
  },
  rowPresent: {borderLeftWidth: 3, borderLeftColor: COLORS.primary},
  rowAbsent: {borderLeftWidth: 3, borderLeftColor: COLORS.secondary},
  rowLate: {borderLeftWidth: 3, borderLeftColor: COLORS.tertiaryContainer},
  info: {flex: 1, minWidth: 0},
});
