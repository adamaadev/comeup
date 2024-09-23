import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function Infos({symbol}) {
  const API_KEY = '7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX';
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
  const [dividendData, setDividendData] = useState({});
  const [payoutRatio, setPayoutRatio] = useState(0);
  const [fcfMarginOneYear, setFcfMarginOneYear] = useState(null);
  const [fcfMarginsFiveYears, setFcfMarginsFiveYears] = useState([]);
  const [averageMarginFiveYears, setAverageMarginFiveYears] = useState(null);
  const [dividendData1, setDividendData1] = useState([]);
  const [dividendYearEnded, setDividendYearEnded] = useState(0);
  const [annualizedGrowthRate, setAnnualizedGrowthRate] = useState(0);
  const [dividendYearEndedData, setDividendYearEndedData] = useState(0);
  const [dividendPreviousYearData, setDividendPreviousYearData] = useState(0);
  const [netIncomeGrowthOneYear, setNetIncomeGrowthOneYear] = useState(null);
  const [netIncomeGrowthFiveYears, setNetIncomeGrowthFiveYears] = useState(null);
  const [netIncomeGrowthTenYears, setNetIncomeGrowthTenYears] = useState(null);
  const [capexNetIncomeRatios, setCapexNetIncomeRatios] = useState([]);
  const [averageRatio, setAverageRatio] = useState(0); // Ajout de la variable pour la moyenne
  const [balanceSheetData, setBalanceSheetData] = useState({});
  const [debtToEquityRatio, setDebtToEquityRatio] = useState(0);
  const LIMIT = 5;
  const [netSharesRepurchases, setNetSharesRepurchases] = useState(null);
  const [repurchaseDetails, setRepurchaseDetails] = useState([]);
  const URL = `https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?limit=${LIMIT}&apikey=${API_KEY}`;
  const [dividendYearsStable, setDividendYearsStable] = useState(0);
  const [dividendYears, setDividendYears] = useState([]);
  const [dividendData5, setDividendData5] = useState({});
  const [growthRate, setGrowthRate] = useState(0);
  const [annualDividends, setAnnualDividends] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const y19 =  new Date().getFullYear() - 5;
const y20 =  new Date().getFullYear() - 4;
const y21 =  new Date().getFullYear() - 3;
const y22 =  new Date().getFullYear() - 2;
const y23 =  new Date().getFullYear() - 1;
const YEARS_TO_DISPLAY = [y19, y20, y21, y22, y23]; // Années à afficher
const [cagr1Year1, setCagr1Year1] = useState(null);
const [cagr5Years2, setCagr5Years2] = useState(null);
const [cagr10Years3, setCagr10Years3] = useState(null);
const date1____1 = new Date().getFullYear() - 1; 
const date2____2 = new Date().getFullYear() - 2;  
const date1____1Str = date1____1.toString();
const date2____2Str = date2____2.toString();
const [averageTotalAssets23, setAverageTotalAssets23] = useState(0);
const [averageTotalAssets22, setAverageTotalAssets22] = useState(0);
const [pct____ , setpct____] = useState();
const [pct____1 , setpct____1] = useState();
const [pct____2 , setpct____2] = useState();
const [pct____3 , setpct____3] = useState();
const [revenues, setRevenues] = useState([]);
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
const [pct_____ , setpct_____] = useState();
const [pct_____1 , setpct_____1] = useState();
const [cptmargebrute , setcptmargebrute] = useState(0);
const [chiffreaffaire22 , setchiffreaffaire22] = useState();
const [chiffreaffaire23 , setchiffreaffaire23] = useState();
const [cptvrotaction , setcptvrotaction] = useState(0);

const date1____2 = new Date().getFullYear() - 1;
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
    const pct_____curentration = currentasset22 / currentliabilities22;
    const pct_____curentration1 = currentasset23 / currentliabilities23;
    const pct_____longtermdebttotalasset22 = termdebt22 / totalasset22;
    const pct_____longtermdebttotalasset23 = termdebt23 / totalasset23;
    const margebrute22 = (grossProfit22 / Revenue22) * 100;
    const margebrute23 = (grossProfit23 / Revenue23) * 100;
    setpct_____(margebrute22.toFixed(2));
    setpct_____1(margebrute23.toFixed(2));

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
    if(pct_____longtermdebttotalasset23 <= pct_____longtermdebttotalasset22){
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
    if (pct_____curentration1 >= pct_____curentration) {
      setcptcurrentratio(1)
    }else{
      setcptcurrentratio(0)
    }
  }
, [totalcurrentasset22, totalcurrentasset23, netIncome22, netIncome23  , netIncome1 , operatingCashFlow1 , currentasset22 , currentasset23 , currentliabilities22 , currentasset23]);

const totalScore = netIncomeCount + operatingCashFlowCount + roaCount + cptnetoperating + cptcurrentratio + cptlongtermdebttotalasset + cptsharesoutstanding + cptmargebrute;

 useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch cash flow statement data for last 11 years (including current year)
      const response = await axios.get(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?limit=11&apikey=${API_KEY}`);
      const cashFlowData = response.data;

      // Log selected years to console
      logSelectedYearsToConsole(cashFlowData);

      if (cashFlowData.length >= 2) {
        // Calculate CAGR for 1 year
        const initialValue1Y = cashFlowData[1].freeCashFlow; // FCF from 1 year ago
        const finalValue1Y = cashFlowData[0].freeCashFlow; // Current FCF
        const years1Y = 1;
        const cagrValue1Y = ((finalValue1Y / initialValue1Y) ** (1 / years1Y) - 1) * 100;
        setCagr1Year1(cagrValue1Y.toFixed(2));
      } else {
        setError('Données insuffisantes pour calculer le CAGR sur 1 an.');
      }

      if (cashFlowData.length >= 5) {
        // Calculate CAGR for 5 years
        const initialValue5Y = cashFlowData[4].freeCashFlow; // FCF from 5 years ago
        const finalValue5Y = cashFlowData[0].freeCashFlow; // Current FCF
        const years5Y = 5;
        const cagrValue5Y = (((finalValue5Y / initialValue5Y) ** (1 / years5Y) - 1) * 100).toFixed(2);
        setCagr5Years2(cagrValue5Y);
      } else {
        setError('Données insuffisantes pour calculer le CAGR sur 5 ans.');
      }

      if (cashFlowData.length >= 11) {
        // Calculate CAGR for 10 years
        const initialValue10Y = cashFlowData[10].freeCashFlow; // FCF from 10 years ago
        const finalValue10Y = cashFlowData[0].freeCashFlow; // Current FCF
        const years10Y = 10;
        const cagrValue10Y = ((finalValue10Y / initialValue10Y) ** (1 / years10Y) - 1) * 100;
        setCagr10Years3(cagrValue10Y.toFixed(2));
      } else {
        setError('Données insuffisantes pour calculer le CAGR sur 10 ans.');
      }

      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const logSelectedYearsToConsole = (data) => {
    const selectedYearsData = data.filter(entry => YEARS_TO_DISPLAY.includes(new Date(entry.date).getFullYear()));
    const years = selectedYearsData.map(entry => entry.date);
    console.log('Selected Years:', years);
  };

  fetchData();
}, []);

  const formatNumber = (num) => {
    if (Math.abs(num) >= 1e9) {
      return (Math.round(num / 1e7) / 100) + ' B'; // Arrondir à deux chiffres après la virgule
    } else if (Math.abs(num) >= 1e6) {
      return (Math.round(num / 1e4) / 100) + ' M'; // Arrondir à deux chiffres après la virgule
    } else {
      return num.toFixed(2); // Limiter à deux chiffres après la virgule
    }
  };

  useEffect(()=>{
    axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/stock_dividend/${symbol}?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
    .then(res => {
      const currentYear = new Date().getFullYear();
      const data = res.data.historical;

      // Filtrer les données pour exclure l'année en cours
      const filteredData = data.filter(item => new Date(item.date).getFullYear() < currentYear);

      const aggregatedData = filteredData.reduce((acc, item) => {
        const year = new Date(item.date).getFullYear();
        if (!acc[year]) {
          acc[year] = {
            year,
            adjDividend: 0,
          };
        }
        acc[year].adjDividend += item.adjDividend;
        return acc;
      }, {});

      const annualData = Object.values(aggregatedData).sort((a, b) => b.year - a.year);

      setAnnualDividends(annualData.reverse());
    })
    .catch(err => console.error(err));
    const fetchData4 = async () => {
      try {
        const response = await axios.get(URL);
        const data = response.data;

        if (data.length >= 5) {
          let totalRepurchases = 0;
          let details = [];

          for (let i = 0; i < 5; i++) {
            const repurchased = data[i].commonStockRepurchased || 0;
            const issued = data[i].commonStockIssued || 0;
            const netRepurchase = repurchased + issued;
            totalRepurchases += netRepurchase;

            details.push({
              date: data[i].date,
              repurchased: formatNumber(repurchased),
              issued: formatNumber(issued),
              netRepurchase: formatNumber(netRepurchase),
            });
          }

          const averageRepurchase = totalRepurchases / 5;
          setNetSharesRepurchases(formatNumber(averageRepurchase));
          setRepurchaseDetails(details);
        } else {
          setError('Données insuffisantes pour calculer les rachats nets d\'actions sur 5 ans.');
        }

        setLoading(false);
      } catch (error) {
        setError('Erreur lors de la récupération des données');
        setLoading(false);
      }
    };

    fetchData4();

    const fetchData2 = async () => {
      try {
        // Fetch cash flow statement data
        const responseCashFlow = await axios.get(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?limit=6&apikey=${API_KEY}`);
        const cashFlowData = responseCashFlow.data;

        // Fetch income statement data
        const responseIncome = await axios.get(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=6&apikey=${API_KEY}`);
        const incomeData = responseIncome.data;

        if (cashFlowData.length >= 5 && incomeData.length >= 5) {
          const ratios = [];

          for (let i = 0; i < 5; i++) {
            const capex = Math.abs(parseFloat(cashFlowData[i]?.capitalExpenditure || 0));
            const netIncome = parseFloat(incomeData[i]?.netIncome || 0);

            if (netIncome !== 0) {
              const capexNetIncomeRatio = (capex / netIncome) * 100;
              ratios.push({ year: new Date().getFullYear() - 1 - i, ratio: capexNetIncomeRatio });
            } else {
              setError(`Données insuffisantes pour calculer le ratio Capex/Résultat Net pour l'année ${new Date().getFullYear() - 1 - i}.`);
              setLoading(false);
              return;
            }
          }

          setCapexNetIncomeRatios(ratios);

          // Calcul de la moyenne
          const sum = ratios.reduce((acc, item) => acc + parseFloat(item.ratio), 0);
          const average = (sum / ratios.length).toFixed(2);
          setAverageRatio(average); // Mettre la moyenne à 2 décimales
        } else {
          setError('Données insuffisantes pour calculer le ratio Capex/Résultat Net sur 5 ans.');
        }

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData2();
    const fetchDividendData1 = async () => {
      const fetchData1 = async () => {
        try {
          // Fetch income statement data
          const responseIncome = await axios.get(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=11&apikey=${API_KEY}`);
          const incomeData = responseIncome.data;
  
          // Calculations for net income growth
          const currentNetIncome = incomeData[0].netIncome;
          const previousYearNetIncome = incomeData[1].netIncome;
          const netIncomeGrowth = (((currentNetIncome - previousYearNetIncome) / previousYearNetIncome) * 100).toFixed(2);
          setNetIncomeGrowthOneYear(netIncomeGrowth);
  
          const fiveYearsAgoNetIncome = incomeData[4].netIncome;
          const cagr5NetIncome = Math.pow((currentNetIncome / fiveYearsAgoNetIncome), (1 / 5)) - 1;
          const growthFiveYearsNetIncome = (cagr5NetIncome * 100).toFixed(2);
          setNetIncomeGrowthFiveYears(growthFiveYearsNetIncome);
  
          const tenYearsAgoNetIncome = incomeData[9].netIncome;
          const cagr10NetIncome = Math.pow((currentNetIncome / tenYearsAgoNetIncome), (1 / 10)) - 1;
          const growthTenYearsNetIncome = (cagr10NetIncome * 100).toFixed(2);
          setNetIncomeGrowthTenYears(growthTenYearsNetIncome);
  
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
  
      fetchData1();

      const fetchBalanceSheetData = async () => {
        try {
          const response = await axios.get(`https://financialmodelingprep.com/api/v3/balance-sheet-statement/${symbol}?limit=1&apikey=${API_KEY}`);
          const balanceSheetData = response.data[0];
  
          const longTermDebt = balanceSheetData.longTermDebt;
          const shortTermDebt = balanceSheetData.shortTermDebt;
          const stockholdersEquity = balanceSheetData.totalStockholdersEquity;
  
          // Calcul du Debt to Equity Ratio
          const debtToEquityRatioValue = ((longTermDebt + shortTermDebt) / stockholdersEquity).toFixed(2);
          setDebtToEquityRatio(debtToEquityRatioValue);
  
          setBalanceSheetData(balanceSheetData);
          setLoading(false);
        } catch (error) {
          console.error('Erreur lors du chargement des données du bilan :', error.message);
          setError('Erreur lors du chargement des données du bilan.');
          setLoading(false);
        }
      };
  
      fetchBalanceSheetData();
      try {
        const response = await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/stock_dividend/${symbol}?apikey=${API_KEY}`);
        const dividendData1 = response.data.historical;

        // Trouver l'année terminée et l'année précédente par rbuybackort à la date actuelle
        const currentYear = new Date().getFullYear();
        const yearEnded = currentYear - 1; // Ex. si on est en 2024, l'année terminée est 2023
        const previousYear = yearEnded - 1; // L'année précédente est donc 2022

        // Filtrer les données pour l'année terminée et l'année précédente
        const yearEndedData = getAnnualDividend(dividendData1, yearEnded);
        const previousYearData = getAnnualDividend(dividendData1, previousYear);

        if (yearEndedData && previousYearData) {
          // Calculer la croissance annualisée
          const annualizedGrowth = (((yearEndedData - previousYearData) / previousYearData) * 100).toFixed(2);
          setAnnualizedGrowthRate(annualizedGrowth);
          setDividendYearEnded(yearEnded);
          setDividendYearEndedData(yearEndedData);
          setDividendPreviousYearData(previousYearData);
        } else {
          setError('Les données de dividende pour l\'année terminée ou l\'année précédente ne sont pas disponibles.');
        }

        setDividendData1(dividendData1);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données de dividende :', error.message);
        setError('Erreur lors du chargement des données de dividende.');
        setLoading(false);
      }
    };

    fetchDividendData1();
    const fetchFinancialData = async () => {
      try {
        // Récupération des données pour 1 an
        const cashFlowResponseOneYear = await axios.get(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?limit=1&apikey=${API_KEY}`);
        const incomeResponseOneYear = await axios.get(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=1&apikey=${API_KEY}`);

        const cashFlowDataOneYear = cashFlowResponseOneYear.data;
        const incomeDataOneYear = incomeResponseOneYear.data;

        if (cashFlowDataOneYear.length > 0 && incomeDataOneYear.length > 0) {
          const fcfOneYear = cashFlowDataOneYear[0].freeCashFlow;
          const revenueOneYear = incomeDataOneYear[0].revenue;
          const fcfMarginCalcOneYear = ((fcfOneYear / revenueOneYear) * 100).toFixed(2);
          setFcfMarginOneYear(fcfMarginCalcOneYear);
        } else {
          setFcfMarginOneYear('Données de cash-flow ou de revenu insuffisantes');
        }

        // Récupération des données pour 5 ans
        const cashFlowResponseFiveYears = await axios.get(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?limit=5&apikey=${API_KEY}`);
        const incomeResponseFiveYears = await axios.get(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=5&apikey=${API_KEY}`);

        const cashFlowDataFiveYears = cashFlowResponseFiveYears.data;
        const incomeDataFiveYears = incomeResponseFiveYears.data;

        if (cashFlowDataFiveYears.length > 0 && incomeDataFiveYears.length > 0) {
          const margins = [];

          for (let i = 0; i < 5; i++) {
            const fcfYear = cashFlowDataFiveYears[i].freeCashFlow;
            const revenueYear = incomeDataFiveYears[i].revenue;
            const fcfMarginCalc = (fcfYear / revenueYear) * 100;
            margins.push({
              year: cashFlowDataFiveYears[i].date.substring(0, 4), // Assuming date format is YYYY-MM-DD
              margin: fcfMarginCalc
            });
          }

          setFcfMarginsFiveYears(margins);

          // Calcul de la moyenne sur 5 ans
          if (margins.length > 0) {
            const totalMargin = margins.reduce((acc, curr) => acc + parseFloat(curr.margin), 0);
            const avgMargin = (totalMargin / margins.length).toFixed(2);
            setAverageMarginFiveYears(avgMargin);
          } else {
            setAverageMarginFiveYears(null);
          }
        } else {
          setFcfMarginsFiveYears([]);
          setAverageMarginFiveYears(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setFcfMarginOneYear(null);
        setFcfMarginsFiveYears([]);
        setAverageMarginFiveYears(null);
      }
    };

    fetchFinancialData();
    const fetchDividendData = async () => {
      try {
        const response = await axios.get(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?limit=1&apikey=${API_KEY}`);
        const dividendData = response.data[0];

        const dividendsPaid = Math.abs(dividendData.dividendsPaid); // Utiliser la valeur absolue pour s'assurer que c'est positif
        const netIncome = dividendData.netIncome;

        // Calcul du Payout Ratio
        const payoutRatioValue = ((dividendsPaid / netIncome) * 100).toFixed(2);
        setPayoutRatio(payoutRatioValue);

        setDividendData(dividendData);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données de flux de trésorerie :', error.message);
        setError('Erreur lors du chargement des données de flux de trésorerie.');
        setLoading(false);
      }
    };

    fetchDividendData();
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

  const getAnnualDividend = (dividendData1, year) => {
    const filteredData = dividendData1.filter(entry => new Date(entry.date).getFullYear() === year);
    const annualDividend = filteredData.reduce((total, entry) => total + entry.adjDividend, 0);
    return annualDividend;
  };
  const capitaux19 = totasset19 - curyabilities19;
  const capitaux20 = totasset20 - curyabilities20;
  const capitaux21 = totasset21 - curyabilities21;
  const capitaux22 = totasset22 - curyabilities22;
  const capitaux23 = totasset23 - curyabilities23;
  const roce19 = (incomtax19 / capitaux19) * 100; 
  const roce20 = (incomtax20 / capitaux20) * 100; 
  const roce21 = (incomtax21 / capitaux21) * 100; 
  const roce22 = (incomtax22 / capitaux22) * 100; 
  const roce23 = ((incomtax23 / capitaux23) * 100).toFixed(2); 

  const pct1 = ((roce19 + roce20 + roce21 + roce22 + roce23) / 5).toFixed(2);
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
  const buyback = (-((commonstockrepurchased + commonstockissued) / pct) *100).toFixed(2)
  const [cagr5Years, setCagr5Years] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const annee5 = new Date().getFullYear()-5;
  const annee1 = new Date().getFullYear()-1;
  const startDate = `${annee5}-12-31`; // Date de début fixée au 31 décembre 2018
  const endDate = `${annee1}-12-31`; // Date de fin fixée au 31 décembre 2023

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?from=${startDate}&to=${endDate}&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`);
        const historicalData = response.data.historical;

        if (historicalData.length >= 2) {
          const initialValue = historicalData[historicalData.length - 1].close; // Prix de clôture il y a 5 ans (31 décembre 2018)
          const finalValue = historicalData[0].close; // Prix de clôture actuel (31 décembre 2023)
          const years = 5;
          const cagrValue = (((finalValue / initialValue) ** (1 / years) - 1) * 100).toFixed(2);
          setCagr5Years(cagrValue);
        } else {
          setError('Données insuffisantes pour calculer le CAGR sur 5 ans.');
        }

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    function findDecreasingDividends(data) {
      const decreasingYears = [];
      let streak = 0;

      for (let i = 1; i < data.length; i++) {
        if (data[i].year !== data[i - 1].year + 1) {
          // Année manquante, réinitialiser le compteur
          streak = 0;
        } else if (data[i].adjDividend < data[i - 1].adjDividend) {
          decreasingYears.push(data[i].year);
          streak = 0;
        } else {
          streak++;
        }
      }
      setCurrentStreak(streak);

      return decreasingYears;
    }

    findDecreasingDividends(annualDividends);
  }, [annualDividends]);

  useEffect(() => {
    const fetchDividendData5 = async () => {
      try {
        const response = await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/stock_dividend/${symbol}?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`);
        const dividendData5 = response.data.historical;

        const currentYear = new Date().getFullYear();
        const dividendYears = [currentYear - 5, currentYear - 1];

        const aggregatedDividends = {};
        dividendYears.forEach(year => {
          const annualDividend = aggregateAnnualDividend(dividendData5, year);
          aggregatedDividends[year] = annualDividend;
        });

        setDividendYears(dividendYears);
        setDividendData5(aggregatedDividends);

        const growthRateValue = (Math.pow(aggregatedDividends[currentYear - 1] / aggregatedDividends[currentYear - 5], 1 / 5) - 1).toFixed(2);
        setGrowthRate(growthRateValue * 100);

        setLoading(false);
      } catch (error) {
        
        setLoading(false);
      }
    };

    fetchDividendData5();
  }, []);

  const aggregateAnnualDividend = (dividendData5, year) => {
    const filteredData = dividendData5.filter(entry => new Date(entry.date).getFullYear() === year);
    const annualDividend = filteredData.reduce((total, entry) => total + entry.adjDividend, 0);
    return annualDividend;
  };

  const [dates, setDates] = useState([]);

  useEffect(() => {
    axios.get(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=11&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
      .then(res => {
        const fetchedRevenues = res.data.map(yearData => yearData.revenue);
        const fetchedDates = res.data.map(yearData => yearData.date);
        setRevenues(fetchedRevenues);
        setDates(fetchedDates);
      });
  }, [symbol]);

  const revenueLastYear = revenues[0];
  const revenueOneYearAgo = revenues[1];
  const revenueFiveYearsAgo = revenues[5]; // Utiliser 2019 au lieu de 2018
  const revenueTenYearsAgo = revenues[10]; // Utiliser 2014 au lieu de 2013

  const dateLastYear = dates[0];
  const dateOneYearAgo = dates[1];
  const dateFiveYearsAgo = dates[5]; // Utiliser 2019 au lieu de 2018
  const dateTenYearsAgo = dates[10]; // Utiliser 2014 au lieu de 2013

  const croissanceCA1an = (((revenueLastYear - revenueOneYearAgo) / revenueOneYearAgo) * 100).toFixed(2);
  const croissanceCA5ans = ((Math.pow((revenueLastYear / revenueFiveYearsAgo), (1 / 5)) - 1) * 100).toFixed(2);
  const croissanceCA10ans = ((Math.pow((revenueLastYear / revenueTenYearsAgo), (1 / 10)) - 1) * 100).toFixed(2);
  let score = 0;

  const getProgressClass = (value) => {
    if (value >= 20) {
        return 'progress-bar bg-success';
    } else if (value >= 10) {
      return 'progress-bar bg-info';
    } else if (value < 10) {
        return 'progress-bar bg-danger';
    }
};

    if (!isNaN(buyback) && isFinite(buyback) && buyback !== null) {
        score += buyback >= 20 ? 1 : (buyback >= 10 ? 0.5 : 0);
    }

    if (!isNaN(roce23) && isFinite(roce23) && roce23 !== null) {
        score += roce23 >= 20 ? 1 : (roce23 >= 10 ? 0.5 : 0);
    }

    if (!isNaN(pct1) && isFinite(pct1) && pct1 !== null) {
        score += pct1 >= 20 ? 1 : (pct1 >= 10 ? 0.5 : 0);
    }

    if (!isNaN(cagr5Years) && isFinite(cagr5Years) && cagr5Years !== null) {
        score += cagr5Years >= 20 ? 1 : (cagr5Years >= 10 ? 0.5 : 0);
    }

    if (!isNaN(payoutRatio) && isFinite(payoutRatio) && payoutRatio !== null) {
        score += payoutRatio >= 20 ? 1 : (payoutRatio >= 10 ? 0.5 : 0);
    }

    if (!isNaN(fcfMarginOneYear) && isFinite(fcfMarginOneYear) && fcfMarginOneYear !== null) {
        score += fcfMarginOneYear >= 20 ? 1 : (fcfMarginOneYear >= 10 ? 0.5 : 0);
    }

    if (!isNaN(averageMarginFiveYears) && isFinite(averageMarginFiveYears) && averageMarginFiveYears !== null) {
        score += averageMarginFiveYears >= 20 ? 1 : (averageMarginFiveYears >= 10 ? 0.5 : 0);
    }

    if (!isNaN(annualizedGrowthRate) && isFinite(annualizedGrowthRate) && annualizedGrowthRate !== null) {
        score += annualizedGrowthRate >= 20 ? 1 : (annualizedGrowthRate >= 10 ? 0.5 : 0);
    }

    if (!isNaN(netIncomeGrowthOneYear) && isFinite(netIncomeGrowthOneYear) && netIncomeGrowthOneYear !== null) {
        score += netIncomeGrowthOneYear >= 20 ? 1 : (netIncomeGrowthOneYear >= 10 ? 0.5 : 0);
    }

    if (!isNaN(netIncomeGrowthFiveYears) && isFinite(netIncomeGrowthFiveYears) && netIncomeGrowthFiveYears !== null) {
        score += netIncomeGrowthFiveYears >= 20 ? 1 : (netIncomeGrowthFiveYears >= 10 ? 0.5 : 0);
    }

    if (!isNaN(averageRatio) && isFinite(averageRatio) && averageRatio !== null) {
        score += averageRatio >= 20 ? 1 : (averageRatio >= 10 ? 0.5 : 0);
    }

    if (!isNaN(debtToEquityRatio) && isFinite(debtToEquityRatio) && debtToEquityRatio !== null) {
        score += debtToEquityRatio >= 20 ? 1 : (debtToEquityRatio >= 10 ? 0.5 : 0);
    }

    if (!isNaN(netSharesRepurchases) && isFinite(netSharesRepurchases) && netSharesRepurchases !== null) {
        score += netSharesRepurchases >= 20 ? 1 : (netSharesRepurchases >= 10 ? 0.5 : 0);
    }

    if (!isNaN(growthRate) && isFinite(growthRate) && growthRate !== null) {
        score += growthRate >= 20 ? 1 : (growthRate >= 10 ? 0.5 : 0);
    }

    if (!isNaN(currentStreak) && isFinite(currentStreak) && currentStreak !== null) {
        // Assuming currentStreak is the number of years
        score += currentStreak >= 20 ? 1 : (currentStreak >= 10 ? 0.5 : 0);
    }

    if (!isNaN(cagr1Year1) && isFinite(cagr1Year1) && cagr1Year1 !== null) {
        score += cagr1Year1 >= 20 ? 1 : (cagr1Year1 >= 10 ? 0.5 : 0);
    }

    if (!isNaN(cagr5Years2) && isFinite(cagr5Years2) && cagr5Years2 !== null) {
        score += cagr5Years2 >= 20 ? 1 : (cagr5Years2 >= 10 ? 0.5 : 0);
    }

    if (!isNaN(cagr10Years3) && isFinite(cagr10Years3) && cagr10Years3 !== null) {
        score += cagr10Years3 >= 20 ? 1 : (cagr10Years3 >= 10 ? 0.5 : 0);
    }

    if (!isNaN(croissanceCA1an) && isFinite(croissanceCA1an) && croissanceCA1an !== null) {
        score += croissanceCA1an >= 20 ? 1 : (croissanceCA1an >= 10 ? 0.5 : 0);
    }

    if (!isNaN(croissanceCA5ans) && isFinite(croissanceCA5ans) && croissanceCA5ans !== null) {
        score += croissanceCA5ans >= 20 ? 1 : (croissanceCA5ans >= 10 ? 0.5 : 0);
    }

    if (!isNaN(croissanceCA10ans) && isFinite(croissanceCA10ans) && croissanceCA10ans !== null) {
        score += croissanceCA10ans >= 20 ? 1 : (croissanceCA10ans >= 10 ? 0.5 : 0);
    }


  return (
    <div>   
      <p>Score : {score}</p>
        {isNaN(roce23) || !isFinite(roce23) || roce23 === null ? '' : 
            <div>
                <p>Roce 1 an : </p>
                <div className="progress">
                    <div className={getProgressClass(roce23)} role="progressbar" style={{ width: `${roce23}%` }} aria-valuenow={roce23} aria-valuemin="0" aria-valuemax="100">
                        {roce23}%
                    </div>
                </div>
            </div>
        }

        {isNaN(pct1) || !isFinite(pct1) || pct1 === null ? '' : 
            <div>
                <p>Roce 5 ans : </p>
                <div className="progress">
                    <div className={getProgressClass(pct1)} role="progressbar" style={{ width: `${pct1}%`, color : black }} aria-valuenow={pct1} aria-valuemin="0" aria-valuemax="100">
                        {pct1}%
                    </div>
                </div>
            </div>
        }

        {isNaN(cagr5Years) || !isFinite(cagr5Years) || cagr5Years === null ? '' : 
            <div>
                <p>Performance moyenne sur les 5 dernières années : </p>
                <div className="progress">
                    <div className={getProgressClass(cagr5Years)} role="progressbar" style={{ width: `${cagr5Years}%` }} aria-valuenow={cagr5Years} aria-valuemin="0" aria-valuemax="100">
                        {cagr5Years}%
                    </div>
                </div>
            </div>
        }

        {isNaN(payoutRatio) || !isFinite(payoutRatio) || payoutRatio === null ? '' : 
            <div>
                <p>Payout Ratio de {symbol} : </p>
                <div className="progress">
                    <div className={getProgressClass(payoutRatio)} role="progressbar" style={{ width: `${payoutRatio}%` }} aria-valuenow={payoutRatio} aria-valuemin="0" aria-valuemax="100">
                        {payoutRatio}%
                    </div>
                </div>
            </div>
        }

        {isNaN(fcfMarginOneYear) || !isFinite(fcfMarginOneYear) || fcfMarginOneYear === null ? '' : 
            <div>
                <p>Free Cash Flow Margin 1 an : </p>
                <div className="progress">
                    <div className={getProgressClass(fcfMarginOneYear)} role="progressbar" style={{ width: `${fcfMarginOneYear}%` }} aria-valuenow={fcfMarginOneYear} aria-valuemin="0" aria-valuemax="100">
                        {fcfMarginOneYear}%
                    </div>
                </div>
            </div>
        }

        {isNaN(averageMarginFiveYears) || !isFinite(averageMarginFiveYears) || averageMarginFiveYears === null ? '' : 
            <div>
                <p>Free Cash Flow Margin 5 ans : </p>
                <div className="progress">
                    <div className={getProgressClass(averageMarginFiveYears)} role="progressbar" style={{ width: `${averageMarginFiveYears}%` }} aria-valuenow={averageMarginFiveYears} aria-valuemin="0" aria-valuemax="100">
                        {averageMarginFiveYears}%
                    </div>
                </div>
            </div>
        }

        {isNaN(annualizedGrowthRate) || !isFinite(annualizedGrowthRate) || annualizedGrowthRate === null ? '' : 
            <div>
                <p>Croissance Annualisée du Dividende : </p>
                <div className="progress">
                    <div className={getProgressClass(annualizedGrowthRate)} role="progressbar" style={{ width: `${annualizedGrowthRate}%` }} aria-valuenow={annualizedGrowthRate} aria-valuemin="0" aria-valuemax="100">
                        {annualizedGrowthRate}%
                    </div>
                </div>
            </div>
        }

        {isNaN(netIncomeGrowthOneYear) || !isFinite(netIncomeGrowthOneYear) || netIncomeGrowthOneYear === null ? '' : 
            <div>
                <p>Croissance du résultat net sur 1 an : </p>
                <div className="progress">
                    <div className={getProgressClass(netIncomeGrowthOneYear)} role="progressbar" style={{ width: `${netIncomeGrowthOneYear}%` }} aria-valuenow={netIncomeGrowthOneYear} aria-valuemin="0" aria-valuemax="100">
                        {netIncomeGrowthOneYear}%
                    </div>
                </div>
            </div>
        }

        {isNaN(netIncomeGrowthFiveYears) || !isFinite(netIncomeGrowthFiveYears) || netIncomeGrowthFiveYears === null ? '' : 
            <div>
                <p>Croissance du résultat net sur 5 ans : </p>
                <div className="progress">
                    <div className={getProgressClass(netIncomeGrowthFiveYears)} role="progressbar" style={{ width: `${netIncomeGrowthFiveYears}%` }} aria-valuenow={netIncomeGrowthFiveYears} aria-valuemin="0" aria-valuemax="100">
                        {netIncomeGrowthFiveYears}%
                    </div>
                </div>
            </div>
        }

        {isNaN(averageRatio) || !isFinite(averageRatio) || averageRatio === null ? '' : 
            <div>
                <p>Capex / Résultat net (moyenne 5 ans) : </p>
                <div className="progress">
                    <div className={getProgressClass(averageRatio)} role="progressbar" style={{ width: `${averageRatio}%` }} aria-valuenow={averageRatio} aria-valuemin="0" aria-valuemax="100">
                        {averageRatio}%
                    </div>
                </div>
            </div>
        }

        {isNaN(debtToEquityRatio) || !isFinite(debtToEquityRatio) || debtToEquityRatio === null ? '' : 
            <div>
                <p>Debt to Equity Ratio : </p>
                <div className="progress">
                    <div className={getProgressClass(debtToEquityRatio)} role="progressbar" style={{ width: `${debtToEquityRatio}%` }} aria-valuenow={debtToEquityRatio} aria-valuemin="0" aria-valuemax="100">
                        {debtToEquityRatio}%
                    </div>
                </div>
            </div>
        }

        {isNaN(netSharesRepurchases) || !isFinite(netSharesRepurchases) || netSharesRepurchases === null ? '' : 
            <div>
                <p>Rachat net moyen d'actions (moyenne 5 ans) : </p>
                <div className="progress">
                    <div className={getProgressClass(netSharesRepurchases)} role="progressbar" style={{ width: `${netSharesRepurchases}%` }} aria-valuenow={netSharesRepurchases} aria-valuemin="0" aria-valuemax="100">
                        {netSharesRepurchases}%
                    </div>
                </div>
            </div>
        }

        {isNaN(growthRate) || !isFinite(growthRate) || growthRate === null ? '' : 
            <div>
                <p>Croissance moyenne du dividende sur 5 ans : </p>
                <div className="progress">
                    <div className={getProgressClass(growthRate)} role="progressbar" style={{ width: `${growthRate}%` }} aria-valuenow={growthRate} aria-valuemin="0" aria-valuemax="100">
                        {growthRate}%
                    </div>
                </div>
            </div>
        }

        <div>
          <p>Le dividende n'a pas diminué depuis {currentStreak} an(s)</p>
        </div>

        {isNaN(cagr1Year1) || !isFinite(cagr1Year1) || cagr1Year1 === null ? '' : 
            <div>
                <p>FCF 1 an : {cagr1Year1}%</p>
                <div className="progress">
                    <div className={getProgressClass(cagr1Year1)} role="progressbar" style={{ width: `${cagr1Year1}%` }} aria-valuenow={cagr1Year1} aria-valuemin="0" aria-valuemax="100">
                        {cagr1Year1}%
                    </div>
                </div>
            </div>
        }

        {isNaN(averageRatio) || !isFinite(averageRatio) || averageRatio === null ? '' : 
            <div>
                <p>Capex / Résultat net (moyenne 5 ans) : {averageRatio}%</p>
                <div className="progress">
                    <div className={getProgressClass(averageRatio)} role="progressbar" style={{ width: `${averageRatio}%` }} aria-valuenow={averageRatio} aria-valuemin="0" aria-valuemax="100">
                        {averageRatio}%
                    </div>
                </div>
            </div>
        }

  <p>Total Piotroski Score: {totalScore} / 9 points</p>
    </div>
  )
}