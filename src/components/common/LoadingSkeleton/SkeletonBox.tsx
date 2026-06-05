import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, ViewStyle} from 'react-native';
import {COLORS} from '@constants/colors';
import {BORDER_RADIUS} from '@constants/spacing';

interface Props {
  width: number | string;
  height: number;
  radius?: number;
  style?: ViewStyle;
}

export const SkeletonBox: React.FC<Props> = ({width, height, radius = BORDER_RADIUS.sm, style}) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {toValue: 0.9, duration: 700, useNativeDriver: true}),
        Animated.timing(opacity, {toValue: 0.4, duration: 700, useNativeDriver: true}),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      accessibilityLabel="Loading"
      style={[
        {
          width: width as number,
          height,
          borderRadius: radius,
          backgroundColor: COLORS.surfaceContainerHigh,
          opacity,
        },
        style,
      ]}
    />
  );
};
