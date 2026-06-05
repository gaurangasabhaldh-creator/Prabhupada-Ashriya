import React, {useEffect, useRef} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Text} from '../Typography/Text';
import {Icon} from '../Icon/Icon';
import {useUIStore} from '@store/ui.store';
import {COLORS} from '@constants/colors';
import {SPACING, BORDER_RADIUS} from '@constants/spacing';

const TOAST_CONFIG = {
  success: {color: COLORS.success, bg: COLORS.successContainer, icon: 'check_circle'},
  error: {color: COLORS.secondary, bg: COLORS.secondaryFixed, icon: 'error'},
  warning: {color: COLORS.tertiary, bg: COLORS.warningContainer, icon: 'warning'},
  info: {color: COLORS.primary, bg: COLORS.primaryFixed, icon: 'info'},
} as const;

interface ToastItemProps {
  id: string;
  type: keyof typeof TOAST_CONFIG;
  message: string;
  duration: number;
}

const ToastItem = ({id, type, message, duration}: ToastItemProps) => {
  const dismissToast = useUIStore(s => s.dismissToast);
  const translateY = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const config = TOAST_CONFIG[type] ?? TOAST_CONFIG.info;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {toValue: 0, useNativeDriver: true, tension: 200, friction: 20}),
      Animated.timing(opacity, {toValue: 1, duration: 200, useNativeDriver: true}),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {toValue: -80, duration: 250, useNativeDriver: true}),
        Animated.timing(opacity, {toValue: 0, duration: 250, useNativeDriver: true}),
      ]).start(() => dismissToast(id));
    }, duration - 250);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.toast,
        {backgroundColor: config.bg, borderLeftColor: config.color},
        {transform: [{translateY}], opacity},
      ]}>
      <Icon name={config.icon} size={20} color={config.color} filled />
      <Text variant="body-md" style={{flex: 1, color: COLORS.onSurface}} numberOfLines={2}>
        {message}
      </Text>
      <TouchableOpacity onPress={() => dismissToast(id)} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
        <Icon name="close" size={16} color={COLORS.onSurfaceVariant} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export const ToastContainer = () => {
  const toasts = useUIStore(s => s.toasts);

  if (!toasts.length) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map(t => (
        <ToastItem
          key={t.id}
          id={t.id}
          type={t.type}
          message={t.message}
          duration={t.duration ?? 3000}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 56,
    left: SPACING.marginMobile,
    right: SPACING.marginMobile,
    zIndex: 9999,
    gap: SPACING.sm,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});
