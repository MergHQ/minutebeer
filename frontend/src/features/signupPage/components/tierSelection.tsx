import React from 'react'
import { Button } from 'reactstrap'
import { UserGame } from '../../../types/Game'
import { sendAction } from '../../../utils/actionDispatcher'
import { setCurrentGameAction } from '../../../utils/actions'

type Props = {
  game: UserGame
}

const buttonStyle = {
  margin: '10px',
}

const setGame = (id: string) => (tier: number) =>
  sendAction(setCurrentGameAction, { id, tier })

export default ({ game }: Props) => {
  const handleClick = setGame(game.id)
  return (
    <div>
      <h1>Select tier:</h1>
      <Button style={buttonStyle} onClick={() => handleClick(1)}>
        Tier 1 ({game.maxMinutes / 3} minutes)
      </Button>
      <Button style={buttonStyle} onClick={() => handleClick(2)}>
        Tier 2 ({(game.maxMinutes * 2) / 3} minutes)
      </Button>
      <Button style={buttonStyle} onClick={() => handleClick(3)}>
        Tier 3 ({game.maxMinutes} minutes)
      </Button>
    </div>
  )
}
