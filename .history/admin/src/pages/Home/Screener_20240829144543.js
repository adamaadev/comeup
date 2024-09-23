import axios from 'axios';
import {useEffect} from 'react';

export default function Screener() {
  useEffect(()=>{
    axios.get('http://localhost:4000/screener').then(res=>console.log(res))
  },[])
  return (
   <div></div>
  );
}
