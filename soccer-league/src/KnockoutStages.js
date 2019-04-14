import React, { Component } from 'react';
import Knockout from './Knockout.js';
import Winner from './Winner.js';

class KnockoutStages extends Component {
	constructor(props) {
		super(props);
		this.state = {
			quarterFinals: null,
			semiFinals: null,
			final: null,
			winner: null
		};
	}

	componentDidMount() {
		const data = [
			{ home: 'team1', away: 'team2', hscore: 0, ascore: 0, round: 0 },
			{ home: 'team3', away: 'team4', hscore: 0, ascore: 0, round: 0 },
			{ home: 'team5', away: 'team6', hscore: 0, ascore: 0, round: 0 },
			{ home: 'team7', away: 'team8', hscore: 0, ascore: 0, round: 0 },
			{ home: 'team1', away: 'team4', hscore: 0, ascore: 0, round: 1 },
			{ home: 'team5', away: 'team8', hscore: 0, ascore: 0, round: 1 },
			{ home: 'team4', away: 'team8', hscore: 0, ascore: 0, round: 2 },
			{ home: 'team8', round: 3 }
		];
		this.setState({ quarterFinals: data.filter(game => game.round === 0) });
		this.setState({ semiFinals: data.filter(game => game.round === 1) });
		this.setState({ final: data.filter(game => game.round === 2) });
		this.setState({ winner: data.filter(game => game.round === 3) });
	}

	render() {
		return (
			<div>
				<h1 className="page-header">Knockout</h1>
				<div className="knockout quarters">
					<h2>Quarter Finals</h2>
					<Knockout games={this.state.quarterFinals} order={this.props.quarterOrder} updateKnockout={this.updateKnockout} round={'quarter'} />
				</div>
				<div className="knockout semi">
					<h2>Semi Finals</h2>
					<Knockout games={this.state.semiFinals} order={this.props.semiOrder} updateKnockout={this.updateKnockout} round={'semi'} />
				</div>
				<div className="knockout final">
					<h2>Final</h2>
					<Knockout games={this.state.final} order={this.props.finalOrder} updateKnockout={this.updateKnockout} round={'final'} />
				</div>
				<div className="knockout winner">
					<h2>Winner</h2>
					<Winner games={this.state.winner} order={this.props.winnerOrder} updateKnockout={this.updateKnockout} round={'winner'} />
				</div>
			</div>
		);
	}
}

export default KnockoutStages;
