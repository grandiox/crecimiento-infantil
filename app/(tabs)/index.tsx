import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { useData } from '@/lib/data-context';
import { Child } from '@/types';
import { getAgeInMonths } from '@/lib/who-data';
import { useColors } from '@/hooks/use-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';

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
  return `${years} a ${remainingMonths} m`;
}

function ChildCard({ child }: { child: Child }) {
  const router = useRouter();
  const colors = useColors();
  const { getChildMeasurements } = useData();
  const measurements = getChildMeasurements(child.id);
  const lastMeasurement = measurements[0];

  const sexColor = child.sex === 'male' ? '#4A90D9' : '#E8709A';
  const sexLabel = child.sex === 'male' ? '♂' : '♀';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && { opacity: 0.75 },
      ]}
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/child/${child.id}` as Href);
      }}
    >
      <View style={[styles.avatar, { backgroundColor: sexColor + '22' }]}>
        <Text style={[styles.avatarText, { color: sexColor }]}>
          {child.name.charAt(0).toUpperCase()}
        </Text>
        <Text style={[styles.sexBadge, { color: sexColor }]}>{sexLabel}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.childName, { color: colors.foreground }]}>{child.name}</Text>
        <Text style={[styles.childAge, { color: colors.muted }]}>{formatAge(child.birthDate)}</Text>
        {lastMeasurement ? (
          <View style={styles.lastMeasure}>
            {lastMeasurement.weight && (
              <View style={[styles.measureBadge, { backgroundColor: colors.primary + '22' }]}>
                <Text style={[styles.measureBadgeText, { color: colors.primary }]}>
                  {lastMeasurement.weight} kg
                </Text>
              </View>
            )}
            {lastMeasurement.height && (
              <View style={[styles.measureBadge, { backgroundColor: colors.primary + '22' }]}>
                <Text style={[styles.measureBadgeText, { color: colors.primary }]}>
                  {lastMeasurement.height} cm
                </Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={[styles.noMeasure, { color: colors.muted }]}>Sin medidas aún</Text>
        )}
      </View>
      <IconSymbol name="chevron.right" size={20} color={colors.muted} />
    </Pressable>
  );
}

function EmptyState() {
  const colors = useColors();
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>👶</Text>
      <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
        Aún no hay niños registrados
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
        Toca el botón + para agregar el primer niño y comenzar el seguimiento de su crecimiento.
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { children, isLoading } = useData();

  return (
    <ScreenContainer>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Mis Niños</Text>
          <Text style={[styles.headerSubtitle, { color: colors.muted }]}>
            {children.length === 0
              ? 'Comienza el seguimiento'
              : `${children.length} ${children.length === 1 ? 'niño registrado' : 'niños registrados'}`}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] },
          ]}
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/child/add' as Href);
          }}
        >
          <IconSymbol name="plus" size={22} color="#fff" />
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptySubtitle, { color: colors.muted }]}>Cargando...</Text>
        </View>
      ) : children.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={children}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ChildCard child={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
  },
  sexBadge: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: -2,
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  childName: {
    fontSize: 17,
    fontWeight: '600',
  },
  childAge: {
    fontSize: 13,
  },
  lastMeasure: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  measureBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  measureBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  noMeasure: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
