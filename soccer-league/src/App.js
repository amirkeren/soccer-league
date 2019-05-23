import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrophy, faTrash, faFlagCheckered, faHeart, faFutbol } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import logo from './img/tbl-soccer-white-logo.png';
import amirK from './img/players/Amir_Keren.png';
import galB from './img/players/Gal_Bari.png';

import GroupStage from './GroupStage';
import Scores from './Scores';
import TopScorers from './TopScorers';
import FixturesPage from './FixturesPage';
import KnockoutStages from './KnockoutStages';
import TeamInfo from './TeamInfo';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

// import logo from './logo.svg';
import './App.css';
import './StickyFooter.css';

library.add(faTrophy, faTrash, faFlagCheckered, faHeart, faFutbol);

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
					<div className="content-container mb-10">
						<h1 className="page-header flex justify-center">
							<div className="logo-container mr-4 flex justify-center">
								<div className="logo" />
							</div>
							<div>
								Taboola <br /> World Cup
							</div>
						</h1>

						<div>
							<ul className="tbl-wc-nav list-reset flex justify-between overflow-x-auto overflow-y-hidden flex-no-wrap whitespace-no-wrap">
								<NavLink exact to="/" className="">
									<li className="pt-0 px-3 pb-2">Group Stage</li>
								</NavLink>
								<NavLink exact to="/topscorers" className="">
									<li className="pt-0 px-3 pb-2">Top Scorers</li>
								</NavLink>
								{isAdmin && (
									<NavLink exact to="/scores" className="">
										<li className="pt-0 px-3 pb-2">Update Score</li>
									</NavLink>
								)}
								<NavLink exact to="/knockout" className="">
									<li className="pt-0 px-3 pb-2">Knockouts</li>
								</NavLink>
							</ul>

							<Route exact path="/" render={props => <GroupStage {...props} isAdmin={isAdmin} />} />
							<Route path="/scores" render={props => <Scores {...props} isAdmin={isAdmin} />} />
							<Route path="/topscorers" render={props => <TopScorers {...props} isAdmin={isAdmin} />} />
							<Route path="/teamInfo/:teamId" render={props => <TeamInfo {...props} />} />
							<Route path="/fixtures/:groupId" render={props => <FixturesPage {...props} isAdmin={isAdmin} />} />
							<Route path="/knockout" render={() => <KnockoutStages isAdmin={isAdmin} />} />
						</div>
					</div>
					<footer className="pt-10 text-white">
						<div className="flex flex-col mb-10">
							<div className="mb-5">
								Made with
								<span className="mx-2">
									<FontAwesomeIcon icon="heart" style={{ color: '#ef1919' }} />
								</span>
								to
								<span className="mx-2">
									<FontAwesomeIcon icon="futbol" style={{ color: '#ef1919' }} />
								</span>
								by
							</div>
							<div className="flex flex-row justify-center">
								<div className="mx-1">
									<img className="w-10 h-10 rounded-full" src={amirK} alt="Amir Keren Avatar" />
									<div className="text-xs">Amir Keren</div>
								</div>
								<div className="mx-1">
									<img className="w-10 h-10 rounded-full" src={galB} alt="Gal Bari Avatar" />
									<div className="text-xs">Gal Bari</div>
								</div>
							</div>
						</div>
					</footer>
				</div>
			</Router>
		);
	}
}

export default App;
