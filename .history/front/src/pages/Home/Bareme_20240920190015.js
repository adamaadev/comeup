import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Bareme() {
  const [scores, setScores] = useState({
    count_above_15: 0,
    count_between_10_and_15: 0,
    count_below_10: 0,
  });

  useEffect(() => {
    // Fonction pour récupérer les scores depuis l'API
    const fetchScores = async () => {
      try {
        const response = await axios.get('http://localhost:4000/getscore');
        setScores(response.data);
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };

    fetchScores();
  }, []);

  return (
    <div>
      <h1>Scores des Entreprises</h1>
      <p>Nombre d'entreprises avec un score supérieur à 15: {scores.count_above_15}</p>
      <p>Nombre d'entreprises avec un score entre 10 et 15: {scores.count_between_10_and_15}</p>
      <p>Nombre d'entreprises avec un score inférieur à 10: {scores.count_below_10}</p>
    </div>
  );
}
