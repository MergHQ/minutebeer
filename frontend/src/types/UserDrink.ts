export enum DrinkType {
  ALCOHOL = 0,
  NON_ALCOHOL = 1
}

export interface UserDrink {
  id?: string,
  drinkType: DrinkType,
  userId: string
}
