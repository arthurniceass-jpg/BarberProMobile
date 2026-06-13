import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from './Icon';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';

interface BookingConfirmationProps {
  visible: boolean;
  shopName: string;
  serviceName: string;
  barberName: string;
  date: string;
  time: string;
  onClose: () => void;
}

export function BookingConfirmation({
  visible, shopName, serviceName, barberName, date, time, onClose,
}: BookingConfirmationProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.iconContainer}>
            <Icon name="checkmark-circle" size={64} color={colors.success} />
          </View>
          <Text style={styles.title}>Agendamento Confirmado!</Text>
          <Text style={styles.subtitle}>Seu horário foi reservado com sucesso</Text>

          <View style={styles.details}>
            <DetailRow icon="business-outline" label="Barbearia" value={shopName} />
            <DetailRow icon="cut-outline" label="Serviço" value={serviceName} />
            <DetailRow icon="person-outline" label="Barbeiro" value={barberName} />
            <DetailRow icon="calendar-outline" label="Data" value={date} />
            <DetailRow icon="time-outline" label="Horário" value={time} />
          </View>

          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Icon name={icon} size={18} color={colors.primary} />
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  details: {
    width: '100%',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    fontSize: 14,
    color: colors.textMuted,
  },
  value: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxxl,
    borderRadius: borderRadius.sm,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
});
