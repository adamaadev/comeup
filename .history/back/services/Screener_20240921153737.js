import con from './db.js';

export function ListCompany(req, res) {
  const { symbol } = req.body;
  con.query("SELECT * FROM screener WHERE symbol = ?", [symbol], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }
    res.send(result);
  });
}

export function search(req, res) {
  const { query } = req.query;
  con.query("SELECT Name FROM screener WHERE Name LIKE ?", [`%${query}%`], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }
    res.send(result);
  });
}

export function screener(req, res) {
  const query = `
    SELECT * FROM screener
    WHERE NOT (pays = 'États-Unis' AND (symbol LIKE '%.%' OR symbol LIKE '%-%'))
  `;
  
  con.query(query, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(result);
  });
}
