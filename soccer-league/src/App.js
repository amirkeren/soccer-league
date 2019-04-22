import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import GroupStage from './GroupStage';
import Scores from './Scores';
import KnockoutStages from './KnockoutStages';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

// import logo from './logo.svg';
import './App.css';

class App extends Component {
	handleEndGroupStage() {
		confirmAlert({
			title: 'Confirm ending Group Stage',
			message: 'Are you sure group stage is over?',
			buttons: [
				{
					label: 'Yes',
					onClick: () => {
						let host = process.env.NODE_HOST || 'localhost';
						if (!process.env.CORS_ENABLED) {
							fetch('http://' + host + ':8000/playoffs', {
								method: 'POST',
								mode: 'no-cors'
							}).then(console.log('aaaaaa'));
						} else {
							fetch('http://' + host + ':8000/playoffs', {
								method: 'POST'
							}).then(console.log('aaaaaa'));
						}
					}
				},
				{
					label: 'No',
					onClick: () => console.log('💩')
				}
			]
		});
	}
	render() {
		return (
			<Router>
				<div className="App">
					<h1 className="page-header">
						Taboola <br /> World Cup
					</h1>
					<div>
						<ul className="tbl-wc-nav list-reset flex justify-between overflow-x-auto overflow-y-hidden">
							<NavLink to="/">
								<li className="flex-grow pb-10">Group Stage</li>
							</NavLink>
							<li className="flex-grow pb-10">
								<NavLink to="/scores/">Update Score</NavLink>
							</li>
							<li className="flex-grow pb-10">
								<NavLink to="/knockout">Knockouts</NavLink>
							</li>
							<li className="flex-grow pb-10">
								<a onClick={this.handleEndGroupStage}>End Group Stage</a>
							</li>
						</ul>

						<hr />

						<Route exact path="/" render={() => <GroupStage />} />
						<Route path="/scores/:home?/:away?/:hscore?/:ascore?" component={Scores} />
						<Route path="/knockout" component={KnockoutStages} />
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
