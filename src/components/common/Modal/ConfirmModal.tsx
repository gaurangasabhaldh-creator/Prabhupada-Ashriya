import React, {useEffect, useRef} from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import {Text} from '../Typography/Text';
import {Button} from '../Button/Button';
import {COLORS} from '@constants/colors';
import {BORDER_RADIUS, SPACING} from '@constants/spacing';
import {useUIStore} from '@store/ui.store';

export const ConfirmModal: React.FC = () => {
  const {confirmModal, dismissConfirm} = useUIStore();
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (confirmModal) {
      Animated.parallel([
        Animated.spring(scaleAnim, {toValue: 1, useNativeDriver: true, tension: 200, friction: 15}),
        Animated.timing(opacityAnim, {toValue: 1, duration: 180, useNativeDriver: true}),
      ]).start();
    } else {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
    }
  }, [confirmModal, scaleAnim, opacityAnim]);

  if (!confirmModal) return null;

  const handleConfirm = () => {
    confirmModal.onConfirm();
    dismissConfirm();
  };

  const handleCancel = () => {
    confirmModal.onCancel?.();
    dismissConfirm();
  };

  return (
    <Modal transparent visible animationType="none" statusBarTranslucent>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleCancel} />
      <View style={styles.centeredView} pointerEvents="box-none">
        <Animated.View
          style={[styles.modal, {transform: [{scale: scaleAnim}], opacity: opacityAnim}]}
          accessibilityViewIsModal>
          <Text variant="title-lg" color="onSurface" style={styles.title}>
            {confirmModal.title}
          </Text>
          <Text variant="body-md" color="onSurfaceVariant" style={styles.message}>
            {confirmModal.message}
          </Text>
          <View style={styles.actions}>
            <Button
              label={confirmModal.cancelLabel ?? 'Cancel'}
              onPress={handleCancel}
              variant="text"
              size="md"
              style={{flex: 1}}
            />
            <Button
              label={confirmModal.confirmLabel ?? 'Confirm'}
              onPress={handleConfirm}
              variant={confirmModal.destructive ? 'danger' : 'primary'}
              size="md"
              style={{flex: 1}}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  centeredView: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  modal: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 340,
  },
  title: {marginBottom: SPACING.sm},
  message: {marginBottom: SPACING.xl},
  actions: {flexDirection: 'row', gap: SPACING.sm},
});
