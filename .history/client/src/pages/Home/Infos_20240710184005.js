import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function App({ symbol }) {
  
  return (
    <div>
      <p>Buyback yield 1 an {symbol} : {App} %</p>
      <div>
      <p>Roce 1 an : {roce23} %</p>
      <p>Roce 5 ans : {pct1} %</p>
      <p>Performance moyenne sur les 5 dernières années pour {symbol}</p>
      <p>CAGR sur 5 ans : {cagr5Years !== null ? `${cagr5Years}%` : 'Calcul en cours...'}</p>
      <p>Payout Ratio de {symbol} : {payoutRatio}% </p>
      <p>Free Cash Flow Margin pour {symbol}</p>

{fcfMarginOneYear !== null && (
  <p>Free Cash Flow Margin 1 an : {fcfMarginOneYear}%</p>
)}
    <p>Free Cash Flow Margin 5 ans : {averageMarginFiveYears}%</p>
    <p>Croissance Annualisée du Dividende : {annualizedGrowthRate}%</p>
      <p>Croissance du résultat net sur 1 an: {netIncomeGrowthOneYear}%</p>
      <p>Croissance du résultat net sur 5 ans: {netIncomeGrowthFiveYears}%</p>
      <p>Croissance du résultat net sur 10 ans: {netIncomeGrowthTenYears}%</p>
      <p>Capex / Résultat net (moyenne 5 ans) : {averageRatio}%</p>
      <p>Debt to Equity Ratio de : {debtToEquityRatio}</p>
      <p>Rachat net moyen d'actions (moyenne 5 ans) {symbol}: {netSharesRepurchases}</p>
      <p>Croissance moyenne du dividende sur 5 ans {symbol}: {growthRate.toFixed(2)} %</p>
      <p> Le dividende n'a pas diminué depuis {currentStreak} an(s)</p>
      <p>Calculs de croissance du Free Cash Flow pour {symbol}</p>
      <p>CAGR sur 1 an : {cagr1Year1 !== null ? `${cagr1Year1}%` : 'Calcul en cours...'}</p>
      <p>CAGR sur 5 ans : {cagr5Years2 !== null ? `${cagr5Years2}%` : 'Calcul en cours...'}</p>
      <p>CAGR sur 10 ans : {cagr10Years3 !== null ? `${cagr10Years3}%` : 'Calcul en cours...'}</p>
    </div>
    </div>
  )
}