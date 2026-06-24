import { Hotel } from '../../domain/entities/Hotel';
import type { HotelProps } from '../../domain/entities/Hotel';
import type { IHotelRepository } from '../../domain/repositories/IHotelRepository';

export type UpdateHotelInput = Partial<Omit<HotelProps, 'id'>>;

export class UpdateHotelUseCase {
  constructor(private readonly hotelRepository: IHotelRepository) {}

  async execute(id: string, changes: UpdateHotelInput): Promise<Hotel> {
    const existing = await this.hotelRepository.findById(id);
    if (!existing) {
      throw new Error(`Hotel with id "${id}" was not found.`);
    }

    const updated = Hotel.create({ ...existing.toProps(), ...changes, id });
    await this.hotelRepository.update(updated);
    return updated;
  }
}
