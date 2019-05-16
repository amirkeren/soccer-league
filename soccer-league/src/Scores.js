import React, { Component } from 'react';
import Scorers from './Scorers';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Select from 'react-select';
class Score extends Component {
	constructor(props) {
		super(props);
		this.state = {
			homeTeam: null,
			awayTeam: null,
			homeTeamPlayers: [{ value: 'amir keren', label: 'amir keren' }, { value: 'gal bari', label: 'gal bari' }],
			awayTeamPlayers: null,
			homeTeamScorers: [],
			awayTeamScorers: [],
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

	handleScorerDdSelection = name => value => {
		const scorer = { value: value.value, label: value.label };
		this.setState({ [name]: [...this.state[name], scorer] });
	};

	hadnleScoreUpdateCick = () => {
		if (!this.state.homeTeam || !this.state.awayTeam || !this.state.homeTeam.value || !this.state.awayTeam.value) {
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
				message: 'Are you sure this is the final result?',
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
							<div className="teamSectionContainer">
								<div className="team home flex justify-between">
									<div className="teamSection">
										<Select
											value={this.state.homeTeam}
											className={'teamSelection'}
											classNamePrefix={'team-selection'}
											isDisabled={this.state.isKnockoutMatch}
											onChange={this.handleDdSelection('homeTeam')}
											options={this.state.teams}
											placeholder={'Home Team'}
											isSearchable={false}
										/>
									</div>
									<div className="home-team-score teamScore">
										<Select
											value={this.state.homeTeamScore}
											className={'teamScoreSelection'}
											classNamePrefix={'score-selection'}
											onChange={this.handleDdSelection('homeTeamScore')}
											options={goalsOptions}
											placeholder={'0'}
											isSearchable={false}
										/>
									</div>
								</div>
								<div className="scorersContainer flex justify-between">
									{this.state.homeTeamScore.value > 0 && (
										<Scorers
											team={'homeTeamScorers'}
											scorersList={this.state.homeTeamScorers}
											numOfSelect={this.state.homeTeamScore.value}
											playersList={this.state.homeTeamPlayers}
											onScorerSelection={this.handleScorerDdSelection}
										/>
									)}
								</div>
							</div>

							<div className="vs flex justify-center mt-6 mb-6 text-white">VS</div>
							<div className="teamSectionContainer">
								<div className="team away flex justify-between">
									<div className="teamSection">
										<Select
											value={this.state.awayTeam}
											className={'teamSelection'}
											classNamePrefix={'team-selection'}
											isDisabled={this.state.isKnockoutMatch}
											onChange={this.handleDdSelection('awayTeam')}
											options={this.state.teams}
											placeholder={'Away Team'}
											isSearchable={false}
										/>
									</div>
									<div className="home-team-score teamScore">
										<Select
											value={this.state.awayTeamScore}
											className={'teamScoreSelection'}
											classNamePrefix={'score-selection'}
											onChange={this.handleDdSelection('awayTeamScore')}
											options={goalsOptions}
											placeholder={'0'}
											isSearchable={false}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="update-score-container flex justify-center mt-6">
							<button onClick={this.hadnleScoreUpdateCick} className="w-full bg-blue-900 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded">
								Update Score
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Score;
