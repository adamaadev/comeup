import {useEffect} from 'react'

export default function Infos({symbol}) {
    useEffect(() => {
        axios.get(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
          .then(res => {
            setInfos([res.data[0]]) 
            const {companyName , image , symbol , country , mktCap , sector} = res.data[0];
            axios.post('http://localhost:4000/checkcompany',{ companyName , image , symbol , country , mktCap , sector })
          });
      }, [symbol]);
  return (
    <div>Infos</div>
  )
}
