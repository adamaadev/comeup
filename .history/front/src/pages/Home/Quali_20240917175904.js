import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'iPhone', value: 200.6, color: '#4285F4' },
  { name: 'Services', value: 85.2, color: '#34A853' },
  { name: 'Wearables, Home and Accessories', value: 39.8, color: '#FBBC05' },
  { name: 'Mac', value: 29.4, color: '#EA4335' },
  { name: 'iPad', value: 28.3, color: '#9E69D2' },
];

const COLORS = ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#9E69D2'];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = 25 + innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      fontSize={14}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${data[index].name}: $${data[index].value}B`}
    </text>
  );
};

const DonutChart = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Apple Inc's 2023-09 Operating Revenue by Business Segment</h2>
      <PieChart width={600} height={400}>
        <Pie
          data={data}
          cx={300}
          cy={200}
          innerRadius={90}
          outerRadius={140}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label={renderCustomizedLabel}
          labelLine={false} // Disabling label lines
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
          iconSize={10}
          wrapperStyle={{ fontSize: '14px' }}
        />
      </PieChart>
    </div>
  );
};

export default DonutChart;
