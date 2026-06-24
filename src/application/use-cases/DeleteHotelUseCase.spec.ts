import { describe, expect, it } from 'vitest';
import { Hotel } from '../../domain/entities/Hotel';
import { DeleteHotelUseCase } from './DeleteHotelUseCase';
import { InMemoryHotelRepository } from '../../test/doubles/InMemoryHotelRepository';

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

describe('DeleteHotelUseCase', () => {
  it('removes an existing hotel from the catalog', async () => {
    const repository = new InMemoryHotelRepository();
    await repository.save(existingHotel);
    const useCase = new DeleteHotelUseCase(repository);

    await useCase.execute('hotel-1');

    expect(await repository.findById('hotel-1')).toBeNull();
  });

  it('throws when the hotel does not exist', async () => {
    const repository = new InMemoryHotelRepository();
    const useCase = new DeleteHotelUseCase(repository);

    await expect(useCase.execute('missing-id')).rejects.toThrow();
  });
});
