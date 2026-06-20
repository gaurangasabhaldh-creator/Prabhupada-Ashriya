import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {BORDER_RADIUS, SPACING, HIT_SLOP} from '@constants/spacing';
import {formatDate, addDays, subDays, isToday} from '@utils/date.utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
        <Icon name="chevron-left" size={22} color="#B0A89A" />
      </TouchableOpacity>

      <View style={styles.dateDisplay}>
        <Icon name="calendar" size={16} color="#FF8F00" />
        <Text variant="title-md" style={{marginLeft: SPACING.xs, color: '#F5F0E8'}}>
          {atToday ? 'Today' : formatDate(date)}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => !atToday && onChange(addDays(date, 1))}
        hitSlop={HIT_SLOP}
        disabled={atToday}
        accessibilityLabel="Next day"
        style={[styles.arrow, atToday && {opacity: 0.3}]}>
        <Icon name="chevron-right" size={22} color="#B0A89A" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#25253E',
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: '#353555',
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
