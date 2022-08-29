import React from 'react';
import _ from 'lodash';
import styled from 'styled-components'
import { Play, Pause, Refresh } from '@styled-icons/heroicons-outline';
import { Trophy } from '@styled-icons/ionicons-outline';
import { gameApi } from '../../api';
import StopWatch from './StopWatch';
import { SHOW_TOP } from '../../Config';
import { computeWinner } from './DashboardUtils';


const Title = styled.h1`
  text-align: center;
  font-weight: 700;
  font-size: 3rem;
  color: white;
`

const LeftBarDiv = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 350px;
  background-color: #262626;
  display: flex;
  flex-direction: column;
`;

const Control = ({className, status}) => (
    <div className={className}>
        {status === 'started' ? (
            <button id="pause" onClick={() => gameApi.sendEvent('pause')}><Pause/></button>
        ) : (
            <button id="play" onClick={() => gameApi.sendEvent('start')}><Play/></button>
        )}
        <button id="reset" onClick={() => gameApi.sendEvent('reset')}><Refresh/></button>
    </div>
);

const StyledControl = styled(Control)`
  margin: 20px 0;
  text-align: center;
  color: white;

  button {
    border: 0;
    background: transparent;
    cursor: pointer;

    svg {
      height: 100px;
      color: white;
    }
  }
`;

const Teams = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  margin-left: 20px;
  margin-right: 20px;

  .stopwatch {
    font-size: 1.5rem;

    span:last-child {
      font-size: 1rem;
    }
  }
`

const Header = styled.div`
  display: flex;
  border-bottom: 1px solid white;
  font-size: 2rem;
  
  & > span:first-child {
    flex-grow: 1;
  }
  & > span:last-child {
    color: white;
    font-size: 1rem;
    line-height: 2rem;
  }
  
  svg {
    margin-right: 10px;
    margin-top: -10px;
  }
`

const Team = (props) => {
    let team = _.values(props.team);
    team = team.sort((a, b) => b.generated - a.generated);
    team = team.slice(0, SHOW_TOP);
    return (
        <div className={props.className}>
            <Header style={{color: gameApi.TEAM_COLORS[props.id - 1]}}>
                <span>
                    {props.winner === props.id && <Trophy size={32}/>}
                    Team {props.id}
                </span>
                {props.winner < 0 && <span>{props.generated} MW</span>}
                {props.time && <span><StopWatch time={props.time} running={false}/></span>}
            </Header>
            <ol>
                {team.length > 0 ? team.map((u, id) => (
                    <li key={id}>{u.id} - {u.generated} MW</li>
                )) : (<li>Waiting for players...</li>)
                }
            </ol>
        </div>
    );
}

const StyledTeam = styled(Team)`
  font-size: 1.0rem;
  color: white;

  li {
    line-height: 25px;
  }
`;

const LeftBar = (props) => {
    const winner = computeWinner(props.result);
    return (
        <LeftBarDiv>
            <Title>The Race</Title>
            <Teams>
                <StyledTeam id={1} team={props.team1} generated={props.power[0]} time={props.result.team1} winner={winner}/>
                <StyledTeam id={2} team={props.team2} generated={props.power[1]} time={props.result.team2} winner={winner}/>
            </Teams>
            <StopWatch time={props.time} setTime={props.setTime} running={props.status === 'started'}/>
            <StyledControl status={props.status}/>
        </LeftBarDiv>
    );
}

export default LeftBar;