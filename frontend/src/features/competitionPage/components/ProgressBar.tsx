import React from 'react'
import { User } from '../../../types/User'
import { Progress } from 'reactstrap'

interface Props {
  drinks: string[]
  user: User
}

export default class ProgressBar extends React.Component<Props, any> {
  render() {
    const { drinks, user } = this.props
    const { tier } = user
    return (
      <Progress value={(drinks.length / ((tier + 1) * 31)) * 100} />
    )
  }
}