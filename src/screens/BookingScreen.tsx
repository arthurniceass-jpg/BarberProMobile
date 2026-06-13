import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Icon } from '../components/Icon';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { barbershops } from '../data/barbershops';
import { BarberAvatar } from '../components/BarberAvatar';
import { BookingConfirmation } from '../components/BookingConfirmation';
import { HomeStackParamList } from '../navigation/types';
import { WebContainer } from '../components/WebContainer';

type RouteType = RouteProp<HomeStackParamList, 'Booking'>;

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
];

function getNextDays(count: number) {
  const days: { label: string; date: string; dayName: string }[] = [];
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      label: d.getDate().toString().padStart(2, '0'),
      date: d.toISOString().split('T')[0],
      dayName: i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : weekDays[d.getDay()],
    });
  }
  return days;
}

export function BookingScreen() {
  const route = useRoute<RouteType>();
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const shop = useMemo(
    () => barbershops.find((s) => s.id === route.params.shopId),
    [route.params.shopId]
  );

  const service = useMemo(
    () => shop?.services.find((s) => s.id === route.params.serviceId),
    [shop, route.params.serviceId]
  );

  const days = useMemo(() => getNextDays(7), []);

  const canBook = selectedDate && selectedTime && selectedBarber;

  const handleConfirm = useCallback(() => {
    setShowConfirmation(true);
  }, []);

  const handleCloseConfirmation = useCallback(() => {
    setShowConfirmation(false);
    navigation.goBack();
  }, [navigation]);

  if (!shop || !service) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Dados não encontrados</Text>
      </View>
    );
  }

  const barber = shop.barbers.find((b) => b.id === selectedBarber);
  const dateLabel = days.find((d) => d.date === selectedDate);

  return (
    <WebContainer>
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.serviceInfo}>
          <View style={styles.serviceIconBox}>
            <Icon name={service.icon} size={28} color={colors.primary} />
          </View>
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.shopNameText}>{shop.name}</Text>
            <View style={styles.serviceMetaRow}>
              <Text style={styles.servicePrice}>R$ {service.price.toFixed(2)}</Text>
              <View style={styles.durationRow}>
                <Icon name="time-outline" size={14} color={colors.textMuted} />
                <Text style={styles.durationText}>{service.duration} min</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Escolha o Dia</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysRow}>
          {days.map((day) => (
            <TouchableOpacity
              key={day.date}
              style={[styles.dayCard, selectedDate === day.date && styles.dayCardActive]}
              onPress={() => setSelectedDate(day.date)}
            >
              <Text style={[styles.dayName, selectedDate === day.date && styles.dayTextActive]}>
                {day.dayName}
              </Text>
              <Text style={[styles.dayNumber, selectedDate === day.date && styles.dayTextActive]}>
                {day.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Escolha o Horário</Text>
        <View style={styles.timesGrid}>
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={[styles.timeChip, selectedTime === time && styles.timeChipActive]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[styles.timeText, selectedTime === time && styles.timeTextActive]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Escolha o Barbeiro</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {shop.barbers.map((b) => (
            <BarberAvatar
              key={b.id}
              barber={b}
              selected={selectedBarber === b.id}
              onPress={() => setSelectedBarber(b.id)}
            />
          ))}
        </ScrollView>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.confirmButton, !canBook && styles.confirmButtonDisabled]}
          disabled={!canBook}
          onPress={handleConfirm}
          activeOpacity={0.8}
        >
          <Icon name="calendar-outline" size={20} color={colors.background} />
          <Text style={styles.confirmButtonText}>Confirmar Agendamento</Text>
        </TouchableOpacity>
      </View>

      <BookingConfirmation
        visible={showConfirmation}
        shopName={shop.name}
        serviceName={service.name}
        barberName={barber?.name ?? ''}
        date={dateLabel ? `${dateLabel.dayName}, ${dateLabel.label}` : ''}
        time={selectedTime ?? ''}
        onClose={handleCloseConfirmation}
      />
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
  content: {
    padding: spacing.xl,
    paddingBottom: 100,
  },
  serviceInfo: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceIconBox: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(212, 168, 83, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  shopNameText: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  serviceMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  daysRow: {
    marginBottom: spacing.sm,
  },
  dayCard: {
    width: 70,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayName: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
  },
  dayTextActive: {
    color: colors.background,
  },
  timesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  timeTextActive: {
    color: colors.background,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.sm,
  },
  confirmButtonDisabled: {
    opacity: 0.4,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },
});
