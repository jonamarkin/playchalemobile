import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography, borderRadius } from '@/constants/theme';
import { Logo } from '@/components/Icons';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Logo size={48} />
      <Text style={styles.title}>Page Not Found</Text>
      <Text style={styles.subtitle}>This screen doesn't exist</Text>
      <Pressable style={styles.button} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.buttonText}>Go Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    padding: 40,
  },
  title: {
    fontFamily: typography.fontFamily.black,
    fontSize: 24,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -1,
    color: colors.dark,
    marginTop: 12,
  },
  subtitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.blackAlpha(0.4),
  },
  button: {
    backgroundColor: colors.dark,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 9999,
    marginTop: 8,
  },
  buttonText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.lime,
  },
});
