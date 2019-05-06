import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { generateKey } from './utils';
import Select from 'react-select';


class Knockout extends Component {
	render() {
		function MatchTeam(props) {
			return (
				<div className={`matchTeam ${props.won && 'won'}`}>
					<div className="flex">
						<span className="flag-icon" />
						<div className="flex-grow team homeTeam flex items-center">
							<div>{props.teamName}</div>
						</div>
						<div className="flex-shrink score flex items-center justify-end">{props.scored}</div>
					</div>
				</div>
			);
		}

		function UpdateScore(props) {
			const { home_team, away_team, home_scored, away_scored, step_id, isAdmin } = props;
			let { index } = props;
			return (
				<div>
					{' '}
					<Link
						to={{
							pathname: '/scores',
							state: {
								home_team: home_team,
								away_team: away_team,
								home_scored: home_scored,
								away_scored: away_scored,
								isKnockoutMatch: true,
								step_id: step_id,
								gameIndex: ++index,
								isAdmin: isAdmin
							}
						}}
					>
						<div>Update score</div>
					</Link>
				</div>
			);
		}
		const { isAdmin } = this.props;
		const matches = this.props.games
			? this.props.games.map((game, index) => {
					const { home_team, away_team, home_scored, away_scored } = game;
					const randomKey = Math.floor(Math.random() * Math.floor(10000));
					return (
						<div key={generateKey(randomKey)} className="matchContainer">
							<div className="matchTeams">
								<MatchTeam teamName={home_team} scored={home_scored} won={home_scored > away_scored} />
								<MatchTeam teamName={away_team} scored={away_scored} won={home_scored < away_scored} />
							</div>
							{isAdmin && <UpdateScore {...game} index={index} />}
						</div>
					);
			  })
			: null;
		return <div className="matches">{matches}</div>;
	}
}

export default Knockout;
