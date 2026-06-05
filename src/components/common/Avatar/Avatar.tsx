import React, {useState} from 'react';
import {View, Image, StyleSheet, ViewStyle} from 'react-native';
import {Text} from '../Typography/Text';
import {COLORS} from '@constants/colors';
import {BORDER_RADIUS} from '@constants/spacing';
import {getInitials} from '@utils/phone.utils';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

const FONT_SIZE_MAP: Record<AvatarSize, number> = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 20,
  xl: 28,
};

// Deterministic color from name
const AVATAR_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.tertiary,
  '#2d6a2d',
  '#1a5276',
  '#6c3483',
  '#a04000',
  '#117a65',
];

const getAvatarColor = (name: string): string => {
  if (!name) return COLORS.primary;
  const code = name.charCodeAt(0) + (name.charCodeAt(1) ?? 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
};

interface Props {
  uri?: string | null;
  name: string;
  size?: AvatarSize;
  borderColor?: string;
  style?: ViewStyle;
}

export const Avatar: React.FC<Props> = ({
  uri,
  name,
  size = 'md',
  borderColor,
  style,
}) => {
  const [imageError, setImageError] = useState(false);
  const dim = SIZE_MAP[size];
  const fontSize = FONT_SIZE_MAP[size];
  const bgColor = getAvatarColor(name);
  const showImage = !!uri && !imageError;

  return (
    <View
      style={[
        styles.container,
        {
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          backgroundColor: showImage ? COLORS.surfaceContainerHigh : bgColor,
          borderWidth: borderColor ? 2 : 0,
          borderColor: borderColor ?? 'transparent',
        },
        style,
      ]}
      accessibilityLabel={name}>
      {showImage ? (
        <Image
          source={{uri}}
          style={[StyleSheet.absoluteFill, {borderRadius: dim / 2}]}
          onError={() => setImageError(true)}
          resizeMode="cover"
        />
      ) : (
        <Text
          style={{
            color: COLORS.onPrimary,
            fontSize,
            fontWeight: '700',
            lineHeight: fontSize * 1.2,
          }}>
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
