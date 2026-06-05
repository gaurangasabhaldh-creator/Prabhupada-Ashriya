import React, {memo} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Icon} from '@components/common/Icon/Icon';
import {Avatar} from '@components/common/Avatar/Avatar';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';
import {
  CALL_STATUS,
  CALL_STATUS_LABELS,
  CALL_STATUS_COLORS,
  CALL_STATUS_ICONS,
  CallStatus,
} from '@constants/callStatus';
import {CallRecordDocument} from '@mytypes/calling.types';
import {openDialer, openWhatsApp} from '@utils/phone.utils';

interface Props {
  record: CallRecordDocument;
  onStatusPress: () => void;
}

export const CallingDevoteeCard = memo(({record, onStatusPress}: Props) => {
  const status = record.status as CallStatus;
  const statusColor = CALL_STATUS_COLORS[status];
  const isPending = status === CALL_STATUS.PENDING;

  return (
    <View style={[styles.card, {borderLeftColor: statusColor}]}>
      <Avatar name={record.devoteeName} size="md" />

      <View style={styles.info}>
        <Text variant="title-md">{record.devoteeName}</Text>
        <Text variant="body-sm" color="onSurfaceVariant">{record.devoteeMobile}</Text>
        {record.devoteeLastStatus && (
          <Text variant="label-sm" color="onSurfaceVariant">
            Last: {record.devoteeLastStatus}
          </Text>
        )}
        {record.notes && (
          <Text variant="body-sm" color="onSurfaceVariant" numberOfLines={1}>
            {record.notes}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        {/* Quick call buttons */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => openDialer(record.devoteeMobile)}
            accessibilityLabel={`Call ${record.devoteeName}`}>
            <Icon name="call" size={18} color={COLORS.primary} filled />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => openWhatsApp(record.devoteeMobile)}
            accessibilityLabel={`WhatsApp ${record.devoteeName}`}>
            <Icon name="chat" size={18} color={COLORS.success} />
          </TouchableOpacity>
        </View>

        {/* Status chip */}
        <TouchableOpacity
          style={[
            styles.statusChip,
            {
              backgroundColor: statusColor + '18',
              borderColor: statusColor,
            },
          ]}
          onPress={onStatusPress}>
          <Icon
            name={CALL_STATUS_ICONS[status]}
            size={14}
            color={statusColor}
            filled={!isPending}
          />
          <Text variant="label-sm" style={{color: statusColor}}>
            {isPending ? 'Set Status' : CALL_STATUS_LABELS[status]}
          </Text>
          <Icon name="expand_more" size={14} color={statusColor} />
        </TouchableOpacity>
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
  actions: {alignItems: 'flex-end', gap: SPACING.sm},
  quickActions: {flexDirection: 'row', gap: SPACING.sm},
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
  },
});
