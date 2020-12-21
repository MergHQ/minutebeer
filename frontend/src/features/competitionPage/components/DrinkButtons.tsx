import React from 'react'
import {DrinkType} from '../../../types/UserDrink'
import { Button } from 'reactstrap'

export default (props: {handleClick: (dt: DrinkType) => void}) => {
  const {handleClick} = props
  return (
    <div>
      <Button onClick={() => handleClick(DrinkType.ALCOHOL)}>
        <h1>🍺</h1>
      </Button>
      <Button onClick={() => handleClick(DrinkType.NON_ALCOHOL)}>
        <h1>🥛</h1>
      </Button>
    </div>
  )
}