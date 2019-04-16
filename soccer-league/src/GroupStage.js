import React, { Component } from 'react';
import Group from './Group';
import { generateKey } from './utils';

class GroupStage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groups: [],
        };
    }

    componentDidMount() {
        fetch('http://localhost:8000/league')
            .then(response => response.json())
            .then(data => {this.setState({ groups: data })});
    }

	render() {
		const { groups } = this.state;
		return (
			<div>
				<h1 className="page-header">
					Taboola <br /> World Cup
				</h1>
				<h2 className="group-stage">Group Stage</h2>
				<div className="wrap">
					{groups.map((group, i) => <Group key={generateKey(i)} teams={group} num={i} />)}
				</div>
			</div>
		);
	}
}

export default GroupStage;
