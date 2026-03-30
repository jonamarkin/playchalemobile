/**
 * Create Game Modal
 * A modal to let hosts create new games
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, typography, borderRadius, shadows } from '@/constants/theme';
import { useCreateGame } from '@/hooks/useData';
import { useAuthContext } from '@/providers/AuthProvider';
import { useUIStore } from '@/hooks/useUIStore';
import { X, Check } from '@/components/Icons';

const SPORTS = ['Football', 'Basketball', 'Tennis', 'Padel', 'Volleyball'];
const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Competitive'];
const VISIBILITY = ['public', 'private'];

export default function CreateGameModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { closeModal, triggerToast } = useUIStore();
  const { mutateAsync: createGame } = useCreateGame();

  const [title, setTitle] = useState('');
  const [sport, setSport] = useState(SPORTS[0]);
  const [level, setLevel] = useState(LEVELS[0]);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('Free');
  const [spotsTotal, setSpotsTotal] = useState('10');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValid = title && location && date && time && spotsTotal;

  const handleSubmit = async () => {
    if (!user) return;
    if (!isValid) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await createGame({
        userId: user.id,
        game: {
          title,
          sport,
          skillLevel: level as any,
          location,
          date,
          time,
          price,
          spotsTotal: parseInt(spotsTotal, 10),
          visibility,
        }
      });
      triggerToast('GAME CREATED SUCESSFULLY');
      closeModal();
    } catch (err: any) {
      setError(err.message || 'Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Host a Game</Text>
        <Pressable onPress={closeModal} style={styles.closeBtn}>
          <X size={24} color={colors.dark} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.formGroup}>
          <Text style={styles.label}>Game Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Sunday Morning Kickoff"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={colors.blackAlpha(0.3)}
            maxLength={40}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150)} style={styles.formGroup}>
          <Text style={styles.label}>Sport</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {SPORTS.map(s => (
              <Pressable
                key={s}
                style={[styles.chip, sport === s && styles.chipActive]}
                onPress={() => setSport(s)}
              >
                <Text style={[styles.chipText, sport === s && styles.chipTextActive]}>{s}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.formGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Central Park Pitch 1"
            value={location}
            onChangeText={setLocation}
            placeholderTextColor={colors.blackAlpha(0.3)}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250)} style={styles.row}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Sat, Oct 15"
              value={date}
              onChangeText={setDate}
              placeholderTextColor={colors.blackAlpha(0.3)}
            />
          </View>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Time</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 10:00 AM"
              value={time}
              onChangeText={setTime}
              placeholderTextColor={colors.blackAlpha(0.3)}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={styles.row}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Spots</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 10"
              keyboardType="number-pad"
              value={spotsTotal}
              onChangeText={setSpotsTotal}
              placeholderTextColor={colors.blackAlpha(0.3)}
            />
          </View>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. $5 or Free"
              value={price}
              onChangeText={setPrice}
              placeholderTextColor={colors.blackAlpha(0.3)}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(350)} style={styles.formGroup}>
          <Text style={styles.label}>Skill Level</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {LEVELS.map(l => (
              <Pressable
                key={l}
                style={[styles.chip, level === l && styles.chipActive]}
                onPress={() => setLevel(l)}
              >
                <Text style={[styles.chipText, level === l && styles.chipTextActive]}>{l}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)} style={styles.formGroup}>
          <Text style={styles.label}>Visibility</Text>
          <View style={styles.visibilityRow}>
            {VISIBILITY.map(v => (
              <Pressable
                key={v}
                style={[styles.visibilityBtn, visibility === v && styles.visibilityBtnActive]}
                onPress={() => setVisibility(v as any)}
              >
                <Text style={[styles.visibilityBtnText, visibility === v && styles.visibilityBtnTextActive]}>
                  {v.toUpperCase()}
                </Text>
                {visibility === v && <Check size={14} color={colors.dark} />}
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Animated.View entering={FadeInDown.delay(450)}>
          <Pressable
            style={[styles.submitButton, (!isValid || loading) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!isValid || loading}
          >
            <Text style={[styles.submitButtonText, (!isValid || loading) && styles.submitButtonTextDisabled]}>
              {loading ? 'Creating...' : 'Create Game'}
            </Text>
          </Pressable>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.blackAlpha(0.05),
  },
  headerTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 20,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    color: colors.dark,
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.blackAlpha(0.4),
    marginLeft: 4,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blackAlpha(0.08),
    borderRadius: borderRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: typography.fontFamily.medium,
    fontSize: 15,
    color: colors.dark,
  },
  chipRow: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blackAlpha(0.08),
  },
  chipActive: {
    backgroundColor: colors.lime,
    borderColor: colors.lime,
  },
  chipText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
    color: colors.blackAlpha(0.5),
  },
  chipTextActive: {
    color: colors.dark,
  },
  visibilityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  visibilityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blackAlpha(0.08),
  },
  visibilityBtnActive: {
    backgroundColor: colors.limeAlpha(0.15),
    borderColor: colors.lime,
  },
  visibilityBtnText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.blackAlpha(0.4),
  },
  visibilityBtnTextActive: {
    color: colors.dark,
  },
  submitButton: {
    backgroundColor: colors.dark,
    paddingVertical: 18,
    borderRadius: 9999,
    alignItems: 'center',
    marginTop: 10,
    ...shadows.md,
  },
  submitButtonDisabled: {
    backgroundColor: colors.blackAlpha(0.1),
    shadowOpacity: 0,
  },
  submitButtonText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.lime,
  },
  submitButtonTextDisabled: {
    color: colors.blackAlpha(0.3),
  },
  errorText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 12,
    color: colors.destructive,
    textAlign: 'center',
  },
});
