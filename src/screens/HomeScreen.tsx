import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, StatusBar,
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

type Nav = NativeStackNavigationProp<HomeStackParamList>;

const popularServices = [
  { icon: 'cut-outline', label: 'Corte' },
  { icon: 'happy-outline', label: 'Barba' },
  { icon: 'star-outline', label: 'Combo' },
  { icon: 'color-palette-outline', label: 'Pigmentação' },
  { icon: 'water-outline', label: 'Hidratação' },
  { icon: 'sunny-outline', label: 'Luzes' },
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
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
        <View style={styles.servicesGrid}>
          {popularServices.map((svc) => (
            <TouchableOpacity key={svc.label} style={styles.serviceItem} activeOpacity={0.7}>
              <View style={styles.serviceIcon}>
                <Ionicons name={svc.icon as any} size={26} color={colors.primary} />
              </View>
              <Text style={styles.serviceLabel}>{svc.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  );
}

function NearbyCard({ shop, distance, onPress }: { shop: Barbershop; distance: string | null; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.nearbyCard} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: shop.image }} style={styles.nearbyImage} />
      <View style={styles.nearbyContent}>
        <Text style={styles.nearbyName} numberOfLines={1}>{shop.name}</Text>
        <RatingStars rating={shop.rating} size={11} />
        {distance && (
          <View style={styles.nearbyDistance}>
            <Ionicons name="navigate-outline" size={11} color={colors.primary} />
            <Text style={styles.nearbyDistText}>{distance}</Text>
          </View>
        )}
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
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  serviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(212, 168, 83, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  serviceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  nearbyCard: {
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nearbyImage: {
    width: '100%',
    height: 100,
  },
  nearbyContent: {
    padding: spacing.sm,
  },
  nearbyName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  nearbyDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  nearbyDistText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
});
