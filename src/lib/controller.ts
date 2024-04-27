import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { app } from "./firebase";
import { AddHotelType } from "../types/hotel";
import { NavigateFunction } from "react-router-dom";

export const firestore = getFirestore(app);

//HOTELS COLLECTION
export const hotelsCollection = collection(firestore, "hotels");

//ADD NEW DOCUMENT TO YOUR COLLECTION
export const addHotel = async (hotelData: AddHotelType) => {
  const newHotel = await addDoc(hotelsCollection, { ...hotelData });
  console.log(`The new hotel was created at ${newHotel.path}`);
};

// DELETE A DOCUMENT IN YOUR COLLECTION
export const deleteHotel = async (
  id: string | undefined,
  navigate: NavigateFunction,
) => {
  const document = doc(firestore, `hotels/${id}`);
  await deleteDoc(document);
  console.log("The hotel now has been deleted.");
  navigate("/");
};

// EDIT A DOCUMENT / DESCRIPTION
export const updateHotel = async (id: string | undefined, docData: any) => {
  const getHotel = doc(firestore, `hotels/${id}`);
  await setDoc(getHotel, docData, { merge: true });
  console.log("The value has been written to the database.");
};
