import React, { useEffect } from 'react'

export default function Gestion() {

  useEffect(()=>{
    axios.post('http://localhost:4000/',{ type }).then(res => {
        if (res.data.success) {
          setauth(true);
        }
      });
  },[])

  return (
    <div>Gestion</div>
  )
}
