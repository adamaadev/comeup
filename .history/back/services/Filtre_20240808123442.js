import con from './db.js';

export function countries (req, res) {
    const countriesQuery = "SELECT DISTINCT pays FROM screener WHERE pays IS NOT NULL";
  
    con.query(countriesQuery, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send(result.map(row => row.pays));
    });
};
  
export function secteurs (req, res) {
    const secteursQuery = "SELECT DISTINCT secteur FROM screener WHERE secteur IS NOT NULL";
  
    con.query(secteursQuery, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send(result.map(row => row.secteur));
    });
};
  
  app.get('/exchanges', (req, res) => {
    const exchangesQuery = "SELECT DISTINCT exchangeShortName FROM screener WHERE exchangeShortName IS NOT NULL";
  
    con.query(exchangesQuery, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send(result.map(row => row.exchangeShortName));
    });
  });