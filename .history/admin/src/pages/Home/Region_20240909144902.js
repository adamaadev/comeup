import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

...

<ResponsiveContainer width="100%" height={400}>
  <PieChart>
    <Pie
      data={geoData}
      cx="50%"
      cy="50%"
      innerRadius={100}
      outerRadius={140}
      fill="#8884d8"
      paddingAngle={5}
      dataKey="value"
    >
      {geoData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.color} />
      ))}
      {/* Adding labels with dashed lines */}
      <Label
        content={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
          const RADIAN = Math.PI / 180;
          const radius = 25 + innerRadius + (outerRadius - innerRadius) * 0.5;
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);

          const labelRadius = 10 + outerRadius;
          const labelX = cx + labelRadius * Math.cos(-midAngle * RADIAN);
          const labelY = cy + labelRadius * Math.sin(-midAngle * RADIAN);

          return (
            <>
              {/* Dashed lines */}
              <line
                x1={x}
                y1={y}
                x2={labelX}
                y2={labelY}
                stroke="#8884d8"
                strokeDasharray="3 3"
              />
              {/* Text labels */}
              <text
                x={labelX}
                y={labelY}
                fill="black"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
              >
                {geoData[index].name}
              </text>
            </>
          );
        }}
      />
    </Pie>
    <Pie
      data={[{ value: 100 }]}
      cx="50%"
      cy="50%"
      innerRadius={0}
      outerRadius={100}
      fill="#fff"
      dataKey="value"
    />
    <Tooltip />
    <Legend layout="horizontal" align="center" verticalAlign="bottom" />
  </PieChart>
</ResponsiveContainer>
