import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

// Remplacez par votre clé publique Stripe
const stripePromise = loadStripe('pk_test_51JqmbXFTPbYwB9q1Tpw79DhUCE6lM356dKEwUETXjwCKQsrO21V5XLBpSZYmAVQPuMEfpYVDNQvRhwhB4eCI7Ils0046P0OZMh');

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

  const handleTrialStart = async () => {
    if (!userId) {
      console.error('ID utilisateur non disponible');
      return;
    }

    const stripe = await stripePromise;

    try {
      // Envoyer l'ID de l'utilisateur au backend pour créer une session d'essai
      const { data } = await axios.post('http://localhost:4000/essaie', { userId });

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
  };

  return (
    <div>
      <button onClick={handleTrialStart}>Commencer l'essai gratuit</button>
    </div>
  );
}
