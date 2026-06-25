import { useCallback, useEffect, useState } from 'react';
import {
  createHotelUseCase as defaultCreateHotelUseCase,
  deleteHotelUseCase as defaultDeleteHotelUseCase,
  getFilteredHotelsUseCase as defaultGetFilteredHotelsUseCase,
  updateHotelUseCase as defaultUpdateHotelUseCase,
} from '../composition/container';
import type { Hotel } from '../../domain/entities/Hotel';
import type { CreateHotelInput } from '../../application/use-cases/CreateHotelUseCase';
import type { CreateHotelUseCase } from '../../application/use-cases/CreateHotelUseCase';
import type { DeleteHotelUseCase } from '../../application/use-cases/DeleteHotelUseCase';
import type {
  GetFilteredHotelsUseCase,
  HotelFilterCriteria,
} from '../../application/use-cases/GetFilteredHotelsUseCase';
import type { UpdateHotelInput, UpdateHotelUseCase } from '../../application/use-cases/UpdateHotelUseCase';

export type HotelDashboardStatus = 'loading' | 'success' | 'error';

export interface UseHotelDashboardDeps {
  getFilteredHotels: GetFilteredHotelsUseCase;
  createHotel: CreateHotelUseCase;
  updateHotel: UpdateHotelUseCase;
  deleteHotel: DeleteHotelUseCase;
}

const defaultDeps: UseHotelDashboardDeps = {
  getFilteredHotels: defaultGetFilteredHotelsUseCase,
  createHotel: defaultCreateHotelUseCase,
  updateHotel: defaultUpdateHotelUseCase,
  deleteHotel: defaultDeleteHotelUseCase,
};

export interface UseHotelDashboardResult {
  status: HotelDashboardStatus;
  hotels: Hotel[];
  error: string | null;
  filters: HotelFilterCriteria;
  applyFilters: (filters: HotelFilterCriteria) => void;
  createHotel: (input: CreateHotelInput) => Promise<void>;
  updateHotel: (id: string, changes: UpdateHotelInput) => Promise<void>;
  deleteHotel: (id: string) => Promise<void>;
}

export function useHotelDashboard(
  deps: UseHotelDashboardDeps = defaultDeps,
): UseHotelDashboardResult {
  const [status, setStatus] = useState<HotelDashboardStatus>('loading');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<HotelFilterCriteria>({});

  const load = useCallback(
    async (criteria: HotelFilterCriteria) => {
      setStatus('loading');
      try {
        const result = await deps.getFilteredHotels.execute(criteria);
        setHotels(result);
        setStatus('success');
        setError(null);
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : 'Failed to load hotels.');
        setStatus('error');
      }
    },
    [deps],
  );

  useEffect(() => {
    // Fetching hotels is synchronizing with the Firestore-backed repository
    // (an external system), not mirroring local state, so the async setState
    // here is intentional rather than the anti-pattern this rule targets.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(filters);
  }, [filters, load]);

  const applyFilters = useCallback((nextFilters: HotelFilterCriteria) => {
    setFilters(nextFilters);
  }, []);

  const createHotel = useCallback(
    async (input: CreateHotelInput) => {
      await deps.createHotel.execute(input);
      await load(filters);
    },
    [deps, filters, load],
  );

  const updateHotel = useCallback(
    async (id: string, changes: UpdateHotelInput) => {
      await deps.updateHotel.execute(id, changes);
      await load(filters);
    },
    [deps, filters, load],
  );

  const deleteHotel = useCallback(
    async (id: string) => {
      await deps.deleteHotel.execute(id);
      await load(filters);
    },
    [deps, filters, load],
  );

  return { status, hotels, error, filters, applyFilters, createHotel, updateHotel, deleteHotel };
}
