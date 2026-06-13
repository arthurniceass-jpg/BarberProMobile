import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, TextInput, Switch, StyleSheet, Alert,
} from 'react-native';
import { Icon } from '../components/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { useCamera } from '../hooks/useCamera';
import { Appointment } from '../types';
import { WebContainer } from '../components/WebContainer';

const mockAppointments: Appointment[] = [
  { id: 'a1', shopId: '1', shopName: 'Barbearia Premium', serviceName: 'Corte Executivo', barberName: 'Carlos Silva', date: '2026-06-15', time: '10:00', status: 'upcoming' },
  { id: 'a2', shopId: '5', shopName: 'The King Barber', serviceName: 'Combo Royal', barberName: 'Eduardo Reis', date: '2026-06-18', time: '14:30', status: 'upcoming' },
  { id: 'a3', shopId: '2', shopName: 'Don Juan Barber', serviceName: 'Barba Navalhada', barberName: 'Fernando Costa', date: '2026-06-01', time: '11:00', status: 'completed' },
  { id: 'a4', shopId: '7', shopName: 'El Patrón Barbearia', serviceName: 'Combo El Patrón', barberName: 'Matheus Souza', date: '2026-05-20', time: '16:00', status: 'completed' },
];

export function ProfileScreen() {
  const { photoUri, setPhotoUri, pickImage } = useCamera();
  const [name, setName] = useState('Arthur');
  const [email, setEmail] = useState('arthur@email.com');
  const [phone, setPhone] = useState('(11) 99999-0000');
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('profilePhoto').then((uri) => {
      if (uri) setPhotoUri(uri);
    });
  }, []);

  useEffect(() => {
    if (photoUri) {
      AsyncStorage.setItem('profilePhoto', photoUri);
    }
  }, [photoUri]);

  const upcomingAppointments = mockAppointments.filter((a) => a.status === 'upcoming');
  const pastAppointments = mockAppointments.filter((a) => a.status === 'completed');

  return (
    <WebContainer>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
          <View style={styles.avatarContainer}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Icon name="camera" size={32} color={colors.primary} />
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Icon name="camera" size={14} color={colors.background} />
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.photoHint}>Toque para alterar a foto</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados Pessoais</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nome</Text>
          <View style={styles.inputContainer}>
            <Icon name="person-outline" size={18} color={colors.textMuted} />
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor={colors.textMuted} />
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputContainer}>
            <Icon name="mail-outline" size={18} color={colors.textMuted} />
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" placeholderTextColor={colors.textMuted} />
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Telefone</Text>
          <View style={styles.inputContainer}>
            <Icon name="call-outline" size={18} color={colors.textMuted} />
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor={colors.textMuted} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximos Agendamentos</Text>
        {upcomingAppointments.map((apt) => (
          <AppointmentCard key={apt.id} appointment={apt} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Histórico</Text>
        {pastAppointments.map((apt) => (
          <AppointmentCard key={apt.id} appointment={apt} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Icon name="notifications-outline" size={20} color={colors.primary} />
            <Text style={styles.settingText}>Notificações</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: colors.border, true: colors.primaryDark }}
            thumbColor={notifications ? colors.primary : colors.textMuted}
          />
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => Alert.alert('Logout', 'Funcionalidade demonstrativa')}
        >
          <Icon name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>BarberPro Mobile v1.0.0</Text>
      <View style={{ height: spacing.xxxl }} />
    </ScrollView>
    </WebContainer>
  );
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const isUpcoming = appointment.status === 'upcoming';
  return (
    <View style={styles.appointmentCard}>
      <View style={[styles.statusDot, isUpcoming ? styles.upcomingDot : styles.completedDot]} />
      <View style={styles.appointmentContent}>
        <Text style={styles.appointmentShop}>{appointment.shopName}</Text>
        <Text style={styles.appointmentService}>{appointment.serviceName} com {appointment.barberName}</Text>
        <View style={styles.appointmentMeta}>
          <Icon name="calendar-outline" size={12} color={colors.textMuted} />
          <Text style={styles.appointmentDate}>{appointment.date}</Text>
          <Icon name="time-outline" size={12} color={colors.textMuted} />
          <Text style={styles.appointmentDate}>{appointment.time}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoHint: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    paddingVertical: spacing.md,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.md,
  },
  upcomingDot: {
    backgroundColor: colors.primary,
  },
  completedDot: {
    backgroundColor: colors.success,
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentShop: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  appointmentService: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  appointmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  appointmentDate: {
    fontSize: 12,
    color: colors.textMuted,
    marginRight: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingText: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.error,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xxl,
  },
});
