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
  { icon: 'cut', label: 'Corte', desc: 'Degradê, social, moderno', avg: 'R$ 45', color: '#D4A853' },
  { icon: 'happy', label: 'Barba', desc: 'Navalhada, design, completa', avg: 'R$ 35', color: '#4CAF50' },
  { icon: 'star', label: 'Combo', desc: 'Corte + barba + extras', avg: 'R$ 80', color: '#2196F3' },
  { icon: 'color-palette', label: 'Pigmentação', desc: 'Coloração capilar', avg: 'R$ 90', color: '#9C27B0' },
  { icon: 'water', label: 'Hidratação', desc: 'Tratamento profundo', avg: 'R$ 50', color: '#00BCD4' },
  { icon: 'sunny', label: 'Luzes', desc: 'Mechas e reflexos', avg: 'R$ 120', color: '#FF9800' },
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
      <View style={styles.headerSection}>
        <View>
          <Text style={styles.greeting}>Olá! 👋</Text>
          <Text style={styles.subtitle}>Encontre a barbearia perfeita</Text>
        </View>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={24} color={colors.primary} />
        </View>
      </View>

      <View style={styles.section}>
        <SearchBar value={search} onChangeText={setSearch} />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Serviços Populares" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {popularServices.map((svc) => (
            <TouchableOpacity key={svc.label} style={styles.serviceCard} activeOpacity={0.7}>
              <View style={[styles.serviceIconWrap, { backgroundColor: svc.color + '20' }]}>
                <Ionicons name={svc.icon as any} size={28} color={svc.color} />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceLabel}>{svc.label}</Text>
                <Text style={styles.serviceDesc} numberOfLines={1}>{svc.desc}</Text>
              </View>
              <View style={styles.serviceAvgContainer}>
                <Text style={styles.serviceAvgLabel}>a partir de</Text>
                <Text style={styles.serviceAvg}>{svc.avg}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Perto de Você"
          actionText="Ver todos"
          onAction={() => navigation.getParent()?.navigate('ExploreTab')}
        />
        {location.loading ? (
          <Text style={styles.loadingText}>Obtendo localização...</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {nearbyShops.map(({ shop, dist }) => (
              <NearbyCard
                key={shop.id}
                shop={shop}
                distance={dist != null ? formatDistance(dist) : null}
                onPress={() => navigateToShop(shop.id)}
              />
            ))}
          </ScrollView>
        )}
      </View>

      <View style={[styles.section, { marginBottom: spacing.xxxl }]}>
        <SectionHeader title="Mais Bem Avaliadas" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {topRated.map((shop) => (
            <NearbyCard
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

function NearbyCard({ shop, distance, onPress }: { shop: Barbershop; distance: string | null; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.nearbyCard} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: shop.image }} style={styles.nearbyImage} />
      <View style={styles.nearbyOverlay}>
        <View style={[styles.nearbyBadge, shop.isOpen ? styles.nearbyOpen : styles.nearbyClosed]}>
          <View style={[styles.nearbyDot, { backgroundColor: shop.isOpen ? colors.success : colors.error }]} />
          <Text style={[styles.nearbyBadgeText, { color: shop.isOpen ? colors.success : colors.error }]}>
            {shop.isOpen ? 'Aberto' : 'Fechado'}
          </Text>
        </View>
      </View>
      <View style={styles.nearbyContent}>
        <Text style={styles.nearbyName} numberOfLines={1}>{shop.name}</Text>
        <View style={styles.nearbyRatingRow}>
          <RatingStars rating={shop.rating} size={11} />
          <Text style={styles.nearbyReviews}>({shop.reviewsCount})</Text>
        </View>
        <View style={styles.nearbyAddressRow}>
          <Ionicons name="location-outline" size={11} color={colors.textMuted} />
          <Text style={styles.nearbyAddress} numberOfLines={1}>{shop.address.split(' - ')[0]}</Text>
        </View>
        <View style={styles.nearbyFooter}>
          <Text style={styles.nearbyPrice}>{shop.priceRange}</Text>
          {distance && (
            <View style={styles.nearbyDistance}>
              <Ionicons name="navigate-outline" size={11} color={colors.primary} />
              <Text style={styles.nearbyDistText}>{distance}</Text>
            </View>
          )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 15,
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
  section: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  serviceCard: {
    width: 200,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  serviceIconWrap: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  serviceInfo: {
    marginBottom: spacing.md,
  },
  serviceLabel: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  serviceDesc: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3,
  },
  serviceAvgContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  serviceAvgLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  serviceAvg: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '800',
    marginTop: 2,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  nearbyCard: {
    width: 180,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  nearbyImage: {
    width: '100%',
    height: 110,
  },
  nearbyOverlay: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  nearbyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  nearbyOpen: {},
  nearbyClosed: {},
  nearbyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  nearbyBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  nearbyContent: {
    padding: spacing.md,
  },
  nearbyName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  nearbyRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nearbyReviews: {
    fontSize: 10,
    color: colors.textMuted,
  },
  nearbyAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 6,
  },
  nearbyAddress: {
    fontSize: 11,
    color: colors.textMuted,
    flex: 1,
  },
  nearbyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  nearbyPrice: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
  nearbyDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  nearbyDistText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
});
