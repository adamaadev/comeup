import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51JqmbXFTPbYwB9q1Tpw79DhUCE6lM356dKEwUETXjwCKQsrO21V5XLBpSZYmAVQPuMEfpYVDNQvRhwhB4eCI7Ils0046P0OZMh');

export default function Abonnement() {
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isTrial, setIsTrial] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    axios.post('http://localhost:4000/', { type: 'user' })
      .then(res => {
        setEmail(res.data.email);
        if (res.data.success) {
          setIsSubscribed(res.data.status === 'active');
          setIsTrial(res.data.essaie === 'true');
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

  const handleSubscribe = async (plan) => {
    try {
      const response = await fetch(`http://localhost:4000/subscribe?plan=${plan}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  

  return (
    <div className="App">
      <header className="App-header">
        <h1>Abonnement</h1>
        <button onClick={() => handleSubscribe('starter')}>S'abonner au plan Starter</button>
        <button onClick={() => handleSubscribe('pro')}>S'abonner au plan Pro</button>
        <button onClick={() => handleSubscribe('free')}>Essaie gratuit</button>
        <button onClick={handleLogout}>se deconnecter</button>
      </header>
    </div>
  );
}
