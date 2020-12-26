import { UserDrink } from './UserDrink'

export interface User {
  id?: string
  nickname: string
  tkoAlyUserId: number
  email: string
  role: string
  tier: 0 | 1 | 2
}

export interface UserDrinksObject extends User {
  drinks: UserDrink[]
}
