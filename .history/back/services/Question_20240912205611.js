import con from './db.js';

export function sendquestion(req, res) {
  const { id, symbol, modalQuestion, selectedResponse, justification } = req.body;
  con.query("INSERT INTO questions VALUES (?, ?, ?, ?, ?,?)",
    [null,symbol, modalQuestion, selectedResponse, justification, id,], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion de la question :', err);
      res.status(500).send('Erreur serveur');
    } else {
      res.send('Question ajoutée avec succès');
    }
  });
}

export function getExistingQuestions(req, res) {
    const { id, symbol } = req.body;
    con.query('SELECT question FROM questions WHERE symbol = ? AND id_user = ?',[symbol , id], (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des questions existantes :', err);
        res.status(500).send('Erreur serveur');
      } else {
        const existingQuestions = results.map(result => result.question);
        res.json(existingQuestions);
      }
    });
};
  
export function checkscore(req,res){
    const { id, symbol } = req.body;
    con.query('SELECT reponse From questions WHERE symbol = ? AND id_user = ?',[symbol , id], (err , result)=>{
      res.send(result)
    } )
}

export function updateQuestion(req, res) {
  const { id, symbol, modalQuestion, selectedResponse, justification } = req.body;
  con.query(
      "UPDATE questions SET reponse = ?, justification = ? WHERE symbol = ? AND id_user = ? AND question = ?",
      [selectedResponse, justification, symbol, id, modalQuestion],
      (err, result) => {
          if (err) {
              console.error('Erreur lors de la mise à jour de la question :', err);
              res.status(500).send('Erreur serveur');
          } else {
              res.send('Mise à jour réussie');
          }
      }
  );
}

export function resetQuestions(req, res) {
  const { id, symbol } = req.body;
  con.query('DELETE FROM questions WHERE symbol = ? AND id_user = ?', [symbol, id], (err) => {
    if (err) {
      console.error('Erreur lors de la réinitialisation des questions :', err);
      res.status(500).send('Erreur serveur');
    } else {
      res.send('Réinitialisation réussie');
    }
  });
}
