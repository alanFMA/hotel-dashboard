import { useEffect, useState } from 'react';
import { getHotelByIdUseCase as defaultGetHotelByIdUseCase } from '../composition/container';
import type { Hotel } from '../../domain/entities/Hotel';
import type { GetHotelByIdUseCase } from '../../application/use-cases/GetHotelByIdUseCase';

export type UseHotelStatus = 'loading' | 'success' | 'error';

export interface UseHotelResult {
  hotel: Hotel | null;
  status: UseHotelStatus;
}

export function useHotel(
  id: string | undefined,
  getHotelById: GetHotelByIdUseCase = defaultGetHotelByIdUseCase,
): UseHotelResult {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [status, setStatus] = useState<UseHotelStatus>('loading');

  // Fetching a hotel by id is synchronizing with the Firestore-backed
  // repository (an external system), so the setState calls below are
  // intentional rather than the local-state-mirroring anti-pattern this
  // rule targets.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!id) {
      setStatus('error');
      return;
    }

    let active = true;
    setStatus('loading');

    getHotelById
      .execute(id)
      .then((result) => {
        if (active) {
          setHotel(result);
          setStatus('success');
        }
      })
      .catch(() => {
        if (active) {
          setStatus('error');
        }
      });

    return () => {
      active = false;
    };
  }, [id, getHotelById]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return { hotel, status };
}
