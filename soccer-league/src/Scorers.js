import React from 'react';
import Select from 'react-select';


const Scorers = function (props) {
	const { numOfSelect, playersList, scorersList, team } = props;
	let selects = [];
	for (let i = 1; i <= numOfSelect; i++) {
		selects.push(
			<div>
				<Select
					value={scorersList && scorersList[i-1] ? scorersList[i-1] : {value: '', label: ''}}
					name={team}
					className={'scorer'}
					classNamePrefix={'player-selection'}
					options={playersList}
					placeholder={'select scorer'}
					isSearchable={false}
					onChange={props.onScorerSelection(team)}
				/>
			</div>
		);
	}
	return <div className="w-full">{selects}</div>;
}

export default Scorers;