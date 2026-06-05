import React, {memo} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Avatar} from '@components/common/Avatar/Avatar';
import {Text} from '@components/common/Typography/Text';
import {StatusChip} from '@components/common/Chip/StatusChip';
import {Icon} from '@components/common/Icon/Icon';
import {DevoteeDocument} from '@mytypes/devotee.types';
import {COLORS} from '@constants/colors';
import {SPACING} from '@constants/spacing';
import {CATEGORY_LABELS} from '@constants/categories';
import {formatForDisplay} from '@utils/phone.utils';

interface Props {
  devotee: DevoteeDocument;
  onPress: (id: string) => void;
  showPhone?: boolean;
}

export const DevoteeListItem: React.FC<Props> = memo(({devotee, onPress, showPhone = false}) => {
  const subtitle = showPhone
    ? formatForDisplay(devotee.mobileNumber)
    : `${CATEGORY_LABELS[devotee.primaryCategory]} · ${devotee.attendancePct30d}% (30d)`;

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onPress(devotee.id)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${devotee.fullName}, ${CATEGORY_LABELS[devotee.primaryCategory]}`}>
      <Avatar uri={devotee.photoURL} name={devotee.fullName} size="md" />

      <View style={styles.info}>
        <Text variant="title-md" color="onSurface" numberOfLines={1}>
          {devotee.fullName}
        </Text>
        <Text variant="body-sm" color="onSurfaceVariant" numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      <View style={styles.right}>
        <StatusChip status={devotee.status} />
        <Icon name="chevron_right" size={18} color="outlineVariant" style={{marginTop: 2}} />
      </View>
    </TouchableOpacity>
  );
});

DevoteeListItem.displayName = 'DevoteeListItem';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.marginMobile,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.outlineVariant,
    gap: SPACING.md,
  },
  info: {flex: 1, minWidth: 0},
  right: {alignItems: 'flex-end', gap: 4},
});
