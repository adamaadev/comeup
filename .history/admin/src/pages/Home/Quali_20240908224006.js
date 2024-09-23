import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { LinearProgress, Typography, Box } from '@mui/material';

export default function Quali({ symbol }) {
  const [infos, setInfos] = useState({});

  useEffect(() => {
    axios.post("http://localhost:4000/screener/ratios", { symbol })
      .then((res) => {
        setInfos(res.data[0]);
      })
      .catch((err) => console.error(err));
  }, [symbol]);

  // Fonction pour formater les pourcentages et ajouter un seuil de couleur
  const formatProgress = (value) => {
    if (value === null || value === undefined) return "N/A";
    return `${value}%`;
  };

  const getProgressColor = (value) => {
    if (value >= 75) return 'green';   // vert pour les performances élevées
    if (value < 25) return 'red';      // rouge pour les faibles performances
    return 'blue';                     // bleu pour intermédiaire
  };

  return (
    <div className="container">
      <div className="section">
        <Typography variant="h6">Rentabilité</Typography>
        <ul>
          <li>
            ROIC 1A: {formatProgress(infos.roce)}
            <LinearProgress 
              variant="determinate" 
              value={infos.roce || 0} 
              style={{ backgroundColor: getProgressColor(infos.roce), width: '80%' }} 
            />
          </li>
          <li>
            ROCE 5A: {formatProgress(infos.roce_5_year_avg)}
            <LinearProgress 
              variant="determinate" 
              value={infos.roce_5_year_avg || 0} 
              style={{ backgroundColor: getProgressColor(infos.roce_5_year_avg), width: '80%' }} 
            />
          </li>
          {/* Ajoutez d'autres ratios de rentabilité */}
        </ul>
      </div>

      <div className="section">
        <Typography variant="h6">Croissance</Typography>
        <ul>
          <li>
            CA 1 AN: {formatProgress(infos.croissance_CA_1_an)}
            <LinearProgress 
              variant="determinate" 
              value={infos.croissance_CA_1_an || 0} 
              style={{ backgroundColor: getProgressColor(infos.croissance_CA_1_an), width: '80%' }} 
            />
          </li>
          {/* Ajoutez d'autres ratios de croissance */}
        </ul>
      </div>

      <div className="section">
        <Typography variant="h6">Dividende</Typography>
        <ul>
          <li>
            Croissance 1 AN: {formatProgress(infos.croissance_annualisee)}
            <LinearProgress 
              variant="determinate" 
              value={infos.croissance_annualisee || 0} 
              style={{ backgroundColor: getProgressColor(infos.croissance_annualisee), width: '80%' }} 
            />
          </li>
          {/* Ajoutez d'autres ratios de dividende */}
        </ul>
      </div>

      <div className="section">
        <Typography variant="h6">Santé</Typography>
        <ul>
          <li>
            Payout Ratio: {formatProgress(infos.ratio_payout)}
            <LinearProgress 
              variant="determinate" 
              value={infos.ratio_payout || 0} 
              style={{ backgroundColor: getProgressColor(infos.ratio_payout), width: '80%' }} 
            />
          </li>
          {/* Ajoutez d'autres ratios de santé */}
        </ul>
      </div>
    </div>
  );
}
