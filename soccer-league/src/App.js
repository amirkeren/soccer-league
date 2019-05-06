import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import logo from './img/logo.png';

import GroupStage from './GroupStage';
import Scores from './Scores';
import KnockoutStages from './KnockoutStages';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

// import logo from './logo.svg';
import './App.css';

library.add(faTrophy);

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
				{/* First option */}
					<h1 className="page-header flex justify-center">
						<div className="logo-container mr-4 flex justify-center">
							<div className="logo" />
						</div>
						<div>
							Taboola <br /> World Cup
						</div>
					</h1>
				{/* Second option */}
					{/* <h1 className="page-header flex justify-center">
						<div>
							<span className="tab">Tab</span>
							<span className="tbl-icon" />
							<span className="la">la</span>
							<br /> World Cup
						</div>
					</h1> */}
					
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

						<Route exact path="/" render={props => <GroupStage {...props} isAdmin={isAdmin} />} />
						<Route path="/scores" render={props => <Scores {...props} isAdmin={isAdmin} />} />
						<Route path="/knockout" render={() => <KnockoutStages isAdmin={isAdmin} />} />
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
