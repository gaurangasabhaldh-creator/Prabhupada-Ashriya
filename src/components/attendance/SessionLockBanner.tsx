import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '@components/common/Typography/Text';
import {Icon} from '@components/common/Icon/Icon';
import {COLORS} from '@constants/colors';
import {SPACING} from '@constants/spacing';

export const SessionLockBanner: React.FC = () => (
  <View style={styles.banner} accessibilityLiveRegion="polite">
    <Icon name="lock" size={16} color={COLORS.onSurface} />
    <Text variant="body-sm" color="onSurface" style={{marginLeft: SPACING.sm}}>
      This session is locked. Contact your coordinator to make changes.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerHigh,
    borderTopWidth: 1,
    borderTopColor: COLORS.outlineVariant,
    paddingHorizontal: SPACING.marginMobile,
    paddingVertical: SPACING.sm,
  },
});
