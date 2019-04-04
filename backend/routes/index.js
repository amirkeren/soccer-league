var express = require('express');
var router = express.Router();
var cors = require('cors')

var app = express();
app.use(express.json());
app.use(express.urlencoded());
app.post('/match', cors());


var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    // host     : 'db',
    user     : 'user',
    password : 'password',
    database : 'db'
});

router.get('/playoffs', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    connection.query('SELECT * from playoffs order by step_id', function (error, results) {
        if (error) {
            res.status(500).send({ error: "can't load playoffs" });
            return;
        }
        res.contentType('application/json');
        res.send(results);
    });
});

router.post('/playoffs', function(req, res) {
   res.contentType('application/json');
   connection.query(`
    SELECT
        *
    FROM
        (
            SELECT
                team_id,
                RANK() OVER(PARTITION BY group_id ORDER BY points DESC, goals_scored - goals_against
                DESC, goals_scored DESC, team_id) AS ranking
            FROM
                league) a
    WHERE
        ranking <= 2`, function (error, results) {
       if (error) {
           res.status(500).send({error: "can't load playoffs teams - phase 1"});
           return;
       }
       let teams = [];
       for (var i = 0; i < results.length; i++) {
           teams.push(results[i].team_id);
       }
       connection.query(`
        SELECT
            team_id
        FROM
            league
        WHERE
            team_id NOT IN (` + teams.join() + `)
        ORDER BY
            points DESC,
            goals_scored - goals_against DESC,
            goals_scored DESC,
            team_id LIMIT 2`, function (error, results) {
           if (error) {
               res.status(500).send({error: "can't load playoffs teams - phase 2"});
               return;
           }
           for (var i = 0; i < results.length; i++) {
               teams.push(results[i].team_id);
           }
           connection.query("UPDATE playoffs SET home_team = ?, away_team = ? WHERE step_id = 1 AND home_team = 'first_a' AND away_team = 'second_b'",
               [teams[0], teams[1]], function (error) {
               if (error) {
                   res.status(500).send({ error: "failed to league result for winner" });
                   connection.rollback(function() {
                       return;
                   });
               }
               connection.query("UPDATE playoffs SET home_team = ?, away_team = ? WHERE step_id = 1 AND home_team = 'second_a' AND away_team = 'first_b'",
                   [teams[2], teams[3]], function (error) {
                   if (error) {
                       res.status(500).send({ error: "failed to league result for winner" });
                       connection.rollback(function() {
                           return;
                       });
                   }
                   connection.query("UPDATE playoffs SET home_team = ?, away_team = ? WHERE step_id = 1 AND home_team = 'first_c' AND away_team = 'weird_a'",
                       [teams[4], teams[5]], function (error) {
                       if (error) {
                           res.status(500).send({ error: "failed to league result for winner" });
                           connection.rollback(function() {
                               return;
                           });
                       }
                       connection.query("UPDATE playoffs SET home_team = ?, away_team = ? WHERE step_id = 1 AND home_team = 'second_c' AND away_team = 'weird_b'",
                           [teams[6], teams[7]], function (error) {
                           if (error) {
                               res.status(500).send({ error: "failed to league result for winner" });
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
                               console.log('transaction complete');
                               res.sendStatus(200);
                           });
                       });
                   });
               });
           });
       });
   });
});

router.get('/players', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    connection.query('SELECT * from players order by goals_scored desc, goals_assisted desc, name', function (error, results) {
        if (error) {
            res.status(500).send({ error: "can't load players" });
            return;
        }
        res.contentType('application/json');
        res.send(results);
    });
});

router.get('/league/teams', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    connection.query('SELECT * from teams order by name', function (error, results) {
        if (error) {
            res.status(500).send({ error: "can't load teams" });
            return;
        }
        res.contentType('application/json');
        res.send(results);
    });
});

router.get('/playoffs/teams', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    connection.query(`
    SELECT team_id, name
    FROM
        (
            SELECT
                home_team AS team
            FROM
                playoffs
            UNION
            SELECT
                away_team AS team
            FROM
                playoffs) a
    JOIN teams t ON team = t.team_id
    ORDER BY
    name`, function (error, results) {
        if (error) {
            res.status(500).send({ error: "can't load playoffs teams" });
            return;
        }
        res.contentType('application/json');
        res.send(results);
    });
});

router.get('/league', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    connection.query('SELECT l.*, goals_scored - goals_against AS goal_difference, g.name AS group_name, t.name AS team_name FROM league l JOIN sgroups g ON g.group_id = l.group_id JOIN teams t ON t.team_id = l.team_id ORDER BY group_id, points desc, goals_scored - goals_against desc, goals_scored desc, team_id asc', function (error, results) {
        if (error) {
          res.status(500).send({ error: "can't load league standings" });
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

router.post('/league/match', function(req, res) {
    res.contentType('application/json');
    let home_team = req.body.home_team;
    let away_team = req.body.away_team;
    let home_score = req.body.home_score;
    let away_score = req.body.away_score;
    if (home_team == away_team) {
      res.status(500).send({ error: "team can't play against itself" });
      return;
    }
    if (home_score < 0 || away_score < 0) {
        res.status(500).send({ error: "goals can't be negative" });
        return;
    }
    connection.query('SELECT COUNT(*) as c FROM (SELECT group_id FROM teams WHERE team_id IN (?, ?) GROUP BY 1) a', [home_team, away_team], function (error, results) {
        if (error) {
            res.status(500).send({ error: "can't verify teams" });
            return;
        }
        if (results[0].c != 1) {
            res.status(500).send({ error: "teams are not from the same group" });
            return;
        }
        connection.beginTransaction(function() {
            let winner = 'UPDATE league SET games_played = games_played + 1, wins = wins + 1, points = points + 3, goals_scored = goals_scored + ?, goals_against = goals_against + ? WHERE team_id = ?';
            let loser = 'UPDATE league SET games_played = games_played + 1, loses = loses + 1, goals_scored = goals_scored + ?, goals_against = goals_against + ? WHERE team_id = ?';
            let draw = 'UPDATE league SET games_played = games_played + 1, draws = draws + 1, points = points + 1, goals_scored = goals_scored + ?, goals_against = goals_against + ? WHERE team_id IN (?, ?)';
            if (home_score > away_score) {
                connection.query(winner, [home_score, away_score, home_team], function (error) {
                    if (error) {
                        res.status(500).send({ error: "failed to league result for winner" });
                        connection.rollback(function() {
                            return;
                        });
                    }
                    connection.query(loser, [away_score, home_score, away_team], function (error) {
                        if (error) {
                            res.status(500).send({ error: "failed to league result for loser" });
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
                            console.log('transaction complete');
                            res.sendStatus(200);
                        });
                    });
                });
            } else if (away_score > home_score) {
                connection.query(winner, [away_score, home_score, away_team], function (error) {
                    if (error) {
                        res.status(500).send({ error: "failed to league result for winner" });
                        connection.rollback(function() {
                            return;
                        });
                    }
                    connection.query(loser, [home_score, away_score, home_team], function (error) {
                        if (error) {
                            res.status(500).send({ error: "failed to league result for loser" });
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
                            console.log('transaction complete');
                            res.sendStatus(200);
                        });
                    });
                });
            } else {
                connection.query(draw, [home_score, away_score, home_team, away_team], function (error) {
                    if (error) {
                        res.status(500).send({ error: "failed to league result for draw" });
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
                        console.log('transaction complete');
                        res.sendStatus(200);
                    });
                });
            }
        });
    });
});

router.post('/playoffs/match', function(req, res) {
    res.contentType('application/json');
    let home_team = req.body.home_team;
    let away_team = req.body.away_team;
    let home_score = req.body.home_score;
    let away_score = req.body.away_score;
    if (home_team == away_team) {
        res.status(500).send({ error: "team can't play against itself" });
        return;
    }
    if (home_score < 0 || away_score < 0) {
        res.status(500).send({ error: "goals can't be negative" });
        return;
    }
    //TODO - what do we need to do here?!
    connection.beginTransaction(function() {
        let winner = 'UPDATE league SET games_played = games_played + 1, wins = wins + 1, points = points + 3, goals_scored = goals_scored + ?, goals_against = goals_against + ? WHERE team_id = ?';
        let loser = 'UPDATE league SET games_played = games_played + 1, loses = loses + 1, goals_scored = goals_scored + ?, goals_against = goals_against + ? WHERE team_id = ?';
        let draw = 'UPDATE league SET games_played = games_played + 1, draws = draws + 1, points = points + 1, goals_scored = goals_scored + ?, goals_against = goals_against + ? WHERE team_id IN (?, ?)';
        if (home_score > away_score) {
            connection.query(winner, [home_score, away_score, home_team], function (error) {
                if (error) {
                    res.status(500).send({ error: "failed to league result for winner" });
                    connection.rollback(function() {
                        return;
                    });
                }
                connection.query(loser, [away_score, home_score, away_team], function (error) {
                    if (error) {
                        res.status(500).send({ error: "failed to league result for loser" });
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
                        console.log('transaction complete');
                        res.sendStatus(200);
                    });
                });
            });
        } else if (away_score > home_score) {
            connection.query(winner, [away_score, home_score, away_team], function (error) {
                if (error) {
                    res.status(500).send({ error: "failed to league result for winner" });
                    connection.rollback(function() {
                        return;
                    });
                }
                connection.query(loser, [home_score, away_score, home_team], function (error) {
                    if (error) {
                        res.status(500).send({ error: "failed to league result for loser" });
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
                        console.log('transaction complete');
                        res.sendStatus(200);
                    });
                });
            });
        } else {
            connection.query(draw, [home_score, away_score, home_team, away_team], function (error) {
                if (error) {
                    res.status(500).send({ error: "failed to league result for draw" });
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
                    console.log('transaction complete');
                    res.sendStatus(200);
                });
            });
        }
    });
});

module.exports = router;