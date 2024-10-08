import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BaremeQuanti() {

  return (
    <div style={{ margin: '20px' }}>
      <table className="table table-bordered">
        <thead className='Bareme'>
          <tr>
          <th colSpan="3" className="no-border"></th>
            <th colSpan="3">Croissance</th>
            <th colSpan="3">FCF</th>
            <th colSpan="2">Résultat Net</th>
            <th colSpan="1">Capex / Résultat Net</th>
            <th colSpan="2">Roce</th>
            <th colSpan="2">FCF Margin</th>
            <th colSpan="1">Debt / Equity</th>
            <th colSpan="1">Payout Ratio</th>
            <th colSpan="3">Dividende</th>
            <th colSpan="3">Autres</th>
          </tr>
          <tr>
            <th>Criteres</th>
            <th>Quanti Score / 20</th>
            <th>Performance 5 A</th>
            <th>CA 1 A</th>
            <th>CA 5 A</th>
            <th>CA 10 A</th>
            <th>1 A</th>
            <th>5 A</th>
            <th>10 A</th>
            <th>1 A</th>
            <th>5 A</th>
            <th>5 A</th>
            <th>1 A</th>
            <th>5 A</th>
            <th>1 A</th>
            <th>5 A</th>
            <th>1 A</th>
            <th>1 A</th>
            <th>1 A</th>
            <th>5 A</th>
            <th>10 A</th>
            <th>Buyback Yield</th>
            <th>Piotroski Score</th>
            <th>Rachat Net</th>
          </tr>
          <tr>
            <td>Excellent</td>
            <td>15+</td>
            <td>13%+</td>
            <td>10%+</td>
            <td>10%+</td>
            <td>10%+</td>
            <td>9%+</td>
            <td>10%+</td>
            <td>10%+</td>
            <td>12%+</td>
            <td>14%+</td>
            <td>20%-</td>
            <td>14%+</td>
            <td>15%+</td>
            <td>10%+</td>
            <td>10%</td>
            <td>0.5</td>
            <td>35-</td>
            <td>10%+</td>
            <td>8%+</td>
            <td>20+</td>
            <td>4%+</td>
            <td>7-9</td>
            <td>-</td>
          </tr>
          <tr>
            <td>Correct</td>
            <td>10-14</td>
            <td>4-13%</td>
            <td>7-10%</td>
            <td>7-10%</td>
            <td>7-10%</td>
            <td>5-9%</td>
            <td>7-10%</td>
            <td>7-10%</td>
            <td>10-12%</td>
            <td>8-14%</td>
            <td>20-40%</td>
            <td>7-14%</td>
            <td>7-15%</td>
            <td>5-10%</td>
            <td>6-10%</td>
            <td>05-1</td>
            <td>35-50</td>
            <td>5-10%</td>
            <td>5-8%</td>
            <td>10-20</td>
            <td>2-4%</td>
            <td>5-6</td>
            <td>=</td>
          </tr>
          <tr>
           <td>Faible</td>
            <td>10-</td>
            <td>4%-</td>
            <td>7%-</td>
            <td>7%-</td>
            <td>7%-</td>
            <td>5%-</td>
            <td>7%-</td>
            <td>7%-</td>
            <td>10%-</td>
            <td>8%-</td>
            <td>40%+</td>
            <td>7%-</td>
            <td>7%-</td>
            <td>5%-</td>
            <td>6%-</td>
            <td>1+</td>
            <td>50%+</td>
            <td>5%+</td>
            <td>5%-</td>
            <td>10-</td>
            <td>2%-</td>
            <td>4-</td>
            <td>+</td>
          </tr>
          <tr>
            <td>Mediane</td>
            <td>8%</td>
            <td>4%</td>
            <td>7%</td>
            <td>7%</td>
            <td>7%</td>
            <td>9%</td>
            <td>7%</td>
            <td>8%</td>
            <td>-0.89%</td>
            <td>8%</td>
            <td>20%</td>
            <td>7%</td>
            <td>7%</td>
            <td>7%</td>
            <td>6%</td>
            <td>1</td>
            <td>40%</td>
            <td>5%</td>
            <td>6%</td>
            <td>11</td>
            <td>2%</td>
            <td>6</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  );
}