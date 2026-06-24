import { describe, expect, it } from 'vitest';
import { CreateHotelUseCase } from './CreateHotelUseCase';
import { InMemoryHotelRepository } from '../../test/doubles/InMemoryHotelRepository';
import { DomainValidationError } from '../../domain/errors/DomainValidationError';

const validInput = {
  name: 'Ocean Cliff Resort',
  description: 'A serene cliffside escape with panoramic ocean views.',
  location: 'Florianópolis, Brazil',
  pricePerNight: 1250,
  starRating: 5,
  imageUrl: 'https://example.com/ocean-cliff.jpg',
  reviewScore: 9.4,
};

describe('CreateHotelUseCase', () => {
  it('persists a new hotel with a generated id', async () => {
    const repository = new InMemoryHotelRepository();
    const useCase = new CreateHotelUseCase(repository, () => 'generated-id');

    const hotel = await useCase.execute(validInput);

    expect(hotel.id).toBe('generated-id');
    expect(await repository.findById('generated-id')).not.toBeNull();
  });

  it('rejects invalid hotel data without touching the repository', async () => {
    const repository = new InMemoryHotelRepository();
    const useCase = new CreateHotelUseCase(repository, () => 'generated-id');

    await expect(
      useCase.execute({ ...validInput, pricePerNight: -1 }),
    ).rejects.toThrow(DomainValidationError);
    expect(await repository.findAll()).toHaveLength(0);
  });
});
