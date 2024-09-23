import axios from 'axios'
import React, {useEffect} from 'react'

export default function Abonnement() {

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.post('http://localhost:4000/',{ type : user }).then(res => {
      if (res.data.success) {
        setauth(true);
      }
    });
  }, []);

  return (
    <div>Abonnement</div>
  )
}
