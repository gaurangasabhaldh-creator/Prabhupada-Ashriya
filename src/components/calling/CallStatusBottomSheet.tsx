import React, {useState} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Button} from '@components/common/Button/Button';
import {IconButton} from '@components/common/Button/IconButton';
import {Icon} from '@components/common/Icon/Icon';
import {TextInput} from '@components/common/Input/TextInput';
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

interface Props {
  record: CallRecordDocument;
  onSave: (status: CallStatus, notes: string | null) => void;
  onClose: () => void;
}

const STATUS_OPTIONS = Object.values(CALL_STATUS).filter(s => s !== CALL_STATUS.PENDING);

export const CallStatusBottomSheet = ({record, onSave, onClose}: Props) => {
  const [selected, setSelected] = useState<CallStatus>(record.status as CallStatus);
  const [notes, setNotes] = useState(record.notes ?? '');

  return (
    <Modal visible transparent animationType="slide" statusBarTranslucent>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.wrapper}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={{flex: 1}}>
              <Text variant="title-lg">{record.devoteeName}</Text>
              <Text variant="body-sm" color="onSurfaceVariant">{record.devoteeMobile}</Text>
            </View>
            <IconButton name="close" onPress={onClose} accessibilityLabel="Close" />
          </View>

          <ScrollView
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}>
            <Text variant="label-lg" color="onSurfaceVariant" style={{marginBottom: SPACING.sm}}>
              Call Status
            </Text>

            <View style={styles.statusGrid}>
              {STATUS_OPTIONS.map(s => {
                const active = selected === s;
                const color = CALL_STATUS_COLORS[s];
                return (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.statusOption,
                      {borderColor: active ? color : COLORS.outlineVariant},
                      active && {backgroundColor: color + '18'},
                    ]}
                    onPress={() => setSelected(s)}>
                    <Icon
                      name={CALL_STATUS_ICONS[s]}
                      size={20}
                      color={active ? color : COLORS.onSurfaceVariant}
                      filled={active}
                    />
                    <Text
                      variant="label-sm"
                      style={{color: active ? color : COLORS.onSurface, textAlign: 'center'}}>
                      {CALL_STATUS_LABELS[s]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TextInput
              label="Notes (optional)"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />

            <Button
              label="Save Status"
              variant="primary"
              size="lg"
              fullWidth
              onPress={() => {
                onSave(selected, notes.trim() || null);
                onClose();
              }}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  wrapper: {flex: 1, justifyContent: 'flex-end'},
  sheet: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '90%',
    paddingBottom: SPACING.xl + 16,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.outlineVariant,
    alignSelf: 'center',
    marginVertical: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.marginMobile,
    marginBottom: SPACING.md,
  },
  body: {
    paddingHorizontal: SPACING.marginMobile,
    gap: SPACING.md,
    paddingBottom: SPACING.md,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  statusOption: {
    width: '47%',
    borderWidth: 1.5,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    gap: SPACING.xs,
  },
});
