import con from './db.js';

export function sendforce (req,res) {
    const {id , symbol , force} = req.body;    
    console.log(id , symbol , force);
    
    con.query('INSERT INTO analyse VALUES (? , ? , ? , ? , ?)',[null , id , symbol , "force" , force],(err,result)=>{
    })
}

export function sendrisque (req,res) {
    const {id , symbol , risque} = req.body;
    con.query('INSERT INTO analyse VALUES (? , ? , ? , ? , ?)',[null , id , symbol , "risque" , risque],(err,result)=>{
    })
}

export function Listanalyse (req,res) {
    const {symbol , id} = req.body;
    con.query('SELECT * FROM analyse WHERE symbol = ? AND id_user = ?',[symbol , id] ,(err , result)=>{
      res.send(result)
    })
}

export function deleteanalyse (req,res) {
    con.query('DELETE FROM  analyse where id = ?',[req.body.index],(err,result)=>{
    })
}