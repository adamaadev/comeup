import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function App() {
  const symbol = 'MSFT';
  const [netIncome, setNetIncome] = useState();
  const [netIncomeCount, setNetIncomeCount] = useState(0);
  const [operatingCashFlow, setOperatingCashFlow] = useState();
  const [operatingCashFlowCount, setOperatingCashFlowCount] = useState(0);
  const [totalcurrentasset22, setTotalcurrentasset22] = useState();
  const [totalcurrentasset23, setTotalcurrentasset23] = useState();
  const [netIncome22, setNetIncome22] = useState();
  const [netIncome23, setNetIncome23] = useState();
  const [roaCount, setRoaCount] = useState(0);
  const [netIncome1, setNetIncome1] = useState();
  const [operatingCashFlow1, setOperatingCashFlow1] = useState();
  const [cptnetoperating , setcptnetoperating] = useState(0);
  const [currentasset22 , setcurrentasset22] = useState();
  const [currentasset23 , setcurrentasset23] = useState();
  const [currentliabilities22 , setcurrentliabilities22] = useState();
  const [currentliabilities23 , setcurrentliabilities23] = useState();
  const [cptcurrentratio , setcptcurrentratio] = useState(0);
  const [termdebt22 , settermdebt22] = useState();
  const [termdebt23 , settermdebt23] = useState();
  const [totalasset22 , settotalasset22] = useState();
  const [totalasset23 , settotalasset23] = useState();
  const [cptlongtermdebttotalasset , setcptlongtermdebttotalasset] = useState(0);
  const [sharesoutstanding22 , setsharesoutstanding22] = useState();
  const [sharesoutstanding23 , setsharesoutstanding23] = useState();
  const [cptsharesoutstanding , setcptsharesoutstanding] = useState(0);
  const [grossProfit22 , setgrossProfit22] = useState();
  const [grossProfit23 , setgrossProfit23] = useState();
  const [Revenue22 , setRevenue22] = useState();
  const [Revenue23 , setRevenue23] = useState();
  const [pct , setpct] = useState();
  const [pct1 , setpct1] = useState();
  const [cptmargebrute , setcptmargebrute] = useState(0);
  const [chiffreaffaire22 , setchiffreaffaire22] = useState();
  const [chiffreaffaire23 , setchiffreaffaire23] = useState();

  const date1 = new Date().getFullYear() - 1;
  useEffect(() => { 
    axios.get(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=2&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
      .then(res => {
        setchiffreaffaire23(res.data[0].revenue);
        setchiffreaffaire22(res.data[1].revenue);
        const income = res.data[0].netIncome;
        setNetIncome(income);
        if (income >= 0) {
          setNetIncomeCount(1);
        } else {
          setNetIncomeCount(0);
        }
      });
  }, [symbol]);

  useEffect(() => {
    axios.get(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?limit=1&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
      .then(res => {
        const cashFlow = res.data[0].operatingCashFlow;
        setOperatingCashFlow(cashFlow);
        if (cashFlow >= 0) {
          setOperatingCashFlowCount(1);
        } else {
          setOperatingCashFlowCount(0);
        }
      });
  }, [symbol]);

  useEffect(() => {
    axios.get(`https://financialmodelingprep.com/api/v3/financials/balance-sheet-statement/${symbol}?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
      .then(res => {
        settermdebt23(res.data.financials[0]["Long-term debt"]);
        settermdebt22(res.data.financials[1]["Long-term debt"]);
        settotalasset23(res.data.financials[0]["Total assets"]);
        settotalasset22(res.data.financials[1]["Total assets"]);
        setcurrentasset22(res.data.financials[1]["Total current assets"]);
        setcurrentasset23(res.data.financials[0]["Total current assets"]);
        setcurrentliabilities22(res.data.financials[1]["Total current liabilities"]);
        setcurrentliabilities23(res.data.financials[0]["Total current liabilities"]);
        setTotalcurrentasset22(res.data.financials[1]["Total assets"]);
        setTotalcurrentasset23(res.data.financials[0]["Total assets"]);
      });

      axios.get(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?limit=2&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
      .then(res => {
        setNetIncome1(res.data[0].netIncome);
        setOperatingCashFlow1(res.data[0].operatingCashFlow);
        setNetIncome22(res.data[1].netIncome);
        setNetIncome23(res.data[0].netIncome);
      });

      axios.get(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
      .then(res => {
        setgrossProfit23(res.data[0].grossProfit);
        setgrossProfit22(res.data[1].grossProfit);
        setRevenue22(res.data[1].revenue);
        setRevenue23(res.data[0].revenue);
        setsharesoutstanding22(res.data[1].weightedAverageShsOutDil);
        setsharesoutstanding23(res.data[0].weightedAverageShsOutDil);
      });

  }, [symbol ]);


  useEffect(() => {
      const roa22 = netIncome22 / totalcurrentasset22;
      const roa23 = netIncome23 / totalcurrentasset23;
      const pctcurentration = currentasset22 / currentliabilities22;
      const pctcurentration1 = currentasset23 / currentliabilities23;
      const pctlongtermdebttotalasset22 = termdebt22 / totalasset22;
      const pctlongtermdebttotalasset23 = termdebt23 / totalasset23;
      const margebrute22 = (grossProfit22 / Revenue22) * 100;
      const margebrute23 = (grossProfit23 / Revenue23) * 100;
      setpct(margebrute22.toFixed(2));
      setpct1(margebrute23.toFixed(2));

      if(margebrute23 >= margebrute22){
        setcptmargebrute(1);
      }else{
        setcptmargebrute(0);
      }

      if (sharesoutstanding23 <= sharesoutstanding22) {
        setcptsharesoutstanding(1)
      }else{
        setcptsharesoutstanding(0)
      }
      if(pctlongtermdebttotalasset23 <= pctlongtermdebttotalasset22){
        setcptlongtermdebttotalasset(1);
      }else{
        setcptlongtermdebttotalasset(0);
      }
      if (roa23 >= roa22) {
        setRoaCount(1);
      } else {
        setRoaCount(0);
      }
      if (operatingCashFlow1 >= netIncome1) {
        setcptnetoperating(1)
      }else{
        setcptnetoperating(0)
      }
      if (pctcurentration1 >= pctcurentration) {
        setcptcurrentratio(1)
      }else{
        setcptcurrentratio(0)
      }
    }
  , [totalcurrentasset22, totalcurrentasset23, netIncome22, netIncome23  , netIncome1 , operatingCashFlow1 , currentasset22 , currentasset23 , currentliabilities22 , currentasset23]);

  const totalScore = netIncomeCount + operatingCashFlowCount + roaCount + cptnetoperating + cptcurrentratio + cptlongtermdebttotalasset + cptsharesoutstanding + cptmargebrute;

  const date = new Date().getFullYear();

  return (
    <div>
      <p>Résultat Net: {netIncome}</p>
      <p>{netIncomeCount} / 1 point</p>
      <br />
      <p>Operating Cash Flow: {operatingCashFlow}</p>
      <p>{operatingCashFlowCount} / 1 point</p>
      <br />
      <p>ROA {date - 2}: {((netIncome22 / totalcurrentasset22) * 100).toFixed(2)}%</p>
      <p>ROA {date - 1}: {((netIncome23 / totalcurrentasset23) * 100).toFixed(2)}%</p>
      <p>Variation du ROA : {roaCount} / 1 point</p>
      <br />
      <p>NetIncome : {netIncome1}</p>
      <p>Operating cashlow : {operatingCashFlow1}</p>
      <p>Operating cashlow to NetIncome : {cptnetoperating} / 1 point</p>
      <br />
      <p>Current asset 2022 : {currentasset22}</p>
      <p>Current asset 2023 : {currentasset23}</p>
      <p>current liabilities 2022 : {currentliabilities22}</p>
      <p>current liabilities 2023 : {currentliabilities23}</p>
      <p>Current ratio : {cptcurrentratio} / 1 point</p>
      <br />
      <p>Total asset 2022 : {totalasset22}</p>
      <p>Total asset 2023 : {totalasset23}</p>
      <p>Terme debt 2022 : {termdebt22}</p>
      <p>Terme debt 2023 : {termdebt23}</p>
      <p>long terme debt to asset : {cptlongtermdebttotalasset} / 1 point</p>
      <br />
      <p>Shares outstanding 2022 : {sharesoutstanding22}</p>
      <p>Shares outstanding 2023 : {sharesoutstanding23}</p>
      <p>Variations des actions : {cptsharesoutstanding} / 1 point</p>
      <br />
      <p>Revenu 2022 : {Revenue22}</p>
      <p>Revenu 2023 : {Revenue23}</p>
      <p>Profit 2022 : {grossProfit22}</p>
      <p>Profit 2023 : {grossProfit23}</p>
      <p>Marge brute 2022 : {pct}%</p>
      <p>Marge brute 2023 : {pct1}%</p>
      <p>Variation de la marge brute {cptmargebrute} / 1 point</p>
      <br />
      <p>Chiffre d'affaires 2022 : {chiffreaffaire22}</p>
      <p>Chiffre d'affaires 2023 : {chiffreaffaire23}</p>
      <p>Moyenne total des assets {date1} : </p>
      <p>Total Piotroski Score: {totalScore} / 9 points</p>
    </div>
  );
}