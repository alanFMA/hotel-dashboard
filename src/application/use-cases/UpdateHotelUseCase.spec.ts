import { describe, expect, it } from 'vitest';
import { Hotel } from '../../domain/entities/Hotel';
import { UpdateHotelUseCase } from './UpdateHotelUseCase';
import { InMemoryHotelRepository } from '../../test/doubles/InMemoryHotelRepository';
import { DomainValidationError } from '../../domain/errors/DomainValidationError';

const existingHotel = Hotel.create({
  id: 'hotel-1',
  name: 'Ocean Cliff Resort',
  description: 'A serene cliffside escape with panoramic ocean views.',
  location: 'Florianópolis, Brazil',
  pricePerNight: 1250,
  starRating: 5,
  imageUrl: 'https://example.com/ocean-cliff.jpg',
  reviewScore: 9.4,
});

describe('UpdateHotelUseCase', () => {
  it('applies a partial update to an existing hotel', async () => {
    const repository = new InMemoryHotelRepository();
    await repository.save(existingHotel);
    const useCase = new UpdateHotelUseCase(repository);

    await useCase.execute('hotel-1', { pricePerNight: 980 });

    const updated = await repository.findById('hotel-1');
    expect(updated?.pricePerNight).toBe(980);
    expect(updated?.name).toBe(existingHotel.name);
  });

  it('rejects an update that would leave the hotel in an invalid state', async () => {
    const repository = new InMemoryHotelRepository();
    await repository.save(existingHotel);
    const useCase = new UpdateHotelUseCase(repository);

    await expect(useCase.execute('hotel-1', { starRating: 7 })).rejects.toThrow(
      DomainValidationError,
    );
  });

  it('throws when the hotel does not exist', async () => {
    const repository = new InMemoryHotelRepository();
    const useCase = new UpdateHotelUseCase(repository);

    await expect(useCase.execute('missing-id', { pricePerNight: 100 })).rejects.toThrow();
  });
});
