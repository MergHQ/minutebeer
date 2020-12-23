import { User } from './User'

export interface InitialState {
  authentication: User
  currentPage: string
  competitionState: {
    userDrinks: { drinkType: number }[]
    stage: number
    isModalOpen: boolean
    adminStats: {
      participants: string[]
      totalDrinks: number
      nonHolic: number
      holic: number
    }
  }
}
