export const DEVOTEE_CATEGORIES = {
  IGF: 'IGF',
  IYF: 'IYF',
  ICF_MEETING: 'ICF_MEETING',
  ICF_PROGRAM: 'ICF_PROGRAM',
} as const;

export type DevoteeCategory = (typeof DEVOTEE_CATEGORIES)[keyof typeof DEVOTEE_CATEGORIES];

export const CATEGORY_LABELS: Record<DevoteeCategory, string> = {
  IGF: 'IGF',
  IYF: 'IYF',
  ICF_MEETING: 'ICF Meeting',
  ICF_PROGRAM: 'ICF Program',
};

export const CATEGORY_COLORS: Record<DevoteeCategory, string> = {
  IGF: '#8f4e00',
  IYF: '#785900',
  ICF_MEETING: '#b22b1d',
  ICF_PROGRAM: '#2d6a2d',
};

export const ALL_CATEGORIES = Object.values(DEVOTEE_CATEGORIES);
