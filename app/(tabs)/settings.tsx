import { Pressable, ScrollView, StyleSheet, Text, View, Switch } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { useThemeContext } from '@/lib/theme-provider';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';

function SettingRow({ icon, label, value, onPress, rightElement }: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}) {
  const colors = useColors();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.border },
        pressed && onPress ? { backgroundColor: colors.border + '40' } : {},
      ]}
      onPress={onPress}
      disabled={!onPress && !rightElement}
    >
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={[styles.rowLabel, { color: colors.foreground }]}>{label}</Text>
      {value && <Text style={[styles.rowValue, { color: colors.muted }]}>{value}</Text>}
      {rightElement}
      {onPress && <IconSymbol name="chevron.right" size={16} color={colors.muted} />}
    </Pressable>
  );
}

function SectionHeader({ title }: { title: string }) {
  const colors = useColors();
  return (
    <Text style={[styles.sectionHeader, { color: colors.muted }]}>{title.toUpperCase()}</Text>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const { colorScheme, setColorScheme } = useThemeContext();
  const isDark = colorScheme === 'dark';

  return (
    <ScreenContainer>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Ajustes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Apariencia */}
        <SectionHeader title="Apariencia" />
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingRow
            icon="🌙"
            label="Modo oscuro"
            rightElement={
              <Switch
                value={isDark}
                onValueChange={v => setColorScheme(v ? 'dark' : 'light')}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            }
          />
        </View>

        {/* Información */}
        <SectionHeader title="Información" />
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingRow icon="📊" label="Curvas de referencia" value="OMS 2006/2007" />
          <SettingRow icon="📏" label="Unidades" value="kg / cm" />
          <SettingRow icon="💾" label="Almacenamiento" value="Local (offline)" />
        </View>

        {/* Acerca de */}
        <SectionHeader title="Acerca de" />
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingRow icon="👶" label="Crecimiento Infantil" value="v1.0.0" />
          <SettingRow icon="🏥" label="Estándares OMS" value="0-5 años" />
        </View>

        {/* Nota informativa */}
        <View style={[styles.infoCard, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '40' }]}>
          <Text style={styles.infoEmoji}>ℹ️</Text>
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            Esta aplicación utiliza las curvas de crecimiento de la Organización Mundial de la Salud (OMS) como referencia. Los datos se almacenan localmente en tu dispositivo y no se comparten con terceros.
          </Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.warning + '12', borderColor: colors.warning + '40' }]}>
          <Text style={styles.infoEmoji}>⚠️</Text>
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            Esta app es una herramienta de seguimiento y no reemplaza la evaluación médica profesional. Consulta siempre con tu pediatra.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  content: {
    padding: 16,
    gap: 8,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    gap: 12,
  },
  rowIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  rowLabel: { flex: 1, fontSize: 15 },
  rowValue: { fontSize: 14 },
  infoCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginTop: 8,
  },
  infoEmoji: { fontSize: 18, marginTop: 1 },
  infoText: { flex: 1, fontSize: 13, lineHeight: 19 },
});
