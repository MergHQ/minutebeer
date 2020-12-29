import { UserDrink } from './UserDrink'

export interface User {
  id?: string
  nickname: string
  tkoAlyUserId: number
  email: string
  role: string
}

export interface UserDrinksObject extends User {
  drinks: UserDrink[]
}
