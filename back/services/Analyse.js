import con from './db.js';

export function sendforce(req, res) {
    const { id, symbol, force } = req.body;
    if (!id || !symbol || !force) {
        return res.status(400).send("Invalid data");
    }

    const query = 'INSERT INTO analyse (id, id_user, symbol, type, content) VALUES (?, ?, ?, ?, ?)';
    con.query(query, [null, id, symbol, "force", force], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send("Force added successfully");
    });
}

export function sendrisque(req, res) {
    const { id, symbol, risque } = req.body;
    if (!id || !symbol || !risque) {
        return res.status(400).send("Invalid data");
    }

    const query = 'INSERT INTO analyse (id, id_user, symbol, type, content) VALUES (?, ?, ?, ?, ?)';
    con.query(query, [null, id, symbol, "risque", risque], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send("Risque added successfully");
    });
}

export function Listanalyse(req, res) {
    const { symbol, id } = req.body;
    if (!symbol || !id) {
        return res.status(400).send("Invalid data");
    }

    const query = 'SELECT * FROM analyse WHERE symbol = ? AND id_user = ?';
    con.query(query, [symbol, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(result);
    });
}

export function deleteanalyse(req, res) {
    const { id } = req.body;
    if (!id) {
        return res.status(400).send("Invalid data");
    }

    const query = 'DELETE FROM analyse WHERE id = ?';
    con.query(query, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send("Analysis deleted successfully");
    });
}
