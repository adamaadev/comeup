import axios from 'axios';
import {useEffect} from 'react';

export default function Screener() {
  useEffect(()=>{
    axios.get('http://localhost:3000/')
  },[])
  return (
   <div></div>
  );
}
