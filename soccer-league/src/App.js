import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import GroupStage from './GroupStage';
import Scores from './Scores';

import logo from './logo.svg';
import './App.css';

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

var request = new XMLHttpRequest();
request.open('GET', 'http://localhost:8000/league', false);
request.send(null);

let data = [];

if (request.status === 200) {
    data = JSON.parse(request.responseText);
}

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
