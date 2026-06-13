import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from './Icon';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { RatingStars } from './RatingStars';
import { Barbershop } from '../types';

interface BarbershopCardProps {
  shop: Barbershop;
  distance?: string | null;
  onPress: () => void;
}

export const BarbershopCard = memo(({ shop, distance, onPress }: BarbershopCardProps) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    <Image source={{ uri: shop.image }} style={styles.image} />
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>{shop.name}</Text>
        <Text style={styles.price}>{shop.priceRange}</Text>
      </View>
      <RatingStars rating={shop.rating} size={12} />
      <View style={styles.info}>
        <Icon name="location-outline" size={14} color={colors.textMuted} />
        <Text style={styles.address} numberOfLines={1}>{shop.address}</Text>
      </View>
      <View style={styles.footer}>
        <View style={[styles.badge, shop.isOpen ? styles.openBadge : styles.closedBadge]}>
          <Text style={[styles.badgeText, shop.isOpen ? styles.openText : styles.closedText]}>
            {shop.isOpen ? 'Aberto' : 'Fechado'}
          </Text>
        </View>
        {distance && (
          <View style={styles.distanceContainer}>
            <Icon name="navigate-outline" size={12} color={colors.primary} />
            <Text style={styles.distance}>{distance}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  image: {
    width: 110,
    height: 130,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  price: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  address: {
    fontSize: 12,
    color: colors.textMuted,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  openBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  closedBadge: {
    backgroundColor: 'rgba(244, 67, 54, 0.15)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  openText: {
    color: colors.success,
  },
  closedText: {
    color: colors.error,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
});
