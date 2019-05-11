import React, { Component } from 'react';
import Fixture from './Fixture.js';
import Winner from './Winner.js';
import SizeMe from 'react-sizeme';

class KnockoutStages extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			quarterFinals: null,
			semiFinals: null,
			final: null,
			winner: null
		};
	}

	componentDidMount() {
		fetch('/playoffs')
			.then(response => response.json())
			.then(data => {
				this.setState({ quarterFinals: data.filter(game => game.step_id === 1) });
				this.setState({ semiFinals: data.filter(game => game.step_id === 2) });
				this.setState({ final: data.filter(game => game.step_id === 3) });
				this.setState({ winner: data.filter(game => game.step_id === 4)[0].home_team });
			});
	}

	render() {
		const winnerTeam = this.state.winner;
		return (
			<div>
				<h1 className="sub-header">Knockout</h1>
				{winnerTeam && <Winner winner={winnerTeam} isAdmin={this.props.isAdmin} />}
				<div className="knockout quarters">
					<h2>Quarter Finals</h2>
					<Fixture games={this.state.quarterFinals} order={this.props.quarterOrder} round={'quarter'} isAdmin={this.props.isAdmin} />
				</div>
				<div className="knockout semi">
					<h2>Semi Finals</h2>
					<Fixture games={this.state.semiFinals} order={this.props.semiOrder} round={'semi'} isAdmin={this.props.isAdmin} />
				</div>
				<div className="knockout final">
					<h2>Final</h2>
					<Fixture games={this.state.final} order={this.props.finalOrder} round={'final'} isAdmin={this.props.isAdmin} />
				</div>
				{winnerTeam && <Winner winner={winnerTeam} isAdmin={this.props.isAdmin} />}
			</div>
		);
	}
}

export default KnockoutStages;
