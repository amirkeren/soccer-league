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
		return <PlayersList header={'Top Scorers'} players={this.state.players}/>;
	}
}

export default TeamInfo;
