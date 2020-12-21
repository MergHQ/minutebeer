import db from '../database'

export function startGame(minutes: number) {
  startTimer(minutes)
}

function startTimer(minutes: number) {
  const interval = setInterval(() => {
    minutesPassed++
    if (minutesPassed > minutes) {
      clearInterval(interval)
      minutesPassed = 0
      return
    }
    sendGlobalEvent({ eventType: EventType.DRINK_ALERT, data: { stage: minutesPassed } })
  }, 60000)
}

export function getGame() {
  return {
    stage: minutesPassed,
  }
}
