import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/screen-container';
import { useData } from '@/lib/data-context';
import { Child, Sex } from '@/types';
import { useColors } from '@/hooks/use-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function AddChildScreen() {
  const router = useRouter();
  const colors = useColors();
  const { addChild } = useData();

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [sex, setSex] = useState<Sex>('male');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateDate(dateStr: string): boolean {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dateStr)) return false;
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return false;
    if (date > new Date()) return false;
    if (year < 1900) return false;
    return true;
  }

  function parseDateInput(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  async function handleSave() {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!birthDate.trim()) {
      newErrors.birthDate = 'La fecha de nacimiento es obligatoria';
    } else if (!validateDate(birthDate)) {
      newErrors.birthDate = 'Formato inválido. Usa DD/MM/AAAA';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const child: Child = {
      id: generateId(),
      name: name.trim(),
      birthDate: parseDateInput(birthDate),
      sex,
      createdAt: new Date().toISOString(),
    };

    await addChild(child);
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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Agregar Niño</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        {/* Nombre */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>Nombre completo</Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.foreground, backgroundColor: colors.surface, borderColor: errors.name ? colors.error : colors.border },
            ]}
            placeholder="Ej: María García"
            placeholderTextColor={colors.muted}
            value={name}
            onChangeText={t => { setName(t); setErrors(e => ({ ...e, name: '' })); }}
            returnKeyType="next"
            autoCapitalize="words"
          />
          {errors.name ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.name}</Text> : null}
        </View>

        {/* Fecha de nacimiento */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>Fecha de nacimiento</Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.foreground, backgroundColor: colors.surface, borderColor: errors.birthDate ? colors.error : colors.border },
            ]}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={colors.muted}
            value={birthDate}
            onChangeText={t => {
              let cleaned = t.replace(/[^0-9]/g, '');
              if (cleaned.length > 2 && cleaned.length <= 4) cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
              else if (cleaned.length > 4) cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
              setBirthDate(cleaned);
              setErrors(e => ({ ...e, birthDate: '' }));
            }}
            keyboardType="numeric"
            maxLength={10}
            returnKeyType="done"
          />
          {errors.birthDate ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.birthDate}</Text> : null}
        </View>

        {/* Sexo */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>Sexo</Text>
          <View style={styles.sexRow}>
            <Pressable
              style={({ pressed }) => [
                styles.sexBtn,
                { borderColor: sex === 'male' ? '#4A90D9' : colors.border, backgroundColor: sex === 'male' ? '#4A90D9' + '18' : colors.surface },
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => setSex('male')}
            >
              <Text style={[styles.sexBtnText, { color: sex === 'male' ? '#4A90D9' : colors.muted }]}>♂ Masculino</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.sexBtn,
                { borderColor: sex === 'female' ? '#E8709A' : colors.border, backgroundColor: sex === 'female' ? '#E8709A' + '18' : colors.surface },
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => setSex('female')}
            >
              <Text style={[styles.sexBtnText, { color: sex === 'female' ? '#E8709A' : colors.muted }]}>♀ Femenino</Text>
            </Pressable>
          </View>
        </View>

        {/* Botón guardar */}
        <Pressable
          style={({ pressed }) => [
            styles.saveBtn,
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>Guardar Niño</Text>
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
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    padding: 20,
    gap: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  errorText: {
    fontSize: 13,
    marginTop: 2,
  },
  sexRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sexBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  sexBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  saveBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
