import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { Barber } from '../types';

interface BarberAvatarProps {
  barber: Barber;
  size?: number;
  selected?: boolean;
  onPress?: () => void;
}

export const BarberAvatar = memo(({ barber, size = 70, selected = false, onPress }: BarberAvatarProps) => (
  <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
    <View style={[
      styles.avatarWrapper,
      { width: size + 4, height: size + 4 },
      selected && styles.selectedWrapper,
    ]}>
      <Image source={{ uri: barber.avatar }} style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]} />
    </View>
    <Text style={styles.name} numberOfLines={1}>{barber.name.split(' ')[0]}</Text>
    <View style={styles.ratingRow}>
      <Ionicons name="star" size={10} color={colors.star} />
      <Text style={styles.rating}>{barber.rating.toFixed(1)}</Text>
    </View>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: spacing.lg,
    width: 80,
  },
  avatarWrapper: {
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedWrapper: {
    borderColor: colors.primary,
  },
  avatar: {
    backgroundColor: colors.surfaceLight,
  },
  name: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  rating: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
