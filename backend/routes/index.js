let express = require('express');
let router = express.Router();
let fs = require('fs');

let app = express();
app.use(express.json());
app.use(express.urlencoded());

let mysql      = require('mysql');
let connection = mysql.createConnection({
    host     : process.env.DB_HOST || 'localhost',
    user     : 'user',
    password : 'password',
    database : 'db',
    multipleStatements: true
});

router.get('/players', function(req, res) {
    const team_id = req.query.team_id;
    if (team_id) {
        connection.query('SELECT p.name as player, t.name, p.goals_scored from players p join teams t on t.team_id = p.team_id where p.team_id = ? order by goals_scored desc, p.name', [team_id],function(error, results) {
            if (error) {
                res.status(500).send({ "error": "can't load players" });
                return;
            }
            res.contentType('application/json');
            res.send(results);
        });
    } else {
        connection.query('SELECT p.name as player, t.name, p.goals_scored from players p join teams t on t.team_id = p.team_id order by goals_scored desc, p.name', function(error, results) {
            if (error) {
                res.status(500).send({ "error": "can't load players" });
                return;
            }
            res.contentType('application/json');
            res.send(results);
        });
    }
});

router.get('/playoffs', function(req, res) {
    connection.query('SELECT * from playoffs order by step_id', function(error, results) {
        if (error) {
            res.status(500).send({ "error": "can't load playoffs" });
            return;
        }
        res.contentType('application/json');
        res.send(results);
    });
});

router.post('/reset', function(req, res) {
    let contents = fs.readFileSync('reset.sql', 'utf8');
    connection.query(contents, function(error) {
        if (error) {
            res.status(500).send({ "error": "can't reset" });
            return
        }
        res.sendStatus(200);
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
                t.name,
                l.team_id,
                RANK() OVER(PARTITION BY l.group_id ORDER BY points DESC, goals_scored - goals_against DESC,
                goals_scored DESC, l.team_id) AS ranking
            FROM
                league l
            JOIN
                teams t
            ON
                l.team_id = t.team_id) a
    WHERE
        ranking <= 2`, function(error, results) {
       if (error) {
           res.status(500).send({"error": "can't load playoffs teams - phase 1"});
           return;
       }
       let teams = [];
       let team_ids = [];
       for (let i = 0; i < results.length; i++) {
           teams.push(results[i].name);
           team_ids.push(results[i].team_id);
       }
       connection.query(`
       SELECT
            t.name
        FROM
            (
                SELECT
                    team_id
                FROM
                    league
                WHERE
                    team_id NOT IN (` + team_ids.join() + `)
                ORDER BY
                    points DESC,
                    goals_scored - goals_against DESC,
                    goals_scored DESC,
                    team_id LIMIT 2) l
        JOIN
            teams t
        ON
            l.team_id = t.team_id;`, function(error, results) {
           if (error) {
               res.status(500).send({"error": "can't load playoffs teams - phase 2"});
               return;
           }
           for (let i = 0; i < results.length; i++) {
               teams.push(results[i].name);
               team_ids.push(results[i].team_id);
           }
           connection.query("UPDATE playoffs SET home_team = ?, away_team = ? WHERE step_id = 1 AND home_team = 'first_a' AND away_team = 'second_b'",
               [teams[0], teams[1]], function(error) {
               if (error) {
                   res.status(500).send({ "error": "failed to set league result for winner" });
                   connection.rollback(function() {
                       return;
                   });
               }
               connection.query("UPDATE playoffs SET home_team = ?, away_team = ? WHERE step_id = 1 AND home_team = 'second_a' AND away_team = 'first_b'",
                   [teams[2], teams[3]], function(error) {
                   if (error) {
                       res.status(500).send({ "error": "failed to set league result for winner" });
                       connection.rollback(function() {
                           return;
                       });
                   }
                   connection.query("UPDATE playoffs SET home_team = ?, away_team = ? WHERE step_id = 1 AND home_team = 'first_c' AND away_team = 'weird_a'",
                       [teams[4], teams[5]], function(error) {
                       if (error) {
                           res.status(500).send({ "error": "failed to set league result for winner" });
                           connection.rollback(function() {
                               return;
                           });
                       }
                       connection.query("UPDATE playoffs SET home_team = ?, away_team = ? WHERE step_id = 1 AND home_team = 'second_c' AND away_team = 'weird_b'",
                           [teams[6], teams[7]], function(error) {
                           if (error) {
                               res.status(500).send({ "error": "failed to set league result for winner" });
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
    connection.query('SELECT * from players order by goals_scored desc, name', function(error, results) {
        if (error) {
            res.status(500).send({ "error": "can't load players" });
            return;
        }
        res.contentType('application/json');
        res.send(results);
    });
});

router.get('/league/teams', function(req, res) {
    connection.query('SELECT t.*, p.name as player_name from teams t join players p on t.team_id = p.team_id order by t.name, p.name', function(error, results) {
        if (error) {
            res.status(500).send({ "error": "can't load teams" });
            return;
        }
        let teams = [];
        for (let i = 0; i < results.length; i++) {
            let team;
            for (let j = 0; j < teams.length; j++) {
                if (teams[j].team_id === results[i].team_id) {
                    team = teams[j];
                }
            }
            if (!team) {
                teams.push({ 'team_id': results[i].team_id, 'name': results[i].name, 'group_id': results[i].group_id, 'players': [ results[i].player_name ] });
            } else {
                team.players.push(results[i].player_name);
            }
        }
        res.contentType('application/json');
        res.send(teams);
    });
});

router.get('/league', function(req, res) {
    connection.query('SELECT l.*, goals_scored - goals_against AS goal_difference, g.name AS group_name, t.name AS team_name FROM league l JOIN sgroups g ON g.group_id = l.group_id JOIN teams t ON t.team_id = l.team_id ORDER BY group_id, points desc, goals_scored - goals_against desc, goals_scored desc, team_id asc', function(error, results) {
        if (error) {
          res.status(500).send({ "error": "can't load league standings" });
          return;
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
        res.contentType('application/json');
        res.send(table);
    });
});

router.get('/fixtures', function(req, res) {
    let group_id = req.query.group_id;
    connection.query('SELECT f.*, g.name AS group_name, t.name AS home_team, t2.name AS away_team FROM fixtures f JOIN sgroups g ON g.group_id = f.group_id JOIN teams t ON t.team_id = f.home_team JOIN teams t2 ON t2.team_id = f.away_team WHERE g.group_id = ? ORDER BY group_id, id', [group_id], function(error, results) {
        if (error) {
            res.status(500).send({ "error": "can't load fixtures" });
            return;
        }
        res.contentType('application/json');
        res.send(results);
    });
});

function revertGame(res, home_team, away_team, home_score, away_score) {
    const winner = 'UPDATE league SET games_played = games_played - 1, wins = wins - 1, points = points - 3, goals_scored = goals_scored - ?, goals_against = goals_against - ? WHERE team_id = ?;';
    const loser = 'UPDATE league SET games_played = games_played - 1, loses = loses - 1, goals_scored = goals_scored - ?, goals_against = goals_against - ? WHERE team_id = ?;';
    const draw = 'UPDATE league SET games_played = games_played - 1, draws = draws - 1, points = points - 1, goals_scored = goals_scored - ?, goals_against = goals_against - ? WHERE team_id IN (?, ?)';
    connection.beginTransaction(function() {
        connection.query("UPDATE fixtures SET home_scored = null, away_scored = null WHERE home_team = ? AND away_team = ?; UPDATE fixtures SET home_scored = null, away_scored = null WHERE home_team = ? AND away_team = ?",
            [home_score, away_score, home_team, away_team, away_score, home_score, away_team, home_team], function(error) {
                if (error) {
                    res.status(500).send({"error": "failed to set league fixtures"});
                    connection.rollback(function () {
                    });
                }
                if (home_score === away_score) {
                    connection.query(draw, [home_score, away_score, home_team, away_team], function (error) {
                        if (error) {
                            res.status(500).send({"error": "failed to set league result for draw"});
                            connection.rollback(function () {
                            });
                        }
                        connection.commit(function (err) {
                            if (err) {
                                connection.rollback(function () {
                                });
                            }
                            console.log('revert complete');
                        });
                    });
                } else {
                    let params = [];
                    if (home_score > away_score) {
                        params.push(...[home_score, away_score, home_team]);
                        params.push(...[away_score, home_score, away_team]);
                    } else {
                        params.push(...[away_score, home_score, away_team]);
                        params.push(...[home_score, away_score, home_team]);
                    }
                    connection.query(winner + loser, params, function (error) {
                        if (error) {
                            res.status(500).send({"error": "failed to set league result for winner"});
                            connection.rollback(function () {
                            });
                        }
                        connection.commit(function (err) {
                            if (err) {
                                connection.rollback(function () {
                                });
                            }
                            console.log('revert complete');
                        });
                    });
                }
            });
    });
}

function updateScorers(res, home_scorers, away_scorers) {
    let home_scorers_map = {};
    let away_scorers_map = {};
    for (let i = 0; i < home_scorers.length; i++) {
        if (home_scorers[i] === "og") {
            continue;
        }
        if (home_scorers[i] in home_scorers_map) {
            home_scorers_map[home_scorers[i]] = home_scorers_map[home_scorers[i]] + 1;
        } else {
            home_scorers_map[home_scorers[i]] = 1;
        }
    }
    for (let i = 0; i < away_scorers.length; i++) {
        if (away_scorers[i] === "og") {
            continue;
        }
        if (away_scorers_map[i] in away_scorers_map) {
            away_scorers_map[away_scorers[i]] = away_scorers_map[away_scorers[i]] + 1;
        } else {
            away_scorers_map[away_scorers[i]] = 1;
        }
    }
    for (let player in home_scorers_map) {
        if (home_scorers_map.hasOwnProperty(player)) {
            connection.query("UPDATE players SET goals_scored = goals_scored + ? WHERE name = ?", [home_scorers_map[player], player], function(error) {
                if (error) {
                    res.status(500).send({"error": "failed to update goal scorers for home team"});
                    connection.rollback(function () {
                    });
                }
            });
        }
    }
    for (let player in away_scorers_map) {
        if (away_scorers_map.hasOwnProperty(player)) {
            connection.query("UPDATE players SET goals_scored = goals_scored + ? WHERE name = ?", [away_scorers_map[player], player], function(error) {
                if (error) {
                    res.status(500).send({"error": "failed to update goal scorers for away team"});
                    connection.rollback(function () {
                    });
                }
            });
        }
    }
}

function updateGame(res, home_score, away_score, home_team, away_team) {
    let winner = 'UPDATE league SET games_played = games_played + 1, wins = wins + 1, points = points + 3, goals_scored = goals_scored + ?, goals_against = goals_against + ? WHERE team_id = ?;';
    let loser = 'UPDATE league SET games_played = games_played + 1, loses = loses + 1, goals_scored = goals_scored + ?, goals_against = goals_against + ? WHERE team_id = ?;';
    let draw = 'UPDATE league SET games_played = games_played + 1, draws = draws + 1, points = points + 1, goals_scored = goals_scored + ?, goals_against = goals_against + ? WHERE team_id IN (?, ?)';
    if (home_score === away_score) {
        connection.query(draw, [home_score, away_score, home_team, away_team], function(error) {
            if (error) {
                res.status(500).send({ "error": "failed to set league result for draw" });
                connection.rollback(function() {
                });
            }
            connection.commit(function(err) {
                if (err) {
                    connection.rollback(function() {
                    });
                }
                console.log('transaction complete');
                res.sendStatus(200);
            });
        });
    } else {
        let params = [];
        if (home_score > away_score) {
            params.push(...[home_score, away_score, home_team]);
            params.push(...[away_score, home_score, away_team]);
        } else {
            params.push(...[away_score, home_score, away_team]);
            params.push(...[home_score, away_score, home_team]);
        }
        connection.query(winner + loser, params, function(error) {
            if (error) {
                res.status(500).send({ "error": "failed to set league result" });
                connection.rollback(function() {
                });
            }
            connection.commit(function(err) {
                if (err) {
                    connection.rollback(function() {
                    });
                }
                console.log('transaction complete');
                res.sendStatus(200);
            });
        });
    }
}

router.post('/league/match', function(req, res) {
    res.contentType('application/json');
    let home_team = req.body.home_team;
    let away_team = req.body.away_team;
    let home_score = req.body.home_score;
    let away_score = req.body.away_score;
    let home_scorers = req.body.home_team_scorers ? req.body.home_team_scorers.split(',') : [];
    let away_scorers = req.body.away_team_scorers ? req.body.away_team_scorers.split(',') : [];
    if (home_team === away_team) {
      res.status(500).send({ "error": "team can't play against itself" });
      return;
    }
    if (home_score < 0 || away_score < 0) {
        res.status(500).send({ "error": "goals can't be negative" });
        return;
    }
    if ((home_score > 0 && home_scorers.length != home_score) || (home_score == 0 && home_scorers.length > 0) ||
        (away_score > 0 && away_scorers.length != away_score) || (away_score == 0 && away_scorers.length > 0)) {
        res.status(500).send({ "error": "scores and scorers don't match" });
        return;
    }
    updateScorers(res, home_scorers, away_scorers);
    connection.query('SELECT COUNT(*) as c FROM (SELECT group_id FROM teams WHERE team_id IN (?, ?) GROUP BY 1) a', [home_team, away_team], function(error, results) {
        if (error) {
            res.status(500).send({"error": "can't verify teams"});
            return;
        }
        if (results[0].c !== 1) {
            res.status(500).send({"error": "teams are not from the same group"});
            return;
        }
        connection.query('SELECT * FROM fixtures WHERE ((home_team = ? AND away_team = ?) OR (home_team = ? AND away_team = ?)) AND home_scored IS NOT NULL AND away_scored IS NOT NULL', [home_team, away_team, away_team, home_team], function(error, results) {
            if (error) {
                res.status(500).send({ "error": "can't verify teams" });
                return;
            }
            if (results.length > 0) {
                revertGame(res, results[0].home_team, results[0].away_team, results[0].home_scored, results[0].away_scored);
            }
            connection.beginTransaction(function() {
                connection.query("UPDATE fixtures SET home_scored = ?, away_scored = ? WHERE home_team = ? AND away_team = ?; UPDATE fixtures SET home_scored = ?, away_scored = ? WHERE home_team = ? AND away_team = ?",
                    [home_score, away_score, home_team, away_team, away_score, home_score, away_team, home_team], function(error) {
                        if (error) {
                            res.status(500).send({"error": "failed to set league fixtures"});
                            connection.rollback(function () {
                            });
                        }
                        updateGame(res, home_score, away_score, home_team, away_team);
                    });
            });
        });
    });
});

router.post('/playoffs/match', function(req, res) {
    res.contentType('application/json');
    let home_team = req.body.home_team;
    let away_team = req.body.away_team;
    let home_score = req.body.home_score;
    let away_score = req.body.away_score;
    let step_id = req.body.step_id;
    let id = req.body.id;
    let home_scorers = req.body.home_team_scorers ? req.body.home_team_scorers.split(',') : [];
    let away_scorers = req.body.away_team_scorers ? req.body.away_team_scorers.split(',') : [];
    if (home_team === away_team) {
        res.status(500).send({ "error": "team can't play against itself" });
        return;
    }
    if (home_score < 0 || away_score < 0) {
        res.status(500).send({ "error": "goals can't be negative" });
        return;
    }
    if ((home_score > 0 && home_scorers.length != home_score) || (home_score == 0 && home_scorers.length > 0) ||
        (away_score > 0 && away_scorers.length != away_score) || (away_score == 0 && away_scorers.length > 0)) {
        res.status(500).send({ "error": "scores and scorers don't match" });
        return;
    }
    connection.query("UPDATE playoffs SET home_scored = ?, away_scored = ? WHERE step_id = ? AND id = ?",
        [home_score, away_score, step_id, id], function(error) {
        if (error) {
            res.status(500).send({"error": "failed to set playoffs result for winner"});
        } else {
            updateScorers(res, home_scorers, away_scorers);
            let winner = home_score > away_score ? home_team : away_team;
            //qf
            if (step_id == 1) {
                //first qf
                if (id == 1) {
                    connection.query("UPDATE playoffs SET home_team = ? WHERE step_id = 2 AND id = 1", [winner], function (error) {
                        if (error) {
                            res.status(500).send({"error": "failed to set playoffs result for winner"});
                        } else {
                            res.sendStatus(200);
                        }
                    });
                    return;
                } //second qf
                if (id == 2) {
                    connection.query("UPDATE playoffs SET away_team = ? WHERE step_id = 2 AND id = 1", [winner], function(error) {
                        if (error) {
                            res.status(500).send({"error": "failed to set playoffs result for winner"});
                        } else {
                            res.sendStatus(200);
                        }
                    });
                    return;
                } //third qf
                if (id == 3) {
                    connection.query("UPDATE playoffs SET home_team = ? WHERE step_id = 2 AND id = 2", [winner], function(error) {
                        if (error) {
                            res.status(500).send({"error": "failed to set playoffs result for winner"});
                        } else {
                            res.sendStatus(200);
                        }
                    });
                    return;
                } //fourth qf
                if (id == 4) {
                    connection.query("UPDATE playoffs SET away_team = ? WHERE step_id = 2 AND id = 2", [winner], function(error) {
                        if (error) {
                            res.status(500).send({"error": "failed to set playoffs result for winner"});
                        } else {
                            res.sendStatus(200);
                        }
                    });
                    return;
                }
                return;
            } //half
            if (step_id == 2) {
                if (id == 1) {
                    connection.query("UPDATE playoffs SET home_team = ? WHERE step_id = 3", [winner], function(error) {
                        if (error) {
                            res.status(500).send({"error": "failed to set playoffs result for winner"});
                        } else {
                            res.sendStatus(200);
                        }
                    });
                } else {
                    connection.query("UPDATE playoffs SET away_team = ? WHERE step_id = 3", [winner], function(error) {
                        if (error) {
                            res.status(500).send({"error": "failed to set playoffs result for winner"});
                        } else {
                            res.sendStatus(200);
                        }
                    });
                } //final
            } else {
                connection.query("UPDATE playoffs SET home_team = ? WHERE step_id = 4", [winner], function(error) {
                    if (error) {
                        res.status(500).send({"error": "failed to set playoffs result for winner"});
                    } else {
                        res.sendStatus(200);
                    }
                });
            }
        }
    });
});

module.exports = router;