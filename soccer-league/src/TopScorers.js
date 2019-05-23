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

	render() {
		return (
			this.state.players.map((player) => (
				<li >{player.player},{player.name}, {player.goals_scored}</li>
			))
		);
	}
}

export default TopScorers;