import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';

const RevenueGeographicSegmentation = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logo, setLogo] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const fetchLogo = async () => {
    try {
      const response = await axios.get('https://financialmodelingprep.com/api/v3/profile/AAPL?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX');
      const companyData = response.data[0];
      setLogo(companyData.image);
    } catch (err) {
      setError(err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://financialmodelingprep.com/api/v4/revenue-geographic-segmentation?symbol=AAPL&structure=flat&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX');
      const fetchedData = response.data;
      
      const formattedData = fetchedData.map(item => {
        const [date, values] = Object.entries(item)[0];
        return {
          name: date,
          ...values
        };
      });

      const aggregatedData = formattedData.reduce((acc, item) => {
        Object.keys(item).forEach(key => {
          if (key !== 'name') {
            if (!acc[key]) {
              acc[key] = 0;
            }
            acc[key] += item[key];
          }
        });
        return acc;
      }, {});

      const pieData = Object.keys(aggregatedData).map(key => ({
        name: key,
        value: aggregatedData[key]
      }));

      setData(pieData);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLogo();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6F61', '#6A5ACD'];

  return (
    <div className="chart-container">
      <h2>Revenue Geographic Segmentation</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={(data, index) => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
              />
              {/* Add a Line pointing towards the United States legend */}
              <Line
                x1="400" // Position the start point of the line (adjust as necessary)
                y1="200" // Adjust the position of the line based on your chart
                x2="350"
                y2="180"
                stroke="#0088FE" // Use the same color as the US segment
                strokeWidth={2}
              />
            </PieChart>
          </ResponsiveContainer>
          <img src={logo} alt="Company Logo" className="logo-overlay" />
        </div>
      )}
    </div>
  );
};

export default RevenueGeographicSegmentation;
