import React, { useState } from "react";
import { updateHotel } from "../lib/controller";
import { useNavigate } from "react-router-dom";

interface IProps {
  editDescription: boolean;
  setEditDescription: React.Dispatch<React.SetStateAction<boolean>>;
  id?: string;
}

function Edit({ editDescription, setEditDescription, id }: IProps) {
  const [newDescription, setNewDescription] = useState("");

  const navigate = useNavigate();

  const handleUpdate = () => {
    // atualizar descrição
    updateHotel(id, { description: newDescription });
    setEditDescription(!editDescription);
    // navegar para homepage
    navigate("/");
  };

  return (
    <div className="edit">
      <label>Por favor, digite uma nova descrição:</label>
      <textarea
        required
        name="description"
        id="description"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
      />
      <button className="update-button" onClick={() => handleUpdate()}>
        Atualizar descrição
      </button>
    </div>
  );
}

export default Edit;
