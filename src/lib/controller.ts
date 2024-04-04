import { collection, getFirestore } from "firebase/firestore";
import { app } from "./firebase";

export const firestore = getFirestore(app);

//HOTELS COLLECTION
export const hotelsCollection = collection(firestore, "hotels");
