import con from './db.js';

export function ListCompany (req, res) {
    const { symbol } = req.body;
    con.query("SELECT * FROM screener WHERE symbol = ?", [symbol], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server Error');
      }
      res.send(result);
    });
  }

export function search (req, res) {
    const { query } = req.query;
    con.query( `SELECT Name FROM screener WHERE Name LIKE '%${query}%'`, (err, result) => {
      res.send(result);
    });
}

export function screener(req, res) {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const { pays, secteur, eligiblePea, verseDividende } = req.query;

  let filterConditions = [];
  let queryParams = [];

  if (pays) {
    filterConditions.push('pays = ?');
    queryParams.push(pays);
  }
  if (secteur) {
    filterConditions.push('secteur = ?');
    queryParams.push(secteur);
  }
  if (eligiblePea) {
    filterConditions.push('eligiblePea = ?');
    queryParams.push(eligiblePea === 'true' ? 1 : 0);
  }
  if (verseDividende) {
    filterConditions.push('verseDividende = ?');
    queryParams.push(verseDividende === 'true' ? 1 : 0);
  }

  const filterQuery = filterConditions.length > 0
    ? `WHERE ${filterConditions.join(' AND ')}`
    : '';

  const totalQuery = `SELECT COUNT(*) as count FROM screener ${filterQuery}`;
  const dataQuery = `SELECT * FROM screener ${filterQuery} ORDER BY marketcap DESC LIMIT ? OFFSET ?`;

  queryParams.push(limit, offset);

  con.query(totalQuery, queryParams.slice(0, filterConditions.length), (err, totalResult) => {
    if (err) {
      return res.status(500).send(err);
    }
    const totalCompanies = totalResult[0].count;
    const totalPages = Math.ceil(totalCompanies / limit);

    con.query(dataQuery, queryParams, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send({
        data: result,
        totalPages: totalPages,
        currentPage: page
      });
    });
  });
}
