const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  password: "Adai2003",
  host: "localhost",
  port: 5432,
  database: "uni",
});

module.exports = pool;
