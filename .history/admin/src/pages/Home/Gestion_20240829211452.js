import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Gestion() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/users').then(res => {
      setEmails(res.data); // Met à jour l'état avec les emails
    }).catch(err => {
      console.error("Erreur lors de la récupération des emails :", err);
    });
  }, []);

  return (
    <div>
      <h2>Liste des emails</h2>
      <ul>
        {emails.map((email, index) => (
          <li key={index}>{email}</li>
        ))}
      </ul>
    </div>
  );
}
