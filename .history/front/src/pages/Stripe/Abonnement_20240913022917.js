import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const Abonnement = () => {
  const [showForm, setShowForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');

  const handleShow = () => setShowForm(true);
  const handleClose = () => setShowForm(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Ajoutez ici la logique pour traiter le numéro de carte
    console.log('Card Number:', cardNumber);
    handleClose();
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Commencer l'essai gratuit
      </Button>

      <Modal show={showForm} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Payment Information</Modal.Title>
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
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Abonnement;
