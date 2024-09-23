import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Screener() {
  const [infos, setInfos] = useState([]);

  useEffect(()=>{
    axios.get('http://localhost:4000/listcompany').then(res => {setInfos(res.data) ; console.log(res.data);})
  },[])
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
