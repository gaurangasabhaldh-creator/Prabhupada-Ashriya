import React, {useEffect, useRef} from 'react';
import {Animated, View, StyleSheet} from 'react-native';
import {Text} from '../Typography/Text';
import {Icon} from '../Icon/Icon';
import {COLORS} from '@constants/colors';
import {SPACING} from '@constants/spacing';
import {useAuthStore} from '@store/auth.store';

export const OfflineBanner: React.FC = () => {
  const isOffline = useAuthStore(s => s.isOffline);
  const translateY = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isOffline ? 0 : -60,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, [isOffline, translateY]);

  return (
    <Animated.View
      style={[styles.banner, {transform: [{translateY}]}]}
      accessibilityLiveRegion="assertive"
      accessibilityLabel="You are offline. Changes will sync when reconnected.">
      <Icon name="cloud_off" size={16} color={COLORS.onSurface} />
      <Text variant="body-sm" color="onSurface" style={{marginLeft: SPACING.sm}}>
        Offline — changes will sync when reconnected
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.warningContainer,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    zIndex: 100,
  },
});
