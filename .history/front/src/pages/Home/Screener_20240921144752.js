import { useEffect } from "react";
import React , useEffect from 'react'

export default function Screener() {
  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        // Filtrer les entreprises avec un point dans leur symbole au chargement initial
        const filteredData = res.data;
        const sortedData = filteredData.sort((a, b) => b.Capitalisation - a.Capitalisation); // Décroissant
        setInfos(sortedData);
        setFilteredInfos(sortedData); // Initialement, les infos filtrées sont les mêmes que les infos triées
      });
  }, []);

  return (
    <div>Screener</div>
  )
}
