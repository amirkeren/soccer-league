import React from 'react';
import Select from 'react-select';

const Scorers = function(props) {
	const { numOfSelect, scorersList, team, onScorerSelection } = props;
	let { playersList } = props
	const ownGoalObj = {value: 'og', label: '💩 Own Goal 💩'};
	playersList.push(ownGoalObj);

	let selects = [];
	for (let i = 1; i <= numOfSelect; i++) {
		selects.push(
			<div key={i}>
				<Select
					value={scorersList && scorersList[i - 1] ? scorersList[i - 1] : { value: '', label: '' }}
					name={team}
					className={'scorer'}
					classNamePrefix={'player-selection'}
					options={playersList}
					placeholder={'select scorer'}
					isSearchable={false}
					onChange={onScorerSelection(team).bind(this)}
				/>
			</div>
		);
	}
	console.log('selects:', selects);
	return (
		<div className="w-full">
      <div className="text-xl text-left text-white">Who Scored:</div>
			<div>
      {selects}
      </div>
		</div>
	);
};

export default Scorers;
