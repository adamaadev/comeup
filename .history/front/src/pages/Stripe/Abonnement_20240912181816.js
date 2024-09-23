import React, {useEffect} from 'react'

export default function Abonnement() {
  useEffect(() => {
    axios.post('http://localhost:4000/', { type: 'user' })
      .then(res => {
        if (res.data.status === 'inactive') {
          setSubs(true);
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
