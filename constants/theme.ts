/**
 * PlayChale Design System — React Native
 * Translated from the web app's lib/theme.ts + globals.css + tailwind.config.ts
 */

export const colors = {
  lime: '#C6FF00',
  beige: '#F5F5F0',
  dark: '#111111',
  cream: '#FDFDFB',
  white: '#FFFFFF',
  black: '#000000',

  // Semantic
  primary: '#C6FF00',
  primaryForeground: '#111111',
  background: '#FDFDFB',
  foreground: '#111111',
  card: '#FFFFFF',
  cardForeground: '#111111',
  muted: '#F5F5F0',
  mutedForeground: '#737373',
  border: '#E5E5E5',
  destructive: '#EF4444',
  destructiveForeground: '#FAFAFA',

  // Opacity helpers
  blackAlpha: (opacity: number) => `rgba(0, 0, 0, ${opacity})`,
  whiteAlpha: (opacity: number) => `rgba(255, 255, 255, ${opacity})`,
  limeAlpha: (opacity: number) => `rgba(198, 255, 0, ${opacity})`,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 10,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 15,
  },
  lime: {
    shadowColor: '#C6FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 8,
  },
} as const;

export const typography = {
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    extraBold: 'Inter_800ExtraBold',
    black: 'Inter_900Black',
  },
  fontSize: {
    xs: 10,   // 10px — labels, badges
    sm: 12,   // 12px — captions
    base: 14, // 14px — body text
    lg: 16,   // 16px — large body
    xl: 20,   // 20px — section titles
    '2xl': 24, // 24px — headings
    '3xl': 32, // 32px — large headings
    '4xl': 40, // 40px — hero headings
    '5xl': 48, // 48px — display
  },
  lineHeight: {
    tight: 0.85,
    snug: 0.9,
    normal: 1.0,
    relaxed: 1.3,
    loose: 1.5,
  },
  letterSpacing: {
    tighter: -1.5,
    tight: -0.5,
    normal: 0,
    wide: 1,
    wider: 2,
    widest: 3,
    ultraWide: 4,
  },
} as const;

export const animations = {
  durations: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easings: {
    default: 'ease-in-out',
    in: 'ease-in',
    out: 'ease-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// Pre-composed text styles matching the web app's design language
export const textStyles = {
  // The signature PlayChale heading: font-black italic uppercase tracking-tighter
  heading: {
    fontFamily: typography.fontFamily.black,
    fontStyle: 'italic' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: typography.letterSpacing.tighter,
  },
  // Micro labels: text-[10px] font-black uppercase tracking-widest
  label: {
    fontFamily: typography.fontFamily.black,
    fontSize: typography.fontSize.xs,
    textTransform: 'uppercase' as const,
    letterSpacing: typography.letterSpacing.widest,
  },
  // Body text
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.base,
    lineHeight: 20,
  },
  // Button text
  button: {
    fontFamily: typography.fontFamily.black,
    fontSize: 11,
    textTransform: 'uppercase' as const,
    letterSpacing: typography.letterSpacing.wider,
  },
} as const;
