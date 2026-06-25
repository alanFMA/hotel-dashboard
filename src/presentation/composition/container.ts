import { auth, firestore } from '../../infrastructure/firebase/firebaseClient';
import { FirebaseHotelRepository } from '../../infrastructure/firebase/FirebaseHotelRepository';
import { FirebaseAuthService } from '../../infrastructure/firebase/FirebaseAuthService';
import { CreateHotelUseCase } from '../../application/use-cases/CreateHotelUseCase';
import { UpdateHotelUseCase } from '../../application/use-cases/UpdateHotelUseCase';
import { DeleteHotelUseCase } from '../../application/use-cases/DeleteHotelUseCase';
import { GetFilteredHotelsUseCase } from '../../application/use-cases/GetFilteredHotelsUseCase';
import { GetHotelByIdUseCase } from '../../application/use-cases/GetHotelByIdUseCase';

export const hotelRepository = new FirebaseHotelRepository(firestore);
export const authService = new FirebaseAuthService(auth);

export const createHotelUseCase = new CreateHotelUseCase(hotelRepository);
export const updateHotelUseCase = new UpdateHotelUseCase(hotelRepository);
export const deleteHotelUseCase = new DeleteHotelUseCase(hotelRepository);
export const getFilteredHotelsUseCase = new GetFilteredHotelsUseCase(hotelRepository);
export const getHotelByIdUseCase = new GetHotelByIdUseCase(hotelRepository);
