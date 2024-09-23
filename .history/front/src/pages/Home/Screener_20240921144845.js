import React , {useEffect} from 'react'
import axios from 'axios';
export default function Screener() {
  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        console.log(res.data);
        
      });
  }, []);

  return (
    <div>Screener</div>
  )
}
