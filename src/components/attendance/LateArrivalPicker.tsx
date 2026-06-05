import React, {useState} from 'react';
import {View, Modal, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Button} from '@components/common/Button/Button';
import {Icon} from '@components/common/Icon/Icon';
import {COLORS} from '@constants/colors';
import {BORDER_RADIUS, SPACING} from '@constants/spacing';
import {formatTime} from '@utils/date.utils';

interface Props {
  visible: boolean;
  devoteeName: string;
  onConfirm: (arrivalTime: Date) => void;
  onCancel: () => void;
}

// Build 5-minute time slots for the past 2 hours
const buildTimeSlots = (): Date[] => {
  const now = new Date();
  const slots: Date[] = [];
  for (let i = 0; i <= 24; i++) {
    const d = new Date(now);
    d.setMinutes(now.getMinutes() - i * 5, 0, 0);
    slots.push(d);
  }
  return slots;
};

export const LateArrivalPicker: React.FC<Props> = ({
  visible,
  devoteeName,
  onConfirm,
  onCancel,
}) => {
  const [selected, setSelected] = useState<Date | null>(null);
  const slots = buildTimeSlots();

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onCancel} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Icon name="schedule" size={20} color="tertiary" />
          <Text variant="title-md" color="onSurface" style={{marginLeft: SPACING.sm}}>
            Late Arrival — {devoteeName}
          </Text>
        </View>
        <Text variant="body-sm" color="onSurfaceVariant" style={styles.hint}>
          Select arrival time (long-press P to change)
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.slots}>
          {slots.map((slot, i) => {
            const isSelected = selected?.getTime() === slot.getTime();
            return (
              <TouchableOpacity
                key={i}
                onPress={() => setSelected(slot)}
                style={[styles.slot, isSelected && styles.slotSelected]}
                accessibilityRole="radio"
                accessibilityState={{selected: isSelected}}>
                <Text
                  variant="label-lg"
                  style={{color: isSelected ? COLORS.onPrimary : COLORS.onSurface}}>
                  {formatTime(slot)}
                </Text>
                {i === 0 && (
                  <Text variant="label-md" style={{color: isSelected ? COLORS.onPrimary : COLORS.outline}}>
                    Now
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.actions}>
          <Button label="Cancel" onPress={onCancel} variant="text" size="md" style={{flex: 1}} />
          <Button
            label="Mark Late"
            onPress={() => selected && onConfirm(selected)}
            variant="primary"
            size="md"
            disabled={!selected}
            style={{flex: 1}}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)'},
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingBottom: SPACING.xl + 16,
    paddingTop: SPACING.sm,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.outlineVariant,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.marginMobile,
    marginBottom: SPACING.xs,
  },
  hint: {paddingHorizontal: SPACING.marginMobile, marginBottom: SPACING.md},
  slots: {
    paddingHorizontal: SPACING.marginMobile,
    gap: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  slot: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    alignItems: 'center',
    minWidth: 70,
    backgroundColor: COLORS.surfaceContainerLow,
  },
  slotSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.marginMobile,
    marginTop: SPACING.sm,
  },
});
