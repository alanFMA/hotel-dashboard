import React, { useEffect, useState } from "react";
import { hotelsCollection } from "../lib/controller";
import { DocumentData, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { NewHotelType } from "../types/hotel";
import Information from "./Information";

function Card() {
  const [hotels, setHotels] = useState<NewHotelType[]>([]);

  useEffect(
    () =>
      onSnapshot(hotelsCollection, (snapshot: QuerySnapshot<DocumentData>) => {
        setHotels(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          }),
        );
      }),
    [],
  );

  console.log(hotels, "hotels");

  return (
    <div className="card">
      <h2 className="title">Hotéis</h2>
      {hotels && hotels.length ? (
        <div>
          {hotels?.map((hotel) => (
            <Information hotel={hotel} detailsPage={false} />
          ))}
        </div>
      ) : (
        <h2 className="no-hotels">
          Nenhum hotel cadastrado. Por favor, cadastre.
        </h2>
      )}
    </div>
  );
}

export default Card;
