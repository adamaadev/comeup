import React from 'react'

export default function Abonnement() {
  useEffect(() => {
    axios.post('http://localhost:4000/', { type: 'user' })
      .then(res => {
        if (res.data.success) {
          setAuth(true);
        }
        if (res.data.status === 'active') {
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
