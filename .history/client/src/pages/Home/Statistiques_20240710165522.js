import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

export default function Statistiques({symbol}) {
  const symbol = 'AAPL'; // Remplacez par le symbole de l'entreprise souhaitée
  const [financialData, setFinancialData] = useState([]);
  const chartContainer = useRef(null);
  const pieChartContainer = useRef(null);
  const chartInstance = useRef(null);
  const pieChartInstance = useRef(null);

  useEffect(() => {
    fetchFinancialData(symbol);
  }, [symbol]);

  const fetchFinancialData = (symbol) => {
    axios.get(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=11&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
      .then(res => {
        console.log(res.data);
        setFinancialData(res.data.reverse()); // Reverse the data array to display in descending order of dates
        plotLineChart(res.data);
        plotPieChart(res.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setFinancialData([]);
        if (chartInstance.current) {
          chartInstance.current.destroy(); // Destroy the chart instance if it exists
        }
        if (pieChartInstance.current) {
          pieChartInstance.current.destroy(); // Destroy the pie chart instance if it exists
        }
      });
  };

  const plotLineChart = (data) => {
    if (!chartContainer.current || !data.length) return;

    const years = data.map(item => item.date.substring(0, 4));
    const revenues = data.map(item => item.revenue / 1000000); // Convert revenue to millions for better scale
    const netIncomes = data.map(item => item.netIncome / 1000000); // Convert net income to millions

    if (chartInstance.current) {
      chartInstance.current.data.labels = years;
      chartInstance.current.data.datasets[0].data = revenues;
      chartInstance.current.data.datasets[1].data = netIncomes;
      chartInstance.current.update(); // Update the chart with new data
    } else {
      const ctx = chartContainer.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: years,
          datasets: [
            {
              label: 'Revenu (en millions $)',
              data: revenues,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.1
            },
            {
              label: 'Bénéfice net (en millions $)',
              data: netIncomes,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              tension: 0.1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Montant (en millions $)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Année'
              }
            }
          }
        }
      });
    }
  };

  const plotPieChart = (data) => {
    if (!pieChartContainer.current || !data.length) return;

    // Calculate total revenue and net income
    const totalRevenue = data.reduce((acc, item) => acc + item.revenue, 0);
    const totalNetIncome = data.reduce((acc, item) => acc + item.netIncome, 0);

    // Assuming data includes revenue breakdown by region
    const revenueByRegion = {
      NorthAmerica: totalRevenue * 0.6, // Example percentages for illustration
      Europe: totalRevenue * 0.3,
      Asia: totalRevenue * 0.1
    };

    const ctx = pieChartContainer.current.getContext('2d');
    pieChartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(revenueByRegion),
        datasets: [{
          label: 'Répartition des revenus par région',
          data: Object.values(revenueByRegion),
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.label + ': ' + tooltipItem.raw.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
              }
            }
          }
        }
      }
    });
  };

  return (
    <div>
      <div>
        <h2>Évolution du cours de l'action pour {symbol}</h2>
        <canvas ref={chartContainer} style={{ maxWidth: '600px', maxHeight: '400px' }}></canvas>
      </div>

      <div>
        <h2>Répartition des revenus par région</h2>
        <canvas ref={pieChartContainer} style={{ maxWidth: '400px', maxHeight: '400px' }}></canvas>
      </div>
    </div>
  );
}
