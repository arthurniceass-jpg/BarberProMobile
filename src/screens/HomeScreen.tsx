import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { barbershops } from '../data/barbershops';
import { useLocation } from '../hooks/useLocation';
import { calculateDistance, formatDistance } from '../utils/distance';
import { SearchBar } from '../components/SearchBar';
import { SectionHeader } from '../components/SectionHeader';
import { RatingStars } from '../components/RatingStars';
import { HomeStackParamList } from '../navigation/types';
import { Barbershop } from '../types';
import { WebContainer } from '../components/WebContainer';

type Nav = NativeStackNavigationProp<HomeStackParamList>;

const popularServices = [
  { emoji: '✂️', label: 'Corte', desc: 'Degradê, social, moderno', avg: 'R$ 45', color: '#D4A853' },
  { emoji: '🧔', label: 'Barba', desc: 'Navalhada, design, completa', avg: 'R$ 35', color: '#4CAF50' },
  { emoji: '⭐', label: 'Combo', desc: 'Corte + barba + extras', avg: 'R$ 80', color: '#2196F3' },
  { emoji: '🎨', label: 'Pigmentação', desc: 'Coloração capilar', avg: 'R$ 90', color: '#9C27B0' },
  { emoji: '💧', label: 'Hidratação', desc: 'Tratamento profundo', avg: 'R$ 50', color: '#00BCD4' },
  { emoji: '✨', label: 'Luzes', desc: 'Mechas e reflexos', avg: 'R$ 120', color: '#FF9800' },
];

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState('');
  const location = useLocation();

  const shopsWithDistance = useMemo(() => {
    return barbershops.map((shop) => {
      const dist =
        location.latitude && location.longitude
          ? calculateDistance(location.latitude, location.longitude, shop.latitude, shop.longitude)
          : null;
      return { shop, dist };
    });
  }, [location.latitude, location.longitude]);

  const nearbyShops = useMemo(() => {
    return [...shopsWithDistance]
      .filter(({ shop }) => shop.isOpen)
      .sort((a, b) => (a.dist ?? 999) - (b.dist ?? 999))
      .slice(0, 5);
  }, [shopsWithDistance]);

  const topRated = useMemo(() => {
    return [...barbershops]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }, []);

  const navigateToShop = (shopId: string) => {
    navigation.navigate('BarbershopDetail', { shopId });
  };

  return (
    <WebContainer>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerSection}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>BarberPro</Text>
            <Text style={styles.subtitle}>Encontre a barbearia perfeita</Text>
          </View>
          <View style={styles.avatarPlaceholder}>
            <Text style={{ fontSize: 22 }}>👤</Text>
          </View>
        </View>

        {/* Location indicator */}
        <View style={styles.locationBar}>
          <Text style={{ fontSize: 14 }}>📍</Text>
          <Text style={styles.locationText}>
            {location.loading
              ? 'Obtendo localização...'
              : location.error
              ? 'Localização indisponível'
              : 'Recife, PE'}
          </Text>
          {!location.loading && !location.error && (
            <View style={styles.locationDot} />
          )}
        </View>
      </View>

      {/* Search */}
      <View style={styles.section}>
        <SearchBar value={search} onChangeText={setSearch} />
      </View>

      {/* Banner */}
      <View style={styles.section}>
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTag}>OFERTA ESPECIAL</Text>
            <Text style={styles.bannerTitle}>Primeiro corte com{'\n'}20% de desconto</Text>
            <TouchableOpacity style={styles.bannerButton} activeOpacity={0.8}>
              <Text style={styles.bannerButtonText}>Agendar agora</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.bannerEmoji}>💈</Text>
        </View>
      </View>

      {/* Popular Services */}
      <View style={styles.section}>
        <SectionHeader title="Serviços Populares" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {popularServices.map((svc) => (
            <TouchableOpacity key={svc.label} style={styles.serviceCard} activeOpacity={0.7}>
              <View style={[styles.serviceIconWrap, { backgroundColor: svc.color + '20' }]}>
                <Text style={styles.serviceEmoji}>{svc.emoji}</Text>
              </View>
              <Text style={styles.serviceLabel}>{svc.label}</Text>
              <Text style={styles.serviceDesc} numberOfLines={2}>{svc.desc}</Text>
              <View style={styles.serviceAvgContainer}>
                <Text style={styles.serviceAvgLabel}>A PARTIR DE</Text>
                <Text style={[styles.serviceAvg, { color: svc.color }]}>{svc.avg}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12+</Text>
            <Text style={styles.statLabel}>Barbearias</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Barbeiros</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.7</Text>
            <Text style={styles.statLabel}>Avaliação</Text>
          </View>
        </View>
      </View>

      {/* Nearby */}
      <View style={styles.section}>
        <SectionHeader
          title="Perto de Você"
          actionText="Ver todos"
          onAction={() => navigation.getParent()?.navigate('ExploreTab')}
        />
        {location.loading ? (
          <View style={styles.loadingContainer}>
            <Text style={{ fontSize: 24 }}>📍</Text>
            <Text style={styles.loadingText}>Obtendo sua localização...</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {nearbyShops.map(({ shop, dist }) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                distance={dist != null ? formatDistance(dist) : null}
                onPress={() => navigateToShop(shop.id)}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Top Rated */}
      <View style={[styles.section, { marginBottom: 40 }]}>
        <SectionHeader title="Mais Bem Avaliadas" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {topRated.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              distance={null}
              onPress={() => navigateToShop(shop.id)}
            />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
    </WebContainer>
  );
}

function ShopCard({ shop, distance, onPress }: { shop: Barbershop; distance: string | null; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.shopCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.shopImageContainer}>
        <Image source={{ uri: shop.image }} style={styles.shopImage} />
        <View style={styles.shopImageOverlay} />
        <View style={[styles.shopBadge, shop.isOpen ? styles.shopOpen : styles.shopClosed]}>
          <View style={[styles.shopDot, { backgroundColor: shop.isOpen ? '#4CAF50' : '#F44336' }]} />
          <Text style={[styles.shopBadgeText, { color: shop.isOpen ? '#4CAF50' : '#F44336' }]}>
            {shop.isOpen ? 'Aberto' : 'Fechado'}
          </Text>
        </View>
        {distance && (
          <View style={styles.shopDistanceBadge}>
            <Text style={styles.shopDistanceText}>{distance}</Text>
          </View>
        )}
      </View>
      <View style={styles.shopContent}>
        <View style={styles.shopNameRow}>
          <Text style={styles.shopName} numberOfLines={1}>{shop.name}</Text>
          <Text style={styles.shopPrice}>{shop.priceRange}</Text>
        </View>
        <View style={styles.shopRatingRow}>
          <RatingStars rating={shop.rating} size={11} />
          <Text style={styles.shopReviews}>({shop.reviewsCount})</Text>
        </View>
        <View style={styles.shopAddressRow}>
          <Text style={{ fontSize: 10 }}>📍</Text>
          <Text style={styles.shopAddress} numberOfLines={1}>
            {shop.address.split(' - ')[0]}
          </Text>
        </View>
        <View style={styles.shopServicesRow}>
          <Text style={styles.shopServicesCount}>
            {shop.services.length} serviços • {shop.barbers.length} barbeiros
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: Platform.OS === 'web' ? spacing.xxl : spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginTop: spacing.lg,
    gap: spacing.sm,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xxl,
  },

  // Banner
  banner: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary + '30',
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTag: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 26,
  },
  bannerButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: spacing.md,
  },
  bannerButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.background,
  },
  bannerEmoji: {
    fontSize: 64,
    marginLeft: spacing.md,
  },

  // Services
  serviceCard: {
    width: 150,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceIconWrap: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  serviceEmoji: {
    fontSize: 24,
  },
  serviceLabel: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: 2,
  },
  serviceDesc: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 15,
    marginBottom: spacing.md,
  },
  serviceAvgContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  serviceAvgLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  serviceAvg: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: 2,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },

  // Loading
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 14,
  },

  // Shop Cards
  shopCard: {
    width: 220,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shopImageContainer: {
    position: 'relative',
  },
  shopImage: {
    width: '100%',
    height: 130,
  },
  shopImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'transparent',
  },
  shopBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  shopOpen: {},
  shopClosed: {},
  shopDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  shopBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  shopDistanceBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  shopDistanceText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.background,
  },
  shopContent: {
    padding: spacing.md,
  },
  shopNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  shopPrice: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
  },
  shopRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  shopReviews: {
    fontSize: 10,
    color: colors.textMuted,
  },
  shopAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  shopAddress: {
    fontSize: 11,
    color: colors.textMuted,
    flex: 1,
  },
  shopServicesRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  shopServicesCount: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
