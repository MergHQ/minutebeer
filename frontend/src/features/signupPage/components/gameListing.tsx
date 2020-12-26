import React from 'react'
import { Card, CardBody, CardTitle, CardSubtitle, CardText, Button } from 'reactstrap'
import { GameState, UserGame } from '../../../types/Game'

type Props = {
  games: UserGame[]
}

const stateToStr = (state: GameState) =>
  state === GameState.NOT_STARTED ? 'Not started' : state === GameState.STARTED ? 'Started' : 'Finnished'


const renderCard = ({ id, state, currentMinutes, maxMinutes, userGameState }: UserGame) => (
  <Card>
    <CardBody>
      <CardTitle tag="h5">{id}</CardTitle>
      <CardSubtitle tag="h6" className="mb-2 text-muted">State: {stateToStr(state)}</CardSubtitle>
      <CardText>
        Progress: {currentMinutes}min / {maxMinutes}min
        {userGameState && state === GameState.STARTED ? `Your status: Tier: ${userGameState.tier} progress ${userGameState.current}min / ${maxMinutes}min` : null}
      </CardText>
      {state !== GameState.FINISHED && <Button>{!userGameState ? 'Join' : 'Continue'}</Button>}
    </CardBody>
  </Card>
)

export default (props: Props) => (
  <div className="games" style={{ margin: '10px' }}>
    <h1>Games</h1>
    {props.games.map(renderCard)}
  </div>
)
