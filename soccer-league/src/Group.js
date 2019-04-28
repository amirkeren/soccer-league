import React, { Component } from 'react';
import { generateKey } from './utils';

class Group extends Component {
	render() {
		function TableHead(props) {
			return (
				<thead>
					<th />
					<th className="name" />
					<th>P</th>
					<th>W</th>
					<th>D</th>
					<th>L</th>
					<th>F</th>
					<th>A</th>
					<th>GD</th>
					<th>Pts</th>
				</thead>
			);
		}

		function Row(props) {
			const team = props.team;
			//convert team name into css syntax for className
			let flagClass = team.team_name.toLowerCase().replace(/\s/g, '-');
			return (
				<tr>
					<td>
						<div className={'flag ' + flagClass}>
							<div />
						</div>
					</td>
					<td className="name">{team.team_name}</td>
					<td>{team.games_played}</td>
					<td>{team.wins}</td>
					<td>{team.draws}</td>
					<td>{team.loses}</td>
					<td>{team.goals_scored}</td>
					<td>{team.goals_against}</td>
					<td>{team.goals_scored - team.goals_against}</td>
					<td>{team.points}</td>
				</tr>
			);
		}

		function getGroupLetter(num) {
			return String.fromCharCode(97 + num).toUpperCase();
		}

		return (
			<div className="container">
				<div className="table-container">
					<h2 className="group-title pb-2">Group {getGroupLetter(this.props.num)}</h2>
					<table>
						<TableHead />
						<tbody>
							{this.props.teams.map(team => {
								return <Row key={generateKey(team.team_id)} team={team} />;
							})}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

export default Group;
