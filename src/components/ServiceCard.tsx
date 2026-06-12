import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  selected?: boolean;
  onPress: () => void;
}

export const ServiceCard = memo(({ service, selected = false, onPress }: ServiceCardProps) => (
  <TouchableOpacity
    style={[styles.card, selected && styles.selectedCard]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.iconContainer, selected && styles.selectedIcon]}>
      <Ionicons name={service.icon as any} size={24} color={selected ? colors.background : colors.primary} />
    </View>
    <View style={styles.content}>
      <Text style={styles.name}>{service.name}</Text>
      <Text style={styles.description} numberOfLines={1}>{service.description}</Text>
      <View style={styles.footer}>
        <Text style={styles.price}>R$ {service.price.toFixed(2)}</Text>
        <View style={styles.duration}>
          <Ionicons name="time-outline" size={12} color={colors.textMuted} />
          <Text style={styles.durationText}>{service.duration} min</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceLight,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(212, 168, 83, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  selectedIcon: {
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  description: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
