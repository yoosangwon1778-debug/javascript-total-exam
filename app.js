const board = document.querySelector('.board')
const triesText = document.querySelector('.tries')
const timeText = document.querySelector('.time')
const bestText = document.querySelector('.best')
const message = document.querySelector('.message')
const btnRestart = document.querySelector('.restart')

const emojis = ['🍎', '🍌', '🍇', '🍓', '🍒', '🥝', '🍑', '🍍'];

const makeCards = () => [...emojis, ...emojis]


const render = (cards) => {
  board.innerHTML = ''

  cards.forEach((emoji) => {
    const card = document.createElement('button')

    card.classList.add('card')
    card.dataset.emoji = emoji
    card.innerHTML = `
          <span class="front">?</span>
          <span class="back">${emoji}</span>
        `
    card.addEventListener('click', () => flip(card))
    board.appendChild(card)
  })
}

const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = getRandom(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// render(shuffle(makeCards()))

let first = null
let second = null
let lock = false
let matchedCount = 0

const flip = (card) => {
  if (lock) return;
  if (card === first) return
  if (card.classList.contains('matched')) return;
  startTimer()
  card.classList.add('open')

  if (first == null) {
    first = card;
    return
  }
  second = card;
  tries++;
  triesText.textContent = tries
  check()
}


const check = () => {

  if (first.dataset.emoji === second.dataset.emoji) {
    first.classList.add('matched')
    second.classList.add('matched')
    matchedCount++;
    resetPick();
    if (matchedCount == emojis.length) {
      win()
    }
  } else {
    lock = true

    setTimeout(() => {
      first.classList.remove('open')
      second.classList.remove('open')
      resetPick();

    }, 800)

  }

}

const resetPick = () => {
  first = null
  second = null
  lock = false
}

let tries = 0;
let seconds = 0;
let startTime = 0;
let timerId = null

const startTimer = () => {
  if (timerId !== null) return;
  startTime = Date.now()
  timerId = setInterval(() => {
    seconds = Math.floor((Date.now() - startTime) / 1000);
    timeText.textContent = seconds

  }, 1000)
}

const stopTimer = () => {
  clearInterval(timerId)
  timerId = null
}


const BEST_KEY = 'card-memory-best'

const loadBest = () => {

  try {
    return JSON.parse(localStorage.getItem(BEST_KEY))
  } catch (error) {
    return null;
  }

}
const saveBest = (record) => {
  localStorage.setItem(BEST_KEY, JSON.stringify(record))
}
const showBest = () => {
  const best = loadBest()

  if (best == null) {
    bestText.textContent = '없음'
  } else {
    bestText.textContent = `${best.tries}번 ${best.seconds}초`

  }

}
const isNewBest = (record, best) => {
  if (best == null) return true;
  if (record.tries < best.tries) return true;
  if (record.tries === best.tries && record.seconds < best.seconds) return true;

  return false
}

const win = () => {
  stopTimer()
  seconds = Math.floor((Date.now() - startTime) / 1000)
  timeText.textContent = seconds

  const record = {
    tries: tries,
    seconds: seconds,
    date: new Date().toLocaleDateString()
  }

  if (isNewBest(record, loadBest())) {
    saveBest(record)
    message.textContent = `🏆 신기록! ${tries}번 만에 ${seconds}초`
  } else {
    message.textContent = `🎉 성공! ${tries}번 만에 ${seconds}초`
  }
  showBest()

}
const startGame = () => {
  stopTimer()
  resetPick()
  tries = 0;
  seconds = 0;
  matchedCount = 0;
  triesText.textContent = 0;
  timeText.textContent = 0;
  message.textContent = '카드를 눌러 시작하세요'

  render(shuffle(makeCards()))
  showBest()
}

btnRestart.addEventListener('click', startGame)
startGame()

