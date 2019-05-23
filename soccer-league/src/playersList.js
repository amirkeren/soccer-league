import React from 'react';

const PlayersList = function(props) {
  const { players, header } = props;
  
  function getFlagClass(teamName) {
		return teamName.toLowerCase().replace(/\s/g, '-');
  }
  
	return (
		<div className="flex flex-col topScorers-container">
			<div className="flex bg-gray-200 py-3">
				<div className="w-5/6 text-left pl-3 font-bold">{header}</div>
				<div className="w-1/6 font-bold">Goals</div>
			</div>
			{players.map((player, i) => (
				<div className={`flex w-full row bg-gray-${i % 2 === 0 ? '300' : '200'}`}>
					<div className={`w-1/6 mx-3 flag ${getFlagClass(player.name)}`} />
					<div className="w-5/6 text-left p-5">{player.player}</div>
					<div className="w-1/6 p-5">{player.goals_scored}</div>
				</div>
			))}
		</div>
	);
};

export default PlayersList;
