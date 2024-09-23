import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

export default function Abonnement() {
  useEffect(() => {
    axios.post('http://localhost:4000/', { type: 'user' })
      .then(res => {
        if (res.data.status === 'inactive') {
          Navigate
        }
      })
      .catch(error => {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
      });
  }, []);
  return (
    <div>Abonnement</div>
  )
}
