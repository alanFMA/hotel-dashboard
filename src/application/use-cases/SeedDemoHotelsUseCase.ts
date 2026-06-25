import { Hotel } from '../../domain/entities/Hotel';
import type { HotelProps } from '../../domain/entities/Hotel';
import type { IHotelRepository } from '../../domain/repositories/IHotelRepository';

export const DEMO_HOTELS: HotelProps[] = [
  {
    id: 'demo-serhs-natal-grand-hotel',
    name: 'SERHS Natal Grand Hotel',
    description: 'Lorem ipsum',
    location: 'Natal, Rio Grande do Norte, BRA',
    pricePerNight: 59,
    starRating: 3,
    imageUrl:
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/c3/60/72/caption.jpg?w=1200&h=-1&s=1',
    reviewScore: 10,
  },
  {
    id: 'demo-mcnehens',
    name: 'McNehens',
    description: 'Lorem Ipsum',
    location: 'Monte mor, Valfenda',
    pricePerNight: 400,
    starRating: 5,
    imageUrl: 'https://cdn.britannica.com/96/115096-050-5AFDAF5D/Bellagio-Hotel-Casino-Las-Vegas.jpg',
    reviewScore: 6.5,
  },
  {
    id: 'demo-provechai-hotels',
    name: 'Provechai HOtels',
    description: 'labaxai',
    location: 'Bodocongó, EUA',
    pricePerNight: 120,
    starRating: 4,
    imageUrl:
      'https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/900/450/75/dam/wdpro-assets/dlr/places-to-stay/disneyland-hotel/resort-overview/disneyland-hotel-06.jpg?1719924985224',
    reviewScore: 3.5,
  },
  {
    id: 'demo-disneyland-hotels',
    name: 'Disneyland Hotels',
    description: 'Lorem Ipsum',
    location: 'Riverside, EUA',
    pricePerNight: 220,
    starRating: 3,
    imageUrl:
      'https://images.bubbleup.com/width1920/quality35/mville2017/1-brand/1-margaritaville.com/gallery-media/220803-compasshotel-medford-pool-73868-1677873697-78625-1694019828.jpg',
    reviewScore: 2,
  },
];

export class SeedDemoHotelsUseCase {
  constructor(private readonly hotelRepository: IHotelRepository) {}

  async execute(): Promise<Hotel[]> {
    const hotels = DEMO_HOTELS.map((props) => Hotel.create(props));
    await Promise.all(hotels.map((hotel) => this.hotelRepository.save(hotel)));
    return hotels;
  }
}
