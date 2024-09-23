import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table } from "react-bootstrap";

export default function DouveComponent({ id, symbol }) {
  const [selectedDouve, setSelectedDouve] = useState("");
  const [justification, setJustification] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    // Fetch the list of douves when the component mounts
    axios.post("http://localhost:4000/douve/list",{symbol,id})
      .then((response) => {
        // Set the responses state with the fetched data
        setResponses(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the douve list!", error);
      });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    axios.post("http://localhost:4000/douve/add", { symbol, reponse: selectedDouve, justification, id_user: id })
      .then((response) => {
        // Add the new response to the list without re-fetching
        setResponses([...responses, response.data]);
        setShowModal(false);
        setSelectedDouve("");
        setJustification("");
      })
  }

  function handleDelete(id) {
    axios.delete(`http://localhost:4000/douve/delete/${id}`)
      .then(() => {
        // Remove the deleted response from the list
        setResponses(responses.filter(response => response.id !== id));
      })
      .catch((error) => {
        console.error("There was an error deleting the douve!", error);
      });
  }

  return (
    <div>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Ajouter une Douve
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Douve</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">L’entreprise possède-t-elle une douve ?</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="douveSelect">Sélectionnez une option :</label>
              <select
                className="form-control"
                id="douveSelect"
                value={selectedDouve}
                onChange={(e) => setSelectedDouve(e.target.value)}
                required
              >
                <option value="" disabled>
                  -- Choisissez une option --
                </option>
                <option value="grande_douve">Grande douve</option>
                <option value="petite_douve">Petite douve</option>
                <option value="aucune_douve">Aucune douve</option>
              </select>
            </div>

            <div className="form-group mb-3">
              <textarea
                className="form-control"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Justification"
                rows="4"
                required
              ></textarea>
            </div>

            <Button variant="primary" type="submit">
              Soumettre
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <Table striped bordered hover>
        <tbody>
          {responses.map((response) => (
            <tr key={response.id}>
              <td>{response.reponse}</td>
              <td>
                <Button 
                  variant="danger" 
                  onClick={() => handleDelete(response.id)}>
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
