import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
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
						fetch('/playoffs', {
							method: 'POST'
						}).then(console.log('aaaaaa'))
                    }
				},
				{
					label: 'No',
					onClick: () => console.log('💩')
				}
			]
		});
	}
    handleReset() {
        confirmAlert({
            title: 'Confirm Reset',
            message: 'Are you sure you want to reset the entire system?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        fetch('/reset', {
                            method: 'POST'
                        }).then(window.location.reload())
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
					<div>
						<ul>
							<li>
								<Link to="/">Group Stage</Link>
							</li>
							<li>
								<Link to="/scores/">Update Score</Link>
							</li>
							<li>
								<Link to="/knockout">Knockouts</Link>
							</li>
							<li>
								<a onClick={this.handleEndGroupStage}>End Group Stage</a>
							</li>
							<li>
							<a onClick={this.handleReset}>Reset</a>
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
