import con from './db.js';

export function Watchlist(req, res) {
    const { id, type } = req.body;
    con.query("SELECT symbol FROM watchlist WHERE id_user = ? AND type_user = ?", [id, type], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (result.length > 0) {
        const symbols = result.map(row => row.symbol);
        con.query("SELECT * FROM screener WHERE symbol IN (?)", [symbols], (err, screenerResult) => {
          res.send(screenerResult);
        });
      } else {
        res.send([]);
      }
    });
}

app.post('/save-order', (req, res) => {
  const { id, order } = req.body;

  const updatePromises = order.map((company, index) => {
    return new Promise((resolve, reject) => {
      con.query(
        "UPDATE watchlist SET position = ? WHERE symbol = ? AND id_user = ?",
        [index, company.symbol, id],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  });

  Promise.all(updatePromises)
    .then(() => res.send('Order saved successfully'))
    .catch((err) => res.status(500).send(err));
});

export function AddCompany (req,res) {
    const { symbol, id , type } = req.body;
    con.query('INSERT INTO watchlist VALUES (?, ?, ?,?)',[null , id , symbol , type],(err,result)=>{
      if(!err){
        res.send({success : true})
      }
    })
}

export function deletecompany(req, res) {
    const { symbol, id, type } = req.body;
    con.query("DELETE FROM watchlist WHERE symbol = ? AND id_user = ? AND type_user = ?", [symbol, id, type], (err, result) => {
      if (err) {
        res.status(500).send({ success: false, message: 'Erreur lors de la suppression' });
      } else {
        res.send({ success: true, message: 'Suppression réussie' });
      }
    });
}

export function ListCompanies (req, res){
    con.query("SELECT * FROM watchlist WHERE type_user = 'admin'", (err, watchlistResult) => {
      if (watchlistResult && watchlistResult.length > 0) {
        const symbols = watchlistResult.map(watch => watch.symbol);
        const screener2Results = [];
        let completedRequests = 0;
  
        symbols.forEach(symbol => {
          con.query("SELECT * FROM screener WHERE symbol = ?", [symbol], (err, screener2Result) => {
            if (screener2Result && screener2Result.length > 0) {
              screener2Results.push({
                symbol: symbol,
                screener2Data: screener2Result[0]
              });
            }
            completedRequests++;
            if (completedRequests === symbols.length) {
              res.send(screener2Results);
            }
          });
        });
      } else {
        res.send([]); 
      }
    });
}

export function checkcompany(req, res) {
    const { symbol, id, type } = req.body;
    con.query("SELECT * FROM watchlist WHERE symbol = ? and id_user = ? and type_user = ?", [symbol, id, type], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server Error');
      }
      if (result.length > 0) {
        res.send({ exist: true });
      } else {
        res.send({ exist: false });
      }
    });
}