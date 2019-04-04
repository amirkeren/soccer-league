import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
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
      awayTeamScore: { value: 0, label: 0 },
      teams: []
		};
	}

	componentDidMount() {
    function compare(a,b) {
      return a.team_id - b.team_id;
    }
		fetch('http://localhost:8000/teams')
      .then(response => response.json())
      .then(data => data.sort(compare)) //sort the data by team_id
			.then(data => this.setState({ teams: data.map(team => ({value: team.team_id, label: team.name})) }));
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

		const data = new URLSearchParams();
		for (var key in matchData) {
			if (matchData.hasOwnProperty(key)) {
				data.append(key, matchData[key]);
			}
		}
		fetch('http://localhost:8000/match', {
			method: 'post',
			mode: 'no-cors',
			body: data
		})
      .then(() => console.log('Success'))
      .then(() => this.props.history.push('/'))
			.catch(error => console.error('Error:', error));
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

		return (
			<div>
				<h1 className="page-header">Update Match Score</h1>
				<div className="teamsContainer">
					<div className="team home">
						<Select value={this.state.homeTeam} onChange={this.handleDdSelection('homeTeam')} options={this.state.teams} />
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
						<Select value={this.state.awayTeam} onChange={this.handleDdSelection('awayTeam')} options={this.state.teams} placeholder={'select team'} />
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
