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
			awayTeamScore: { value: 0, label: 0 },
			teams: [],
			isKnockoutMatch: false,
			step_id: null,
			gameIndex: null
		};
	}

	componentDidMount() {
		if (!this.props.isAdmin && this.props.history) {
			this.props.history.push('/');
		}

		const shouldDisplayGivenTeams = this.props.location && this.props.location.state && this.props.location.state.isKnockoutMatch;

		if (shouldDisplayGivenTeams) {
			const { home_team, away_team, home_scored, away_scored, isKnockoutMatch, step_id, gameIndex } = this.props.location.state;

			this.setState({
				homeTeam: { value: home_team, label: home_team },
				awayTeam: { value: away_team, label: away_team },
				homeTeamScore: { value: home_scored, label: home_scored },
				awayTeamScore: { value: away_scored, label: away_scored },
				isKnockoutMatch: isKnockoutMatch,
				step_id: step_id,
				gameIndex: gameIndex
			});
		} else {
			fetch('/league/teams')
				.then(response => response.json())
				.then(data => data.sort(compare)) //sort the data by team_id
				.then(data => this.setState({ teams: data.map(team => ({ value: team.team_id, label: team.name })) }));
		}

		function compare(a, b) {
			return a.team_id - b.team_id;
		}
	}

	handleDdSelection = name => value => {
		this.setState({ [name]: { value: value.value, label: value.label } });
	};
	hadnleScoreUpdateCick = () => {
		if (!this.state.homeTeam.value || !this.state.awayTeam.value) {
            confirmAlert({
                title: 'Error',
                message: 'Must select both teams',
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => console.log('💩')
                    }
                ]
            });
        } else if (this.state.isKnockoutMatch && this.state.homeTeamScore.value === this.state.awayTeamScore.value) {
            confirmAlert({
                title: 'Error',
                message: 'Draw is not a valid score in the knockout stage',
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => console.log('💩')
                    }
                ]
            });
		} else {
			confirmAlert({
				title: 'Confirm match result',
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
		}
	};
	saveMatchData() {
		const matchData = {
			home_team: this.state.homeTeam.value,
			away_team: this.state.awayTeam.value,
			home_score: this.state.homeTeamScore.value,
			away_score: this.state.awayTeamScore.value,
			isKnockoutMatch: this.state.isKnockoutMatch,
			step_id: this.state.step_id,
			id: this.state.gameIndex
		};

		const data = new URLSearchParams();
		const fetchUrl = matchData.isKnockoutMatch ? '/playoffs/match' : '/league/match';
		for (var key in matchData) {
			if (matchData.hasOwnProperty(key)) {
				data.append(key, matchData[key]);
			}
		}
		fetch(fetchUrl, {
			method: 'post',
			body: data
		})
			.then(res => {
				if (res.status === 200) {
					const target = this.state.isKnockoutMatch ? '/knockout' : '/';
					this.props.history.push(target);
				} else {
					return res.json();
				}
			})
			.then(jsonData => {
				if (jsonData) {
					confirmAlert({
						title: 'Error',
						message: jsonData.error,
						buttons: [
							{
								label: 'OK',
								onClick: () => console.log('💩')
							}
						]
					});
				}
			});
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
				<h2 className="sub-header">Update Match Score</h2>
				<div className="matchHeadContainer">
					<div className="matchHead">
						<div className="fixureContainer">
							<div className="team home">
								<Select
									value={this.state.homeTeam}
									className={'test'}
									isDisabled={this.state.isKnockoutMatch}
									onChange={this.handleDdSelection('homeTeam')}
									options={this.state.teams}
								/>
							</div>
							<div className="matchScoreContainer">
								<div className="home-team-score">
									<Select
										value={this.state.homeTeamScore}
										onChange={this.handleDdSelection('homeTeamScore')}
										options={goalsOptions}
										placeholder={'0'}
									/>
								</div>
								<span>-</span>
								<div className="away-team-score">
									<Select
										value={this.state.awayTeamScore}
										onChange={this.handleDdSelection('awayTeamScore')}
										options={goalsOptions}
										placeholder={'0'}
									/>
								</div>
							</div>
							<div className="team away">
								<Select
									value={this.state.awayTeam}
        							isDisabled={this.state.isKnockoutMatch}
									onChange={this.handleDdSelection('awayTeam')}
									options={this.state.teams}
									placeholder={'select team'}
								/>
							</div>
						</div>
						<div className="update-score-container">
							<div onClick={this.hadnleScoreUpdateCick} className="update-score-btn">
								Update Score
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Score;
