import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table } from "react-bootstrap";

export default function Scenario({ id, symbol }) {
  const [selectedscenario, setSelectedscenario] = useState("");
  const [justification, setJustification] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    // Fetch the list of scenarios when the component mounts
    axios.post("http://localhost:4000/scenario/list", { symbol, id })
      .then((response) => {
        setResponses(response.data);
      })
  }, [symbol, id]); // Add dependencies to avoid unnecessary re-fetch

  function handleSubmit(e) {
    e.preventDefault();
    axios.post("http://localhost:4000/scenario/add", { symbol, reponse: selectedscenario, justification, id_user: id })
      .then((response) => {
        // Assuming response.data contains the newly added scenario
        setResponses([...responses, response.data]);
        setShowModal(false);
        setSelectedscenario("");
        setJustification("");
      })
      .catch((error) => {
        console.error("Error adding scenario:", error);
      });
  }

  function handleDelete(scenarioId) {
    axios.delete(`http://localhost:4000/scenario/delete/${scenarioId}`)
      .then(() => {
        setResponses(responses.filter(response => response.id !== scenarioId));
      })
      .catch((error) => {
        console.error("Error deleting scenario:", error);
      });
  }

  return (
    <div>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Ajouter une scenario
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>scenario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">L’entreprise possède-t-elle une scenario ?</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="scenarioSelect">Sélectionnez une option :</label>
              <select
                className="form-control"
                id="scenarioSelect"
                value={selectedscenario}
                onChange={(e) => setSelectedscenario(e.target.value)}
                required
              >
                <option value="" disabled>
                  -- Choisissez une option --
                </option>
                <option value="grande_scenario">Grande scenario</option>
                <option value="petite_scenario">Petite scenario</option>
                <option value="aucune_scenario">Aucune scenario</option>
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
