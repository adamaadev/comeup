import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Remplacez par votre clé publique Stripe
const stripePromise = loadStripe('pk_test_51JqmbXFTPbYwB9q1Tpw79DhUCE6lM356dKEwUETXjwCKQsrO21V5XLBpSZYmAVQPuMEfpYVDNQvRhwhB4eCI7Ils0046P0OZMh');

const CheckoutForm = ({ userId }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.error(error);
    } else {
      try {
        // Envoyer le paymentMethodId au backend
        const { data } = await axios.post('http://localhost:4000/essaie', {
          userId,
          paymentMethodId: paymentMethod.id
        });

        // Rediriger vers Stripe Checkout
        if (data.sessionId) {
          const result = await stripe.redirectToCheckout({
            sessionId: data.sessionId
          });

          if (result.error) {
            console.error(result.error.message);
          }
        }
      } catch (error) {
        console.error('Erreur lors du démarrage de l\'essai gratuit :', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Payer
      </button>
    </form>
  );
};

export default function Abonnement() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Récupérer les informations de l'utilisateur, y compris l'ID
    axios.post('http://localhost:4000/', { type: 'user' })
      .then(res => {
        if (res.data.success) {
          setUserId(res.data.id);
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des informations utilisateur :', error);
      });
  }, []);

  return (
    <div>
      {userId ? (
        <Elements stripe={stripePromise}>
          <CheckoutForm userId={userId} />
        </Elements>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
}
