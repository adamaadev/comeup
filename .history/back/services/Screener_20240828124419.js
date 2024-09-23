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
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = (page - 1) * limit;
  const secteur = req.query.secteur || '';
  const exchangeShortName = req.query.exchangeShortName || '';

  let whereClauses = [];
  let params = [];
  
  if (secteur) {
    whereClauses.push('secteur = ?');
    params.push(secteur);
  }
  if (exchangeShortName) {
    whereClauses.push('exchangeShortName = ?');
    params.push(exchangeShortName);
  }

  let whereClause = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

  let totalQuery = `SELECT COUNT(*) as count FROM screener ${whereClause}`;
  let dataQuery = `SELECT * FROM screener ${whereClause} ORDER BY marketcap DESC LIMIT ? OFFSET ?`;

  con.query(totalQuery, params, (err, totalResult) => {
    if (err) {
      return res.status(500).send('Server Error');
    }
    const totalCompanies = totalResult[0].count;
    const totalPages = Math.ceil(totalCompanies / limit);

    params.push(limit, offset);
    con.query(dataQuery, params, (err, result) => {
      if (err) {
        return res.status(500).send('Server Error');
      }
      res.send({
        data: result,
        totalPages: totalPages,
        currentPage: page
      });
    });
  });
}
