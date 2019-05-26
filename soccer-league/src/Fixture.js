import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { generateKey } from './utils';

class Fixture extends Component {
	render() {
		function MatchTeam(props) {
			let flagClass = props.teamName.toLowerCase().replace(/\s/g, '-');
			return (
				<div className={`matchTeam ${props.won && 'won'}`}>
					<div className="flex">
						<span className={`flag ${flagClass}`} />
						<div className="flex-grow team flex items-center text-left">
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
						<button className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded mt-1 mb-1">Update Score</button>
					</Link>
				</div>
			);
		}
		const { isAdmin } = this.props;
		const matches = this.props.games
			? this.props.games.map((game, index) => {
					const { home_team, away_team, home_scored, away_scored } = game;
					const randomKey = Math.floor(Math.random() * Math.floor(10000));
					let home_score = home_scored === undefined ? '' : home_scored;
					let away_score = away_scored === undefined ? '' : away_scored;
					return (
						<div key={generateKey(randomKey)} className="matchContainer">
							<div className="matchTeams">
								<MatchTeam teamName={home_team} scored={home_score} won={home_scored > away_scored} />
								<MatchTeam teamName={away_team} scored={away_score} won={home_scored < away_scored} />
							</div>
							{isAdmin && <UpdateScore {...game} index={index} />}
						</div>
					);
			  })
			: null;
		return <div className="matches">{matches}</div>;
	}
}

export default Fixture;
