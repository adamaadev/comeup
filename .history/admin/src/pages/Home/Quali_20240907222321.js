import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function Quali({symbol}) {
    const [infos , setinfos] = useState([]);

    useEffect(()=>{
        axios.post("http://localhost:4000/douve/ratios", { symbol, id })
        .then((res) => {
        })
    },[])

  return (
    <div>Quali</div>
  )
}
