import type { IHotelRepository } from '../../domain/repositories/IHotelRepository';

export class DeleteHotelUseCase {
  constructor(private readonly hotelRepository: IHotelRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.hotelRepository.findById(id);
    if (!existing) {
      throw new Error(`Hotel with id "${id}" was not found.`);
    }

    await this.hotelRepository.delete(id);
  }
}
