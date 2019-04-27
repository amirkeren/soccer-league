import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink, withRouter } from 'react-router-dom';
import queryString from 'query-string';
import GroupStage from './GroupStage';
import Scores from './Scores';
import KnockoutStages from './KnockoutStages';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

// import logo from './logo.svg';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isAdmin: true
		};
	}
	componentDidMount() {
		const params = this.getParams(window.location);
		params && params.isAdmin && this.setState({ isAdmin: true });
	}
	getParams(location) {
		const searchParams = new URLSearchParams(location.search.toLowerCase());
		return {
			isAdmin: searchParams.get('isadmin') || ''
		};
	}
	
	render() {
		const { isAdmin } = this.state;
		return (
			<Router>
				<div className="App">
					<h1 className="page-header">
						Taboola <br /> World Cup
					</h1>
					<div>
						<ul className="tbl-wc-nav list-reset flex justify-between overflow-x-auto overflow-y-hidden">
							<NavLink exact to="/" className="flex-grow">
								<li className="pb-2">Group Stage</li>
							</NavLink>
							{isAdmin && (
								<NavLink exact to="/scores" className="flex-grow">
									<li className="pb-2">Update Score</li>
								</NavLink>
							)}
							<NavLink exact to="/knockout" className="flex-grow">
								<li className="pb-2">Knockouts</li>
							</NavLink>
						</ul>

						<hr />

						<Route exact path="/" render={(props) => <GroupStage {...props} isAdmin={isAdmin} />} />
						<Route path="/scores" render={props => <Scores {...props} isAdmin={isAdmin} />} />
						<Route path="/knockout" render={() => <KnockoutStages isAdmin={isAdmin} />} />
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
