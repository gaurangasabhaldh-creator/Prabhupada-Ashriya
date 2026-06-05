import React from 'react';
import {Text, TextStyle} from 'react-native';
import {COLORS, ColorKey} from '@constants/colors';
import {ICON_SIZE} from '@constants/spacing';

type IconSize = keyof typeof ICON_SIZE | number;

interface Props {
  name: string;
  size?: IconSize;
  color?: ColorKey | string;
  filled?: boolean;
  style?: TextStyle;
}

export const Icon: React.FC<Props> = ({
  name,
  size = 'md',
  color = 'onSurface',
  filled = false,
  style,
}) => {
  const resolvedSize = typeof size === 'number' ? size : ICON_SIZE[size];
  const resolvedColor = color in COLORS ? COLORS[color as ColorKey] : color;

  return (
    <Text
      style={[
        {
          fontFamily: 'MaterialSymbolsOutlined',
          fontSize: resolvedSize,
          color: resolvedColor,
          lineHeight: resolvedSize,
          fontVariationSettings: filled
            ? `'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24`
            : `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
        },
        style,
      ]}
      accessibilityElementsHidden>
      {name}
    </Text>
  );
};
