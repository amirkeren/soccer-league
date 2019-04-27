import React from 'react';
import { Link } from 'react-router-dom';
import { generateKey } from './utils';

const Knockout = function(props) {
	const { isAdmin } = props;
	const matches = props.games
		? props.games.map((game, index) => {
				const { home_team, away_team, home_scored, away_scored, step_id } = game;
				// key={generateKey(Math.floor(Math.random() * Math.floor(100)))}
				return (
					<div className="matchContainer">
						<div className="match">
							<div className="flag">{home_team}</div>
							<div className=" score home_scored">{home_scored}</div>
							<div className="v">v</div>
							<div className="score away_scored">{away_scored}</div>
							<div className="flag">{away_team}</div>
							{isAdmin && (
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
							)}
						</div>
					</div>
				);
		  })
		: null;
	return <div className="matches">{matches}</div>;
};

export default Knockout;
