function dbConnect()
{
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  port:3307,
  user: "sahil",
password: "JK02bb8911",
database:"auth"

});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
}

module.exports = dbConnect;