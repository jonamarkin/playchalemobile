import React from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useUIStore } from '@/hooks/useUIStore';
import { colors, borderRadius } from '@/constants/theme';
import CreateGameModal from './modals/CreateGameModal';

// Optional generic wrapper for modal content
const ModalWrapper = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <View style={styles.overlay}>
    <TouchableWithoutFeedback onPress={onClose}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.blackAlpha(0.6) }]}
        entering={FadeIn}
        exiting={FadeOut}
      />
    </TouchableWithoutFeedback>
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.contentWrapper}
    >
      <Animated.View
        style={styles.sheet}
        entering={SlideInDown.springify().damping(15)}
        exiting={SlideOutDown}
      >
        {children}
      </Animated.View>
    </KeyboardAvoidingView>
  </View>
);

export default function ModalManager() {
  const { activeModal, closeModal, selectedItem } = useUIStore();

  if (!activeModal) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={closeModal}>
      <ModalWrapper onClose={closeModal}>
        {activeModal === 'create' && <CreateGameModal />}
        {/* other modals can be added here, e.g. ChallengeModal */}
      </ModalWrapper>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  contentWrapper: {
    justifyContent: 'flex-end',
    maxHeight: '90%',
  },
  sheet: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: borderRadius['3xl'],
    borderTopRightRadius: borderRadius['3xl'],
    overflow: 'hidden',
  },
});
