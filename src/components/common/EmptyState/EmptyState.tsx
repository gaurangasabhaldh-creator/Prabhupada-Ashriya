import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../Typography/Text';
import {Button} from '../Button/Button';
import {Icon} from '../Icon/Icon';
import {COLORS} from '@constants/colors';
import {SPACING} from '@constants/spacing';

interface Props {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<Props> = ({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}) => (
  <View style={styles.container} accessibilityLiveRegion="polite">
    <View style={styles.iconContainer}>
      <Icon name={icon} size={56} color="outlineVariant" />
    </View>
    <Text variant="headline-sm" color="onSurface" align="center" style={styles.title}>
      {title}
    </Text>
    <Text variant="body-md" color="onSurfaceVariant" align="center" style={styles.message}>
      {message}
    </Text>
    {actionLabel && onAction && (
      <Button
        label={actionLabel}
        onPress={onAction}
        variant="secondary"
        size="md"
        style={styles.action}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: {marginBottom: SPACING.sm},
  message: {maxWidth: 280},
  action: {marginTop: SPACING.lg, alignSelf: 'center'},
});
