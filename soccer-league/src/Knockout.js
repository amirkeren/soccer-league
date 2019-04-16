import React from 'react';
import { Link } from 'react-router-dom';
import { generateKey } from './utils';


const Knockout = function(props) {
	const matches = props.games
		? props.games.map(game => {
				const { home_team, away_team, home_scored, away_scored } = game;
				// key={generateKey(Math.floor(Math.random() * Math.floor(100)))}
				return (
					<div className="matchContainer">
						<Link
							to={{
								pathname: '/scores',
								state: {
									home_team: home_team,
									away_team: away_team,
									home_scored: home_scored,
									away_scored: away_scored,
									displaySpecificTeams: true
								}
							}}
						>
							<div className="match">
								<div className="flag">{home_team}</div>
								<div className=" score home_scored">{home_scored}</div>
								<div className="v">v</div>
								<div className="score away_scored">{away_scored}</div>
								<div className="flag">{away_team}</div>
							</div>
						</Link>
					</div>
				);
		  })
		: null;
	return <div className="matches">{matches}</div>;
};

export default Knockout;