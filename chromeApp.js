const body = document.querySelector('body')
const clock = document.querySelector('#clock')
const toDoForm = document.querySelector('#todo-form')
const toDoInput = document.querySelector('#todo-form input')
const toDoList = document.querySelector('#todo-list')
const weather = document.querySelector('h5')
const city = document.querySelector('#city')
const loginForm = document.querySelector('#login-form')
const loginInput = document.querySelector('#login-form input')
const greeting = document.querySelector('#greeting')

//body

function createImg(imgNumber) {
  const img = document.createElement('img')

  img.src = `imges/${imgNumber}.jpg`
  img.alt = 'background images'
  img.classList.add('bgImg')

  body.appendChild(img)
}

function getRandom() {
  const IMG_NUM = 3
  let num = Math.floor(Math.random() * IMG_NUM) + 1

  createImg(num)
}

getRandom()

//colock
function getClock() {
  const date = new Date()
  let hour = String(date.getHours()).padStart(2, '0')
  let minute = String(date.getMinutes()).padStart(2, '0')
  let seconds = String(date.getSeconds()).padStart(2, '0')
  clock.innerText = `${hour}:${minute}:${seconds}`
}

getClock()
setInterval(getClock, 1000)

//login
const HIDDEN_CLASSNAME = 'hidden'
const USERNAME_KEY = 'username'

function onLoginSubmit(event) {
  event.preventDefault()
  loginForm.classList.add(HIDDEN_CLASSNAME)
  const username = loginInput.value
  localStorage.setItem(USERNAME_KEY, username)

  paintGreetings(username)
}

function paintGreetings(username) {
  greeting.innerText = `Blooming ${username}`
  greeting.classList.remove(HIDDEN_CLASSNAME)
}

const savedUsername = localStorage.getItem(USERNAME_KEY)
if (savedUsername === null) {
  loginForm.classList.remove(HIDDEN_CLASSNAME)
  loginForm.addEventListener('submit', onLoginSubmit)
} else {
  paintGreetings(savedUsername)
}

//todos
const TODOS_KEY = 'todos'

let toDos = []

function deleteToDo() {
  const li = event.target.parentElement
  li.remove()
  toDos = toDos.filter((toDO) => toDO.id !== parseInt(li.id))
  saveToDos()
}

function saveToDos() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(toDos))
}

function handleToDoSubmit(event) {
  event.preventDefault()
  const newTodo = toDoInput.value
  toDoInput.value = ''
  const newTodoObj = {
    text: newTodo,
    id: Date.now(),
  }
  toDos.push(newTodoObj)
  paintToDo(newTodoObj)
  saveToDos()
}

function paintToDo(newTodo) {
  const li = document.createElement('li')
  li.id = newTodo.addEventListener
  const span = document.createElement('span')
  span.innerText = newTodo.text
  const button = document.createElement('button')
  button.innerText = 'x'
  button.addEventListener('click', deleteToDo)
  li.appendChild(span)
  li.appendChild(button)
  toDoList.appendChild(li)
}

const savedToDos = localStorage.getItem(TODOS_KEY)
if (savedToDos !== null) {
  const parsedToDos = JSON.parse(savedToDos)
  toDos = parsedToDos
  parsedToDos.forEach(paintToDo)
}

toDoForm.addEventListener('submit', handleToDoSubmit)

//whether

const API_KEY = '67b122e080fd8abef897dcddd77e3063'

function onGeoOk(position) {
  const lat = position.coords.latitude
  const lon = position.coords.longitude
  const url = ` https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      console.log(data.weather[0].main)
      console.log(data.main.temp)
      city.innerHTML = data.name
      weather.innerText = `${data.weather[0].main} / ${data.main.temp}`
    })
}

function onGeoError() {
  alert("Can't find you. No weather for you.")
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError)
