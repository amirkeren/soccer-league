import React from 'react';
import playerPlacholderImg from './img/players/player-placeholder.png';

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
				<div key={player.player} className={`flex w-full row bg-gray-${i % 2 === 0 ? '300' : '200'}`}>
					<div className="relative py-2">
						<img
							className="w-3/4 mx-3  rounded-full"
							src={process.env.PUBLIC_URL + '/player_pictures/' + player.player.split(' ')[0] + '_' + player.player.split(' ')[1] + '.png'}
							onError={e => {
								e.target.onerror = null;
								e.target.src =`${playerPlacholderImg}`
							}}
							alt={player.player}
						/>
						<div className={`absolute flag ${getFlagClass(player.name)}`} />
					</div>

					<div className="w-5/6 text-left px-3 pt-10 text-xl">{player.player}</div>
					<div className="w-1/6 py-10">{player.goals_scored}</div>
				</div>
			))}
		</div>
	);
};

export default PlayersList;
