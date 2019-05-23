import React, { Component } from 'react';
import Fixture from './Fixture.js';

class FixturesPage extends Component {
	constructor() {
		super();
		this.state = {
			fixtures: null
		};
	}
	componentDidMount() {
		const group_id = this.props.match.params.groupId;
		fetch(`/fixtures?group_id=${group_id}`)
			.then(response => response.json())
			.then(data => {
				this.setState({ fixtures: data });
				console.log(data);
			});
	}
	render() {
		const groupHeader = this.props.location.state.groupHeader;
		return (
			<div className="fixures-container">
				<div className="fixures-header text-white text-2xl py-3 font-bold">{groupHeader} Fixures</div>
				{this.state.fixtures && <Fixture games={this.state.fixtures} isAdmin={this.state.isAdmin} />}
			</div>
		);
	}
}

export default FixturesPage;
