import React, { useEffect } from 'react'
import axios from 'axios';

export default function Gestion() {
  useEffect(()=>{
    axios.get('http://localhost:4000/getusers').then(res => {
       console.log(res);
      });
  },[])

  return (
    <div>Gestion</div>
  )
}
