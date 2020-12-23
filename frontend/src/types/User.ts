import { UserDrink } from './UserDrink'

export interface User {
  id?: string
  nickname: string
  tier: 0 | 1 | 2
}

export interface UserDrinksObject extends User {
  drinks: UserDrink[]
}
