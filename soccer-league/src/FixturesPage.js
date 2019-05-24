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
			});
	}
	render() {
		const groupHeader = this.props.location.state.groupHeader;
		return (
			<div className="fixures-container">
				<h1 className=" sub-header fixures-header text-white text-2xl py-3 font-bold">Group Fixures</h1>
				{this.state.fixtures && (
					<div className="knockout quarters">
						<h2>{groupHeader}</h2>
						<Fixture games={this.state.fixtures} isAdmin={this.state.isAdmin} />
					</div>
				)}
			</div>
		);
	}
}

export default FixturesPage;
