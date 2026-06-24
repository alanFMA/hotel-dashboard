import { beforeEach, describe, expect, it } from 'vitest';
import { Hotel } from '../../domain/entities/Hotel';
import { GetFilteredHotelsUseCase } from './GetFilteredHotelsUseCase';
import { InMemoryHotelRepository } from '../../test/doubles/InMemoryHotelRepository';

const repository = new InMemoryHotelRepository();
const useCase = new GetFilteredHotelsUseCase(repository);

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

const budgetStay = Hotel.create({
  id: 'hotel-3',
  name: 'Budget Stay Hostel',
  description: 'Simple beds for travelers passing through.',
  location: 'Florianópolis, Brazil',
  pricePerNight: 90,
  starRating: 1,
  imageUrl: 'https://example.com/budget-stay.jpg',
  reviewScore: 5.5,
});

beforeEach(async () => {
  for (const hotel of [oceanCliff, cityCenterInn, budgetStay]) {
    await repository.save(hotel);
  }
});

describe('GetFilteredHotelsUseCase', () => {
  it('returns every hotel when no criteria is given', async () => {
    const result = await useCase.execute({});

    expect(result.map((hotel) => hotel.id)).toEqual(
      expect.arrayContaining(['hotel-1', 'hotel-2', 'hotel-3']),
    );
  });

  it('filters by a case-insensitive name or location search term', async () => {
    const byName = await useCase.execute({ searchTerm: 'ocean' });
    expect(byName.map((hotel) => hotel.id)).toEqual(['hotel-1']);

    const byLocation = await useCase.execute({ searchTerm: 'florianópolis' });
    expect(byLocation.map((hotel) => hotel.id).sort()).toEqual(['hotel-1', 'hotel-3']);
  });

  it('filters by a minimum and maximum price range', async () => {
    const result = await useCase.execute({ minPrice: 100, maxPrice: 500 });

    expect(result.map((hotel) => hotel.id)).toEqual(['hotel-2']);
  });

  it('filters by a set of selected star ratings', async () => {
    const result = await useCase.execute({ starRatings: [1, 5] });

    expect(result.map((hotel) => hotel.id).sort()).toEqual(['hotel-1', 'hotel-3']);
  });

  it('filters by a minimum review score', async () => {
    const result = await useCase.execute({ minReviewScore: 7 });

    expect(result.map((hotel) => hotel.id).sort()).toEqual(['hotel-1', 'hotel-2']);
  });

  it('combines every criterion at once', async () => {
    const result = await useCase.execute({
      searchTerm: 'florianópolis',
      minPrice: 1000,
      maxPrice: 2000,
      starRatings: [5],
      minReviewScore: 9,
    });

    expect(result.map((hotel) => hotel.id)).toEqual(['hotel-1']);
  });

  it('returns an empty list when nothing matches', async () => {
    const result = await useCase.execute({ searchTerm: 'nonexistent' });

    expect(result).toEqual([]);
  });
});
