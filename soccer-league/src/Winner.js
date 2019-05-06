import React from 'react';
import withSize from 'react-sizeme';
import Confetti from 'react-confetti';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Winner = function(props) {
	const winner = (
		<div className="flex mt-15">
			<div className="champions">
				<Confetti {...props.size} numberOfPieces={50} />
				<div className="trophy pt-10">
					<FontAwesomeIcon icon="trophy" style={{ color: 'gold' }} />
				</div>
				<div className="text-5xl">{props.winner}</div>
			</div>
		</div>
	);

	return (
		<div className="winner">
			<div className="knockout winner">
				<h2>Winner</h2>
				{winner}
			</div>
		</div>
	);
};

export default withSize({ monitorWidth: true, monitorHeight: true })(Winner);
