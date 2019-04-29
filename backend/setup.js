let mysql = require('mysql');
let fs = require('fs');

let connection = mysql.createConnection({
    host     : process.env.DB_HOST || 'localhost',
    user     : 'user',
    password : 'password',
    database : 'db',
    multipleStatements: true
});

let contents = fs.readFileSync('setup.sql', 'utf8');
console.log(contents);
connection.query(contents, function(err) {
    if (err) {
        throw err;
    } else {
        connection.query('SELECT l.*, g.name AS group_name, t.name AS team_name FROM league l JOIN sgroups g ON g.group_id = l.group_id JOIN teams t ON t.team_id = l.team_id ORDER BY group_id, team_id', function(err, results) {
            if (err) {
                throw err;
            }
            let table = [];
            let current_group = [];
            current_group.push(results[0]);
            let current_group_id = results[0].group_id;
            for (let i = 1; i < results.length; i++) {
                if (current_group_id != results[i].group_id) {
                    table.push(current_group);
                    current_group = [];
                    current_group_id = results[i].group_id;
                }
                current_group.push(results[i]);
            }
            table.push(current_group);
            for (let i = 0; i < table.length; i++) {
                let insert = "INSERT INTO fixtures (group_id, home_team, away_team, home_scored, away_scored) VALUES (?, ?, ?, null, null)";
                connection.query(insert, [table[i][0].group_id, table[i][0].team_id, table[i][1].team_id], function(err) {
                    if (err) {
                        throw err
                    }
                });
                connection.query(insert, [table[i][0].group_id, table[i][2].team_id, table[i][3].team_id], function(err) {
                    if (err) {
                        throw err
                    }
                });
                connection.query(insert, [table[i][0].group_id, table[i][0].team_id, table[i][2].team_id], function(err) {
                    if (err) {
                        throw err
                    }
                });
                connection.query(insert, [table[i][0].group_id, table[i][1].team_id, table[i][3].team_id], function(err) {
                    if (err) {
                        throw err
                    }
                });
                connection.query(insert, [table[i][0].group_id, table[i][0].team_id, table[i][3].team_id], function(err) {
                    if (err) {
                        throw err
                    }
                });
                connection.query(insert, [table[i][0].group_id, table[i][1].team_id, table[i][2].team_id], function(err) {
                    if (err) {
                        throw err
                    }
                });
            }
            setTimeout(abort, 3000);
        });
    }
});

function abort() {
    process.exit();
}