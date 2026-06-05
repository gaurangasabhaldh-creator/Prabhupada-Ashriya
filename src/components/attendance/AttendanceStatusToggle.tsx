import React, {useRef} from 'react';
import {View, TouchableOpacity, Animated, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {ATTENDANCE_STATUS, AttendanceStatus} from '@constants/attendance';
import {COLORS} from '@constants/colors';
import {BORDER_RADIUS} from '@constants/spacing';

interface ToggleOption {
  value: AttendanceStatus;
  label: string;
  activeColor: string;
  icon: string;
}

const OPTIONS: ToggleOption[] = [
  {value: ATTENDANCE_STATUS.PRESENT, label: 'P', activeColor: COLORS.primary, icon: '✓'},
  {value: ATTENDANCE_STATUS.ABSENT, label: 'A', activeColor: COLORS.secondary, icon: '✗'},
  {value: ATTENDANCE_STATUS.EXCUSED, label: 'E', activeColor: COLORS.outline, icon: '~'},
];

interface Props {
  value: AttendanceStatus | null;
  onChange: (status: AttendanceStatus) => void;
  onLongPressPresent?: () => void;
  disabled?: boolean;
}

const ToggleButton: React.FC<{
  option: ToggleOption;
  selected: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
}> = ({option, selected, onPress, onLongPress, disabled}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {toValue: 0.85, duration: 70, useNativeDriver: true}),
      Animated.spring(scaleAnim, {toValue: 1, useNativeDriver: true, tension: 300}),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{transform: [{scale: scaleAnim}]}}>
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={onLongPress}
        disabled={disabled}
        delayLongPress={400}
        accessibilityRole="radio"
        accessibilityState={{selected, disabled}}
        accessibilityLabel={
          option.value === 'present' ? 'Present' : option.value === 'absent' ? 'Absent' : 'Excused'
        }
        style={[
          styles.btn,
          selected && {backgroundColor: option.activeColor, borderColor: option.activeColor},
          !selected && {borderColor: COLORS.outlineVariant},
          disabled && {opacity: 0.4},
        ]}>
        <Text
          variant="label-lg"
          style={{
            color: selected ? COLORS.onPrimary : COLORS.onSurfaceVariant,
            fontSize: 13,
            fontWeight: '700',
          }}>
          {option.label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const AttendanceStatusToggle: React.FC<Props> = ({
  value,
  onChange,
  onLongPressPresent,
  disabled = false,
}) => (
  <View style={styles.container}>
    {OPTIONS.map(opt => (
      <ToggleButton
        key={opt.value}
        option={opt}
        selected={value === opt.value}
        onPress={() => onChange(opt.value)}
        onLongPress={opt.value === ATTENDANCE_STATUS.PRESENT ? onLongPressPresent : undefined}
        disabled={disabled}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {flexDirection: 'row', gap: 4},
  btn: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
  },
});
