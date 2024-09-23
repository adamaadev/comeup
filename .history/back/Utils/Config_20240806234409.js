import mysql from "mysql";

export default function connect(){
  const con = mysql.createConnection({ host: "localhost", user: "root", password: "", database: "comeup" });
  con.connect();
}