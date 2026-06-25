import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hotel } from '../../domain/entities/Hotel';
import { CreateHotelUseCase } from '../../application/use-cases/CreateHotelUseCase';
import { UpdateHotelUseCase } from '../../application/use-cases/UpdateHotelUseCase';
import { DeleteHotelUseCase } from '../../application/use-cases/DeleteHotelUseCase';
import { GetFilteredHotelsUseCase } from '../../application/use-cases/GetFilteredHotelsUseCase';
import { InMemoryHotelRepository } from '../../test/doubles/InMemoryHotelRepository';
import { useHotelDashboard } from './useHotelDashboard';

const oceanCliff = Hotel.create({
  id: 'hotel-1',
  name: 'Ocean Cliff Resort',
  description: 'A serene cliffside escape with panoramic ocean views.',
  location: 'Florianópolis, Brazil',
  pricePerNight: 1250,
  starRating: 5,
  imageUrl: 'https://example.com/ocean-cliff.jpg',
  reviewScore: 9.4,
});

const cityCenterInn = Hotel.create({
  id: 'hotel-2',
  name: 'City Center Inn',
  description: 'A practical stay close to the financial district.',
  location: 'São Paulo, Brazil',
  pricePerNight: 320,
  starRating: 3,
  imageUrl: 'https://example.com/city-center.jpg',
  reviewScore: 7.1,
});

function buildDeps() {
  const repository = new InMemoryHotelRepository();
  return {
    repository,
    deps: {
      getFilteredHotels: new GetFilteredHotelsUseCase(repository),
      createHotel: new CreateHotelUseCase(repository, () => 'hotel-3'),
      updateHotel: new UpdateHotelUseCase(repository),
      deleteHotel: new DeleteHotelUseCase(repository),
    },
  };
}

describe('useHotelDashboard', () => {
  it('transitions from loading to success with the fetched hotels', async () => {
    const { repository, deps } = buildDeps();
    await repository.save(oceanCliff);

    const { result } = renderHook(() => useHotelDashboard(deps));

    expect(result.current.status).toBe('loading');

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.hotels.map((hotel) => hotel.id)).toEqual(['hotel-1']);
    expect(result.current.error).toBeNull();
  });

  it('transitions to error when the use case rejects', async () => {
    const { deps } = buildDeps();
    deps.getFilteredHotels = {
      execute: () => Promise.reject(new Error('Firestore is unreachable.')),
    } as unknown as GetFilteredHotelsUseCase;

    const { result } = renderHook(() => useHotelDashboard(deps));

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.error).toBe('Firestore is unreachable.');
  });

  it('reacts to filter changes by reloading the matching hotels', async () => {
    const { repository, deps } = buildDeps();
    await repository.save(oceanCliff);
    await repository.save(cityCenterInn);

    const { result } = renderHook(() => useHotelDashboard(deps));
    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.hotels).toHaveLength(2);

    act(() => {
      result.current.applyFilters({ searchTerm: 'ocean' });
    });

    await waitFor(() => expect(result.current.hotels.map((hotel) => hotel.id)).toEqual(['hotel-1']));
  });

  it('refreshes the list after creating, updating and deleting a hotel', async () => {
    const { deps } = buildDeps();
    const { result } = renderHook(() => useHotelDashboard(deps));
    await waitFor(() => expect(result.current.status).toBe('success'));

    await act(async () => {
      await result.current.createHotel({
        name: 'Budget Stay Hostel',
        description: 'Simple beds for travelers passing through.',
        location: 'Florianópolis, Brazil',
        pricePerNight: 90,
        starRating: 1,
        imageUrl: 'https://example.com/budget-stay.jpg',
        reviewScore: 5.5,
      });
    });
    expect(result.current.hotels.map((hotel) => hotel.id)).toEqual(['hotel-3']);

    await act(async () => {
      await result.current.updateHotel('hotel-3', { pricePerNight: 120 });
    });
    expect(result.current.hotels[0].pricePerNight).toBe(120);

    await act(async () => {
      await result.current.deleteHotel('hotel-3');
    });
    expect(result.current.hotels).toEqual([]);
  });
});
