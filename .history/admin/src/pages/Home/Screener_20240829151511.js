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
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Logo</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Name</th>
          </tr>
        </thead>
        <tbody>
          {infos.map((company, index) => (
            <tr key={index}>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <img src={company.logo} alt={`${company.Name} logo`} style={{ maxWidth: '50px', height: 'auto' }} />
              </td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                {company.Name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
