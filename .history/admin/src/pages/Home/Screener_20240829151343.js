import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Screener() {
  const [infos, setInfos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => setInfos(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {infos.map((company, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <img src={company.logo} alt={`${company.Name} logo`} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
          <span>{company.Name}</span>
        </div>
      ))}
    </div>
  );
}
