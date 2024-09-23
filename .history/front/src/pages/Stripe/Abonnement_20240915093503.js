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

  const handleSubscription = async (plan) => {
    try {
      const response = await axios.get(`http://localhost:4000/subscribe?plan=${plan}`);
      window.location.replace(response.data); // Utilisez replace pour éviter l'ajout dans l'historique
    } catch (error) {
      console.error("Error during subscription:", error);
    }
  };
  

  return (
    <div>
      <p>Bonjour {email}</p>
      <Link onClick={handleLogout} style={{ textDecoration: 'none' }} className="mb-3">Se déconnecter</Link>
      
      {!isSubscribed && !isTrial && (
        <div>
          <h3>Choisissez votre abonnement</h3>
          <button onClick={() => handleSubscription('starter')} className="btn btn-primary">S'abonner au plan Starter</button>
          <button onClick={() => handleSubscription('pro')} className="btn btn-primary">S'abonner au plan Pro</button>
        </div>
      )}

      {isSubscribed && <p>Vous êtes déjà abonné !</p>}
      {isTrial && <p>Vous êtes actuellement en période d'essai gratuit.</p>}
    </div>
  );
}
