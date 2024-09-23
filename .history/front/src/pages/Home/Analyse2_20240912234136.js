import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table } from "react-bootstrap";

export default function Analyse2({ id, symbol }) {
  const [selectedScenario, setSelectedScenario] = useState("");
  const [justification, setJustification] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    // Fetch the list of scenarios when the component mounts
    const fetchScenarios = async () => {
      try {
        const response = await axios.post("http://localhost:4000/scenario/list", { symbol, id });
        if (response.data) {
          setResponses(response.data);
        }
      } catch (error) {
        console.error("Error fetching scenarios:", error);
      }
    };

    fetchScenarios();
  }, [symbol, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/scenario/add", {
        symbol,
        reponse: selectedScenario,
        justification,
        id_user: id,
      });
      if (response.data) {
        setResponses((prevResponses) => [...prevResponses, response.data]);
      }
      // Reset form and close modal
      setShowModal(false);
      setSelectedScenario("");
      setJustification("");
    } catch (error) {
      console.error("Error adding scenario:", error);
    }
  };

  const handleDelete = async (scenarioId) => {
    try {
      await axios.delete(`http://localhost:4000/scenario/delete/${scenarioId}`);
      setResponses((prevResponses) => prevResponses.filter((response) => response.id !== scenarioId));
    } catch (error) {
      console.error("Error deleting scenario:", error);
    }
  };

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
                placeholder="Exemple: Grande scénario"
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

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Scénario</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((response) => (
            <tr key={response.id}>
              <td>{response.reponse}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(response.id)}>
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
