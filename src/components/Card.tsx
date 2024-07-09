import React, { useEffect, useState } from 'react';
import { hotelsCollection } from '../lib/controller';
import { DocumentData, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { NewHotelType } from '../types/hotel';
import Information from './Information';

function Card() {
  const [hotels, setHotels] = useState<NewHotelType[]>([]);
  const [sort, setSort] = useState<string>('');

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

  const sortedHotels = hotels?.sort((a, b) => {
    if (sort === 'title') {
      if (a.title && b.title) return a.title?.localeCompare(b.title);
    }
    if (sort === 'perNight') {
      return Number(a.perNight) - Number(b.perNight);
    }
    if (sort === 'stars') {
      return Number(a.stars) - Number(b.stars);
    }
    if (sort === 'review') {
      return Number(a.review) - Number(b.review);
    }
    return 0;
  });

  return (
    <div className="card">
      <select
        className="select"
        defaultValue={''}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="" disabled>
          Ordenar por
        </option>
        <option value="title">Nome</option>
        <option value="perNight">Pernoite</option>
        <option value="stars">Classificação</option>
        <option value="review">Review</option>
      </select>
      <h2 className="title">Hotéis</h2>
      {hotels && hotels.length ? (
        <div className="hotel-list">
          {sortedHotels?.map((hotel) => (
            <Information key={hotel.id} hotel={hotel} detailsPage={false} />
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
