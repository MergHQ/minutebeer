import React from 'react'
import { User } from '../../../types/User'

interface Props {
  user: User
  tier: number
}

export default class Header extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    const { user, tier } = this.props
    return <h1>{`Competing as ${user.nickname} with tier ${tier}`}</h1>
  }
}
