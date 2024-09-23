import React, { useEffect } from 'react'

export default function Gestion() {

  useEffect(()=>{
    axios.get('http://localhost:4000/getusers').then(res => {
        if (res.data.success) {
          setauth(true);
        }
      });
  },[])

  return (
    <div>Gestion</div>
  )
}
