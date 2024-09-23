import React from 'react';

const QuantitativeScore = () => {
  return (
    <div className="container">
      <h2>Note quantitative</h2>
      <div className="score-bar">
        <span>6 / 20</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '30%' }}></div>
        </div>
      </div>

      <div className="grid-container">
        <Section title="Rentabilité" items={[
          { label: "ROIC 1A", value: "0,72%", color: "red" },
          { label: "ROIC 5A", value: "0,48%", color: "red" },
          { label: "ROIC 10A", value: "0,52%", color: "red" },
          { label: "ROCE 1A", value: "5,14%", color: "red" },
          // Add other items
        ]} />

        <Section title="Profits" items={[
          { label: "Marge brute", value: "36,2%", color: "blue" },
          { label: "Marge opé.", value: "12,58%", color: "blue" },
          { label: "Marge nette", value: "1,91%", color: "red" },
          // Add other items
        ]} />

        <Section title="Croissance" items={[
          { label: "CA 1A", value: "15%", color: "green" },
          { label: "CA 5A", value: "10,8%", color: "green" },
          { label: "CA 10A", value: "36,2%", color: "green" },
          { label: "Prédictibilité", value: "78%", color: "blue" },
          // Add other items
        ]} />

        <Section title="Dividende" items={[
          { label: "Div 1A", value: "-25%", color: "red" },
          // Add other items
        ]} />

        <Section title="Santé" items={[
          { label: "Dettes", value: "8,43", color: "red" },
          { label: "Payout ratio", value: "35%", color: "blue" },
          // Add other items
        ]} />
      </div>
    </div>
  );
};

const Section = ({ title, items }) => (
  <div className="section">
    <h3>{title}</h3>
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          <span>{item.label}: </span>
          <div className="progress-item">
            <div className={`progress-bar ${item.color}`} style={{ width: item.value }}></div>
            <span>{item.value}</span>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default QuantitativeScore;
