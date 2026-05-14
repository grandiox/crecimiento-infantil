import { Pressable, ScrollView, StyleSheet, Text, View, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/screen-container';
import { useData } from '@/lib/data-context';
import { useColors } from '@/hooks/use-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getAgeInMonths, getWHOData, interpolatePercentile, getPercentileCategory } from '@/lib/who-data';
import { PercentileCategory } from '@/types';

function formatAge(birthDate: string): string {
  const months = getAgeInMonths(birthDate);
  if (months < 1) return 'Recién nacido';
  if (months < 24) {
    const m = Math.floor(months);
    return `${m} ${m === 1 ? 'mes' : 'meses'}`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = Math.floor(months % 12);
  if (remainingMonths === 0) return `${years} ${years === 1 ? 'año' : 'años'}`;
  return `${years} años y ${remainingMonths} meses`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function PercentileTag({ category, label }: { category: PercentileCategory; label: string }) {
  const colors = useColors();
  const bgMap: Record<PercentileCategory, string> = {
    'critical-low': colors.error + '22',
    'low': colors.warning + '22',
    'normal': colors.success + '22',
    'high': colors.warning + '22',
    'critical-high': colors.error + '22',
  };
  const textMap: Record<PercentileCategory, string> = {
    'critical-low': colors.error,
    'low': colors.warning,
    'normal': colors.success,
    'high': colors.warning,
    'critical-high': colors.error,
  };
  return (
    <View style={[styles.percentileTag, { backgroundColor: bgMap[category] }]}>
      <Text style={[styles.percentileTagText, { color: textMap[category] }]}>{label}</Text>
    </View>
  );
}

export default function ChildProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { children, getChildMeasurements, deleteChild } = useData();

  const child = children.find(c => c.id === id);
  const measurements = getChildMeasurements(id || '');
  const lastMeasurement = measurements[0];

  if (!child) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text style={[styles.notFound, { color: colors.muted }]}>Niño no encontrado</Text>
          <Pressable style={({ pressed }) => [pressed && { opacity: 0.6 }]} onPress={() => router.back()}>
            <Text style={[styles.backLink, { color: colors.primary }]}>Volver</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const sexColor = child.sex === 'male' ? '#4A90D9' : '#E8709A';
  const sexLabel = child.sex === 'male' ? '♂ Masculino' : '♀ Femenino';

  // Calcular percentil del último peso
  let weightPercentile = null;
  let heightPercentile = null;
  if (lastMeasurement) {
    const ageMonths = getAgeInMonths(child.birthDate, lastMeasurement.date);
    if (lastMeasurement.weight) {
      const whoData = getWHOData('weight', child.sex);
      const ref = interpolatePercentile(whoData, ageMonths);
      if (ref) weightPercentile = getPercentileCategory(lastMeasurement.weight, ref);
    }
    if (lastMeasurement.height) {
      const whoData = getWHOData('height', child.sex);
      const ref = interpolatePercentile(whoData, ageMonths);
      if (ref) heightPercentile = getPercentileCategory(lastMeasurement.height, ref);
    }
  }

  function handleDelete() {
    Alert.alert(
      'Eliminar niño',
      `¿Estás seguro de que quieres eliminar a ${child!.name} y todos sus datos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteChild(child!.id);
            router.back();
          },
        },
      ]
    );
  }

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
          onPress={() => router.back()}
        >
          <IconSymbol name="arrow.left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{child.name}</Text>
        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
          onPress={handleDelete}
        >
          <IconSymbol name="trash.fill" size={20} color={colors.error} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tarjeta de perfil */}
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.bigAvatar, { backgroundColor: sexColor + '22' }]}>
            <Text style={[styles.bigAvatarText, { color: sexColor }]}>
              {child.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.profileName, { color: colors.foreground }]}>{child.name}</Text>
          <Text style={[styles.profileAge, { color: colors.muted }]}>{formatAge(child.birthDate)}</Text>
          <View style={[styles.sexPill, { backgroundColor: sexColor + '18' }]}>
            <Text style={[styles.sexPillText, { color: sexColor }]}>{sexLabel}</Text>
          </View>
          <Text style={[styles.birthDateText, { color: colors.muted }]}>
            Nacido el {formatDate(child.birthDate)}
          </Text>
        </View>

        {/* Última medida */}
        {lastMeasurement ? (
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Última medida</Text>
            <Text style={[styles.sectionDate, { color: colors.muted }]}>{formatDate(lastMeasurement.date)}</Text>
            <View style={styles.metricsGrid}>
              {lastMeasurement.weight && (
                <View style={[styles.metricCard, { backgroundColor: colors.background }]}>
                  <Text style={styles.metricEmoji}>⚖️</Text>
                  <Text style={[styles.metricValue, { color: colors.foreground }]}>{lastMeasurement.weight} kg</Text>
                  <Text style={[styles.metricLabel, { color: colors.muted }]}>Peso</Text>
                  {weightPercentile && <PercentileTag category={weightPercentile.category} label={weightPercentile.percentileApprox} />}
                </View>
              )}
              {lastMeasurement.height && (
                <View style={[styles.metricCard, { backgroundColor: colors.background }]}>
                  <Text style={styles.metricEmoji}>📏</Text>
                  <Text style={[styles.metricValue, { color: colors.foreground }]}>{lastMeasurement.height} cm</Text>
                  <Text style={[styles.metricLabel, { color: colors.muted }]}>Talla</Text>
                  {heightPercentile && <PercentileTag category={heightPercentile.category} label={heightPercentile.percentileApprox} />}
                </View>
              )}
              {lastMeasurement.headCircumference && (
                <View style={[styles.metricCard, { backgroundColor: colors.background }]}>
                  <Text style={styles.metricEmoji}>🧠</Text>
                  <Text style={[styles.metricValue, { color: colors.foreground }]}>{lastMeasurement.headCircumference} cm</Text>
                  <Text style={[styles.metricLabel, { color: colors.muted }]}>P. Cefálico</Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={[styles.noMeasureCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={styles.noMeasureEmoji}>📋</Text>
            <Text style={[styles.noMeasureText, { color: colors.muted }]}>
              Aún no hay medidas registradas. Toca "Registrar medida" para comenzar.
            </Text>
          </View>
        )}

        {/* Acciones */}
        <View style={styles.actionsGrid}>
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              { backgroundColor: colors.primary },
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push(`/child/${id}/add-measurement` as Href);
            }}
          >
            <IconSymbol name="plus.circle.fill" size={22} color="#fff" />
            <Text style={styles.actionBtnText}>Registrar medida</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionBtnOutline,
              { borderColor: colors.primary, backgroundColor: colors.surface },
              pressed && { opacity: 0.75 },
            ]}
            onPress={() => router.push(`/child/${id}/charts` as Href)}
          >
            <IconSymbol name="chart.line.uptrend.xyaxis" size={22} color={colors.primary} />
            <Text style={[styles.actionBtnOutlineText, { color: colors.primary }]}>Ver curvas</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionBtnOutline,
              { borderColor: colors.border, backgroundColor: colors.surface },
              pressed && { opacity: 0.75 },
            ]}
            onPress={() => router.push(`/child/${id}/history` as Href)}
          >
            <IconSymbol name="list.bullet" size={22} color={colors.muted} />
            <Text style={[styles.actionBtnOutlineText, { color: colors.muted }]}>Historial</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFound: { fontSize: 16 },
  backLink: { fontSize: 16, fontWeight: '600' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, gap: 16 },
  profileCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  bigAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  bigAvatarText: { fontSize: 36, fontWeight: '700' },
  profileName: { fontSize: 24, fontWeight: '700' },
  profileAge: { fontSize: 15 },
  sexPill: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  sexPillText: { fontSize: 14, fontWeight: '600' },
  birthDateText: { fontSize: 13 },
  section: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  sectionDate: { fontSize: 13 },
  metricsGrid: { flexDirection: 'row', gap: 10, marginTop: 4 },
  metricCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  metricEmoji: { fontSize: 22 },
  metricValue: { fontSize: 16, fontWeight: '700' },
  metricLabel: { fontSize: 12 },
  percentileTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 2,
  },
  percentileTagText: { fontSize: 11, fontWeight: '600' },
  noMeasureCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    gap: 8,
  },
  noMeasureEmoji: { fontSize: 36 },
  noMeasureText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  actionsGrid: { gap: 10 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 15,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  actionBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1.5,
  },
  actionBtnOutlineText: { fontSize: 15, fontWeight: '600' },
});
