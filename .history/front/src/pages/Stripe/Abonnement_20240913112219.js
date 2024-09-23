import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Abonnement() {
  const navigate = useNavigate();
  const [name, setName] = useState('');

  useEffect(() => {
    // Vérifier l'état d'abonnement
    axios.post('http://localhost:4000/', { type: "user" })
      .then(res => {
        if (res.data.success) {
          if (res.data.status === 'active') {
            navigate('/');
          } else {
            navigate('/abonnement');
          }
        } else {
          navigate('/login');
        }
      });

    // Rediriger l'utilisateur vers l'URL de Stripe pour l'abonnement
    axios.get('http://localhost:4000/subscribe', { params: { plan: 'starter' } }) // Remplacez 'starter' par le plan souhaité
      .then(res => {
        // Rediriger l'utilisateur vers l'URL de Stripe
        if (res.data && res.data.url) {
          window.location.href = res.data.url;
        }
      })
      .catch(error => console.error('Erreur lors de la récupération de la session Stripe', error));
  }, [navigate]);

  const handleLogout = () => {
    axios.post('http://localhost:4000/logout', { type: "user" })
      .then(res => {
        if (res.data.success) {
          window.location.reload(true);
        }
      });
  };

  return (
    <div>
      <Link onClick={handleLogout} style={{ textDecoration: 'none' }} className="mb-3">Se déconnecter</Link>
    </div>
  );
}
