/**
 * Onboarding — multi-step flow for new users
 * Port of Onboarding.tsx from the web app
 * Steps: Name → Sports selection → Location → Done
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight, FadeInLeft, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, typography, borderRadius, shadows } from '@/constants/theme';
import { useAuthContext } from '@/providers/AuthProvider';
import { Logo, ChevronRight, ChevronLeft, Check, X } from '@/components/Icons';

const AVAILABLE_SPORTS = [
  'Football', 'Basketball', 'Tennis', 'Padel',
  'Volleyball', 'Swimming', 'Athletics', 'Boxing',
  'Badminton', 'Table Tennis', 'Cricket', 'Rugby',
];

const TOTAL_STEPS = 3;

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAuthContext();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleSport = (sport: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSports(prev =>
      prev.includes(sport)
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };

  const canProceed = () => {
    if (step === 1) return name.trim().length >= 2;
    if (step === 2) return selectedSports.length > 0;
    if (step === 3) return location.trim().length >= 2;
    return false;
  };

  const nextStep = () => {
    if (!canProceed()) return;
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await completeOnboarding({
        name: name.trim(),
        sports: selectedSports,
        location: location.trim(),
      });
    } catch (e) {
      console.error('Onboarding error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <X size={20} color={colors.whiteAlpha(0.6)} />
        </Pressable>

        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.stepDot,
                i + 1 <= step && styles.stepDotActive,
                i + 1 === step && styles.stepDotCurrent,
              ]}
            />
          ))}
        </View>

        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step 1: Name */}
        {step === 1 && (
          <Animated.View entering={FadeInRight.duration(300)} style={styles.stepContainer}>
            <Text style={styles.stepLabel}>Step 01</Text>
            <Text style={styles.stepTitle}>What's Your{'\n'}Name, Athlete?</Text>
            <Text style={styles.stepSubtitle}>This is how other players will know you</Text>

            <TextInput
              style={styles.bigInput}
              placeholder="Your full name"
              placeholderTextColor={colors.whiteAlpha(0.2)}
              value={name}
              onChangeText={setName}
              autoFocus
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={nextStep}
            />
          </Animated.View>
        )}

        {/* Step 2: Sports */}
        {step === 2 && (
          <Animated.View entering={FadeInRight.duration(300)} style={styles.stepContainer}>
            <Text style={styles.stepLabel}>Step 02</Text>
            <Text style={styles.stepTitle}>Pick Your{'\n'}Sports</Text>
            <Text style={styles.stepSubtitle}>Select one or more sports you play</Text>

            <View style={styles.sportsGrid}>
              {AVAILABLE_SPORTS.map(sport => {
                const isSelected = selectedSports.includes(sport);
                return (
                  <Pressable
                    key={sport}
                    style={[styles.sportChip, isSelected && styles.sportChipActive]}
                    onPress={() => toggleSport(sport)}
                  >
                    {isSelected && <Check size={14} color={colors.dark} />}
                    <Text style={[styles.sportChipText, isSelected && styles.sportChipTextActive]}>
                      {sport}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {selectedSports.length > 0 && (
              <Text style={styles.selectedCount}>
                {selectedSports.length} sport{selectedSports.length > 1 ? 's' : ''} selected
              </Text>
            )}
          </Animated.View>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <Animated.View entering={FadeInRight.duration(300)} style={styles.stepContainer}>
            <Text style={styles.stepLabel}>Step 03</Text>
            <Text style={styles.stepTitle}>Where Do{'\n'}You Play?</Text>
            <Text style={styles.stepSubtitle}>Your city or neighborhood</Text>

            <TextInput
              style={styles.bigInput}
              placeholder="e.g. Accra, Ghana"
              placeholderTextColor={colors.whiteAlpha(0.2)}
              value={location}
              onChangeText={setLocation}
              autoFocus
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={nextStep}
            />
          </Animated.View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { paddingBottom: insets.bottom + 16 }]}>
        {step > 1 && (
          <Pressable style={styles.backButton} onPress={prevStep}>
            <ChevronLeft size={18} color={colors.whiteAlpha(0.6)} />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        )}

        <Pressable
          style={[
            styles.nextButton,
            !canProceed() && styles.nextButtonDisabled,
            step > 1 && { flex: 1 },
            step === 1 && { flex: 1 },
          ]}
          onPress={nextStep}
          disabled={!canProceed() || loading}
        >
          <Text style={[styles.nextButtonText, !canProceed() && styles.nextButtonTextDisabled]}>
            {loading
              ? 'Saving...'
              : step === TOTAL_STEPS
                ? 'Enter The Arena'
                : 'Continue'
            }
          </Text>
          {!loading && step < TOTAL_STEPS && (
            <ChevronRight size={16} color={canProceed() ? colors.dark : colors.whiteAlpha(0.3)} />
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.whiteAlpha(0.08),
    borderWidth: 1,
    borderColor: colors.whiteAlpha(0.1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.whiteAlpha(0.15),
  },
  stepDotActive: {
    backgroundColor: colors.whiteAlpha(0.4),
  },
  stepDotCurrent: {
    backgroundColor: colors.lime,
    width: 24,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  stepContainer: {
    gap: 12,
  },
  stepLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 4,
    color: colors.lime,
  },
  stepTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 36,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -1.5,
    lineHeight: 38,
    color: colors.white,
    marginBottom: 4,
  },
  stepSubtitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.whiteAlpha(0.4),
    marginBottom: 24,
  },
  bigInput: {
    borderBottomWidth: 2,
    borderBottomColor: colors.whiteAlpha(0.15),
    paddingVertical: 16,
    fontFamily: typography.fontFamily.black,
    fontSize: 24,
    fontStyle: 'italic',
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  // Sports Grid
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: colors.whiteAlpha(0.15),
  },
  sportChipActive: {
    backgroundColor: colors.lime,
    borderColor: colors.lime,
  },
  sportChipText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 13,
    color: colors.whiteAlpha(0.6),
  },
  sportChipTextActive: {
    color: colors.dark,
    fontFamily: typography.fontFamily.black,
  },
  selectedCount: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
    color: colors.lime,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 16,
  },
  // Bottom Actions
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.whiteAlpha(0.05),
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: colors.whiteAlpha(0.1),
  },
  backButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.whiteAlpha(0.6),
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    borderRadius: 9999,
    backgroundColor: colors.lime,
    ...shadows.lime,
  },
  nextButtonDisabled: {
    backgroundColor: colors.whiteAlpha(0.08),
    shadowOpacity: 0,
  },
  nextButtonText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.dark,
  },
  nextButtonTextDisabled: {
    color: colors.whiteAlpha(0.3),
  },
});
