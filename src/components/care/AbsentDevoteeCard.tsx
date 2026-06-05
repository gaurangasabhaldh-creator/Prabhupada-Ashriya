import React, {memo} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Avatar} from '@components/common/Avatar/Avatar';
import {Icon} from '@components/common/Icon/Icon';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {AttendanceRecordDocument} from '@mytypes/attendance.types';
import {openDialer, openWhatsApp} from '@utils/phone.utils';

interface Props {
  record: AttendanceRecordDocument;
  devoteeName?: string;
  devoteeMobile?: string;
  onCreateFollowUp?: () => void;
}

export const AbsentDevoteeCard = memo(({record, devoteeName, devoteeMobile, onCreateFollowUp}: Props) => {
  const name = devoteeName ?? record.devoteeId;
  const isExcused = record.status === 'excused';

  return (
    <View style={[styles.card, {borderLeftColor: isExcused ? COLORS.tertiary : COLORS.secondary}]}>
      <Avatar name={name} size="md" />
      <View style={styles.info}>
        <Text variant="title-md">{name}</Text>
        <Text variant="body-sm" color="onSurfaceVariant">
          {isExcused ? 'Excused' : 'Absent'} · {record.dateString}
        </Text>
        {record.notes && (
          <Text variant="body-sm" color="onSurfaceVariant" numberOfLines={1}>{record.notes}</Text>
        )}
      </View>
      <View style={styles.actions}>
        {devoteeMobile && (
          <>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => openDialer(devoteeMobile)}
              accessibilityLabel={`Call ${name}`}>
              <Icon name="call" size={18} color={COLORS.primary} filled />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => openWhatsApp(devoteeMobile)}
              accessibilityLabel={`WhatsApp ${name}`}>
              <Icon name="chat" size={18} color={COLORS.success} />
            </TouchableOpacity>
          </>
        )}
        {onCreateFollowUp && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onCreateFollowUp}
            accessibilityLabel="Create follow-up">
            <Icon name="add_task" size={18} color={COLORS.tertiary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.marginMobile,
    paddingLeft: SPACING.md,
    borderLeftWidth: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
    backgroundColor: COLORS.surfaceContainerLowest,
  },
  info: {flex: 1, gap: 2},
  actions: {flexDirection: 'row', gap: SPACING.sm, alignItems: 'center'},
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
