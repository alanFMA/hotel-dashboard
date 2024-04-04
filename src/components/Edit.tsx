import React, { useState } from "react";

interface IProps {
  editDescription: boolean;
  setEditDescription: React.Dispatch<React.SetStateAction<boolean>>;
}

function Edit({ editDescription, setEditDescription }: IProps) {
  const [newDescription, setNewDescription] = useState("");
  const handleUpdate = () => {
    // atualizar descrição
    setEditDescription(!editDescription);
    // navegar para homepage
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
