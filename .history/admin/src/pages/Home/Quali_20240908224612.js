import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'United States', value: 94.0, color: '#0088FE' },
  { name: 'Europe', value: 64.1, color: '#00C49F' },
  { name: 'Greater China', value: 72.0, color: '#FFBB28' },
  { name: 'Rest of Asia Pacific', value: 29.6, color: '#FF8042' },
  { name: 'Japan', value: 24.3, color: '#A28EFF' },
  { name: 'Americas, excl. USA', value: 24.0, color: '#FFC658' }
];

const COLORS = data.map(d => d.color);

const DonutChart = () => {
  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx={200}
        cy={200}
        innerRadius={100}
        outerRadius={140}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default DonutChart;
