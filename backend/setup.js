var mysql = require('mysql');
var fs = require('fs');

var connection = mysql.createConnection({
    host     : process.env.HOST || 'localhost',
    user     : 'user',
    password : 'password',
    database : 'db',
    multipleStatements: true
});

var contents = fs.readFileSync('setup.sql', 'utf8');
console.log(contents);
connection.query(contents, function(err) {
    if (err) {
        throw err;
    } else {
        process.exit()
    }
});