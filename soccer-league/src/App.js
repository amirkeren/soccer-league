import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import GroupStage from './GroupStage';
import Scores from './Scores';
import Knockout from './Knockout';

import logo from './logo.svg';
import './App.css';

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

						<Route exact path="/" render={() => <GroupStage />} />
						<Route path="/scores" component={Scores} />
						<Route path="/knockout" component={Knockout} />
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
