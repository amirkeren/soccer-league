import React, { Component } from 'react';
import { generateKey } from './utils';


class Group extends Component {
  render(){
    function TableHead(){
      return (
        <thead>
          <th></th>
          <th className="name"></th>
          <th>P</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>F</th>
          <th>A</th>
          <th>GD</th>
          <th>Pts</th>
        </thead>
      )
    }

    function Row(props) {
      const team = props.team;
      //convert team name into css syntax for className
      let flagClass = team.team_name.toLowerCase().replace(/\s/g, "-");
      return (
        <tr>
          <td>
            <div className={'flag ' + flagClass}>
              <div></div>
            </div>
          </td>
          <td className="name">{team.team_name}</td>
          <td>{team.games_played}</td>
          <td>{team.wins}</td>
          <td>{team.draws}</td>
          <td>{team.loses}</td>
          <td>{team.goals_scored}</td>
          <td>{team.goals_against}</td>
          <td>{team.goals_scored - team.goals_against}</td>
          <td>{team.points}</td>
        </tr>
      )
    }

    return (
      <div className="container">
        <div className="table-container">
          <table>
            <TableHead />  
            <tbody>
              {this.props.teams.map((team)=>{
                return (
                  <Row key={generateKey(team.team_id)} team={team}/>                   
                )
              })}
            </tbody>
          </table>
        </div> 
      </div>
    )
  }
}

export default Group;