import {TextStyle} from 'react-native';

export const FONTS = {
  headline: 'PlusJakartaSans',
  body: 'WorkSans',
} as const;

export const TYPOGRAPHY: Record<string, TextStyle> = {
  'display-lg': {
    fontFamily: FONTS.headline,
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 48,
    letterSpacing: -0.5,
  },
  'headline-lg': {
    fontFamily: FONTS.headline,
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
  },
  'headline-md': {
    fontFamily: FONTS.headline,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  },
  'headline-sm': {
    fontFamily: FONTS.headline,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  'title-lg': {
    fontFamily: FONTS.body,
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 28,
  },
  'title-md': {
    fontFamily: FONTS.body,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  'body-lg': {
    fontFamily: FONTS.body,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  'body-md': {
    fontFamily: FONTS.body,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  'body-sm': {
    fontFamily: FONTS.body,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  'label-lg': {
    fontFamily: FONTS.body,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  'label-md': {
    fontFamily: FONTS.body,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
  },
} as const;

export type TypographyVariant = keyof typeof TYPOGRAPHY;
