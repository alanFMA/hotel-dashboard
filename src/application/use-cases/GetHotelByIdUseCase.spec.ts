import { describe, expect, it } from 'vitest';
import { Hotel } from '../../domain/entities/Hotel';
import { GetHotelByIdUseCase } from './GetHotelByIdUseCase';
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

describe('GetHotelByIdUseCase', () => {
  it('returns the hotel when it exists', async () => {
    const repository = new InMemoryHotelRepository();
    await repository.save(existingHotel);
    const useCase = new GetHotelByIdUseCase(repository);

    const result = await useCase.execute('hotel-1');

    expect(result?.id).toBe('hotel-1');
  });

  it('returns null when the hotel does not exist', async () => {
    const repository = new InMemoryHotelRepository();
    const useCase = new GetHotelByIdUseCase(repository);

    expect(await useCase.execute('missing-id')).toBeNull();
  });
});
