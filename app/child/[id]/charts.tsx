import { Pressable, ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useMemo } from 'react';
import Svg, { Line, Path, Circle, Text as SvgText, G } from 'react-native-svg';

import { ScreenContainer } from '@/components/screen-container';
import { useData } from '@/lib/data-context';
import { useColors } from '@/hooks/use-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getWHOData, getAgeInMonths, interpolatePercentile } from '@/lib/who-data';
import { ChartType } from '@/types';

const CHART_TYPES: { key: ChartType; label: string; unit: string; emoji: string }[] = [
  { key: 'weight', label: 'Peso/Edad', unit: 'kg', emoji: '⚖️' },
  { key: 'height', label: 'Talla/Edad', unit: 'cm', emoji: '📏' },
  { key: 'headCircumference', label: 'P. Cef./Edad', unit: 'cm', emoji: '🧠' },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 32;
const CHART_HEIGHT = 260;
const PAD = { top: 16, right: 16, bottom: 40, left: 44 };
const PLOT_W = CHART_WIDTH - PAD.left - PAD.right;
const PLOT_H = CHART_HEIGHT - PAD.top - PAD.bottom;

function scaleX(ageMonths: number, minAge: number, maxAge: number): number {
  return PAD.left + ((ageMonths - minAge) / (maxAge - minAge)) * PLOT_W;
}

function scaleY(value: number, minVal: number, maxVal: number): number {
  return PAD.top + PLOT_H - ((value - minVal) / (maxVal - minVal)) * PLOT_H;
}

function buildPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
}

interface GrowthChartProps {
  chartType: ChartType;
  sex: 'male' | 'female';
  childPoints: { ageMonths: number; value: number }[];
}

function GrowthChart({ chartType, sex, childPoints }: GrowthChartProps) {
  const colors = useColors();
  const whoData = getWHOData(chartType, sex);

  const allAges = whoData.map(d => d.ageMonths);
  const minAge = Math.min(...allAges);
  const maxAge = Math.max(...allAges);

  const allValues = [
    ...whoData.map(d => d.p3),
    ...whoData.map(d => d.p97),
    ...childPoints.map(p => p.value),
  ];
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const padding = (rawMax - rawMin) * 0.1;
  const minVal = Math.max(0, rawMin - padding);
  const maxVal = rawMax + padding;

  const sx = (age: number) => scaleX(age, minAge, maxAge);
  const sy = (val: number) => scaleY(val, minVal, maxVal);

  // Build percentile paths
  const p3Path = buildPath(whoData.map(d => ({ x: sx(d.ageMonths), y: sy(d.p3) })));
  const p15Path = buildPath(whoData.map(d => ({ x: sx(d.ageMonths), y: sy(d.p15) })));
  const p50Path = buildPath(whoData.map(d => ({ x: sx(d.ageMonths), y: sy(d.p50) })));
  const p85Path = buildPath(whoData.map(d => ({ x: sx(d.ageMonths), y: sy(d.p85) })));
  const p97Path = buildPath(whoData.map(d => ({ x: sx(d.ageMonths), y: sy(d.p97) })));

  // Child path
  const childPath = buildPath(childPoints.map(p => ({ x: sx(p.ageMonths), y: sy(p.value) })));

  // Y axis ticks
  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => minVal + (i / yTicks) * (maxVal - minVal));

  // X axis ticks (every 6 months or 12 months)
  const xStep = maxAge <= 24 ? 3 : maxAge <= 60 ? 6 : 12;
  const xTicks: number[] = [];
  for (let age = minAge; age <= maxAge; age += xStep) xTicks.push(age);

  const isDark = colors.background === '#121A17';

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
      {/* Grid lines */}
      {yTickValues.map((val, i) => (
        <G key={`ygrid-${i}`}>
          <Line
            x1={PAD.left} y1={sy(val)}
            x2={PAD.left + PLOT_W} y2={sy(val)}
            stroke={isDark ? '#2E4A3A' : '#E5F0EA'}
            strokeWidth={1}
          />
          <SvgText
            x={PAD.left - 6}
            y={sy(val) + 4}
            fontSize={9}
            fill={isDark ? '#8AADA0' : '#6B8C7A'}
            textAnchor="end"
          >
            {val.toFixed(1)}
          </SvgText>
        </G>
      ))}

      {/* X axis ticks */}
      {xTicks.map((age, i) => (
        <G key={`xtick-${i}`}>
          <Line
            x1={sx(age)} y1={PAD.top + PLOT_H}
            x2={sx(age)} y2={PAD.top + PLOT_H + 4}
            stroke={isDark ? '#8AADA0' : '#6B8C7A'}
            strokeWidth={1}
          />
          <SvgText
            x={sx(age)}
            y={PAD.top + PLOT_H + 14}
            fontSize={9}
            fill={isDark ? '#8AADA0' : '#6B8C7A'}
            textAnchor="middle"
          >
            {age < 24 ? `${age}m` : `${Math.floor(age / 12)}a`}
          </SvgText>
        </G>
      ))}

      {/* Axes */}
      <Line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + PLOT_H} stroke={isDark ? '#2E4A3A' : '#D4E8DC'} strokeWidth={1.5} />
      <Line x1={PAD.left} y1={PAD.top + PLOT_H} x2={PAD.left + PLOT_W} y2={PAD.top + PLOT_H} stroke={isDark ? '#2E4A3A' : '#D4E8DC'} strokeWidth={1.5} />

      {/* Percentile curves */}
      <Path d={p3Path} stroke="#EF4444" strokeWidth={1.5} fill="none" strokeDasharray="4,3" opacity={0.8} />
      <Path d={p15Path} stroke="#F59E0B" strokeWidth={1.5} fill="none" strokeDasharray="4,3" opacity={0.8} />
      <Path d={p50Path} stroke="#4CAF82" strokeWidth={2} fill="none" />
      <Path d={p85Path} stroke="#F59E0B" strokeWidth={1.5} fill="none" strokeDasharray="4,3" opacity={0.8} />
      <Path d={p97Path} stroke="#EF4444" strokeWidth={1.5} fill="none" strokeDasharray="4,3" opacity={0.8} />

      {/* Child line */}
      {childPath && (
        <Path d={childPath} stroke="#1A2E24" strokeWidth={2.5} fill="none" opacity={isDark ? 0.9 : 1} />
      )}

      {/* Child points */}
      {childPoints.map((p, i) => (
        <Circle
          key={`cp-${i}`}
          cx={sx(p.ageMonths)}
          cy={sy(p.value)}
          r={5}
          fill={isDark ? '#E8F5EE' : '#1A2E24'}
          stroke={isDark ? '#121A17' : '#fff'}
          strokeWidth={2}
        />
      ))}
    </Svg>
  );
}

export default function ChartsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { children, getChildMeasurements } = useData();

  const [activeChart, setActiveChart] = useState<ChartType>('weight');

  const child = children.find(c => c.id === id);
  const measurements = getChildMeasurements(id || '');

  const childPoints = useMemo(() => {
    if (!child) return [];
    return measurements
      .filter(m => {
        if (activeChart === 'weight') return m.weight !== undefined;
        if (activeChart === 'height') return m.height !== undefined;
        if (activeChart === 'headCircumference') return m.headCircumference !== undefined;
        return false;
      })
      .map(m => {
        const ageMonths = getAgeInMonths(child.birthDate, m.date);
        const value = activeChart === 'weight' ? m.weight! : activeChart === 'height' ? m.height! : m.headCircumference!;
        return { ageMonths, value };
      })
      .sort((a, b) => a.ageMonths - b.ageMonths);
  }, [child, measurements, activeChart]);

  const activeChartInfo = CHART_TYPES.find(c => c.key === activeChart)!;

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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Curvas de Crecimiento</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Selector de tipo de gráfica */}
        <View style={styles.chartSelector}>
          {CHART_TYPES.map(ct => (
            <Pressable
              key={ct.key}
              style={({ pressed }) => [
                styles.chartTab,
                {
                  backgroundColor: activeChart === ct.key ? colors.primary : colors.surface,
                  borderColor: activeChart === ct.key ? colors.primary : colors.border,
                },
                pressed && { opacity: 0.75 },
              ]}
              onPress={() => setActiveChart(ct.key)}
            >
              <Text style={styles.chartTabEmoji}>{ct.emoji}</Text>
              <Text style={[styles.chartTabText, { color: activeChart === ct.key ? '#fff' : colors.muted }]}>
                {ct.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Gráfica */}
        <View style={[styles.chartContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.chartTitle, { color: colors.foreground }]}>
            {activeChartInfo.emoji} {activeChartInfo.label} — {child.name}
          </Text>
          <Text style={[styles.chartSubtitle, { color: colors.muted }]}>
            {child.sex === 'male' ? 'Niño' : 'Niña'} · Curvas OMS
          </Text>
          <View style={styles.chartWrapper}>
            <GrowthChart chartType={activeChart} sex={child.sex} childPoints={childPoints} />
          </View>

          {/* Leyenda */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendLine, { backgroundColor: '#EF4444' }]} />
              <Text style={[styles.legendText, { color: colors.muted }]}>P3 / P97</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendLine, { backgroundColor: '#F59E0B' }]} />
              <Text style={[styles.legendText, { color: colors.muted }]}>P15 / P85</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendLine, { backgroundColor: '#4CAF82' }]} />
              <Text style={[styles.legendText, { color: colors.muted }]}>P50</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.foreground }]} />
              <Text style={[styles.legendText, { color: colors.muted }]}>{child.name}</Text>
            </View>
          </View>
        </View>

        {/* Estado vacío */}
        {childPoints.length === 0 && (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              No hay medidas de {activeChartInfo.label.toLowerCase()} registradas aún.
            </Text>
          </View>
        )}

        {/* Tabla de percentiles de referencia */}
        <View style={[styles.refCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.refTitle, { color: colors.foreground }]}>Interpretación de percentiles</Text>
          {[
            { range: '< P3', label: 'Muy bajo', color: colors.error },
            { range: 'P3 – P15', label: 'Bajo', color: colors.warning },
            { range: 'P15 – P85', label: 'Normal', color: colors.success },
            { range: 'P85 – P97', label: 'Alto', color: colors.warning },
            { range: '> P97', label: 'Muy alto', color: colors.error },
          ].map(item => (
            <View key={item.range} style={styles.refRow}>
              <View style={[styles.refDot, { backgroundColor: item.color }]} />
              <Text style={[styles.refRange, { color: colors.muted }]}>{item.range}</Text>
              <Text style={[styles.refLabel, { color: colors.foreground }]}>{item.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
  headerTitle: { fontSize: 17, fontWeight: '600' },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, gap: 16 },
  chartSelector: { flexDirection: 'row', gap: 8 },
  chartTab: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 3,
  },
  chartTabEmoji: { fontSize: 18 },
  chartTabText: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  chartContainer: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: { fontSize: 15, fontWeight: '700' },
  chartSubtitle: { fontSize: 12 },
  chartWrapper: { marginTop: 4 },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
    paddingTop: 8,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendLine: { width: 20, height: 3, borderRadius: 2 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11 },
  emptyCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    gap: 8,
  },
  emptyEmoji: { fontSize: 36 },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  refCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  refTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  refRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  refDot: { width: 10, height: 10, borderRadius: 5 },
  refRange: { fontSize: 13, width: 80 },
  refLabel: { fontSize: 13, fontWeight: '600' },
});
