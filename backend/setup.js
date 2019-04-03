var mysql = require('mysql');
var fs = require('fs');

var myCon = mysql.createConnection({
    // host     : 'sql7.freemysqlhosting.net',
    // user     : 'sql7278370',
    // password : 'IAQpVk2u2N',
    // database : 'sql7278370'
    host: 'db',
    port: '3306',
    database: 'db',
    user: 'user',
    password: 'password'
});

var contents = fs.readFileSync('setup.sql', 'utf8').split('\n');
for (var i = 0; i < contents.length; i++) {
    if (contents[i]) {
        console.log(contents[i]);
        myCon.query(contents[i], function(err) {
            if (err) throw err;
        });
    }
}