import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Select from 'react-select';

class Score extends Component {
	constructor(props) {
		super(props);
		this.state = {
			homeTeam: { value: null, label: null },
			awayTeam: { value: null, label: null },
			homeTeamScore: { value: 0, label: 0 },
			awayTeamScore: { value: 0, label: 0 }
		};
	}
	handleDdSelection = name => value => {
		this.setState({ [name]: { value: value.value, label: value.label } });
	};
	hadnleScoreUpdateCick = () => {
		confirmAlert({
			title: 'Confirm match resault',
			message: 'Are you sure this is the final resault?',
			buttons: [
				{
					label: 'Yes',
					onClick: () => this.saveMatchData()
				},
				{
					label: 'No',
					onClick: () => console.log('💩')
				}
			]
		});
  };
  saveMatchData() {
    const matchData = {
      home_team: this.state.homeTeam.value,
      away_team: this.state.awayTeam.value,
      home_score: this.state.homeTeamScore.value,
      away_score: this.state.awayTeamScore.value
    };

    //SEND THIS DATA TO THE SERVER
    console.log(matchData);
  }

	render() {
		const goalsOptions = [
			{ value: 0, label: 0 },
			{ value: 1, label: 1 },
			{ value: 2, label: 2 },
			{ value: 3, label: 3 },
			{ value: 4, label: 4 },
			{ value: 5, label: 5 },
			{ value: 6, label: 6 },
			{ value: 7, label: 7 },
			{ value: 8, label: 8 },
			{ value: 9, label: 9 },
			{ value: 10, label: 10 }
		];
		const teamOptions = [{ value: 'team1', label: 'Team 1' }, { value: 'team2', label: 'Team 2' }, { value: 'team3', label: 'Team 3' }];
		return (
			<div>
				<h1 className="page-header">Update Match Score</h1>
				<div className="teamsContainer">
					<div className="team home">
						<Select value={this.state.homeTeam} onChange={this.handleDdSelection('homeTeam')} options={teamOptions} />
					</div>
					<div className="matchScoreContainer">
						<div className="home-team-score">
							<Select value={this.state.homeTeamScore} onChange={this.handleDdSelection('homeTeamScore')} options={goalsOptions} placeholder={'0'} />
						</div>
						<span>-</span>
						<div className="away-team-score">
							<Select value={this.state.awayTeamScore} onChange={this.handleDdSelection('awayTeamScore')} options={goalsOptions} placeholder={'0'} />
						</div>
					</div>
					<div className="team away">
						<Select value={this.state.awayTeam} onChange={this.handleDdSelection('awayTeam')} options={teamOptions} placeholder={'select team'} />
					</div>
				</div>

				<div className="update-score-container">
					<div onClick={this.hadnleScoreUpdateCick} className="update-score-btn">
						Update Score
					</div>
				</div>
			</div>
		);
	}
}

export default Score;
