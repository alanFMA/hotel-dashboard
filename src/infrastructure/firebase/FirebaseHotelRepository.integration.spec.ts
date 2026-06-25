import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Hotel } from '../../domain/entities/Hotel';
import { FirebaseHotelRepository } from './FirebaseHotelRepository';
import {
  type TestFirebaseEnv,
  clearFirestoreEmulatorData,
  createTestFirebaseEnv,
} from '../../test/integration/firebaseTestEnv';

const buildHotel = () =>
  Hotel.create({
    id: 'hotel-1',
    name: 'Ocean Cliff Resort',
    description: 'A serene cliffside escape with panoramic ocean views.',
    location: 'Florianópolis, Brazil',
    pricePerNight: 1250,
    starRating: 5,
    imageUrl: 'https://example.com/ocean-cliff.jpg',
    reviewScore: 9.4,
  });

describe('FirebaseHotelRepository (integration)', () => {
  describe('as an authenticated user', () => {
    let env: TestFirebaseEnv;
    let repository: FirebaseHotelRepository;

    beforeAll(async () => {
      env = createTestFirebaseEnv();
      await createUserWithEmailAndPassword(
        env.auth,
        'tester@hotel-dashboard.test',
        'super-secret-1',
      );
      repository = new FirebaseHotelRepository(env.firestore);
    });

    beforeEach(async () => {
      await clearFirestoreEmulatorData();
    });

    it('saves a hotel and retrieves it by id', async () => {
      await repository.save(buildHotel());

      const found = await repository.findById('hotel-1');

      expect(found?.toProps()).toEqual(buildHotel().toProps());
    });

    it('returns null when the hotel does not exist', async () => {
      expect(await repository.findById('missing-id')).toBeNull();
    });

    it('lists every saved hotel', async () => {
      await repository.save(buildHotel());

      const all = await repository.findAll();

      expect(all.map((hotel) => hotel.id)).toEqual(['hotel-1']);
    });

    it('updates an existing hotel', async () => {
      await repository.save(buildHotel());
      const updated = Hotel.create({ ...buildHotel().toProps(), pricePerNight: 999 });

      await repository.update(updated);

      const found = await repository.findById('hotel-1');
      expect(found?.pricePerNight).toBe(999);
    });

    it('deletes a hotel', async () => {
      await repository.save(buildHotel());

      await repository.delete('hotel-1');

      expect(await repository.findById('hotel-1')).toBeNull();
    });

    it('skips documents that do not match the current Hotel schema', async () => {
      await setDoc(doc(env.firestore, 'hotels', 'legacy-hotel'), {
        title: 'Old Hotel',
        stars: '4',
        perNight: '350',
      });
      await repository.save(buildHotel());

      const all = await repository.findAll();

      expect(all.map((hotel) => hotel.id)).toEqual(['hotel-1']);
      expect(await repository.findById('legacy-hotel')).toBeNull();
    });
  });

  describe('as an unauthenticated user', () => {
    let repository: FirebaseHotelRepository;

    beforeAll(() => {
      const env = createTestFirebaseEnv();
      repository = new FirebaseHotelRepository(env.firestore);
    });

    afterAll(async () => {
      await clearFirestoreEmulatorData();
    });

    it('is rejected by firestore.rules', async () => {
      await expect(repository.save(buildHotel())).rejects.toThrow();
    });
  });
});
