import React, { Component } from 'react';
import Knockout from './Knockout.js';
import Winner from './Winner.js';

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
        let host = process.env.NODE_HOST || 'localhost';
        fetch('http://' + host + ':8000/playoffs')
			.then(response => response.json())
			.then(data => {
				this.setState({ quarterFinals: data.filter(game => game.step_id === 1) });
				this.setState({ semiFinals: data.filter(game => game.step_id === 2) });
				this.setState({ final: data.filter(game => game.step_id === 3) });
				this.setState({ winner: data.filter(game => game.step_id === 4) });
			});
	}

	render() {
		return (
			<div>
				<h1 className="sub-header">Knockout</h1>
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
