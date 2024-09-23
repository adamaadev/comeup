import axios from 'axios'
import React, { useEffect } from 'react'

export default function Quali({symbol}) {

    useEffect(()=>{
        axios.post("http://localhost:4000/douve/list", { symbol, id })
        .then((response) => {
          setResponses(response.data);
        })
    },[])

  return (
    <div>Quali</div>
  )
}
