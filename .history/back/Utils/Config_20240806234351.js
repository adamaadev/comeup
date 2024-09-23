import mysql from "mysql";

export default connect(){
    const con = mysql.createConnection({ host: "localhost", user: "root", password: "", database: "comeup" });
con.connect();

}