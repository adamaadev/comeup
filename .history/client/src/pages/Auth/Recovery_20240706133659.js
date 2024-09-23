import React, { useState , useEffect } from 'react';
import { useNavigate , useLocation} from 'react-router-dom';

export default function Recovery() {
  const [infos, setInfos] = useState({ password: '', newpassword: '' });
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state;

  const change = (e) => {
    setInfos({ ...infos, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    console.log(infos.password, infos.newpassword);
  };

  useEffect(()=>{
    if (!email) {
      return navigate('/')
    }
  },[])

  return (
    <div>
      {email}
      <form onSubmit={submit}>
        <input type="password" name="password" onChange={change} />
        <input type="password" name="newpassword" onChange={change} />
        <button type="submit">Soumettre</button>
      </form>
    </div>
  );
}
