import React, { Component } from 'react';
import Dropdown from './Dropdown';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


class Score extends Component {
	hadnleGameOver = () => {
    confirmAlert({
      title: 'Confirm match resault',
      message: 'Are you sure this is the final resault?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => alert('Click Yes')
        },
        {
          label: 'No',
          onClick: () => console.log('💩')
          
        }
      ]
    });
  };

	render() {
		const goalsOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

		return (
			<div>
				<h1 className="page-header">Update Match Score</h1>
				<div className="teamsContainer">
					<div className="team home">
						<Dropdown defaultValue={'Home Team'} options={['Team 1', 'Team 2', 'Team 3']} />
					</div>
					<div className="matchScoreContainer">
						<div className="home-team-score">
							<Dropdown defaultValue={'0'} options={goalsOptions} />
						</div>
						<span>-</span>
						<div className="away-team-score">
							<Dropdown defaultValue={'0'} options={goalsOptions} />
						</div>
					</div>
					<div className="team away">
						<Dropdown defaultValue={'Away Team'} options={['Team 1', 'Team 2', 'Team 3']} />
					</div>
				</div>

				<div class="update-score-container">
					<div onClick={this.hadnleGameOver} className="game-over-btn">
						Game Over
					</div>
				</div>
			</div>
		);
	}
}

export default Score;
