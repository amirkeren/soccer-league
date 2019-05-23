import React, { Component } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
class TopScorers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			players: []
		};
	}

	componentDidMount() {
		const url = this.props.team_id ? '/players/team_id=' + this.props.team_id : '/players';
		fetch(url)
			.then(response => response.json())
			.then(data => {
				this.setState({
					players: data
				});
			});
	}

	getFlagClass(teamName) {
		return teamName.toLowerCase().replace(/\s/g, '-');
	}

	render() {
		return (
			<div className="flex flex-col topScorers-container">
				<div className="flex bg-gray-200 py-3">
					<div className="w-5/6 text-left pl-3 font-bold">Top Scorer</div>
					<div className="w-1/6 font-bold">Goals</div>
				</div>
				{this.state.players.map((player, i) => (
					<div className={`flex w-full row bg-gray-${i % 2 === 0 ? '300' : '200'}`}>
						<div className={`w-1/6 mx-3 flag ${this.getFlagClass(player.name)}`} />
						<div className="w-5/6 text-left p-5">{player.player}</div>
						<div className="w-1/6 p-5">{player.goals_scored}</div>
					</div>
				))}
			</div>
		);
	}
}

export default TopScorers;
