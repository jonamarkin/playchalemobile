/**
 * Messages/Inbox screen — port of MessageCenter.tsx
 * Auth-gated with a prompt for unauthenticated users
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { colors, typography, borderRadius } from '@/constants/theme';
import { useAuthContext } from '@/providers/AuthProvider';
import { Logo, Mail, ChevronRight } from '@/components/Icons';

// Mock messages (same as web app's initial state)
const MOCK_MESSAGES = [
  {
    id: 'm1',
    gameId: 'g1',
    senderId: 'p2',
    senderName: 'Elena R.',
    senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
    content: "Hey, is there parking near Pitch 4? I'm coming with a big car.",
    timestamp: '2h ago',
    isRead: false,
    type: 'inquiry',
  },
];

export default function MessagesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();

  // If not logged in, show prompt
  if (!user) {
    return (
      <View style={[styles.container, styles.centeredContainer, { paddingTop: insets.top }]}>
        <Mail size={40} color={colors.blackAlpha(0.15)} />
        <Text style={styles.authPromptTitle}>Your Inbox</Text>
        <Text style={styles.authPromptSubtitle}>
          Sign in to view messages from game organizers and players
        </Text>
        <Pressable style={styles.authButton} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.authButtonText}>Sign In</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
        <Text style={styles.headerLabel}>Messages</Text>
        <Text style={styles.headerTitle}>Inbox</Text>
      </Animated.View>

      {/* Messages List */}
      {MOCK_MESSAGES.length === 0 ? (
        <View style={styles.emptyState}>
          <Mail size={32} color={colors.blackAlpha(0.15)} />
          <Text style={styles.emptyTitle}>No Messages Yet</Text>
          <Text style={styles.emptySubtitle}>
            Join games or challenge players to start conversations
          </Text>
        </View>
      ) : (
        MOCK_MESSAGES.map((msg, index) => (
          <Animated.View key={msg.id} entering={FadeInRight.delay(200 + index * 100)}>
            <Pressable
              style={({ pressed }) => [
                styles.messageCard,
                !msg.isRead && styles.messageCardUnread,
                pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
              ]}
            >
              <Image
                source={msg.senderAvatar}
                style={styles.messageAvatar}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <Text style={styles.messageSender}>{msg.senderName}</Text>
                  <Text style={styles.messageTime}>{msg.timestamp}</Text>
                </View>
                <Text style={styles.messageText} numberOfLines={2}>
                  {msg.content}
                </Text>
                {msg.type === 'challenge' && (
                  <View style={styles.challengeBadge}>
                    <Text style={styles.challengeBadgeText}>Challenge</Text>
                  </View>
                )}
              </View>
              {!msg.isRead && <View style={styles.unreadDot} />}
            </Pressable>
          </Animated.View>
        ))
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
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
    paddingHorizontal: 40,
    gap: 14,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 10,
  },
  header: {
    marginBottom: 8,
  },
  headerLabel: {
    fontFamily: typography.fontFamily.black,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 4,
    color: colors.blackAlpha(0.3),
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 28,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -1,
    color: colors.dark,
  },
  // Auth prompt
  authPromptTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 24,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -1,
    color: colors.dark,
    marginTop: 12,
  },
  authPromptSubtitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.blackAlpha(0.5),
    textAlign: 'center',
    lineHeight: 20,
  },
  authButton: {
    backgroundColor: colors.dark,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 9999,
    marginTop: 8,
  },
  authButtonText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.lime,
  },
  // Message Card
  messageCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.blackAlpha(0.05),
    alignItems: 'flex-start',
  },
  messageCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: colors.lime,
  },
  messageAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
  },
  messageContent: {
    flex: 1,
    gap: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageSender: {
    fontFamily: typography.fontFamily.black,
    fontSize: 14,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: -0.3,
    color: colors.dark,
  },
  messageTime: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 10,
    color: colors.blackAlpha(0.3),
  },
  messageText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.blackAlpha(0.6),
    lineHeight: 18,
  },
  challengeBadge: {
    backgroundColor: colors.limeAlpha(0.15),
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  challengeBadgeText: {
    fontFamily: typography.fontFamily.black,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.dark,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.lime,
    marginTop: 4,
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 10,
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.black,
    fontSize: 18,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    color: colors.blackAlpha(0.3),
  },
  emptySubtitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 13,
    color: colors.blackAlpha(0.3),
    textAlign: 'center',
    maxWidth: 260,
  },
});
