const historyElement = document.querySelector('#history')
const historyButton = document.querySelector('#button__history')
const historyCloseButton = document.querySelector('#history__close__btn')
let show = false
historyButton.addEventListener('click', (event) => {
  event.preventDefault()
  if (!show) {
    show = true
    historyElement.classList.add('history__animation__slidein')
  }
})
historyCloseButton.addEventListener('click', () => {
  event.preventDefault()
  if (show) {
    show = false
    historyElement.classList.remove('history__animation__slidein')
  }
})
