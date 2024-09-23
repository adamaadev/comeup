import React from 'react'

export default function BaremeQuali() {
  return (
    <div className="container">
  <div className="row">
  <div className="col-md-4">
      <h2>Quanti Score</h2>
      <table className="table table-bordered">
        <thead className='Bareme'>
          <tr>
            <th>Score total / 20</th>
            <th>Couleur</th>
            <th>Classement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{'>='}15 points</td>
            <td>Verte</td>
            <td>Excellente</td>
          </tr>
          <tr>
            <td>Entre 10 et 15 points</td>
            <td>Orange</td>
            <td>Correcte</td>
          </tr>
          <tr>
            <td>{'<'}10 points</td>
            <td>Rouge</td>
            <td>Faible</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="col-md-4">
      <h2>Quali Score</h2>
      <table className="table table-bordered">
        <thead className='Bareme'>
          <tr>
            <th>Score total / 20</th>
            <th>Couleur</th>
            <th>Classement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{'>='}15 points</td>
            <td>Verte</td>
            <td>Excellente</td>
          </tr>
          <tr>
            <td>Entre 10 et 15 points</td>
            <td>Orange</td>
            <td>Correcte</td>
          </tr>
          <tr>
            <td>{'<'}10 points</td>
            <td>Rouge</td>
            <td>Faible</td>
          </tr>
        </tbody>
      </table>
    </div>    
    <div className="col-md-4">
      <h2>Checklist qualitative</h2>
      <table className="table table-bordered">
        <thead className='Bareme'>
          <tr>
            <th>Réponses</th>
            <th>Points attribués</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Oui</td>
            <td>+1 point</td>
          </tr>
          <tr>
            <td>Non</td>
            <td>+0 point</td>
          </tr>
          <tr>
            <td>Partiellement</td>
            <td>+0.5 point</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
  )
}
