export enum GameState {
  NOT_STARTED,
  STARTED,
  FINISHED,
}

export type Game = {
  id: string
  maxMinutes: number
  currentMinutes: number
  state: GameState
}

export type UserGame = Game & {
  userGameState: {
    tier: number
    current: number
  }
}
