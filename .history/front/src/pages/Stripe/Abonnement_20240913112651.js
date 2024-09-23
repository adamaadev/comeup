import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Abonnement() {
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    try {
      // Remplacez 'price_1HfX5tLhfO8lfkUbk4LfAbCk' par l'ID de votre prix Stripe
      const response = await axios.post('http://localhost:4000/subscribe', {
        priceId: 'price_1HfX5tLhfO8lfkUbk4LfAbCk'
      });

      // Rediriger l'utilisateur vers l'URL de la session Stripe
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Erreur lors de l\'abonnement:', error);
    }
  };

  return (
    <div>
      <button onClick={handleSubscribe}>S'abonner</button>
    </div>
  );
}
