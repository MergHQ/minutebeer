import Bacon from 'baconjs'

export class Action<T> extends String {}

const bus = new Bacon.Bus<any, any>()

export function sendAction<T>(action: Action<T>, data: T) {
  bus.push({
    action,
    data,
  })
}

export function actionStream<T>(action: Action<T>): Bacon.EventStream<any, T> {
  return bus.filter(value => value.action === action).map(value => value.data as T)
}
