import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const Abonnement = () => {
  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleShow = () => setShowForm(true);
  const handleClose = () => setShowForm(false);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.post('http://localhost:4000/', { type: 'user' })
      .then(res => {
        if (res.data.success) {
          const { id, email, status, username } = res.data;
          setUserId(id);
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des informations utilisateur :', error);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Calculer les dates de début et de fin
    const today = new Date();
    const endDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const formattedStartDate = today.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    try {
      // Envoyer les données d'essai gratuit au backend
      await axios.post('http://localhost:4000/essaie', {
        id: userId,
        essaie: 'true',
        date_debut: formattedStartDate,
        date_fin: formattedEndDate,
      });
      handleClose();
      alert('Essai gratuit activé avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'activation de l\'essai gratuit :', error);
      alert('Erreur lors de l\'activation de l\'essai gratuit.');
    }
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Commencer l'essai gratuit
      </Button>

      <Modal show={showForm} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Informations sur l'essai gratuit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formCardNumber">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your card number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Activer l'essai gratuit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Abonnement;
