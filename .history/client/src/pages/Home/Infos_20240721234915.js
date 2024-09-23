import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function App() {
  const symbol = 'UBER';
  const [commonstockissued , setcommonstockissued] = useState();
  const [commonstockrepurchased , setcommonstockrepurchased] = useState();
  const [infos , setinfos] = useState([])
  const [nbr , setnbr] = useState();
  const date = new Date().getFullYear() - 1;
  const [incomtax19 , setincomtax19] = useState();
  const [totasset19 , settotasset19] = useState();
  const [curyabilities19 , setcuryabilities19] = useState();
  const [incomtax20 , setincomtax20] = useState();
  const [totasset20 , settotasset20] = useState();
  const [curyabilities20 , setcuryabilities20] = useState();
  const [incomtax21 , setincomtax21] = useState();
  const [totasset21 , settotasset21] = useState();
  const [curyabilities21 , setcuryabilities21] = useState();
  const [incomtax22 , setincomtax22] = useState();
  const [totasset22 , settotasset22] = useState();
  const [curyabilities22 , setcuryabilities22] = useState();
  const [incomtax23 , setincomtax23] = useState();
  const [totasset23 , settotasset23] = useState();
  const [curyabilities23 , setcuryabilities23] = useState();
  

  useEffect(()=>{

    axios.get(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=6&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
    .then(res=>{
      setincomtax19(res.data[4].incomeBeforeTax);
      setincomtax20(res.data[3].incomeBeforeTax);
      setincomtax21(res.data[2].incomeBeforeTax);
      setincomtax22(res.data[1].incomeBeforeTax);
      setincomtax23(res.data[0].incomeBeforeTax);
    });

    axios.get(`https://financialmodelingprep.com/api/v3/financials/balance-sheet-statement/${symbol}?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
    .then(res=>{
      settotasset19(res.data.financials[4]["Total assets"]);
      settotasset20(res.data.financials[3]["Total assets"]);
      settotasset21(res.data.financials[2]["Total assets"]);
      settotasset22(res.data.financials[1]["Total assets"]);
      settotasset23(res.data.financials[0]["Total assets"]);
      setcuryabilities19(res.data.financials[4]["Total current liabilities"]);
      setcuryabilities20(res.data.financials[3]["Total current liabilities"]);
      setcuryabilities21(res.data.financials[2]["Total current liabilities"]);
      setcuryabilities22(res.data.financials[1]["Total current liabilities"]);
      setcuryabilities23(res.data.financials[0]["Total current liabilities"]);
    })

  },[])

  const capitaux19 = totasset19 - curyabilities19;
  const capitaux20 = totasset20 - curyabilities20;
  const capitaux21 = totasset21 - curyabilities21;
  const capitaux22 = totasset22 - curyabilities22;
  const capitaux23 = totasset23 - curyabilities23;
  const roce19 = (incomtax19 / capitaux19) * 100; 
  const roce20 = (incomtax20 / capitaux20) * 100; 
  const roce21 = (incomtax21 / capitaux21) * 100; 
  const roce22 = (incomtax22 / capitaux22) * 100; 
  const roce23 = (incomtax23 / capitaux23) * 100; 

  const pct1 = (roce19 + roce20 + roce21 + roce22 + roce23) / 5;
  const date1 = new Date().getFullYear() - 5;

  useEffect(()=>{
    axios.get(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?limit=1&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
    .then(res =>{
      setcommonstockissued(res.data[0].commonStockIssued);
      setcommonstockrepurchased(res.data[0].commonStockRepurchased);
    });

    axios.get(`https://financialmodelingprep.com/api/v3/historical-market-capitalization/${symbol}?limit=250&from=${date}-1-1&to=${date}-12-31&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
    .then(res => {
      setinfos(res.data);
      setnbr(res.data.length);
    })
  },[])

  let som = 0;
  for (let i = 0; i < infos.length; i++) {
    som += infos[i].marketCap;
  }
  let pct = som / nbr;
  const rachat1 = commonstockrepurchased + commonstockissued;
  const App = -((commonstockrepurchased + commonstockissued) / pct) *100
  return (
    <div>
      <p>Buyback yield 1 an {symbol} : {App.toFixed(2)} %</p>
      <div>
      <p>Roce 1 an : {roce23.toFixed(2)} %</p>
      <p>Roce 5 ans : {pct1.toFixed(2)} %</p>
    </div>
    </div>
  )
}