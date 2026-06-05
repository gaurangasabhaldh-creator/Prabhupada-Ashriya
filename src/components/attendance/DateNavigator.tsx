import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Icon} from '@components/common/Icon/Icon';
import {COLORS} from '@constants/colors';
import {BORDER_RADIUS, SPACING, HIT_SLOP} from '@constants/spacing';
import {formatDate, addDays, subDays, isToday} from '@utils/date.utils';

interface Props {
  date: Date;
  onChange: (date: Date) => void;
}

export const DateNavigator: React.FC<Props> = ({date, onChange}) => {
  const atToday = isToday(date);

  return (
    <View style={styles.container} accessibilityRole="toolbar">
      <TouchableOpacity
        onPress={() => onChange(subDays(date, 1))}
        hitSlop={HIT_SLOP}
        accessibilityLabel="Previous day"
        style={styles.arrow}>
        <Icon name="chevron_left" size={22} color="onSurfaceVariant" />
      </TouchableOpacity>

      <View style={styles.dateDisplay}>
        <Icon name="calendar_today" size={16} color="primary" />
        <Text variant="title-md" color="onSurface" style={{marginLeft: SPACING.xs}}>
          {atToday ? 'Today' : formatDate(date)}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => !atToday && onChange(addDays(date, 1))}
        hitSlop={HIT_SLOP}
        disabled={atToday}
        accessibilityLabel="Next day"
        style={[styles.arrow, atToday && {opacity: 0.3}]}>
        <Icon name="chevron_right" size={22} color="onSurfaceVariant" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    overflow: 'hidden',
  },
  arrow: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    minHeight: 44,
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
});
