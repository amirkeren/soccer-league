var express = require('express');
var router = express.Router();

var app = express();
app.use(express.json());

var mysql      = require('mysql');
var connection = mysql.createConnection({
    // host     : 'sql7.freemysqlhosting.net',
    // user     : 'sql7278370',
    // password : 'IAQpVk2u2N',
    // database : 'sql7278370'
    host     : 'localhost',
    user     : 'user',
    password : 'password',
    database : 'db'
});

router.get('/players', function(req, res) {
    connection.query('SELECT * from players order by goals_scored desc, goals_assisted desc, name', function (error, results) {
        if (error) {
            res.json({ error: "can't load players" });
            return;
        }
        res.contentType('application/json');
        res.send(results);
    });
});

router.get('/league', function(req, res) {
    connection.query('SELECT l.*, goals_scored - goals_against AS goal_difference, g.name AS group_name, t.name AS team_name FROM league l JOIN groups g ON g.group_id = l.group_id JOIN teams t ON t.team_id = l.team_id ORDER BY group_id, points desc, goals_scored - goals_against desc, goals_scored desc, team_id asc', function (error, results) {
        if (error) {
          res.json({ error: "can't load league standings" });
          return;
        }
        let table = [];
        let current_group = [];
        current_group.push(results[0]);
        let current_group_id = results[0].group_id;
        for (var i = 1; i < results.length; i++) {
            if (current_group_id != results[i].group_id) {
              table.push(current_group);
              current_group = [];
              current_group_id = results[i].group_id;
            }
            current_group.push(results[i]);
        }
        table.push(current_group);
        res.contentType('application/json');
        res.send(table);
    });
});

router.post('/match', function(req, res) {
    let home_team = req.body.home_team;
    let away_team = req.body.away_team;
    let home_score = req.body.home_score;
    let away_score = req.body.away_score;
    if (home_team == away_team) {
      res.json({ error: "team can't play against itself" });
      return;
    }
    if (home_score < 0 || away_score < 0) {
        res.json({ error: "goals can't be negative" });
        return;
    }
    connection.beginTransaction(function() {
        let winner = 'UPDATE league SET games_played = games_played + 1, wins = wins + 1, points = points + 3, goals_scored = goals_scored + ?, goals_against = goals_against + ? WHERE team_id = ?';
        let loser = 'UPDATE league SET games_played = games_played + 1, loses = loses + 1, goals_scored = goals_scored + ?, goals_against = goals_against + ? WHERE team_id = ?';
        let draw = 'UPDATE league SET games_played = games_played + 1, draws = draws + 1, points = points + 1, goals_scored = goals_scored + ?, goals_against = goals_against + ? WHERE team_id IN (?, ?)';
        if (home_score > away_score) {
            connection.query(winner, [home_score, away_score, home_team], function (error) {
                if (error) {
                    res.json({ error: "failed to league result for winner" });
                    connection.rollback(function() {
                        return;
                    });
                }
                connection.query(loser, [away_score, home_score, away_team], function (error) {
                    if (error) {
                        res.json({ error: "failed to league result for loser" });
                        connection.rollback(function() {
                            return;
                        });
                    }
                    connection.commit(function(err) {
                        if (err) {
                            connection.rollback(function() {
                                return;
                            });
                        }
                        console.log('Transaction Complete.');
                        res.sendStatus(200);
                    });
                });
            });
        } else if (away_score > home_score) {
            connection.query(winner, [away_score, home_score, away_team], function (error) {
                if (error) {
                    res.json({ error: "failed to league result for winner" });
                    connection.rollback(function() {
                        return;
                    });
                }
                connection.query(loser, [home_score, away_score, home_team], function (error) {
                    if (error) {
                        res.json({ error: "failed to league result for loser" });
                        connection.rollback(function() {
                            return;
                        });
                    }
                    connection.commit(function(err) {
                        if (err) {
                            connection.rollback(function() {
                                return;
                            });
                        }
                        console.log('Transaction Complete.');
                        res.sendStatus(200);
                    });
                });
            });
        } else {
            connection.query(draw, [home_score, away_score, home_team, away_team], function (error) {
                if (error) {
                    res.json({ error: "failed to league result for draw" });
                    connection.rollback(function() {
                        return;
                    });
                }
                connection.commit(function(err) {
                    if (err) {
                        connection.rollback(function() {
                            return;
                        });
                    }
                    console.log('Transaction Complete.');
                    res.sendStatus(200);
                });
            });
        }
    });
});

module.exports = router;