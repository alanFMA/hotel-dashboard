import { describe, expect, it } from 'vitest';
import { Hotel } from './Hotel';
import { DomainValidationError } from '../errors/DomainValidationError';

const validProps = {
  id: 'hotel-1',
  name: 'Ocean Cliff Resort',
  description: 'A serene cliffside escape with panoramic ocean views.',
  location: 'Florianópolis, Brazil',
  pricePerNight: 1250,
  starRating: 5,
  imageUrl: 'https://example.com/ocean-cliff.jpg',
  reviewScore: 9.4,
};

describe('Hotel entity', () => {
  it('creates a valid hotel', () => {
    const hotel = Hotel.create(validProps);

    expect(hotel.id).toBe(validProps.id);
    expect(hotel.name).toBe(validProps.name);
    expect(hotel.pricePerNight).toBe(validProps.pricePerNight);
    expect(hotel.starRating).toBe(validProps.starRating);
    expect(hotel.reviewScore).toBe(validProps.reviewScore);
  });

  it.each(['name', 'description', 'location', 'imageUrl'] as const)(
    'rejects a blank %s',
    (field) => {
      expect(() => Hotel.create({ ...validProps, [field]: '   ' })).toThrow(
        DomainValidationError,
      );
    },
  );

  it('rejects a negative price per night', () => {
    expect(() => Hotel.create({ ...validProps, pricePerNight: -1 })).toThrow(
      DomainValidationError,
    );
  });

  it.each([0, 6, 3.5])('rejects an out-of-range star rating of %s', (starRating) => {
    expect(() => Hotel.create({ ...validProps, starRating })).toThrow(
      DomainValidationError,
    );
  });

  it.each([-0.1, 10.1])('rejects an out-of-range review score of %s', (reviewScore) => {
    expect(() => Hotel.create({ ...validProps, reviewScore })).toThrow(
      DomainValidationError,
    );
  });

  it('accepts the boundary review scores of 0 and 10', () => {
    expect(() => Hotel.create({ ...validProps, reviewScore: 0 })).not.toThrow();
    expect(() => Hotel.create({ ...validProps, reviewScore: 10 })).not.toThrow();
  });

  it('accepts every valid star rating from 1 to 5', () => {
    for (const starRating of [1, 2, 3, 4, 5]) {
      expect(() => Hotel.create({ ...validProps, starRating })).not.toThrow();
    }
  });

  it('produces an equivalent plain props snapshot', () => {
    const hotel = Hotel.create(validProps);

    expect(hotel.toProps()).toEqual(validProps);
  });
});
