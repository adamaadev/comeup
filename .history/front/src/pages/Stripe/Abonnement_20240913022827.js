import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const PaymentForm = ({ show, handleClose }) => {
  const [cardNumber, setCardNumber] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Vous pouvez ajouter la logique pour traiter le numéro de carte ici
    console.log('Card Number:', cardNumber);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
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
  );
};

export default PaymentForm;
