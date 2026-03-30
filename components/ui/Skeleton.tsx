/**
 * Skeleton loading component for premium loading states
 */
import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '@/constants/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export default function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.4, 0.8]),
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: colors.blackAlpha(0.08),
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

// Pre-composed skeleton patterns
export function GameCardSkeleton() {
  return (
    <View style={skeletonStyles.gameCard}>
      <Skeleton height={200} borderRadius={40} />
      <View style={skeletonStyles.gameCardContent}>
        <Skeleton width="30%" height={12} borderRadius={6} />
        <Skeleton width="80%" height={28} borderRadius={8} style={{ marginTop: 8 }} />
        <Skeleton width="60%" height={12} borderRadius={6} style={{ marginTop: 12 }} />
        <Skeleton width="50%" height={12} borderRadius={6} style={{ marginTop: 8 }} />
      </View>
      <View style={skeletonStyles.gameCardFooter}>
        <View style={{ flexDirection: 'row', gap: -8 }}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>
        <Skeleton width={120} height={48} borderRadius={24} />
      </View>
    </View>
  );
}

export function PlayerCardSkeleton() {
  return (
    <View style={skeletonStyles.playerCard}>
      <Skeleton width={48} height={48} borderRadius={16} />
      <View style={{ flex: 1, gap: 6 }}>
        <Skeleton width="60%" height={16} borderRadius={6} />
        <Skeleton width="40%" height={10} borderRadius={4} />
      </View>
      <Skeleton width={40} height={24} borderRadius={12} />
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  gameCard: {
    backgroundColor: colors.white,
    borderRadius: 48,
    padding: 24,
    gap: 16,
  },
  gameCardContent: {
    paddingHorizontal: 8,
    gap: 4,
  },
  gameCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.blackAlpha(0.05),
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
