import React, { useState } from "react";
import { NewHotelType } from "../types/hotel";
import { Link } from "react-router-dom";
import Edit from "./Edit";

interface IProps {
  hotel: NewHotelType;
  detailsPage: boolean;
}

function Information({ hotel, detailsPage }: IProps) {
  console.log(hotel, "hotel");
  const [editDescription, setEditDescription] = useState(false);

  return (
    <div className="hotel-preview">
      <div className="image-container">
        <img className="location-image" src={hotel.location} alt="Hotel" />
        <div className="highlights">
          <div className="highlights-text">
            <h2>{hotel.title}</h2>
            <p className="region">{hotel.region}</p>
          </div>
          <div className="highlights-price">
            <h2 className="per-night">R$ {hotel.perNight}</h2>
            <p>Pernoite</p>
          </div>
        </div>
      </div>

      {/*Description */}
      <div className="description">
        <span className="reviews">
          <strong className="review-number">{hotel.stars} ⭐</strong>{" "}
          (Avaliações: {hotel.review})
        </span>
        <hr />
        <span className="feature">
          Principal característica: {hotel.feature}
        </span>

        {detailsPage ? (
          <>
            <p className="description-text">
              {hotel.description}{" "}
              <strong
                className="edit-text"
                onClick={() => setEditDescription(!editDescription)}
              >
                Editar descrição
              </strong>
              {editDescription ? (
                <Edit
                  editDescription={editDescription}
                  setEditDescription={setEditDescription}
                />
              ) : null}
            </p>
            <button>Deletar Hotel</button>
          </>
        ) : (
          <Link to={`/hotels/${hotel.id}`}>
            <button className="moreinfo-btn">Mais informações</button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Information;
