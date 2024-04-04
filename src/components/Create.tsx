import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [feature, setFeature] = useState("Room Only");
  const [location, setLocation] = useState("");
  const [stars, setStars] = useState("1");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [review, setReview] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [perNight, setPerNight] = useState("");

  const navigate = useNavigate();

  const addNewHotel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("successfully added a new hotel");
    navigate("/");
  };

  console.log(title, "title");
  return (
    <div className="create">
      <h2>Cadastrar um novo hotel</h2>
      <form onSubmit={(e) => addNewHotel(e)}>
        <label>Nome do hotel:</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Descrição:</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <label>Principal característica:</label>
        <select value={feature} onChange={(e) => setFeature(e.target.value)}>
          <option value="Room Only">Apenas quarto</option>
          <option value="Room with Breakfast included">
            Quarto com café da manhã incluído
          </option>
          <option value="Local Charges Payable at Hotel">
            Taxas locais pagáveis no hotel
          </option>
          <option value="Free Parking for all guests">
            Estacionamento gratuito para todos os hóspedes
          </option>
          <option value="Free WiFi">Wi-Fi gratuito</option>
          <option value="Spa and wellness centre included">
            Spa e centro de bem-estar incluídos
          </option>
          <option value="Private parking at the hotel">
            Estacionamento privativo no hotel
          </option>
          <option value="Restaurant & Bar">Restaurante e Bar</option>
          <option value="Swimming pool">Piscina</option>
          <option value="Room and Parking">Quarto e Estacionamento</option>
        </select>

        <label>URL da imagem:</label>
        <input
          type="text"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <label>Classificação:</label>
        <select value={stars} onChange={(e) => setStars(e.target.value)}>
          <option value="1">1 ⭐</option>
          <option value="2">2 ⭐⭐</option>
          <option value="3">3 ⭐⭐⭐</option>
          <option value="4">4 ⭐⭐⭐⭐</option>
          <option value="5">5 ⭐⭐⭐⭐⭐</option>
        </select>
        <label>País:</label>
        <input
          type="text"
          required
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <label>Região:</label>
        <input
          type="text"
          required
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
        <label>Number of Reviews:</label>
        <input
          type="number"
          required
          min="1"
          max="1000"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <label>Preço Total (R$):</label>
        <input
          type="text"
          required
          value={totalPrice}
          onChange={(e) => setTotalPrice(e.target.value)}
        />
        <label>Pernoite (R$):</label>
        <input
          type="text"
          required
          value={perNight}
          onChange={(e) => setPerNight(e.target.value)}
        />
        <button>Add Hotel</button>
      </form>
    </div>
  );
}

export default Create;
