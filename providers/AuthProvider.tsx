/**
 * Auth Context — provides auth state to the entire app
 * Similar to PlayChaleProvider on web but adapted for React Native
 */
import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore, ModalType } from '@/hooks/useUIStore';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  hasProfile: boolean;
  setHasProfile: (value: boolean) => void;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  completeOnboarding: (userData: { name: string; sports: string[]; location: string }) => Promise<void>;
  // Gated actions
  requireAuth: (action: () => void) => void;
  openGatedModal: (type: ModalType, item?: any) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const { triggerToast, openModal, setPendingAction } = useUIStore();

  // Gate certain actions behind auth — if user is not logged in, redirect to login
  // If logged in but no profile, redirect to onboarding
  const requireAuth = useCallback((action: () => void) => {
    if (!auth.user) {
      router.push('/(auth)/login');
      return;
    }
    if (!auth.hasProfile) {
      router.push('/(auth)/onboarding');
      return;
    }
    action();
  }, [auth.user, auth.hasProfile, router]);

  // Open a modal but gate it behind auth
  const openGatedModal = useCallback((type: ModalType, item?: any) => {
    const gatedActions: ModalType[] = ['create', 'challenge'];
    if (type && gatedActions.includes(type)) {
      if (!auth.user) {
        setPendingAction({ type: 'modal', modalType: type, item });
        router.push('/(auth)/login');
        return;
      }
      if (!auth.hasProfile) {
        setPendingAction({ type: 'modal', modalType: type, item });
        router.push('/(auth)/onboarding');
        return;
      }
    }
    openModal(type, item);
  }, [auth.user, auth.hasProfile, router, setPendingAction, openModal]);

  const completeOnboarding = useCallback(async (userData: { name: string; sports: string[]; location: string }) => {
    if (!auth.user) return;
    triggerToast('Saving Profile...');

    const starterStats = { gamesPlayed: 0, winRate: '0%', mvps: 0, reliability: '100%', rating: 6.0 };

    const { error: profileError } = await supabase.from('profiles').upsert({
      id: auth.user.id,
      full_name: userData.name,
      username: userData.name.replace(/\s+/g, '').toLowerCase(),
      location: userData.location,
      sports: userData.sports,
      onboarding_completed: true,
      attributes: { pace: 80, shooting: 75, passing: 78, dribbling: 82, defending: 60, physical: 70 },
    }).eq('id', auth.user.id);

    if (profileError) {
      console.error(profileError);
      triggerToast('Error saving profile');
      return;
    }

    for (const sport of userData.sports) {
      await supabase.from('user_sport_stats').upsert({
        user_id: auth.user.id,
        sport,
        stats: starterStats,
      });
    }

    auth.setHasProfile(true);
    triggerToast(`COMMISSIONED. WELCOME TO THE ARENA, ${userData.name.toUpperCase()}.`);

    const { pendingAction } = useUIStore.getState();
    if (pendingAction) {
      if (pendingAction.type === 'view' && pendingAction.viewPath) {
        router.push(pendingAction.viewPath as any);
      } else if (pendingAction.type === 'modal' && pendingAction.modalType) {
        openModal(pendingAction.modalType, pendingAction.item);
        router.push('/(tabs)');
      }
      setPendingAction(null);
    } else {
      router.replace('/(tabs)');
    }
  }, [auth.user, router, triggerToast, openModal, setPendingAction]);

  const value: AuthContextType = {
    user: auth.user,
    isLoading: auth.isLoading,
    hasProfile: auth.hasProfile,
    setHasProfile: auth.setHasProfile,
    signInWithEmail: auth.signInWithEmail,
    signUpWithEmail: auth.signUpWithEmail,
    signInWithGoogle: auth.signInWithGoogle,
    signOut: auth.signOut,
    completeOnboarding,
    requireAuth,
    openGatedModal,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
