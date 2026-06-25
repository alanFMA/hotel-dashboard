import {
  type Firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { Hotel } from '../../domain/entities/Hotel';
import type { HotelProps } from '../../domain/entities/Hotel';
import type { IHotelRepository } from '../../domain/repositories/IHotelRepository';

const HOTELS_COLLECTION = 'hotels';

export class FirebaseHotelRepository implements IHotelRepository {
  constructor(private readonly firestore: Firestore) {}

  async save(hotel: Hotel): Promise<Hotel> {
    await setDoc(this.hotelDoc(hotel.id), this.toDocumentData(hotel));
    return hotel;
  }

  async findAll(): Promise<Hotel[]> {
    const snapshot = await getDocs(collection(this.firestore, HOTELS_COLLECTION));
    return snapshot.docs.map((document) => this.toHotel(document.id, document.data()));
  }

  async findById(id: string): Promise<Hotel | null> {
    const snapshot = await getDoc(this.hotelDoc(id));
    if (!snapshot.exists()) {
      return null;
    }

    return this.toHotel(snapshot.id, snapshot.data());
  }

  async update(hotel: Hotel): Promise<void> {
    await setDoc(this.hotelDoc(hotel.id), this.toDocumentData(hotel));
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(this.hotelDoc(id));
  }

  private hotelDoc(id: string) {
    return doc(this.firestore, HOTELS_COLLECTION, id);
  }

  private toDocumentData(hotel: Hotel): Omit<HotelProps, 'id'> {
    return {
      name: hotel.name,
      description: hotel.description,
      location: hotel.location,
      pricePerNight: hotel.pricePerNight,
      starRating: hotel.starRating,
      imageUrl: hotel.imageUrl,
      reviewScore: hotel.reviewScore,
    };
  }

  private toHotel(id: string, data: Record<string, unknown>): Hotel {
    return Hotel.create({ ...data, id } as HotelProps);
  }
}
