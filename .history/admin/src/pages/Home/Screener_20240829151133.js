import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Screener() {
  const [infos , setinfos] = useState([]);

  useEffect(()=>{
    axios.get('http://localhost:4000/screener').then(res=>setinfos(res.data))
    console.log(infos[0]);
  },[])

  
  return (
   <div>
    
   </div>
  );
}
