import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import GroupStage from './GroupStage';
import Scores from './Scores';

import logo from './logo.svg';
import './App.css';

fetch('http://node:8000/league')
    .then(function(response) {
        return response.json();
    })
	.then(function(myJson) {
		console.log(JSON.stringify(myJson));
	})
	.catch(function(error) {
        console.log(error);
	});

const teams = [
	'Italy',
	'Spain',
	'South Africa',
	'Australia',
	'Germany',
	'Netherlands',
	'Ghana',
	'United States',
	'France',
	'Brazil',
	'Russia',
	'China',
	'England',
	'Argentina',
	'Sweden',
	'Japan'
];

const data = [
	[
		{
			group_id: 1,
			team_id: 1,
			games_played: 0,
			wins: 0,
			loses: 0,
			draws: 0,
			points: 0,
			goals_scored: 0,
			goals_against: 0,
			group_name: 'Group A',
			team_name: 'Team 1'
		},
		{
			group_id: 1,
			team_id: 2,
			games_played: 0,
			wins: 0,
			loses: 0,
			draws: 0,
			points: 0,
			goals_scored: 0,
			goals_against: 0,
			group_name: 'Group A',
			team_name: 'Team 2'
		},
		{
			group_id: 1,
			team_id: 3,
			games_played: 0,
			wins: 0,
			loses: 0,
			draws: 0,
			points: 0,
			goals_scored: 0,
			goals_against: 0,
			group_name: 'Group A',
			team_name: 'Team 3'
		},
		{
			group_id: 1,
			team_id: 4,
			games_played: 0,
			wins: 0,
			loses: 0,
			draws: 0,
			points: 0,
			goals_scored: 0,
			goals_against: 0,
			group_name: 'Group A',
			team_name: 'Team 4'
		}
	],
	[
		{
			group_id: 2,
			team_id: 1,
			games_played: 0,
			wins: 0,
			loses: 0,
			draws: 0,
			points: 0,
			goals_scored: 0,
			goals_against: 0,
			group_name: 'Group B',
			team_name: 'Team 1'
		},
		{
			group_id: 2,
			team_id: 2,
			games_played: 0,
			wins: 0,
			loses: 0,
			draws: 0,
			points: 0,
			goals_scored: 0,
			goals_against: 0,
			group_name: 'Group B',
			team_name: 'Team 2'
		},
		{
			group_id: 2,
			team_id: 3,
			games_played: 0,
			wins: 0,
			loses: 0,
			draws: 0,
			points: 0,
			goals_scored: 0,
			goals_against: 0,
			group_name: 'Group B',
			team_name: 'Team 3'
		},
		{
			group_id: 2,
			team_id: 4,
			games_played: 0,
			wins: 0,
			loses: 0,
			draws: 0,
			points: 0,
			goals_scored: 0,
			goals_against: 0,
			group_name: 'Group B',
			team_name: 'Team 4'
		}
	],
	[
		{
			group_id: 3,
			team_id: 1,
			games_played: 0,
			wins: 0,
			loses: 0,
			draws: 0,
			points: 0,
			goals_scored: 0,
			goals_against: 0,
			group_name: 'Group C',
			team_name: 'Team 1'
		},
		{
			group_id: 3,
			team_id: 2,
			games_played: 0,
			wins: 0,
			loses: 0,
			draws: 0,
			points: 0,
			goals_scored: 0,
			goals_against: 0,
			group_name: 'Group C',
			team_name: 'Team 2'
		},
		{
			group_id: 3,
			team_id: 3,
			games_played: 0,
			wins: 0,
			loses: 0,
			draws: 0,
			points: 0,
			goals_scored: 0,
			goals_against: 0,
			group_name: 'Group C',
			team_name: 'Team 3'
		},
		{
			group_id: 3,
			team_id: 4,
			games_played: 0,
			wins: 0,
			loses: 0,
			draws: 0,
			points: 0,
			goals_scored: 0,
			goals_against: 0,
			group_name: 'Group C',
			team_name: 'Team 4'
		}
	]
];;


class App extends Component {
	render() {
		return (
			<Router>
				<div className="App">
					<div>
						<ul>
							<li>
								<Link to="/">Group Stage</Link>
							</li>
							<li>
								<Link to="/scores">Update Score</Link>
							</li>
							<li>
								<Link to="/knockout">Knockouts</Link>
							</li>
						</ul>

						<hr />

						<Route exact path="/" render={() => <GroupStage teamGroups={data} />} />
						<Route path="/scores" component={Scores} />
						{/* <Route path="/topics" component={Knockout} /> */}
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
