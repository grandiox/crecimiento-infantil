import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Child, Measurement } from '@/types';

const CHILDREN_KEY = '@crecimiento:children';
const MEASUREMENTS_KEY = '@crecimiento:measurements';

interface DataContextValue {
  children: Child[];
  measurements: Record<string, Measurement[]>;
  addChild: (child: Child) => Promise<void>;
  updateChild: (child: Child) => Promise<void>;
  deleteChild: (childId: string) => Promise<void>;
  addMeasurement: (measurement: Measurement) => Promise<void>;
  deleteMeasurement: (childId: string, measurementId: string) => Promise<void>;
  getChildMeasurements: (childId: string) => Measurement[];
  isLoading: boolean;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children: reactChildren }: { children: React.ReactNode }) {
  const [children, setChildren] = useState<Child[]>([]);
  const [measurements, setMeasurements] = useState<Record<string, Measurement[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [childrenRaw, measurementsRaw] = await Promise.all([
        AsyncStorage.getItem(CHILDREN_KEY),
        AsyncStorage.getItem(MEASUREMENTS_KEY),
      ]);
      if (childrenRaw) setChildren(JSON.parse(childrenRaw));
      if (measurementsRaw) setMeasurements(JSON.parse(measurementsRaw));
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveChildren = async (updated: Child[]) => {
    setChildren(updated);
    await AsyncStorage.setItem(CHILDREN_KEY, JSON.stringify(updated));
  };

  const saveMeasurements = async (updated: Record<string, Measurement[]>) => {
    setMeasurements(updated);
    await AsyncStorage.setItem(MEASUREMENTS_KEY, JSON.stringify(updated));
  };

  const addChild = useCallback(async (child: Child) => {
    const updated = [...children, child];
    await saveChildren(updated);
  }, [children]);

  const updateChild = useCallback(async (child: Child) => {
    const updated = children.map(c => c.id === child.id ? child : c);
    await saveChildren(updated);
  }, [children]);

  const deleteChild = useCallback(async (childId: string) => {
    const updatedChildren = children.filter(c => c.id !== childId);
    const updatedMeasurements = { ...measurements };
    delete updatedMeasurements[childId];
    await saveChildren(updatedChildren);
    await saveMeasurements(updatedMeasurements);
  }, [children, measurements]);

  const addMeasurement = useCallback(async (measurement: Measurement) => {
    const childMeasurements = measurements[measurement.childId] || [];
    const updated = {
      ...measurements,
      [measurement.childId]: [...childMeasurements, measurement].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    };
    await saveMeasurements(updated);
  }, [measurements]);

  const deleteMeasurement = useCallback(async (childId: string, measurementId: string) => {
    const childMeasurements = (measurements[childId] || []).filter(m => m.id !== measurementId);
    const updated = { ...measurements, [childId]: childMeasurements };
    await saveMeasurements(updated);
  }, [measurements]);

  const getChildMeasurements = useCallback((childId: string): Measurement[] => {
    return (measurements[childId] || []).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [measurements]);

  return (
    <DataContext.Provider value={{
      children,
      measurements,
      addChild,
      updateChild,
      deleteChild,
      addMeasurement,
      deleteMeasurement,
      getChildMeasurements,
      isLoading,
    }}>
      {reactChildren}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
