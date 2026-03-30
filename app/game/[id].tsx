/**
 * Game Detail screen — port of GameDetailView.tsx
 * Full game information with parallax hero image, participant list, and actions
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, FadeInRight } from 'react-native-reanimated';
import { colors, typography, borderRadius, shadows } from '@/constants/theme';
import { useGames } from '@/hooks/useData';
import { useAuthContext } from '@/providers/AuthProvider';
import { useUIStore } from '@/hooks/useUIStore';
import { ChevronLeft, MapPin, Clock, Users, Star, Calendar, ChevronRight } from '@/components/Icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, requireAuth } = useAuthContext();
  const { triggerToast } = useUIStore();

  const { data: games = [] } = useGames();
  const game = games.find(g => g.id === id);

  if (!game) {
    return (
      <View style={[styles.container, styles.centeredContainer]}>
        <Text style={styles.emptyTitle}>Game Not Found</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const isFull = game.spotsTaken >= game.spotsTotal;
  const fillPercentage = (game.spotsTaken / game.spotsTotal) * 100;

  const handleJoin = () => {
    requireAuth(() => {
      triggerToast('JOIN REQUEST SENT!');
    });
  };

  const handleContactOrganizer = () => {
    requireAuth(() => {
      triggerToast('MESSAGE SENT TO HOST!');
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={game.imageUrl}
            style={styles.heroImage}
            contentFit="cover"
            transition={500}
          />
          <View style={styles.heroOverlay} />

          {/* Back Button */}
          <Pressable
            style={[styles.heroBackButton, { top: insets.top + 8 }]}
            onPress={() => router.back()}
          >
            <ChevronLeft size={20} color={colors.white} />
          </Pressable>

          {/* Hero Content */}
          <View style={[styles.heroContent, { paddingBottom: 32 }]}>
            <View style={styles.heroBadgeRow}>
              <View style={styles.sportBadge}>
                <Text style={styles.sportBadgeText}>{game.sport}</Text>
              </View>
              <View style={[styles.statusBadge, isFull ? styles.statusBadgeFull : styles.statusBadgeOpen]}>
                <Text style={[styles.statusBadgeText, isFull ? { color: colors.white } : { color: colors.dark }]}>
                  {isFull ? 'Squad Full' : `${game.spotsTotal - game.spotsTaken} Spots Open`}
                </Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>{game.title}</Text>
            <Text style={styles.heroOrganizer}>by {game.organizer}</Text>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <Animated.View entering={FadeInUp.delay(200)} style={styles.infoGrid}>
            {[
              { icon: <Calendar size={16} color={colors.lime} />, label: 'Date', value: game.date },
              { icon: <Clock size={16} color={colors.lime} />, label: 'Time', value: game.time },
              { icon: <MapPin size={16} color={colors.lime} />, label: 'Location', value: game.location },
              { icon: <Star size={16} color={colors.lime} />, label: 'Skill Level', value: game.skillLevel },
            ].map((info, i) => (
              <View key={i} style={styles.infoCard}>
                <View style={styles.infoCardIcon}>{info.icon}</View>
                <Text style={styles.infoCardLabel}>{info.label}</Text>
                <Text style={styles.infoCardValue} numberOfLines={2}>{info.value}</Text>
              </View>
            ))}
          </Animated.View>

          {/* Price */}
          <Animated.View entering={FadeInUp.delay(300)} style={styles.priceCard}>
            <Text style={styles.priceLabel}>Entry Fee</Text>
            <Text style={styles.priceValue}>{game.price}</Text>
          </Animated.View>

          {/* Squad Progress */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Squad Recruitment</Text>
              <Text style={styles.progressCount}>
                {game.spotsTaken} / {game.spotsTotal}
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${fillPercentage}%`,
                    backgroundColor: fillPercentage > 85 ? colors.destructive : colors.lime,
                  },
                ]}
              />
            </View>
          </Animated.View>

          {/* Participants */}
          {game.participants && game.participants.length > 0 && (
            <Animated.View entering={FadeInUp.delay(500)} style={styles.participantsSection}>
              <Text style={styles.sectionTitle}>Squad Members</Text>
              {game.participants.map((p, idx) => (
                <Pressable
                  key={p.id}
                  style={({ pressed }) => [styles.participantRow, pressed && { opacity: 0.8 }]}
                  onPress={() => router.push(`/profile/${p.id}`)}
                >
                  <Image source={p.avatar} style={styles.participantAvatar} contentFit="cover" />
                  <View style={styles.participantInfo}>
                    <Text style={styles.participantName}>{p.name}</Text>
                    <Text style={styles.participantRole}>{p.role || 'Player'}</Text>
                  </View>
                  <ChevronRight size={14} color={colors.blackAlpha(0.2)} />
                </Pressable>
              ))}
            </Animated.View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <Animated.View
        entering={FadeInUp.delay(600)}
        style={[styles.actionBar, { paddingBottom: insets.bottom + 12 }]}
      >
        <Pressable style={styles.contactButton} onPress={handleContactOrganizer}>
          <Text style={styles.contactButtonText}>Contact Host</Text>
        </Pressable>
        <Pressable
          style={[styles.joinButton, isFull && styles.joinButtonDisabled]}
          onPress={handleJoin}
          disabled={isFull}
        >
          <Text style={[styles.joinButtonText, isFull && styles.joinButtonTextDisabled]}>
            {isFull ? 'Squad Full' : 'Join Match'}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  centeredContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 20,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    color: colors.blackAlpha(0.3),
  },
  backBtn: {
    backgroundColor: colors.dark,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 9999,
  },
  backBtnText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.lime,
  },
  // Hero
  heroContainer: {
    height: 380,
    position: 'relative',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.blackAlpha(0.5),
  },
  heroBackButton: {
    position: 'absolute',
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.whiteAlpha(0.15),
    borderWidth: 1,
    borderColor: colors.whiteAlpha(0.2),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  heroContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 24,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  sportBadge: {
    backgroundColor: colors.whiteAlpha(0.15),
    borderWidth: 1,
    borderColor: colors.whiteAlpha(0.2),
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  sportBadgeText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.white,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  statusBadgeOpen: {
    backgroundColor: colors.lime,
  },
  statusBadgeFull: {
    backgroundColor: colors.destructive,
  },
  statusBadgeText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  heroTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 32,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -1.5,
    lineHeight: 34,
    color: colors.white,
    marginBottom: 4,
  },
  heroOrganizer: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 13,
    color: colors.whiteAlpha(0.6),
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  // Info Section
  infoSection: {
    padding: 20,
    gap: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  infoCard: {
    width: (SCREEN_WIDTH - 50) / 2,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.blackAlpha(0.05),
  },
  infoCardIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  infoCardLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.blackAlpha(0.3),
  },
  infoCardValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.dark,
  },
  // Price
  priceCard: {
    backgroundColor: colors.dark,
    borderRadius: borderRadius.xl,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.whiteAlpha(0.4),
  },
  priceValue: {
    fontFamily: typography.fontFamily.black,
    fontSize: 24,
    fontStyle: 'italic',
    color: colors.lime,
  },
  // Progress
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.blackAlpha(0.05),
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: colors.blackAlpha(0.3),
  },
  progressCount: {
    fontFamily: typography.fontFamily.black,
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.dark,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.blackAlpha(0.06),
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  // Participants
  participantsSection: {
    gap: 10,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 16,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    color: colors.dark,
    marginBottom: 4,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.blackAlpha(0.05),
  },
  participantAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontFamily: typography.fontFamily.black,
    fontSize: 14,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -0.3,
    color: colors.dark,
  },
  participantRole: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.blackAlpha(0.3),
    marginTop: 2,
  },
  // Action Bar
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    gap: 10,
    backgroundColor: colors.whiteAlpha(0.95),
    borderTopWidth: 1,
    borderTopColor: colors.blackAlpha(0.05),
  },
  contactButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: colors.dark,
    alignItems: 'center',
  },
  contactButtonText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.dark,
  },
  joinButton: {
    flex: 1.5,
    paddingVertical: 18,
    borderRadius: 9999,
    backgroundColor: colors.dark,
    alignItems: 'center',
    ...shadows.lg,
  },
  joinButtonDisabled: {
    backgroundColor: colors.blackAlpha(0.1),
    shadowOpacity: 0,
  },
  joinButtonText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.lime,
  },
  joinButtonTextDisabled: {
    color: colors.blackAlpha(0.25),
  },
});
