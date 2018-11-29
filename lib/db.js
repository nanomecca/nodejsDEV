var mysql = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'nano_db'
})
db.connect();

module.exports = db;  //API가 하나일경우
