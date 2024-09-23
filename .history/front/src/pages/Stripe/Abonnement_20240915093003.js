import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51JqmbXFTPbYwB9q1Tpw79DhUCE6lM356dKEwUETXjwCKQsrO21V5XLBpSZYmAVQPuMEfpYVDNQvRhwhB4eCI7Ils0046P0OZMh');

export default function Abonnement() {
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isTrial, setIsTrial] = useState(false); // Nouvelle état pour gérer essaie
  const [email, setEmail] = useState('');

  useEffect(() => {
    axios.post('http://localhost:4000/', { type: 'user' })
      .then(res => {
        console.log(res.data);
        
        setEmail(res.data.email);
        if (res.data.success) {
          setIsSubscribed(res.data.status === 'active');
          setIsTrial(res.data.essaie === 'true'); // Mise à jour de l'état isTrial
        } else {
          navigate('/login');
        }
      });
  }, [navigate]);


  return (
    <div>
      <p>Bonjour {email}</p>
      <Link onClick={handleLogout} style={{ textDecoration: 'none' }} className="mb-3">Se déconnecter</Link>
      {!isSubscribed ? (
        <div>
          {!isTrial && <button onClick={() => handleSubscribe('FREE')}>Essai gratuit</button>}
          <button onClick={() => handleSubscribe('STARTER')}>Plan Starter</button>
          <button onClick={() => handleSubscribe('PREMIUM')}>Plan Premium</button>
        </div>
      ) : (
        <p>Vous êtes déjà abonné.</p>
      )}
    </div>
  );
}
