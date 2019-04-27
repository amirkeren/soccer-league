import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';

import Group from './Group';
import { generateKey } from './utils';

class GroupStage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			groups: []
		};
	}

	componentDidMount() {
		fetch('/league')
			.then(response => response.json())
			.then(data => {
				this.setState({ groups: data });
			});
	}

	handleEndGroupStage() {
		confirmAlert({
			title: 'Confirm ending Group Stage',
			message: 'Are you sure group stage is over?',
			buttons: [
				{
					label: 'Yes',
					onClick: () => {
						fetch('/playoffs', {
							method: 'POST'
						}).then(console.log('aaaaaa'));
					}
				},
				{
					label: 'No',
					onClick: () => console.log('💩')
				}
			]
		});
	}
	handleReset() {
		confirmAlert({
			title: 'Confirm Reset',
			message: 'Are you sure you want to reset the entire system?',
			buttons: [
				{
					label: 'Yes',
					onClick: () => {
						fetch('/reset', {
							method: 'POST'
						}).then(window.location.reload());
					}
				},
				{
					label: 'No',
					onClick: () => console.log('💩')
				}
			]
		});
	}

	render() {
		const { groups } = this.state;
		return (
			<div>
				<h2 className="sub-header">Group Stage</h2>
				<div className="wrap">
					{groups.map((group, i) => (
						<Group key={generateKey(i)} teams={group} num={i} />
					))}
				</div>
				{this.props.isAdmin && (
					<div className="flex justify-between mt-5 mb-5">
						<div className="flex-grow pb-2">
							<button
								className="bg-green-dark hover:bg-grey text-grey-lightest font-bold py-2 px-4 rounded inline-flex items-center text-xl"
								onClick={this.handleEndGroupStage}
							>
								<span>
									<span className="btn-icon" role="img" aria-label="reset">🕺</span>End Group Stage
								</span>
							</button>
						</div>
						<div className="flex-grow pb-2">
							<button
								className="bg-red-dark hover:bg-grey text-grey-lightest font-bold py-2 px-4 rounded inline-flex items-center text-xl"
								onClick={this.handleReset}
							>
								<span>
									<span className="btn-icon" role="img" aria-label="reset">🤦‍♂️</span>Reset
								</span>
							</button>
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default GroupStage;
