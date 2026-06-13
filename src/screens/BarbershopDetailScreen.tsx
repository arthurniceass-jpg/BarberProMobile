import React, { useMemo, useState } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, useWindowDimensions, Linking, Platform,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon } from '../components/Icon';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { barbershops } from '../data/barbershops';
import { RatingStars } from '../components/RatingStars';
import { ServiceCard } from '../components/ServiceCard';
import { BarberAvatar } from '../components/BarberAvatar';
import { HomeStackParamList } from '../navigation/types';
import { WebContainer } from '../components/WebContainer';

type RouteType = RouteProp<HomeStackParamList, 'BarbershopDetail'>;
type Nav = NativeStackNavigationProp<HomeStackParamList>;

export function BarbershopDetailScreen() {
  const route = useRoute<RouteType>();
  const navigation = useNavigation<Nav>();
  const { width: screenWidth } = useWindowDimensions();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const shop = useMemo(
    () => barbershops.find((s) => s.id === route.params.shopId),
    [route.params.shopId]
  );

  if (!shop) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Barbearia não encontrada</Text>
      </View>
    );
  }

  return (
    <WebContainer>
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroContainer}>
          <Image source={{ uri: shop.image }} style={[styles.heroImage, { width: screenWidth }]} />
          <View style={styles.heroOverlay} />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.nameRow}>
            <Text style={styles.shopName}>{shop.name}</Text>
            <View style={[styles.badge, shop.isOpen ? styles.openBadge : styles.closedBadge]}>
              <Text style={[styles.badgeText, shop.isOpen ? styles.openText : styles.closedText]}>
                {shop.isOpen ? 'Aberto' : 'Fechado'}
              </Text>
            </View>
          </View>

          <View style={styles.ratingRow}>
            <RatingStars rating={shop.rating} size={16} />
            <Text style={styles.reviews}>({shop.reviewsCount} avaliações)</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="location-outline" size={18} color={colors.primary} />
            <Text style={styles.detailText}>{shop.address}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="time-outline" size={18} color={colors.primary} />
            <Text style={styles.detailText}>{shop.openHours}</Text>
          </View>
          <TouchableOpacity
            style={styles.detailRow}
            onPress={() => Linking.openURL(`tel:${shop.phone}`)}
          >
            <Icon name="call-outline" size={18} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.primary }]}>{shop.phone}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Serviços</Text>
          {shop.services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              selected={selectedService === service.id}
              onPress={() => setSelectedService(
                selectedService === service.id ? null : service.id
              )}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nossos Barbeiros</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {shop.barbers.map((barber) => (
              <BarberAvatar key={barber.id} barber={barber} />
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          {selectedService && (
            <Text style={styles.selectedInfo}>
              {shop.services.find((s) => s.id === selectedService)?.name}
            </Text>
          )}
          <Text style={styles.priceText}>
            {selectedService
              ? `R$ ${shop.services.find((s) => s.id === selectedService)?.price.toFixed(2)}`
              : 'Selecione um serviço'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.bookButton, !selectedService && styles.bookButtonDisabled]}
          disabled={!selectedService}
          onPress={() =>
            navigation.navigate('Booking', {
              shopId: shop.id,
              serviceId: selectedService ?? undefined,
            })
          }
          activeOpacity={0.8}
        >
          <Text style={styles.bookButtonText}>Agendar</Text>
          <Icon name="arrow-forward" size={20} color={colors.background} />
        </TouchableOpacity>
      </View>
    </View>
    </WebContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.textMuted,
    fontSize: 16,
  },
  heroContainer: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 220,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    padding: spacing.xl,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  shopName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  openBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  closedBadge: {
    backgroundColor: 'rgba(244, 67, 54, 0.15)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  openText: {
    color: colors.success,
  },
  closedText: {
    color: colors.error,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  reviews: {
    fontSize: 13,
    color: colors.textMuted,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: spacing.xxl,
  },
  selectedInfo: {
    fontSize: 12,
    color: colors.textMuted,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.sm,
  },
  bookButtonDisabled: {
    opacity: 0.4,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },
});
