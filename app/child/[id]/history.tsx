import { FlatList, Pressable, StyleSheet, Text, View, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/screen-container';
import { useData } from '@/lib/data-context';
import { useColors } from '@/hooks/use-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Measurement } from '@/types';
import { getAgeInMonths } from '@/lib/who-data';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatAgeAtMeasure(birthDate: string, measureDate: string): string {
  const months = getAgeInMonths(birthDate, measureDate);
  if (months < 1) return 'Recién nacido';
  if (months < 24) {
    const m = Math.floor(months);
    return `${m} ${m === 1 ? 'mes' : 'meses'}`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = Math.floor(months % 12);
  if (remainingMonths === 0) return `${years} ${years === 1 ? 'año' : 'años'}`;
  return `${years}a ${remainingMonths}m`;
}

function MeasurementItem({ measurement, birthDate, onDelete }: {
  measurement: Measurement;
  birthDate: string;
  onDelete: () => void;
}) {
  const colors = useColors();

  return (
    <View style={[styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.itemHeader}>
        <View>
          <Text style={[styles.itemDate, { color: colors.foreground }]}>{formatDate(measurement.date)}</Text>
          <Text style={[styles.itemAge, { color: colors.muted }]}>
            Edad: {formatAgeAtMeasure(birthDate, measurement.date)}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.6 }]}
          onPress={onDelete}
        >
          <IconSymbol name="trash.fill" size={16} color={colors.error} />
        </Pressable>
      </View>

      <View style={styles.metricsRow}>
        {measurement.weight !== undefined && (
          <View style={[styles.metricChip, { backgroundColor: colors.primary + '18' }]}>
            <Text style={styles.metricChipEmoji}>⚖️</Text>
            <Text style={[styles.metricChipValue, { color: colors.primary }]}>{measurement.weight} kg</Text>
          </View>
        )}
        {measurement.height !== undefined && (
          <View style={[styles.metricChip, { backgroundColor: colors.primary + '18' }]}>
            <Text style={styles.metricChipEmoji}>📏</Text>
            <Text style={[styles.metricChipValue, { color: colors.primary }]}>{measurement.height} cm</Text>
          </View>
        )}
        {measurement.headCircumference !== undefined && (
          <View style={[styles.metricChip, { backgroundColor: colors.primary + '18' }]}>
            <Text style={styles.metricChipEmoji}>🧠</Text>
            <Text style={[styles.metricChipValue, { color: colors.primary }]}>{measurement.headCircumference} cm</Text>
          </View>
        )}
      </View>

      {measurement.notes && (
        <Text style={[styles.notes, { color: colors.muted }]}>📝 {measurement.notes}</Text>
      )}
    </View>
  );
}

export default function HistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { children, getChildMeasurements, deleteMeasurement } = useData();

  const child = children.find(c => c.id === id);
  const measurements = getChildMeasurements(id || '');

  function handleDelete(measurementId: string) {
    Alert.alert(
      'Eliminar medida',
      '¿Estás seguro de que quieres eliminar esta medida?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await deleteMeasurement(id!, measurementId);
          },
        },
      ]
    );
  }

  if (!child) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text style={{ color: colors.muted }}>Niño no encontrado</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
          onPress={() => router.back()}
        >
          <IconSymbol name="arrow.left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Historial</Text>
          <Text style={[styles.headerSub, { color: colors.muted }]}>{child.name}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {measurements.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Sin medidas registradas</Text>
          <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
            Registra la primera medida desde el perfil de {child.name}.
          </Text>
        </View>
      ) : (
        <FlatList
          data={measurements}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MeasurementItem
              measurement={item}
              birthDate={child.birthDate}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={[styles.totalText, { color: colors.muted }]}>
              {measurements.length} {measurements.length === 1 ? 'medida registrada' : 'medidas registradas'}
            </Text>
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  headerSub: { fontSize: 13, marginTop: 1 },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16, gap: 12 },
  totalText: { fontSize: 13, marginBottom: 4 },
  item: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemDate: { fontSize: 15, fontWeight: '600' },
  itemAge: { fontSize: 13, marginTop: 2 },
  deleteBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metricChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  metricChipEmoji: { fontSize: 14 },
  metricChipValue: { fontSize: 14, fontWeight: '600' },
  notes: { fontSize: 13, lineHeight: 18 },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 8,
  },
  emptyEmoji: { fontSize: 56, marginBottom: 8 },
  emptyTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  emptySubtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
});
