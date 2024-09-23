import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueChart() {
  // Data based on the image provided
  const data = [
    { name: 'United States', value: 138.6, color: '#0088FE' },
    { name: 'Europe', value: 94.3, color: '#00C49F' },
    { name: 'Greater China', value: 72.6, color: '#FFBB28' },
    { name: 'Rest of Asia Pacific', value: 29.6, color: '#FF8042' },
    { name: 'Japan', value: 24.3, color: '#8A2BE2' },
    { name: 'Americas, excluding U.S', value: 24.0, color: '#FFD700' },
  ];

  // Custom label rendering function
  const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 40; // Adjust this value for line length
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontWeight: 'bold' }}
      >
        {`${data[index].name}: $${data[index].value}B`}
      </text>
    );
  };

  return (
    <div className="chart-wrapper" style={{ position: 'relative', width: '100%', height: '500px' }}>
      <h3>Operating Revenue by Geographical Region</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={100}
            outerRadius={150}
            dataKey="value"
            label={renderCustomLabel}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      {/* Add the logo in the center */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80px',
          height: '80px',
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" // Replace with local logo if needed
          alt="Apple Logo"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}
