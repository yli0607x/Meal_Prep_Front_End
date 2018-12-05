
document.addEventListener('DOMContentLoaded', () => {
  const dayContainer = document.querySelector('#list-group')
  const breakfastCard = document.querySelector('#breakfast-detail')
  const lunchCard = document.querySelector('#lunch-detail')
  const dinnerCard = document.querySelector('#dinner-detail')
  const searchFood = document.querySelector('#search-food')
  const searchFoodResult = document.querySelector('#result')
  let allDays = []



  //--------------fetch days & show-----------------//
  fetch('http://localhost:3000/api/v1/users/1')
    .then(res => res.json())
    .then(json => {
      allDays = json.days
      allDays.forEach(day => {
        dayContainer.innerHTML += `<li style="text-align:center" class="list-group-item" id="${day.id}">${day.name}</li>`
      })//end of render each day
    })//end of then
  //---------------END fetch days & show-----------//

  //-------------event listener click on days-------//
  dayContainer.addEventListener('click', e => {
    if(e.target.className === "list-group-item") {
      // console.log(e.target.id);
      let clickedDayId = e.target.id
      let foundDay = allDays.find((day) => day.id == clickedDayId )
      // console.log(foundDay);

            breakfastCard.innerHTML = `
              <ul>
              <li>${foods[0].name}
              <button class="mini ui teal basic button">-</button>
              </li>
              </ul>
              `
    }//end of if click on day
  })//end of addEventListener
  //-------------END event listener click on days-------//

  //-------------start of search for food-------------//
  function initEvent() {
    searchFood.addEventListener('submit', e => {
      e.preventDefault()
        let userInput = e.target[0].value
        if (userInput) {
          searchFoodResult.innerHTML = ''
          changeTextButton(e.target[1], 'SEARCHING...')
          search(e.target)
        }
    }, false)//end of submit event listener
  }//end of initEvent

  function changeTextButton(button, text) {
    button.textContent = text
  }

  function search(form) {
    const formData = new FormData(form)

    fetch(`https://api.edamam.com/api/food-database/parser?app_id=01c87681&app_key=2a8c01ebcb6a93693be03084e7e88a7d&ingr=${formData.get('name')}`)
    .then(resp => resp.json())
    .then(resp => {
      if (resp.parsed.length) {
          insertCard(resp.parsed[0].food)
      }
      else {
        changeInput(form[0], 'placeholder', 'We didn\'t found any food.')
        resetInput(form[0])
      }
      changeTextButton(form[1], 'SEARCH')
      changeInput(form[0], 'value', '')
    }).catch(() => {
      changeTextButton(form[1], 'SEARCH')
      changeInput(form[0], 'placeholder', 'An error has occurred. Try again later.')
      resetInput(form[0])
    })
 }

  function resetInput(input) {
    setTimeout(() => {
      changeInput(input, 'placeholder', 'Type a food or a meal...')
    }, 3000)
  }

  function changeInput(input, prop, value) {
      input[prop] = value
  }

  function insertCard(food) {
   result.insertAdjacentHTML('beforeend', buildCard(food))
  }

  function buildCard(data) {
    const energy = data.nutrients.ENERC_KCAL ? `<p>${data.nutrients.ENERC_KCAL.toFixed(1)}kcal</p>` : ''
    const foodName1 = data.label.split(',')[0]
    const foodName2 = data.label.split(',')[1]
    const html = `
    <div class="card">
      <div class="card-header">
        <p>${foodName1} - ${foodName2} ${energy}</p>
        <button>Add to meal</button>
      </div>
    </div>
    `
    return html
  }

  initEvent()
  //-------------end of search for food--------------//


})//end of DOM Content




(function jimmyLovesWinfield(name) {
	if (name === 'Andrew') {
		return 'POWERFUL'
	} else if (name === 'ChromeBoi') {
		return "ANY QUESTIONIONS?"
	}
})('Andrew')
