import React from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';

const iconMap: Record<string, string> = {
  'cut-outline': '✂',
  'cut': '✂',
  'happy-outline': '☺',
  'happy': '☺',
  'star-outline': '★',
  'star': '★',
  'star-half': '★',
  'search-outline': '⌕',
  'search': '⌕',
  'home-outline': '⌂',
  'home': '⌂',
  'person-outline': '♟',
  'person': '♟',
  'location-outline': '⊙',
  'location': '⊙',
  'navigate-outline': '➤',
  'time-outline': '◷',
  'call-outline': '✆',
  'calendar-outline': '▦',
  'arrow-back': '←',
  'arrow-forward': '→',
  'close-circle': '⊗',
  'checkmark-circle': '✓',
  'eye-outline': '◉',
  'water-outline': '♒',
  'color-palette-outline': '◈',
  'sunny-outline': '☀',
  'flame-outline': '♨',
  'flask-outline': '⚗',
  'diamond-outline': '◆',
  'shield-outline': '⛊',
  'brush-outline': '⊘',
  'beer-outline': '⊡',
  'ribbon-outline': '✦',
  'business-outline': '▣',
  'mail-outline': '✉',
  'lock-closed-outline': '⊞',
  'eye-off-outline': '◎',
  'log-out-outline': '⇥',
  'notifications-outline': '⊛',
  'camera': '◻',
  'pricetag-outline': '⊟',
  'logo-google': 'G',
  'logo-apple': '⌘',
  'logo-facebook': 'f',
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 20, color = '#fff' }: IconProps) {
  if (Platform.OS !== 'web') {
    const Ionicons = require('@expo/vector-icons').Ionicons;
    return <Ionicons name={name} size={size} color={color} />;
  }

  const char = iconMap[name] || '●';
  return (
    <Text style={{ fontSize: size * 0.85, color, lineHeight: size, textAlign: 'center', width: size }}>
      {char}
    </Text>
  );
}
