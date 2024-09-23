import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Quati({ symbol }) {
  const [infos, setInfos] = useState({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    axios.post("http://localhost:4000/screener/ratios", { symbol })
      .then((res) => {
        const data = res.data[0];
        setInfos(data);
        calculateScore(data.performance);
      });
  }, [symbol]);

  const getRatioLabel = (performance) => {
    if (performance > 13) {
      return 'Excellente';
    } else if (performance >= 4 && performance <= 13) {
      return 'Correct';
    } else {
      return 'Faible';
    }
  };

  const getProgressColor = (performance) => {
    if (performance > 13) {
      return 'bg-success'; // Vert pour excellente
    } else if (performance >= 4 && performance <= 13) {
      return 'bg-info'; // Bleu pour correct
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  };

  const calculateScore = (performance) => {
    let newScore = 0;
    if (performance > 13) {
      newScore += 1; 
    } else if (performance >= 4 && performance <= 13) {
      newScore += 0.5; 
    } else {
      newScore += 0;  
    }
    setScore(newScore); 
  };

  return (
    <div className="container mt-4">
    <div className="card">
      <div className="card-header">
        <h2>Quanti-score : {score} / 20</h2>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6 col-lg-4 mb-4">
            <h5>Croissance</h5>
            <div className="d-flex align-items-center">
              <p style={{ margin: 0, marginRight: '10px' }}>Performance 5 ans :</p>
              <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '10%', position: 'relative' }}>
                <div
                  className={`progress-bar ${getProgressColor(infos.performance)}`}
                  role="progressbar"
                  style={{ width: `${infos.performance}%` }}
                  aria-valuenow={infos.performance}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                    {infos.performance}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
}
