DROP TABLE IF EXISTS playoffs;
DROP TABLE IF EXISTS league;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS sgroups;

CREATE TABLE sgroups(group_id INT AUTO_INCREMENT, name VARCHAR(50) NOT NULL, PRIMARY KEY (group_id));
CREATE TABLE teams(team_id INT AUTO_INCREMENT, name VARCHAR(50) NOT NULL, group_id INT, PRIMARY KEY (team_id), FOREIGN KEY (group_id) REFERENCES sgroups(group_id));
CREATE TABLE players(player_id INT AUTO_INCREMENT, name VARCHAR(100), number VARCHAR(3), goals_scored INT, team_id INT, PRIMARY KEY (player_id), FOREIGN KEY (team_id) REFERENCES teams(team_id));
CREATE TABLE league(group_id INT, team_id INT, games_played INT, wins INT, loses INT, draws INT, points INT, goals_scored INT, goals_against INT, PRIMARY KEY (group_id, team_id), KEY (group_id), KEY (team_id), CONSTRAINT league_group FOREIGN KEY (group_id) REFERENCES sgroups (group_id), CONSTRAINT league_team FOREIGN KEY (team_id) REFERENCES teams (team_id));
CREATE TABLE playoffs(id INT, step_id iNT, home_team VARCHAR(50), away_team VARCHAR(50), home_scored INT, away_scored INT);

INSERT INTO sgroups (name) VALUES ('Group A');
INSERT INTO sgroups (name) VALUES ('Group B');
INSERT INTO sgroups (name) VALUES ('Group C');

INSERT INTO teams (name, group_id) VALUES ('Team 1', 1);
INSERT INTO teams (name, group_id) VALUES ('Team 2', 1);
INSERT INTO teams (name, group_id) VALUES ('Team 3', 1);
INSERT INTO teams (name, group_id) VALUES ('Team 4', 1);
INSERT INTO teams (name, group_id) VALUES ('Team 5', 2);
INSERT INTO teams (name, group_id) VALUES ('Team 6', 2);
INSERT INTO teams (name, group_id) VALUES ('Team 7', 2);
INSERT INTO teams (name, group_id) VALUES ('Team 8', 2);
INSERT INTO teams (name, group_id) VALUES ('Team 9', 3);
INSERT INTO teams (name, group_id) VALUES ('Team 10', 3);
INSERT INTO teams (name, group_id) VALUES ('Team 11', 3);
INSERT INTO teams (name, group_id) VALUES ('Team 12', 3);

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

INSERT INTO playoffs (id, step_id, home_team, away_team, home_scored, away_scored) VALUES (1, 1, 'first_a', 'second_b', 0, 0);
INSERT INTO playoffs (id, step_id, home_team, away_team, home_scored, away_scored) VALUES (2, 1, 'second_a', 'first_b', 0, 0);
INSERT INTO playoffs (id, step_id, home_team, away_team, home_scored, away_scored) VALUES (3, 1, 'first_c', 'weird_a', 0, 0);
INSERT INTO playoffs (id, step_id, home_team, away_team, home_scored, away_scored) VALUES (4, 1, 'second_c', 'weird_b', 0, 0);
INSERT INTO playoffs (id, step_id, home_team, away_team, home_scored, away_scored) VALUES (1, 2, 'qf_a', 'qf_b', 0, 0);
INSERT INTO playoffs (id, step_id, home_team, away_team, home_scored, away_scored) VALUES (2, 2, 'qf_c', 'qf_d', 0, 0);
INSERT INTO playoffs (id, step_id, home_team, away_team, home_scored, away_scored) VALUES (null, 3, 'half_a', 'half_b', 0, 0);
INSERT INTO playoffs (id, step_id, home_team, away_team, home_scored, away_scored) VALUES (null, 4, 'winner', null, 0, 0);

INSERT INTO players (name, number, team_id, goals_scored) VALUES ('Amir Keren', '9', 1, 0);