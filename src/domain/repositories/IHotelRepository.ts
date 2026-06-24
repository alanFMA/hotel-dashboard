import { Hotel } from '../entities/Hotel';

export interface IHotelRepository {
  save(hotel: Hotel): Promise<Hotel>;
  findAll(): Promise<Hotel[]>;
  findById(id: string): Promise<Hotel | null>;
  update(hotel: Hotel): Promise<void>;
  delete(id: string): Promise<void>;
}
