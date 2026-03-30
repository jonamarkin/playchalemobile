/**
 * Login screen — email/password + Google social login
 * Presented as a modal from any auth-gated action
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors, typography, borderRadius, shadows } from '@/constants/theme';
import { useAuthContext } from '@/providers/AuthProvider';
import { Logo, X, Eye, EyeOff } from '@/components/Icons';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuthContext();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const { error: authError } = isSignUp
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password);

      if (authError) {
        setError(authError.message);
      } else {
        router.back();
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const { error: authError } = await signInWithGoogle();
      if (authError) {
        setError(authError.message);
      } else {
        router.back();
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Close Button */}
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <X size={20} color={colors.blackAlpha(0.5)} />
        </Pressable>

        {/* Logo and Title */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <Logo size={48} />
          <Text style={styles.title}>PlayChale</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? 'Create your account' : 'Welcome back, athlete'}
          </Text>
        </Animated.View>

        {/* Google Sign In */}
        <Animated.View entering={FadeInUp.delay(200)}>
          <Pressable
            style={({ pressed }) => [styles.googleButton, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            <Ionicons name="logo-google" size={18} color={colors.dark} />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </Pressable>
        </Animated.View>

        {/* Divider */}
        <Animated.View entering={FadeInUp.delay(250)} style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </Animated.View>

        {/* Email/Password Form */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={colors.blackAlpha(0.3)}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="••••••••"
                placeholderTextColor={colors.blackAlpha(0.3)}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <Pressable style={styles.passwordToggle} onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={18} color={colors.blackAlpha(0.4)} />
                ) : (
                  <Eye size={18} color={colors.blackAlpha(0.4)} />
                )}
              </Pressable>
            </View>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              pressed && { transform: [{ scale: 0.98 }] },
              loading && { opacity: 0.7 },
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </Text>
          </Pressable>
        </Animated.View>

        {/* Toggle Sign Up / Sign In */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.toggleContainer}>
          <Text style={styles.toggleText}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </Text>
          <Pressable onPress={() => { setIsSignUp(!isSignUp); setError(''); }}>
            <Text style={styles.toggleLink}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Text>
          </Pressable>
        </Animated.View>

        {/* Skip for now */}
        <Pressable style={styles.skipButton} onPress={() => router.back()}>
          <Text style={styles.skipText}>Continue without signing in</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
    flexGrow: 1,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.blackAlpha(0.05),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
    gap: 8,
  },
  title: {
    fontFamily: typography.fontFamily.black,
    fontSize: 28,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -1,
    color: colors.dark,
    marginTop: 12,
  },
  subtitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.blackAlpha(0.5),
  },
  // Google
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.blackAlpha(0.08),
    ...shadows.sm,
  },
  googleButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 15,
    color: colors.dark,
  },
  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.blackAlpha(0.08),
  },
  dividerText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
    color: colors.blackAlpha(0.3),
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  // Form
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.blackAlpha(0.4),
    paddingLeft: 4,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: typography.fontFamily.medium,
    fontSize: 15,
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.blackAlpha(0.08),
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.destructive,
  },
  errorText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 13,
    color: colors.destructive,
  },
  submitButton: {
    backgroundColor: colors.dark,
    borderRadius: borderRadius.xl,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 4,
    ...shadows.lg,
  },
  submitButtonText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.lime,
  },
  // Toggle
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
  },
  toggleText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 13,
    color: colors.blackAlpha(0.5),
  },
  toggleLink: {
    fontFamily: typography.fontFamily.black,
    fontSize: 13,
    color: colors.dark,
    textDecorationLine: 'underline',
  },
  skipButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
  },
  skipText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
    color: colors.blackAlpha(0.3),
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
