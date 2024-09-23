import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartComponent = () => {
  const data = {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'], // X-axis labels
    datasets: [
      {
        label: 'Stock Prices', // Line label
        data: [270, 230, 300, 380, 370, 450], // Y-axis data points (replace with actual data)
        fill: false,
        borderColor: 'teal',
        tension: 0.1,
      },
      {
        label: 'Prix juste',
        data: new Array(6).fill(400), // Constant line for "Prix juste"
        borderColor: 'blue',
        borderWidth: 2,
        pointRadius: 0, // No dots on this line
      }
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: false,
        suggestedMin: 200,
        suggestedMax: 500,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return <Line data={data} options={options} height={100}/>;
};

export default ChartComponent;
