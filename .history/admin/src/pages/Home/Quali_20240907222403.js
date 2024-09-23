import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function Quali({symbol}) {
    const [infos , setinfos] = useState([]);

    useEffect(()=>{
        axios.post("http://localhost:4000/screener/ratios", { symbol})
        .then((res) => {
        })
    },[])

  return (
    <div>Quali</div>
  )
}
