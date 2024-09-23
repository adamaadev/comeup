import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueCharts({ symbol }) {
  const [geoData, setGeoData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [logo, setLogo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const predefinedColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF7F50', '#8470FF']; // Adjust the number of colors

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch product revenue data
        const productResponse = await axios.get(
          `https://financialmodelingprep.com/api/v4/revenue-product-segmentation?symbol=${symbol}&structure=flat&period=annual&apikey=YOUR_API_KEY`
        );
        
        const productDataRaw = productResponse.data[0];
        const latestProductData = productDataRaw && Object.values(productDataRaw)[0];

        if (latestProductData) {
          const formattedProductData = Object.entries(latestProductData).map(([key, value]) => {
            return { name: key, value }; 
          });
          setProductData(formattedProductData);
        } else {
          setProductData([]);
        }

        // Fetch geographic revenue data
        const geoResponse = await axios.get(
          `https://financialmodelingprep.com/api/v4/revenue-geographic-segmentation?symbol=${symbol}&structure=flat&apikey=YOUR_API_KEY`
        );
        
        const geoDataRaw = geoResponse.data[0];
        const latestGeoData = geoDataRaw && Object.values(geoDataRaw)[0];
        
        if (latestGeoData) {
          const formattedGeoData = Object.entries(latestGeoData).map(([key, value]) => {
            return { name: key, value }; 
          });
          setGeoData(formattedGeoData);
        } else {
          setGeoData([]);
        }

        // Fetch logo data
        const logoResponse = await axios.post('http://localhost:4000/getlogo', { symbol });
        const logoUrl = logoResponse.data[0]?.logo;
        setLogo(logoUrl);

      } catch (err) {
        setError('An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setGeoData([]);
      setProductData([]);
      setLogo('');
      setError(null);
    };
  }, [symbol]);

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }, data) => {
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
        style={{ fontWeight: 'bold', lineHeight: '2' }}
      >
        {`${data[index].name}: $${(data[index].value / 1e9).toFixed(1)}B`}
      </text>
    );
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="charts-container" style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
      <div className="product-segmentation" style={{ width: '50%' }}>
        <h3>2023-09 Operating Revenue by Business Segment</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={productData}
              cx="50%"
              cy="50%"
              innerRadius={100}
              outerRadius={140}
              fill="#8884d8"
              dataKey="value"
              label={(props) => renderCustomLabel(props, productData)}
            >
              {productData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={predefinedColors[index % predefinedColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="geo-segmentation" style={{ width: '50%' }}>
        <h3>2023-09 Operating Revenue by Geographic Region</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={geoData}
              cx="50%"
              cy="50%"
              innerRadius={100}
              outerRadius={140}
              fill="#8884d8"
              dataKey="value"
              label={(props) => renderCustomLabel(props, geoData)}
            >
              {geoData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={predefinedColors[index % predefinedColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
