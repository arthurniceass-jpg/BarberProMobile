import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from './Icon';
import { colors } from '../theme/colors';

interface RatingStarsProps {
  rating: number;
  size?: number;
  showNumber?: boolean;
}

export const RatingStars = memo(({ rating, size = 14, showNumber = true }: RatingStarsProps) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <View style={styles.container}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon
          key={i}
          name={i < fullStars ? 'star' : i === fullStars && hasHalf ? 'star-half' : 'star-outline'}
          size={size}
          color={colors.star}
        />
      ))}
      {showNumber && <Text style={[styles.text, { fontSize: size }]}>{rating.toFixed(1)}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  text: {
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: '600',
  },
});
