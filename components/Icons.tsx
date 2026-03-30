/**
 * PlayChale Icons — React Native SVG-like icons using @expo/vector-icons
 * Maps to the same icons used in the web app's ICONS constant
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

interface IconProps {
  size?: number;
  color?: string;
}

// PlayChale Logo mark
export const Logo = ({ size = 28, color = colors.lime }: IconProps) => (
  <View style={[styles.logoContainer, { width: size, height: size }]}>
    <Text style={[styles.logoText, { fontSize: size * 0.55, color }]}>P</Text>
  </View>
);

export const MapPin = ({ size = 16, color = 'currentColor' }: IconProps) => (
  <Ionicons name="location-sharp" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const Clock = ({ size = 16, color = 'currentColor' }: IconProps) => (
  <Ionicons name="time" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const Plus = ({ size = 16, color = 'currentColor' }: IconProps) => (
  <Feather name="plus" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const X = ({ size = 16, color = 'currentColor' }: IconProps) => (
  <Feather name="x" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const Menu = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <Feather name="menu" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const ChevronRight = ({ size = 16, color = 'currentColor' }: IconProps) => (
  <Feather name="chevron-right" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const ChevronLeft = ({ size = 16, color = 'currentColor' }: IconProps) => (
  <Feather name="chevron-left" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const UpArrow = ({ size = 16, color = 'currentColor' }: IconProps) => (
  <Feather name="trending-up" size={size} color={color === 'currentColor' ? colors.lime : color} />
);

export const Search = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <Feather name="search" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const Filter = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <Feather name="sliders" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const ArrowLeft = ({ size = 24, color = 'currentColor' }: IconProps) => (
  <Feather name="arrow-left" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const Send = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <Feather name="send" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const Star = ({ size = 16, color = 'currentColor' }: IconProps) => (
  <Ionicons name="star" size={size} color={color === 'currentColor' ? colors.lime : color} />
);

export const Users = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <Feather name="users" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const Trophy = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <Ionicons name="trophy" size={size} color={color === 'currentColor' ? colors.lime : color} />
);

export const Home = ({ size = 24, color = 'currentColor' }: IconProps) => (
  <Ionicons name="home" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const Compass = ({ size = 24, color = 'currentColor' }: IconProps) => (
  <Ionicons name="compass" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const People = ({ size = 24, color = 'currentColor' }: IconProps) => (
  <Ionicons name="people" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const Stats = ({ size = 24, color = 'currentColor' }: IconProps) => (
  <Ionicons name="stats-chart" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const Mail = ({ size = 24, color = 'currentColor' }: IconProps) => (
  <Ionicons name="mail" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const Settings = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <Feather name="settings" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const LogOut = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <Feather name="log-out" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const Calendar = ({ size = 16, color = 'currentColor' }: IconProps) => (
  <Feather name="calendar" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const Eye = ({ size = 16, color = 'currentColor' }: IconProps) => (
  <Feather name="eye" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const EyeOff = ({ size = 16, color = 'currentColor' }: IconProps) => (
  <Feather name="eye-off" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const Share = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <Feather name="share-2" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const Edit = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <Feather name="edit-2" size={size} color={color === 'currentColor' ? colors.dark : color} />
);

export const Check = ({ size = 16, color = 'currentColor' }: IconProps) => (
  <Feather name="check" size={size} color={color === 'currentColor' ? colors.lime : color} />
);

// ICONS map (for backward compatibility with web app patterns)
export const ICONS = {
  Logo,
  MapPin,
  Clock,
  Plus,
  X,
  Menu,
  ChevronRight,
  ChevronLeft,
  UpArrow,
  Search,
  Filter,
  Send,
  Star,
  Users,
  Trophy,
  Home,
  Compass,
  People,
  Stats,
  Mail,
  Settings,
  LogOut,
  Calendar,
  Eye,
  EyeOff,
  Share,
  Edit,
  Check,
};

const styles = StyleSheet.create({
  logoContainer: {
    backgroundColor: colors.lime,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontWeight: '900',
    fontStyle: 'italic',
    color: colors.dark,
  },
});
