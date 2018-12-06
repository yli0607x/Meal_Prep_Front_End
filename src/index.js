
document.addEventListener('DOMContentLoaded', () => {
  const dayContainer = document.querySelector('#list-group')
  let breakfastTitle = document.getElementById('breakfast-title');
  let lunchTitle = document.getElementById('lunch-title');
  let dinnerTitle = document.getElementById('dinner-title');

//-----did't use these, do we need them?
  const breakfastCard = document.querySelector('#breakfast-detail')
  const lunchCard = document.querySelector('#lunch-detail')
  const dinnerCard = document.querySelector('#dinner-detail')
//------------------
  let breakfastContainer = document.querySelector('.breakfast-time-container')
  let lunchContainer = document.querySelector('.lunch-time-container')
  let dinnerContainer = document.querySelector('.dinner-time-container')
  let oneWeek = [];
  const searchFood = document.querySelector('#search-food');
  const searchFoodResult = document.querySelector('#result');



  //--------------fetch days & show-----------------//
  fetch('http://localhost:3000/api/v1/users/1/days')
    .then(response => response.json())
    .then(userDataJSON => {
      oneWeek = userDataJSON;
      console.log(userDataJSON);
      userDataJSON.forEach(day => {

        dayContainer.innerHTML += `<li style="text-align:center" class="list-group-item" id="${day.id}">${day.name}</li>`
      })//end of render each day
    })//end of then
  //---------------END fetch days & show-----------//

  //-------------event listener click on days-------//
  dayContainer.addEventListener('click', e => {
    if(e.target.className === "list-group-item") {
      let clickedDayId = e.target.id
      let foundDay = oneWeek.find((day) => day.id == clickedDayId )
      let breakfastFood = foundDay.mealtimes[0].foods
      let lunchFood = foundDay.mealtimes[1].foods
      let dinnerFood = foundDay.mealtimes[2].foods

      //render breakfast details for specific day
      breakfastTitle.innerText = `${foundDay.mealtimes[0].name}`
      breakfastContainer.innerHTML = '';
      breakfastFood.forEach((food) =>
      breakfastContainer.innerHTML += `
        <li>${food.name}
          <button class="mini ui teal basic button delete" id="dayId-${clickedDayId}-mealtimeId-${foundDay.mealtimes[0].id}-foodId-${food.id}">-</button>
        </li>
        `
      )//end of rendering breakfast card details


      //render lunch details for specific day
      lunchTitle.innerText = `${foundDay.mealtimes[1].name}`
      lunchContainer.innerHTML = '';
      lunchFood.forEach((food) =>
      lunchContainer.innerHTML += `
        <li>${food.name}
          <button class="mini ui teal basic button delete" id="dayId-${clickedDayId}-mealtimeId-${foundDay.mealtimes[1].id}-foodId-${food.id}"
        >
          -
        </button>
        </li>
      `
    )//end of rendering lunch card details

    //render dinner details for specific day
    dinnerTitle.innerText = `${foundDay.mealtimes[2].name}`
    dinnerContainer.innerHTML = '';
    dinnerFood.forEach((food) =>
    dinnerContainer.innerHTML += `
        <li>${food.name}
          <button
            class="mini ui teal basic button delete" id="dayId-${clickedDayId}-mealtimeId-${foundDay.mealtimes[2].id}-foodId-${food.id}"
          >
            -
          </button>
        </li>
    `
    )//end of dinner details

  }//end of if statement e.target.className === "list-group-item"


  //-------------START event listener delete food BREAKFAST-------//
  breakfastContainer.addEventListener('click', function(event){
    if (event.target.className.includes('delete')){
      let clickedFoodId = event.target.id;
      let thisBreakfastButton = document.getElementById(clickedFoodId)
      let thisBreakfast = thisBreakfastButton.parentElement
      thisBreakfast.remove();
      deleteFood(clickedFoodId)
    }
  });
  //-------------END event listener delete food BREAKFAST-------//

  //-------------START event listener delete food LUNCH-------//
  lunchContainer.addEventListener('click', function(event){
    console.log(event);
    console.log(event.target.className.includes('delete'));
    if (event.target.className.includes('delete')){

      let clickedFoodId = event.target.id
      let thisLunchButton = document.getElementById(clickedFoodId)
      let thisLunch = thisLunchButton.parentElement
      //debugger
      thisLunch.remove();
      deleteFood(clickedFoodId)
    }
  });
  //-------------END event listener delete food LUNCH-------//

  //-------------START event listener delete food DINNER-------//
  dinnerContainer.addEventListener('click', function(event){

    if (event.target.className.includes('delete')){
      let clickedFoodId = event.target.id
      debugger
      let thisDinnerButton = document.getElementById(clickedFoodId)
      let thisDinner = thisDinnerButton.parentElement
      thisDinner.remove();
      deleteFood(clickedFoodId)
    }
  });
  //-------------END event listener delete food DINNER-------//


})
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
        <p class="food-name">${foodName1} -${foodName2}</p>
        <p>${energy}</p>
        <button class="add-to-mealtime">Add to meal</button>
      </div>
    </div>
    `
    return html
  }

  initEvent()
  //-------------end of search for food--------------//
  searchFoodResult.addEventListener('click', e =>{
    if(e.target.className === "add-to-mealtime"){
      let foodName = document.querySelector('.food-name').innerText

    }
  })
  //-------------start of add to list---------------//

  //-------------end of add to list-----------------//


})//end of DOM Content

//***************************
//*****HELPER**FUNCTIONS*****
//***************************

function deleteFood(id) {
  let dayId = event.target.id.split('-')[1]
  let mealtimeId = event.target.id.split('-')[3]
  let foodId = event.target.id.split('-')[5]
  return fetch(`http://localhost:3000/api/v1/users/1/days/${dayId}/mealtimes/${mealtimeId}/foods/${foodId}`, { method: 'DELETE' })
}
