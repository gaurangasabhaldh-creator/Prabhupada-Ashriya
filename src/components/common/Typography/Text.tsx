import React from 'react';
import {Text as RNText, TextProps, TextStyle} from 'react-native';
import {TYPOGRAPHY, TypographyVariant} from '@constants/typography';
import {COLORS, ColorKey} from '@constants/colors';

interface Props extends TextProps {
  variant?: TypographyVariant;
  color?: ColorKey | string;
  bold?: boolean;
  italic?: boolean;
  align?: TextStyle['textAlign'];
  style?: TextStyle;
}

export const Text: React.FC<Props> = ({
  variant = 'body-md',
  color = 'onSurface',
  bold,
  italic,
  align,
  style,
  children,
  ...rest
}) => {
  const variantStyle = TYPOGRAPHY[variant] ?? TYPOGRAPHY['body-md'];
  const resolvedColor = color in COLORS ? COLORS[color as ColorKey] : color;

  return (
    <RNText
      style={[
        variantStyle,
        {color: resolvedColor},
        bold && {fontWeight: '700'},
        italic && {fontStyle: 'italic'},
        align && {textAlign: align},
        style,
      ]}
      {...rest}>
      {children}
    </RNText>
  );
};
