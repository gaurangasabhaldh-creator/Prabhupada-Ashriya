import React, {useEffect, useRef} from 'react';
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import {Text} from '../Typography/Text';
import {Icon} from '../Icon/Icon';
import {COLORS} from '@constants/colors';
import {BORDER_RADIUS, SPACING} from '@constants/spacing';
import {SHADOWS} from '@theme/shadows.theme';

interface Props {
  icon: string;
  label?: string;
  onPress: () => void;
  loading?: boolean;
  badgeCount?: number;
  visible?: boolean;
  color?: string;
  iconColor?: string;
  pulse?: boolean;
  accessibilityLabel: string;
}

export const FAB: React.FC<Props> = ({
  icon,
  label,
  onPress,
  loading = false,
  badgeCount,
  visible = true,
  color = COLORS.primary,
  iconColor = COLORS.onPrimary,
  pulse = false,
  accessibilityLabel,
}) => {
  const translateY = useRef(new Animated.Value(visible ? 0 : 100)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Slide in/out
  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : 100,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, [visible, translateY]);

  // Pulse animation when unsaved marks exist
  useEffect(() => {
    if (!pulse) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {toValue: 1.06, duration: 700, useNativeDriver: true}),
        Animated.timing(scaleAnim, {toValue: 1.0, duration: 700, useNativeDriver: true}),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, scaleAnim]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {toValue: 0.92, duration: 80, useNativeDriver: true}),
      Animated.spring(scaleAnim, {toValue: 1, useNativeDriver: true, tension: 200}),
    ]).start();
    onPress();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {transform: [{translateY}, {scale: scaleAnim}]},
      ]}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={loading}
        activeOpacity={0.85}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        style={[styles.fab, {backgroundColor: color}, label ? styles.extended : styles.round, SHADOWS.xl]}>
        {loading ? (
          <ActivityIndicator color={iconColor} size="small" />
        ) : (
          <>
            <Icon name={icon} size={24} color={iconColor} />
            {label && (
              <Text variant="label-lg" style={{color: iconColor, marginLeft: SPACING.sm, textTransform: 'uppercase', letterSpacing: 1}}>
                {label}
              </Text>
            )}
          </>
        )}
      </TouchableOpacity>

      {badgeCount !== undefined && badgeCount > 0 && (
        <View style={styles.badge}>
          <Text variant="label-md" style={{color: COLORS.onError, fontSize: 10}}>
            {badgeCount > 99 ? '99+' : String(badgeCount)}
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 88,
    right: SPACING.md,
    alignItems: 'center',
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  round: {
    width: 56,
    borderRadius: BORDER_RADIUS.xl,
  },
  extended: {
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
});
