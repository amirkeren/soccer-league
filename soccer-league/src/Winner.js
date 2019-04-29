import React from 'react';

const Winner = function(props) {
	const winnerTeam = props.games && props.games[0].home_team ? props.games[0].home_team : 'TBD';
	const hasWinner = winnerTeam !== 'TBD';

	const winner = (
		<div className="matches">
			<div className={`${hasWinner && 'champions'}`}>
				<div className="flag">{winnerTeam}</div>
			</div>
		</div>
	);

	return <div className="winner">{winner}</div>;
};

export default Winner;
