import { describe, expect, it } from 'vitest';
import { SeedDemoHotelsUseCase, DEMO_HOTELS } from './SeedDemoHotelsUseCase';
import { InMemoryHotelRepository } from '../../test/doubles/InMemoryHotelRepository';

describe('SeedDemoHotelsUseCase', () => {
  it('saves every demo hotel into the repository', async () => {
    const repository = new InMemoryHotelRepository();
    const useCase = new SeedDemoHotelsUseCase(repository);

    const seeded = await useCase.execute();

    expect(seeded).toHaveLength(DEMO_HOTELS.length);
    expect(await repository.findAll()).toHaveLength(DEMO_HOTELS.length);
  });

  it('is idempotent: running it again does not create duplicates', async () => {
    const repository = new InMemoryHotelRepository();
    const useCase = new SeedDemoHotelsUseCase(repository);

    await useCase.execute();
    await useCase.execute();

    expect(await repository.findAll()).toHaveLength(DEMO_HOTELS.length);
  });

  it('restores a demo hotel after it has been deleted', async () => {
    const repository = new InMemoryHotelRepository();
    const useCase = new SeedDemoHotelsUseCase(repository);
    await useCase.execute();

    const [firstDemoHotel] = DEMO_HOTELS;
    await repository.delete(firstDemoHotel.id);
    expect(await repository.findById(firstDemoHotel.id)).toBeNull();

    await useCase.execute();

    expect(await repository.findById(firstDemoHotel.id)).not.toBeNull();
  });
});
