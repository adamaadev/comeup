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
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Nom</th>
              <th>Symbol</th>
              <th>Secteur</th>
              <th>Capitalisation</th>
              <th>Pays</th>
            </tr>
          </thead>
          <tbody>
            {infos.map((item, index) => (
              <tr key={index} onClick={()=> window.open(`/details/${item.symbol}`,'_blank')}>
                <td>{index + 1}</td>
                <td><img src={item.logo} alt={item.nom} style={{ width: '50px' }} /></td>
                <td>{item.nom}</td>
                <td>{item.symbol}</td>
                <td>{item.secteur}</td>
                <td>{item.capitalisation}</td>
                <td>{item.pays}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
  </div>
  
  );
}
