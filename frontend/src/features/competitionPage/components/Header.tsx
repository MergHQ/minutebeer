import React from 'react'
import { User } from '../../../types/User'

interface Props {
  user: User
}

export default class Header extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    const { nickname, tier } = this.props.user
    return (
      <h1>{`Competing as ${nickname} with tier ${tier + 1}`}</h1>
    )
  }
}