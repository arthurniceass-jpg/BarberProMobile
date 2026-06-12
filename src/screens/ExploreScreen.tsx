import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { barbershops } from '../data/barbershops';
import { useLocation } from '../hooks/useLocation';
import { calculateDistance, formatDistance } from '../utils/distance';
import { SearchBar } from '../components/SearchBar';
import { BarbershopCard } from '../components/BarbershopCard';
import { ExploreStackParamList } from '../navigation/types';
import { Barbershop } from '../types';

type Nav = NativeStackNavigationProp<ExploreStackParamList>;

type SortOption = 'rating' | 'distance' | 'price';

export function ExploreScreen() {
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [refreshing, setRefreshing] = useState(false);
  const location = useLocation();

  const getDistance = useCallback(
    (shop: Barbershop) =>
      location.latitude && location.longitude
        ? calculateDistance(location.latitude, location.longitude, shop.latitude, shop.longitude)
        : null,
    [location.latitude, location.longitude]
  );

  const filteredShops = useMemo(() => {
    let result = barbershops.filter(
      (shop) =>
        shop.name.toLowerCase().includes(search.toLowerCase()) ||
        shop.address.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'distance') {
      result.sort((a, b) => (getDistance(a) ?? 999) - (getDistance(b) ?? 999));
    } else if (sortBy === 'price') {
      result.sort((a, b) => a.priceRange.length - b.priceRange.length);
    }

    return result;
  }, [search, sortBy, getDistance]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Barbershop }) => {
      const dist = getDistance(item);
      return (
        <BarbershopCard
          shop={item}
          distance={dist != null ? formatDistance(dist) : null}
          onPress={() => navigation.navigate('BarbershopDetail', { shopId: item.id })}
        />
      );
    },
    [getDistance, navigation]
  );

  const keyExtractor = useCallback((item: Barbershop) => item.id, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorar</Text>
        <Text style={styles.subtitle}>{filteredShops.length} barbearias encontradas</Text>
      </View>

      <View style={styles.searchSection}>
        <SearchBar value={search} onChangeText={setSearch} />
      </View>

      <View style={styles.filterRow}>
        {(['rating', 'distance', 'price'] as SortOption[]).map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.filterChip, sortBy === option && styles.filterChipActive]}
            onPress={() => setSortBy(option)}
          >
            <Ionicons
              name={
                option === 'rating' ? 'star-outline' :
                option === 'distance' ? 'navigate-outline' : 'pricetag-outline'
              }
              size={14}
              color={sortBy === option ? colors.background : colors.textSecondary}
            />
            <Text style={[styles.filterText, sortBy === option && styles.filterTextActive]}>
              {option === 'rating' ? 'Avaliação' : option === 'distance' ? 'Distância' : 'Preço'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredShops}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={4}
        windowSize={5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>Nenhuma barbearia encontrada</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  searchSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.background,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textMuted,
  },
});
