import { AdminStats } from './AdminStats'
import { UserGame } from './Game'
import { User } from './User'

export interface InitialState {
  authentication: User
  currentPage: string
  games: UserGame[]
  adminStats: AdminStats
  gameId: string | null
}
