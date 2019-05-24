import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { generateKey } from './utils';

class Group extends Component {
	render() {
		function TableHead(props) {
			return (
				<thead>
					<th>Pos</th>
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
			const { team, position } = props;
			//convert team name into css syntax for className
			let flagClass = team.team_name.toLowerCase().replace(/\s/g, '-');
			return (
				<tr>
					<td>{position}</td>
					<td>
						<div className={'flag ' + flagClass}>
							<div />
						</div>
					</td>
					<td className="name">
						{/* {team.team_name} */}
						<Link
							to={{
								pathname: `/teamInfo/${team.team_id}`
							}}
						>
							{team.team_name}
						</Link>
					</td>
					<td>{team.games_played}</td>
					<td>{team.wins}</td>
					<td>{team.draws}</td>
					<td>{team.loses}</td>
					<td>{team.goals_scored}</td>
					<td>{team.goals_against}</td>
					<td>{team.goals_scored - team.goals_against}</td>
					<td className="font-bold">{team.points}</td>
				</tr>
			);
		}

		function getGroupLetter(num) {
			return String.fromCharCode(97 + num - 1).toUpperCase();
		}

		return (
			<div className="container">
				<div className="table-container">
					<h2 className="group-title pb-2 font-bold">Group {getGroupLetter(this.props.groupId)}</h2>
					<table>
						<TableHead />
						<tbody>
							{this.props.teams.map((team, i) => {
								return <Row key={generateKey(team.team_id)} team={team} position={++i} />;
							})}
						</tbody>
					</table>
				</div>

				<div className="group-games-link">
					<Link
						to={{
							pathname: `/fixtures/${this.props.groupId}`,
							state: {
								groupHeader: `Group ${getGroupLetter(this.props.groupId)}`
							}
						}}
					>
						<button className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded mt-4">Group Fixtures</button>
					</Link>
				</div>
			</div>
		);
	}
}

export default Group;
