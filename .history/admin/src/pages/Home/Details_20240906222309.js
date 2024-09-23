import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const StockChart = () => {
  // Mock data for the chart (you can replace it with API data)
  const data = {
    labels: ['9 Aug', '15 Aug', '21 Aug', '26 Aug', '30 Aug', '6 Sep'],
    datasets: [
      {
        label: 'Stock Price',
        data: [210, 215, 225, 223, 230, 220],
        fill: true,
        backgroundColor: 'rgba(72, 232, 155, 0.2)',
        borderColor: 'rgba(72, 232, 155, 1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          beginAtZero: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="stock-chart">
      {/* Stock details */}
      <div className="stock-details">
        <h1 className="stock-price">220,82 <span>USD</span></h1>
        <p className="stock-change">+13,59 (6,56%) <span>depuis 1 mois</span></p>
        <p className="stock-status">Fermé: 6 sept, 18:15 UTC</p>
        <p className="stock-post-close">Après la clôture 220,10 <span>-0,72 (0,33%)</span></p>
      </div>

      {/* Time period selectors */}
      <div className="time-selectors">
        <button>1j</button>
        <button>5j</button>
        <button className="selected">1m</button>
        <button>6m</button>
        <button>YTD</button>
        <button>1a</button>
        <button>5a</button>
        <button>Max.</button>
      </div>

      {/* Line chart */}
      <Line data={data} options={options} />
    </div>
  );
};

export default StockChart;
