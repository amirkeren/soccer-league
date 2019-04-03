import React, { Component } from 'react';
import Group from './Group';
import { generateKey } from './utils';

class GroupStage extends Component {
	render() {
		const groups = this.props.teamGroups.map((group, i) => <Group key={generateKey(i)} teams={group} num={i} />);

		return (
			<div>
				<h1 className="page-header">
					Taboola <br /> World Cup
				</h1>
				<h2 className="group-stage">Group Stage</h2>
				<div className="wrap">{groups}</div>
			</div>
		);
	}
}

export default GroupStage;
