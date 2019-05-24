import React, { Component } from 'react';
import PlayersList from './playersList';

class TeamInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			players: []
		};
	}

	componentDidMount() {
		const url = `/players?team_id=${this.props.match.params.teamId}`;
		fetch(url)
			.then(response => response.json())
			.then(data => {
				this.setState({
					players: data
				});
			});
	}

	render() {
    const teamName = this.state.players.length ? this.state.players[0].name : '';
		return <PlayersList header={teamName} players={this.state.players}/>;
	}
}

export default TeamInfo;
