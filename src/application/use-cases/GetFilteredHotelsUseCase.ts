import { Hotel } from '../../domain/entities/Hotel';
import type { IHotelRepository } from '../../domain/repositories/IHotelRepository';

export interface HotelFilterCriteria {
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  starRatings?: number[];
  minReviewScore?: number;
}

export class GetFilteredHotelsUseCase {
  constructor(private readonly hotelRepository: IHotelRepository) {}

  async execute(criteria: HotelFilterCriteria): Promise<Hotel[]> {
    const hotels = await this.hotelRepository.findAll();
    return hotels.filter((hotel) => this.matches(hotel, criteria));
  }

  private matches(hotel: Hotel, criteria: HotelFilterCriteria): boolean {
    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase();
      const matchesText =
        hotel.name.toLowerCase().includes(term) || hotel.location.toLowerCase().includes(term);
      if (!matchesText) {
        return false;
      }
    }

    if (criteria.minPrice !== undefined && hotel.pricePerNight < criteria.minPrice) {
      return false;
    }

    if (criteria.maxPrice !== undefined && hotel.pricePerNight > criteria.maxPrice) {
      return false;
    }

    if (criteria.starRatings && !criteria.starRatings.includes(hotel.starRating)) {
      return false;
    }

    if (criteria.minReviewScore !== undefined && hotel.reviewScore < criteria.minReviewScore) {
      return false;
    }

    return true;
  }
}
