/**
 * GameCard — React Native port of the web app's GameCard.tsx
 * Premium card design with image, sport badge, squad progress, participants
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Game } from '@/types';
import { colors, typography, shadows, borderRadius } from '@/constants/theme';
import { MapPin, Clock, ChevronRight } from '@/components/Icons';

interface GameCardProps {
  game: Game;
  onPress: () => void;
  index?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function GameCard({ game, onPress, index = 0 }: GameCardProps) {
  const isFull = game.spotsTaken >= game.spotsTotal;
  const fillPercentage = (game.spotsTaken / game.spotsTotal) * 100;

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <AnimatedPressable
      entering={FadeInUp.delay(index * 100).duration(500).springify()}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={game.imageUrl}
          style={styles.image}
          contentFit="cover"
          transition={300}
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        />

        {/* Gradient Overlay */}
        <View style={styles.imageOverlay} />

        {/* Floating Tags */}
        <View style={styles.tagRow}>
          <View style={styles.tagColumn}>
            <View style={styles.sportTag}>
              <Text style={styles.sportTagText}>{game.sport}</Text>
            </View>
            <View style={[styles.statusTag, isFull ? styles.statusTagFull : styles.statusTagOpen]}>
              <Text style={[styles.statusTagText, isFull ? styles.statusTagTextFull : styles.statusTagTextOpen]}>
                {isFull ? 'SQUAD FULL' : `${game.spotsTotal - game.spotsTaken} OPEN`}
              </Text>
            </View>
          </View>
          <View style={styles.priceTag}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceValue}>{game.price}</Text>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={2}>{game.title}</Text>
          <View style={styles.metaRow}>
            <MapPin size={14} color={colors.blackAlpha(0.4)} />
            <Text style={styles.metaText} numberOfLines={1}>{game.location}</Text>
          </View>
          <View style={styles.metaRow}>
            <Clock size={14} color={colors.blackAlpha(0.4)} />
            <Text style={styles.metaText}>{game.date} • {game.time}</Text>
          </View>
        </View>

        {/* Squad Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Squad Recruitment</Text>
            <Text style={styles.progressCount}>
              {game.spotsTaken}
              <Text style={styles.progressDivider}> / </Text>
              {game.spotsTotal}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${fillPercentage}%`,
                  backgroundColor: fillPercentage > 85 ? colors.destructive : colors.dark,
                },
              ]}
            />
          </View>
        </View>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <View style={styles.participants}>
            {game.participants?.slice(0, 3).map((p, idx) => (
              <Image
                key={p.id}
                source={p.avatar}
                style={[styles.participantAvatar, { marginLeft: idx > 0 ? -12 : 0, zIndex: 3 - idx }]}
                contentFit="cover"
              />
            ))}
            {game.participants && game.participants.length > 3 && (
              <View style={[styles.participantOverflow, { marginLeft: -12 }]}>
                <Text style={styles.participantOverflowText}>+{game.participants.length - 3}</Text>
              </View>
            )}
          </View>

          <View style={[styles.joinButton, isFull && styles.joinButtonDisabled]}>
            <Text style={[styles.joinButtonText, isFull && styles.joinButtonTextDisabled]}>
              {isFull ? 'SQUAD FULL' : 'JOIN MATCH'}
            </Text>
            {!isFull && <ChevronRight size={14} color={colors.white} />}
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius['3xl'],
    padding: 20,
    borderWidth: 1,
    borderColor: colors.blackAlpha(0.05),
    ...shadows.md,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  imageContainer: {
    height: 220,
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    // Simulated gradient with positioned overlay
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
  },
  tagRow: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tagColumn: {
    gap: 6,
  },
  sportTag: {
    backgroundColor: colors.whiteAlpha(0.15),
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: colors.whiteAlpha(0.2),
  },
  sportTagText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.white,
  },
  statusTag: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 9999,
  },
  statusTagOpen: {
    backgroundColor: colors.lime,
  },
  statusTagFull: {
    backgroundColor: colors.destructive,
  },
  statusTagText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  statusTagTextOpen: {
    color: colors.dark,
  },
  statusTagTextFull: {
    color: colors.white,
  },
  priceTag: {
    backgroundColor: colors.whiteAlpha(0.95),
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
    ...shadows.lg,
  },
  priceLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.blackAlpha(0.4),
    marginBottom: 2,
  },
  priceValue: {
    fontFamily: typography.fontFamily.black,
    fontSize: 14,
    color: colors.dark,
  },
  content: {
    paddingHorizontal: 4,
  },
  titleBlock: {
    marginBottom: 24,
  },
  title: {
    fontFamily: typography.fontFamily.black,
    fontSize: 26,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -1,
    lineHeight: 28,
    color: colors.dark,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  metaText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.blackAlpha(0.4),
    flex: 1,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 2,
    marginBottom: 10,
  },
  progressLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: colors.blackAlpha(0.25),
  },
  progressCount: {
    fontFamily: typography.fontFamily.black,
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.dark,
  },
  progressDivider: {
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    color: colors.blackAlpha(0.25),
  },
  progressBarBg: {
    height: 6,
    backgroundColor: colors.blackAlpha(0.06),
    borderRadius: 9999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 9999,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.blackAlpha(0.05),
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.white,
  },
  participantOverflow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blackAlpha(0.06),
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantOverflowText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    color: colors.dark,
  },
  joinButton: {
    backgroundColor: colors.dark,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  joinButtonDisabled: {
    backgroundColor: colors.blackAlpha(0.06),
  },
  joinButtonText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.white,
  },
  joinButtonTextDisabled: {
    color: colors.blackAlpha(0.2),
  },
});
