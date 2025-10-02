import mysql from "mysql2/promise"; // promise para usar async/await

export const pool = mysql.createPool({
  host: "localhost",
  user: "ruthhdz",
  password: "ruthhdz",
  database: "tiendassintaboo"
});
