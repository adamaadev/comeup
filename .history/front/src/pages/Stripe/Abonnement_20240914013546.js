import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51JqmbXFTPbYwB9q1Tpw79DhUCE6lM356dKEwUETXjwCKQsrO21V5XLBpSZYmAVQPuMEfpYVDNQvRhwhB4eCI7Ils0046P0OZMh'); // Clé publique Stripe

export default function Abonnement() {
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState(false); // Suivi de l'état de l'abonnement

  useEffect(() => {
    axios.post('http://localhost:4000/', { type: 'user' })
      .then(res => {
        console.log(res.data);
        
        if (res.data.success) {
          setIsSubscribed(res.data.status === 'active');
        } else {
          navigate('/login');
        }
      });
  }, [navigate]);

  const handleLogout = () => {
    axios.post('http://localhost:4000/logout', { type: 'user' })
      .then(res => {
        if (res.data.success) {
          window.location.reload(true);
        }
      });
  };

  const handleSubscribe = async () => {
    const stripe = await stripePromise;
    const response = await axios.post('http://localhost:4000/create-checkout-session');
    const sessionId = response.data.id;

    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error('Erreur lors de la redirection vers le checkout :', error);
    }
  };

  return (
    <div>
      <Link onClick={handleLogout} style={{ textDecoration: 'none' }} className="mb-3">Se déconnecter</Link>
      {!isSubscribed ? (
        <button onClick={handleSubscribe}>S'abonner</button>
      ) : (
        <p>Vous êtes déjà abonné.</p>
      )}
    </div>
  );
}
