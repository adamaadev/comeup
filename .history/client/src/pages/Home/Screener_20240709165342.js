import { useState, useEffect } from 'react';

export default function Screener() {
  const [infos, setInfos] = useState([]);


  return (
    <div className="container">
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher sur la liste"
        />
      </div>

  </div>
  
  );
}
