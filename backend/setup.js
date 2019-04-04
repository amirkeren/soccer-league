var mysql = require('mysql');
var fs = require('fs');

var myCon = mysql.createConnection({
    host: 'db',
    port: '3306',
    database: 'db',
    user: 'user',
    password: 'password',
    multipleStatements: true
});

var contents = fs.readFileSync('setup.sql', 'utf8');
console.log(contents);
myCon.query(contents, function(err) {
    if (err) {
        throw err;
    } else {
        process.exit()
    }
});