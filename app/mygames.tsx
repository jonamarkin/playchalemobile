/**
 * My Games — port of MyGamesPage.tsx
 * Allows users to view Hosted and Joined games
 * Requires auth — accessible from Home Dashboard
 */
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, Layout, SlideInRight, SlideOutLeft, SlideInLeft, SlideOutRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, typography, borderRadius, shadows } from '@/constants/theme';
import { useAuthContext } from '@/providers/AuthProvider';
import { useMyGames } from '@/hooks/useData';
import GameCard from '@/components/GameCard';
import { ChevronRight, ArrowLeft } from '@/components/Icons';
import { Game } from '@/types';

export default function MyGamesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { data: myGames, isLoading } = useMyGames(user?.id);
  const [activeTab, setActiveTab] = useState<'hosted' | 'joined'>('hosted');

  const hostedGames = myGames?.hostedGames || [];
  const joinedGames = myGames?.joinedGames || [];

  const handleTabPress = (tab: 'hosted' | 'joined') => {
    if (activeTab !== tab) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setActiveTab(tab);
    }
  };

  const currentGames = activeTab === 'hosted' ? hostedGames : joinedGames;

  const renderGame = ({ item, index }: { item: Game; index: number }) => (
    <View style={styles.gameWrapper}>
      <GameCard
        game={item}
        index={index}
        onPress={() => router.push(`/game/${item.slug || item.id}`)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTop}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.dark} />
          </Pressable>
          <View style={styles.headerLabelContainer}>
            <View style={styles.headerDot} />
            <Text style={styles.headerLabel}>Your Arena</Text>
          </View>
          <View style={styles.backButtonPlaceholder} />
        </View>
        <Text style={styles.headerTitle}>My Games</Text>

        {/* Segmented Control */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, activeTab === 'hosted' && styles.activeTab]}
            onPress={() => handleTabPress('hosted')}
          >
            <Text style={[styles.tabText, activeTab === 'hosted' && styles.activeTabText]}>
              Hosted ({hostedGames.length})
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'joined' && styles.activeTab]}
            onPress={() => handleTabPress('joined')}
          >
            <Text style={[styles.tabText, activeTab === 'joined' && styles.activeTabText]}>
              Joined ({joinedGames.length})
            </Text>
          </Pressable>
        </Animated.View>
      </Animated.View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading your games...</Text>
          </View>
        ) : (
          <Animated.View 
             key={activeTab} // Forces re-render for enter/exit animations
             entering={activeTab === 'joined' ? SlideInRight : SlideInLeft}
             exiting={activeTab === 'joined' ? SlideOutLeft : SlideOutRight}
             layout={Layout.springify()}
             style={{ flex: 1 }}
          >
            <FlashList
              data={currentGames}
              renderItem={renderGame}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <Animated.View entering={FadeInUp.delay(200)} style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>
                    {activeTab === 'hosted' ? '🏟️' : '🤝'}
                  </Text>
                  <Text style={styles.emptySubtitle}>
                    {activeTab === 'hosted' 
                      ? "You haven't hosted any games yet" 
                      : "You haven't joined any games yet"}
                  </Text>
                  <Pressable
                    style={styles.emptyButton}
                    onPress={() => router.push('/(tabs)/discover')}
                  >
                    <Text style={styles.emptyButtonText}>
                      {activeTab === 'hosted' ? 'Create Your First Game' : 'Find Games to Join'}
                    </Text>
                  </Pressable>
                </Animated.View>
              }
            />
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    paddingHorizontal: 20,
    backgroundColor: colors.cream,
    zIndex: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.blackAlpha(0.05),
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backButtonPlaceholder: {
    width: 40,
  },
  headerLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.lime,
  },
  headerLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 4,
    color: colors.blackAlpha(0.3),
  },
  headerTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 40,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -1.5,
    color: colors.dark,
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.blackAlpha(0.04),
    padding: 4,
    borderRadius: 9999,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 9999,
  },
  activeTab: {
    backgroundColor: colors.dark,
    ...shadows.sm,
  },
  tabText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.blackAlpha(0.4),
  },
  activeTabText: {
    color: colors.lime,
  },
  contentContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  gameWrapper: {
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.blackAlpha(0.4),
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: colors.white,
    borderRadius: borderRadius['3xl'],
    borderWidth: 1,
    borderColor: colors.blackAlpha(0.05),
    paddingHorizontal: 20,
    marginVertical: 20,
    ...shadows.sm,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptySubtitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.blackAlpha(0.4),
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyButton: {
    backgroundColor: colors.lime,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 9999,
  },
  emptyButtonText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.dark,
  },
});
