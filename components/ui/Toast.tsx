/**
 * Toast notification component — matches the web app's floating toast
 * Black pill with lime text, slides up from bottom
 */
import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '@/constants/theme';

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (message) {
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withSpring(100, { damping: 15 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [message]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!message) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { bottom: insets.bottom + 24 },
        animatedStyle,
      ]}
      pointerEvents="none"
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  text: {
    backgroundColor: colors.black,
    color: colors.lime,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 9999,
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 3,
    overflow: 'hidden',
  },
});
