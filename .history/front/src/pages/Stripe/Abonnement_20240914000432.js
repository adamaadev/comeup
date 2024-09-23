import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51JqmbXFTPbYwB9q1Tpw79DhUCE6lM356dKEwUETXjwCKQsrO21V5XLBpSZYmAVQPuMEfpYVDNQvRhwhB4eCI7Ils0046P0OZMh'); // Remplacez par votre clé publique Stripe

export default function Abonnement() {
  const type = "user";
  const navigate = useNavigate();
  const [name, setName] = useState('');

  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => {
        if (res.data.success) {
          if (res.data.status === 'active') {
            navigate('/')
          } else {
            navigate('/abonnement')
          }
        } else {
          navigate('/login');
        }
      });
  }, [navigate]);

  const handleLogout = () => {
    axios.post('http://localhost:4000/logout', { type })
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
      console.error('Error redirecting to checkout:', error);
    }
  };

  return (
    <div>
      <Link onClick={handleLogout} style={{ textDecoration: 'none' }} className="mb-3">Se déconnecter</Link>
      <button onClick={handleSubscribe}>S'abonner</button>
    </div>
  );
}
