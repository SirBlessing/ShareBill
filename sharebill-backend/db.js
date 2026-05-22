// const mysql = require("mysql2/promise");
// require("dotenv").config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "",
//   database: process.env.DB_NAME || "sharebill_db",
//   waitForConnections: true,
//   connectionLimit: 10,
// });

// module.exports = pool;


const mysql = require("mysql2/promise");
require("dotenv").config();

// If DATABASE_URL exists (on Render), use it. Otherwise, use your local configuration object.
const connectionConfig = process.env.DATABASE_URL || {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sharebill_db",
};

const pool = mysql.createPool(connectionConfig);

module.exports = pool;
