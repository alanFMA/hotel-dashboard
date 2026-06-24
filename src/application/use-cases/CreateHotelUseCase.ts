import { Hotel } from '../../domain/entities/Hotel';
import type { HotelProps } from '../../domain/entities/Hotel';
import type { IHotelRepository } from '../../domain/repositories/IHotelRepository';

export type CreateHotelInput = Omit<HotelProps, 'id'>;

export class CreateHotelUseCase {
  constructor(
    private readonly hotelRepository: IHotelRepository,
    private readonly generateId: () => string = () => crypto.randomUUID(),
  ) {}

  async execute(input: CreateHotelInput): Promise<Hotel> {
    const hotel = Hotel.create({ ...input, id: this.generateId() });
    return this.hotelRepository.save(hotel);
  }
}
