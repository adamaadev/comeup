import mysql from "mysql";

export function Connect(){
  const con = mysql.createConnection({ host: "localhost", user: "root", password: "", database: "comeup" });
  con.connect();
}