import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function Region({ symbol }) {
  const [geoData, setGeoData] = useState([]);
  const [logo, setLogo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch geographic revenue data
        const geoResponse = await axios.get(`https://financialmodelingprep.com/api/v4/revenue-geographic-segmentation?symbol=${symbol}&structure=flat&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`);
        console.log('Geographic Data Response:', geoResponse.data); // Log to check the data structure

        // Find the data for 2023
        const geoData2023 = geoResponse.data.find(data => data['2023-06-30']);
        if (!geoData2023) {
          throw new Error('No data found for 2023');
        }
        const geoData2023Values = geoData2023['2023-06-30'];

        // Dynamically map over geoData2023 keys to create formatted data for the PieChart
        const formattedGeoData = Object.keys(geoData2023Values).map((segment, index) => ({
          name: segment, // Use the key (segment name) dynamically
          value: geoData2023Values[segment], // Use the value from the geoData object
          color: getColorByIndex(index), // Dynamically assign colors based on the index
        }));

        console.log('Formatted Geo Data:', formattedGeoData); // Log to verify the formatted data

        setGeoData(formattedGeoData);

        // Fetch logo
        const logoResponse = await axios.post('http://localhost:4000/getlogo', { symbol });
        const logoUrl = logoResponse.data[0]?.logo;
        setLogo(logoUrl);

      } catch (err) {
        setError(err);
        console.error('Fetch Error:', err); // Log any errors
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  // Helper function to assign colors dynamically
  const getColorByIndex = (index) => {
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF']; // Add more if necessary
    return colors[index % colors.length]; // Cycle through colors if there are more segments
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontWeight: 'bold', fontSize: '14px' }} // Adjust font size for better responsiveness
      >
        {`${geoData[index]?.name || 'Unknown'}: $${(geoData[index]?.value / 1e9).toFixed(1)}B`} {/* Divide by 1e9 for billion format */}
      </text>
    );
  };

  return (
    <div className="chart-container" style={{ padding: '20px', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && geoData.length > 0 && (
        <div className="chart-wrapper" style={{ width: '100%', position: 'relative' }}>
          <h3 style={{ textAlign: 'center' }}>Geographic Revenue Distribution (2023)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={geoData}
                cx="50%"
                cy="50%"
                innerRadius={100}
                outerRadius={140}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={renderCustomLabel}
              >
                {geoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {logo && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100px',
                height: '100px',
                overflow: 'hidden',
                marginTop: '20px', // Adjust margin for better spacing
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
