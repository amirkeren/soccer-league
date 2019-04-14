import React from 'react';
import { Link } from 'react-router-dom';

const Knockout = function(props) {
	const matches = props.games
		? props.games.map(game => {
        const { home, away, hscore, ascore } = game;
				return (
					<Link
						to={{
							pathname: '/scores',
							state: {
								home: home,
								away: away,
								hscore: hscore,
                ascore: ascore,
                displaySpecificTeams: true
							}
						}}
					>
						<div className="match">
							<div className="flag">{home}</div>
							<div className=" score hscore">{hscore}</div>
							<div className="v">v</div>
							<div className="score ascore">{ascore}</div>
							<div className="flag">{away}</div>
						</div>
					</Link>
				);
		  })
		: null;
	return <div className="matches">{matches}</div>;
};

export default Knockout;
