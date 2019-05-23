import React, { Component } from 'react';
import PlayersList from './playersList';

class TopScorers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			players: []
		};
	}

	componentDidMount() {
		const url = '/players';
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

export default TopScorers;
