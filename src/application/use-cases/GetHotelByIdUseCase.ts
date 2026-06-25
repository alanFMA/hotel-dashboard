import type { Hotel } from '../../domain/entities/Hotel';
import type { IHotelRepository } from '../../domain/repositories/IHotelRepository';

export class GetHotelByIdUseCase {
  constructor(private readonly hotelRepository: IHotelRepository) {}

  async execute(id: string): Promise<Hotel | null> {
    return this.hotelRepository.findById(id);
  }
}
