import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/screen-container';
import { useData } from '@/lib/data-context';
import { Measurement } from '@/types';
import { useColors } from '@/hooks/use-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getTodayStr(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function parseDate(dateStr: string): string {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function validateDate(dateStr: string): boolean {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateStr)) return false;
  const [day, month, year] = dateStr.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) return false;
  if (date > new Date()) return false;
  return true;
}

interface MeasurementField {
  label: string;
  placeholder: string;
  unit: string;
  emoji: string;
  min: number;
  max: number;
}

const FIELDS: Record<string, MeasurementField> = {
  weight: { label: 'Peso', placeholder: 'Ej: 8.5', unit: 'kg', emoji: '⚖️', min: 0.5, max: 200 },
  height: { label: 'Talla', placeholder: 'Ej: 72', unit: 'cm', emoji: '📏', min: 20, max: 250 },
  headCircumference: { label: 'Perímetro cefálico', placeholder: 'Ej: 44', unit: 'cm', emoji: '🧠', min: 20, max: 70 },
};

export default function AddMeasurementScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { children, addMeasurement } = useData();

  const child = children.find(c => c.id === id);

  const [date, setDate] = useState(getTodayStr());
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [headCircumference, setHeadCircumference] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSave() {
    const newErrors: Record<string, string> = {};

    if (!validateDate(date)) newErrors.date = 'Formato inválido. Usa DD/MM/AAAA';

    const weightNum = weight ? parseFloat(weight.replace(',', '.')) : undefined;
    const heightNum = height ? parseFloat(height.replace(',', '.')) : undefined;
    const headNum = headCircumference ? parseFloat(headCircumference.replace(',', '.')) : undefined;

    if (weight && (isNaN(weightNum!) || weightNum! < 0.5 || weightNum! > 200)) {
      newErrors.weight = 'Peso inválido (0.5 - 200 kg)';
    }
    if (height && (isNaN(heightNum!) || heightNum! < 20 || heightNum! > 250)) {
      newErrors.height = 'Talla inválida (20 - 250 cm)';
    }
    if (headCircumference && (isNaN(headNum!) || headNum! < 20 || headNum! > 70)) {
      newErrors.headCircumference = 'Valor inválido (20 - 70 cm)';
    }

    if (!weight && !height && !headCircumference) {
      newErrors.general = 'Ingresa al menos una medida';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const measurement: Measurement = {
      id: generateId(),
      childId: id!,
      date: parseDate(date),
      weight: weightNum,
      height: heightNum,
      headCircumference: headNum,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    await addMeasurement(measurement);
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  return (
    <ScreenContainer>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
          onPress={() => router.back()}
        >
          <IconSymbol name="xmark" size={22} color={colors.muted} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Nueva Medida</Text>
          {child && <Text style={[styles.headerSub, { color: colors.muted }]}>{child.name}</Text>}
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        {/* Fecha */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>📅 Fecha de la medida</Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.foreground, backgroundColor: colors.surface, borderColor: errors.date ? colors.error : colors.border },
            ]}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={colors.muted}
            value={date}
            onChangeText={t => {
              let cleaned = t.replace(/[^0-9]/g, '');
              if (cleaned.length > 2 && cleaned.length <= 4) cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
              else if (cleaned.length > 4) cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
              setDate(cleaned);
              setErrors(e => ({ ...e, date: '' }));
            }}
            keyboardType="numeric"
            maxLength={10}
            returnKeyType="next"
          />
          {errors.date ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.date}</Text> : null}
        </View>

        {/* Peso */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>⚖️ Peso (kg)</Text>
          <View style={styles.inputWithUnit}>
            <TextInput
              style={[
                styles.inputUnit,
                { color: colors.foreground, backgroundColor: colors.surface, borderColor: errors.weight ? colors.error : colors.border },
              ]}
              placeholder="Ej: 8.5"
              placeholderTextColor={colors.muted}
              value={weight}
              onChangeText={t => { setWeight(t); setErrors(e => ({ ...e, weight: '', general: '' })); }}
              keyboardType="decimal-pad"
              returnKeyType="next"
            />
            <View style={[styles.unitBadge, { backgroundColor: colors.primary + '18' }]}>
              <Text style={[styles.unitText, { color: colors.primary }]}>kg</Text>
            </View>
          </View>
          {errors.weight ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.weight}</Text> : null}
        </View>

        {/* Talla */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>📏 Talla (cm)</Text>
          <View style={styles.inputWithUnit}>
            <TextInput
              style={[
                styles.inputUnit,
                { color: colors.foreground, backgroundColor: colors.surface, borderColor: errors.height ? colors.error : colors.border },
              ]}
              placeholder="Ej: 72"
              placeholderTextColor={colors.muted}
              value={height}
              onChangeText={t => { setHeight(t); setErrors(e => ({ ...e, height: '', general: '' })); }}
              keyboardType="decimal-pad"
              returnKeyType="next"
            />
            <View style={[styles.unitBadge, { backgroundColor: colors.primary + '18' }]}>
              <Text style={[styles.unitText, { color: colors.primary }]}>cm</Text>
            </View>
          </View>
          {errors.height ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.height}</Text> : null}
        </View>

        {/* Perímetro cefálico */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>🧠 Perímetro cefálico (cm)</Text>
          <View style={styles.inputWithUnit}>
            <TextInput
              style={[
                styles.inputUnit,
                { color: colors.foreground, backgroundColor: colors.surface, borderColor: errors.headCircumference ? colors.error : colors.border },
              ]}
              placeholder="Ej: 44"
              placeholderTextColor={colors.muted}
              value={headCircumference}
              onChangeText={t => { setHeadCircumference(t); setErrors(e => ({ ...e, headCircumference: '', general: '' })); }}
              keyboardType="decimal-pad"
              returnKeyType="next"
            />
            <View style={[styles.unitBadge, { backgroundColor: colors.primary + '18' }]}>
              <Text style={[styles.unitText, { color: colors.primary }]}>cm</Text>
            </View>
          </View>
          {errors.headCircumference ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.headCircumference}</Text> : null}
        </View>

        {/* Notas */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>📝 Notas (opcional)</Text>
          <TextInput
            style={[
              styles.textArea,
              { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            placeholder="Observaciones del médico, contexto..."
            placeholderTextColor={colors.muted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            returnKeyType="done"
          />
        </View>

        {errors.general ? (
          <View style={[styles.generalError, { backgroundColor: colors.error + '18', borderColor: colors.error }]}>
            <Text style={[styles.generalErrorText, { color: colors.error }]}>{errors.general}</Text>
          </View>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.saveBtn,
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>Guardar Medida</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  form: { padding: 20, gap: 18 },
  fieldGroup: { gap: 8 },
  label: { fontSize: 15, fontWeight: '600' },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputWithUnit: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  inputUnit: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  unitBadge: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 52,
    alignItems: 'center',
  },
  unitText: { fontSize: 15, fontWeight: '700' },
  textArea: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: { fontSize: 13, marginTop: 2 },
  generalError: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  generalErrorText: { fontSize: 14, fontWeight: '500' },
  saveBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
