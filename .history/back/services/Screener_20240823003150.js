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


export function getFilterOptions(req, res) {
  const { filterType } = req.query;

  let query;
  switch (filterType) {
    case 'pays':
      query = 'SELECT DISTINCT pays AS value, pays AS label FROM screener';
      break;
    case 'secteur':
      query = 'SELECT DISTINCT secteur AS value, secteur AS label FROM screener';
      break;
    case 'eligiblePea':
      query = 'SELECT DISTINCT eligiblePea AS value, CASE WHEN eligiblePea = 1 THEN "Oui" ELSE "Non" END AS label FROM screener';
      break;
    case 'verseDividende':
      query = 'SELECT DISTINCT verseDividende AS value, CASE WHEN verseDividende = 1 THEN "Oui" ELSE "Non" END AS label FROM screener';
      break;
    default:
      return res.status(400).send('Invalid filter type');
  }

  con.query(query, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(result);
  });
}

export function screener(req, res) {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const filterType = req.query.filterType;
  const filterValue = req.query.filterValue;

  let totalQuery = 'SELECT COUNT(*) as count FROM screener';
  let dataQuery = 'SELECT * FROM screener ORDER BY marketcap DESC LIMIT ? OFFSET ?';

  if (filterType && filterValue) {
    totalQuery = `SELECT COUNT(*) as count FROM screener WHERE ${filterType} = ?`;
    dataQuery = `SELECT * FROM screener WHERE ${filterType} = ? ORDER BY marketcap DESC LIMIT ? OFFSET ?`;
  }

  con.query(totalQuery, filterValue ? [filterValue] : [], (err, totalResult) => {
    if (err) {
      return res.status(500).send(err);
    }
    const totalCompanies = totalResult[0].count;
    const totalPages = Math.ceil(totalCompanies / limit);

    con.query(dataQuery, filterValue ? [filterValue, limit, offset] : [limit, offset], (err, result) => {
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