DROP TABLE IF EXISTS league;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS teams;

CREATE TABLE teams(team_id INT AUTO_INCREMENT, name VARCHAR(50) NOT NULL, PRIMARY KEY (team_id));
CREATE TABLE groups(group_id INT AUTO_INCREMENT, name VARCHAR(50) NOT NULL, team_id INT, PRIMARY KEY (group_id), FOREIGN KEY (team_id) REFERENCES teams(team_id));
CREATE TABLE players(player_id INT AUTO_INCREMENT, name VARCHAR(100), number VARCHAR(3), goals_scored INT, goals_assisted INT, team_id INT, PRIMARY KEY (player_id), FOREIGN KEY (team_id) REFERENCES teams(team_id));
CREATE TABLE league(group_id INT, team_id INT, games_played INT, wins INT, loses INT, draws INT, points INT, goals_scored INT, goals_against INT, PRIMARY KEY (group_id, team_id), KEY (group_id), KEY (team_id), CONSTRAINT league_group FOREIGN KEY (group_id) REFERENCES groups (group_id), CONSTRAINT league_team FOREIGN KEY (team_id) REFERENCES teams (team_id));

INSERT INTO teams (name) VALUES ('Team 1');
INSERT INTO teams (name) VALUES ('Team 2');
INSERT INTO teams (name) VALUES ('Team 3');
INSERT INTO teams (name) VALUES ('Team 4');
INSERT INTO teams (name) VALUES ('Team 5');
INSERT INTO teams (name) VALUES ('Team 6');
INSERT INTO teams (name) VALUES ('Team 7');
INSERT INTO teams (name) VALUES ('Team 8');
INSERT INTO teams (name) VALUES ('Team 9');
INSERT INTO teams (name) VALUES ('Team 10');
INSERT INTO teams (name) VALUES ('Team 11');
INSERT INTO teams (name) VALUES ('Team 12');

INSERT INTO groups (name, team_id) VALUES ('Group A', 1);
INSERT INTO groups (name, team_id) VALUES ('Group B', 2);
INSERT INTO groups (name, team_id) VALUES ('Group C', 3);

INSERT INTO league (group_id, team_id, games_played, wins, loses, draws, points, goals_scored, goals_against) VALUES (1, 1, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO league (group_id, team_id, games_played, wins, loses, draws, points, goals_scored, goals_against) VALUES (1, 2, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO league (group_id, team_id, games_played, wins, loses, draws, points, goals_scored, goals_against) VALUES (1, 3, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO league (group_id, team_id, games_played, wins, loses, draws, points, goals_scored, goals_against) VALUES (1, 4, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO league (group_id, team_id, games_played, wins, loses, draws, points, goals_scored, goals_against) VALUES (2, 5, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO league (group_id, team_id, games_played, wins, loses, draws, points, goals_scored, goals_against) VALUES (2, 6, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO league (group_id, team_id, games_played, wins, loses, draws, points, goals_scored, goals_against) VALUES (2, 7, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO league (group_id, team_id, games_played, wins, loses, draws, points, goals_scored, goals_against) VALUES (2, 8, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO league (group_id, team_id, games_played, wins, loses, draws, points, goals_scored, goals_against) VALUES (3, 9, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO league (group_id, team_id, games_played, wins, loses, draws, points, goals_scored, goals_against) VALUES (3, 10, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO league (group_id, team_id, games_played, wins, loses, draws, points, goals_scored, goals_against) VALUES (3, 11, 0, 0, 0, 0, 0, 0, 0);
INSERT INTO league (group_id, team_id, games_played, wins, loses, draws, points, goals_scored, goals_against) VALUES (3, 12, 0, 0, 0, 0, 0, 0, 0);

INSERT INTO players(name, number, team_id, goals_scored, goals_assisted) VALUES ('Amir Keren', '9', 1, 0, 0);