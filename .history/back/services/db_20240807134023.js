import mysql from "mysql";

const con = mysql.createConnection({ host:"localhost", user:"root", password: "", database:"comeup"});

con.connect();

export default con;
