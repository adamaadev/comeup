import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Forget() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:4000/forget', { email })
      .then(res => {
        if (res.data.message) {
          navigate('/code' ,{state : email});
        } else {
          alert('Cet email n\'existe pas');
        }
      })
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Adresse email</label>
          <input type="email" className="form-control" id="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Soumettre</button>
      </form>
    </div>
  );
}
