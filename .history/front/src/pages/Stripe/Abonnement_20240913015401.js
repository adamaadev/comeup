import axios from 'axios';
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Remplacez par votre clé publique Stripe
const stripePromise = loadStripe('pk_test_51JqmbXFTPbYwB9q1Tpw79DhUCE6lM356dKEwUETXjwCKQsrO21V5XLBpSZYmAVQPuMEfpYVDNQvRhwhB4eCI7Ils0046P0OZMh');

export default function Abonnement() {

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.post('http://localhost:4000/',{ type }).then(res => {
      if (res.data.success) {
        setauth(true);
      }
    });
  }, []);
  
  const handleTrialStart = async () => {
    const stripe = await stripePromise;
    const { data } = await axios.post('http://localhost:4000/essaie', { type: 'user' });

    if (data.sessionId) {
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      });

      if (result.error) {
        console.error(result.error.message);
      }
    }
  };

  return (
    <div>
      <button onClick={handleTrialStart}>Commencer l'essai gratuit</button>
    </div>
  );
}
