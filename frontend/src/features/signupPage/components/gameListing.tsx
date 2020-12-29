import React from 'react'
import { Card, CardBody, CardTitle, CardSubtitle, CardText, Button } from 'reactstrap'
import { GameState, UserGame } from '../../../types/Game'
import { sendAction } from '../../../utils/actionDispatcher'
import { openTierSelectionAction, setCurrentGameAction } from '../../../utils/actions'

type Props = {
  games: UserGame[]
}

const stateToStr = (state: GameState) =>
  state === GameState.NOT_STARTED
    ? 'Not started'
    : state === GameState.STARTED
    ? 'Started'
    : 'Finished'

const JoinButton = ({ game }: { game: UserGame }) =>
  game.userGameState ? (
    <Button
      onClick={() =>
        sendAction(setCurrentGameAction, { id: game.id, tier: game.userGameState.tier })
      }
    >
      Continue
    </Button>
  ) : (
    <Button onClick={() => sendAction(openTierSelectionAction, game)}>Join</Button>
  )

const renderCard = (game: UserGame) => (
  <Card>
    <CardBody>
      <CardTitle tag="h5">{game.id}</CardTitle>
      <CardSubtitle tag="h6" className="mb-2 text-muted">
        State: {stateToStr(game.state)}
      </CardSubtitle>
      <CardText>
        Progress: {game.currentMinutes}min / {game.maxMinutes}min
        {game.userGameState && game.state === GameState.STARTED
          ? `Your status: Tier: ${game.userGameState.tier} progress ${game.userGameState.current}min / ${game.maxMinutes}min`
          : null}
      </CardText>
      {game.state !== GameState.FINISHED && <JoinButton game={game} />}
    </CardBody>
  </Card>
)

export default (props: Props) => (
  <div className="games" style={{ margin: '10px' }}>
    <h1>Games</h1>
    {props.games.map(renderCard)}
  </div>
)
