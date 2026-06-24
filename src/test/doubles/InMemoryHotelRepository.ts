import { Hotel } from '../../domain/entities/Hotel';
import type { IHotelRepository } from '../../domain/repositories/IHotelRepository';

export class InMemoryHotelRepository implements IHotelRepository {
  private readonly hotels = new Map<string, Hotel>();

  async save(hotel: Hotel): Promise<Hotel> {
    this.hotels.set(hotel.id, hotel);
    return hotel;
  }

  async findAll(): Promise<Hotel[]> {
    return Array.from(this.hotels.values());
  }

  async findById(id: string): Promise<Hotel | null> {
    return this.hotels.get(id) ?? null;
  }

  async update(hotel: Hotel): Promise<void> {
    if (!this.hotels.has(hotel.id)) {
      throw new Error(`Hotel with id "${hotel.id}" was not found.`);
    }

    this.hotels.set(hotel.id, hotel);
  }

  async delete(id: string): Promise<void> {
    this.hotels.delete(id);
  }
}
