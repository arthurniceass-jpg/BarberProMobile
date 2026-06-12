import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
}

export const SectionHeader = memo(({ title, actionText, onAction }: SectionHeaderProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {actionText && onAction && (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.action}>{actionText}</Text>
      </TouchableOpacity>
    )}
  </View>
));

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  action: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});
