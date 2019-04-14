import React from 'react';

const Winner = function(props) {
  const winnerTeam = props.games ? props.games[0].home : 'TBD'; 
	const winner = (
		<div className="match">
			<div className="flag">{winnerTeam}</div>
		</div>
	);

	return <div className="winner">{winner}</div>;
};

export default Winner;
