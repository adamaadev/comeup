import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table } from "react-bootstrap";

export default function Scenario({ id, symbol }) {
  const [selectedScenario, setSelectedScenario] = useState("");
  const [justification, setJustification] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    // Fetch the list of scenarios when the component mounts
    axios.post("http://localhost:4000/scenario/list", { symbol, id })
      .then((response) => {
        setResponses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching scenarios:", error);
      });
  }, [symbol, id]); // Add dependencies to avoid unnecessary re-fetch

  function handleSubmit(e) {
    e.preventDefault();
    axios.post("http://localhost:4000/scenario/add", { symbol, reponse: selectedScenario, justification, id_user: id })
      .then((response) => {
        // Assuming response.data contains the newly added scenario
        setResponses([...responses, response.data]);
        setShowModal(false);
        setSelectedScenario("");
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
        Ajouter un scénario
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Scénario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">L’entreprise possède-t-elle un scénario ?</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="scenarioInput">Saisir le scénario :</label>
              <input
                type="text"
                className="form-control"
                id="scenarioInput"
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
                placeholder="Exemple: Grande scenario"
                required
              />
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
              <td>{response.justification}</td>
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
