
document.addEventListener('DOMContentLoaded', () => {
  const dayContainer = document.querySelector('#list-group')
  let breakfastTitle = document.getElementById('breakfast-title');
  let lunchTitle = document.getElementById('lunch-title');
  let dinnerTitle = document.getElementById('dinner-title');
  let breakfastContainer = document.querySelector('#breakfast-time-container')
  let oneWeek = [];
  const searchFood = document.querySelector('#search-food');
  const searchFoodResult = document.querySelector('#result');
  const mealTimeContainer = document.querySelector('#meal-time')
  const searchArea = document.querySelector('#search-area')
  let dayId
  let mealtimeId



  //--------------fetch days & show-----------------//
  fetch('http://localhost:3000/api/v1/users/1/days')
    .then(response => response.json())
    .then(userDataJSON => {
      oneWeek = userDataJSON;
      for(let i = 0; i < userDataJSON.length; i++){
        for (let j = 0; j < userDataJSON[i].mealtimes.length; j++){
          let foodDesId =(`${i+1}-${j+1}`)
          let foods = userDataJSON[i].mealtimes[j].foods

          let foodForContainer = foods.filter(food => food.mealtime_id === userDataJSON[i].mealtimes[j].id)
          let foodCell = document.getElementById(`${userDataJSON[i].id}-${userDataJSON[i].mealtimes[j].id}`)

          foods.forEach(food => foodCell.innerHTML += `<li>${food.name}
            <span class="delete" id="dayId-${userDataJSON[i].id}-mealtimeId-${userDataJSON[i].mealtimes[j].id}-foodId-${food.id}"> -</span>
          </li>`)
        }
      }
      //})//end of render each day
    })//end of then
  //---------------END fetch days & show-----------//



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
    const energy = data.nutrients.ENERC_KCAL ? `<p>Energy: ${data.nutrients.ENERC_KCAL.toFixed(1)}kcal</p>` : ''
    const carbs = data.nutrients.CHOCDF ? `<p>Carbs: ${data.nutrients.CHOCDF.toFixed(1)}g</p>` : ''
    const protein = data.nutrients.PROCNT ? `<p>Protein: </b><span>${data.nutrients.PROCNT.toFixed(1)}g</p>` : ''
    const fat = data.nutrients.FAT ? `<p>Fat: ${data.nutrients.FAT.toFixed(1)}g</p>` : ''
    const foodName1 = data.label.split(',')[0]
    const foodName2 = data.label.split(',')[1]
    const html = `
    <div class="card">
      <div class="card-header">
        <p class="food-name">${foodName1} -${foodName2}</p>
        <p class="food-calorie">${energy}</p>
        <p class="food-calorie">${carbs}</p>
        <p class="food-calorie">${protein}</p>
        <p class="food-calorie">${fat}</p>
        <button class="add-to-mealtime">Add to meal</button>
      </div>
    </div>
    `
    return html
  }

  initEvent()
  //-------------end of search for food--------------//


  //-------------start of add to list---------------//

  document.addEventListener('click', e =>{
    if (e.target.className.includes('delete')){
      let clickedFoodId = event.target.id;
      let thisBreakfastButton = document.getElementById(clickedFoodId)
      let thisBreakfast = thisBreakfastButton.parentElement

      thisBreakfast.remove();
      deleteFood(clickedFoodId)
    }

    else if (e.target.className.includes('addButton')){

      buttonId = e.target.parentElement.id
      dayId = buttonId.split("-")[0]
      mealtimeId = buttonId.split("-")[1]
      console.log(dayId, mealtimeId);
      searchArea.dataset.id = buttonId
      if(searchArea.style.display = ''){
        searchArea.style.display = 'block'
      }
    }
  })

  searchArea.addEventListener('click', e => {

    if(e.target.className === 'add-to-mealtime'){
      let searchAreaId = e.target.parentElement.parentElement.parentElement.parentElement.dataset.id
      let dayId = searchAreaId.split("-")[0]
      let mealtimeId = searchAreaId.split("-")[1]
      console.log(dayId)
      console.log(mealtimeId);
          let addBtn = searchArea.querySelector('.add-to-mealtime')
          let addFoodContainerId = `${dayId}-${mealtimeId}`
          let addFoodContainer = document.getElementById(addFoodContainerId)
          //console.log(addFoodContainer)
          let addFoodName = document.getElementsByClassName('food-name')[0].innerText
          let addFoodCalorie = document.getElementsByClassName('food-calorie')[0].innerText
          console.log(addFoodName);
            fetch(`http://localhost:3000/api/v1/users/1/days/${dayId}/mealtimes/${mealtimeId}/foods`,
               { method: 'POST',
                 headers: {
                   'Content-Type': 'application/json', //data we are sending to the server
                   'Accept': 'application/json' //data type we want back from the server
                 },//end of header
                 body: JSON.stringify({
                   'name': addFoodName,
                   'calories': addFoodCalorie,
                   'mealtime_id': mealtimeId
                 })//end of body
               })//end of fetch
              .then(r => r.json())
              .then((newFoodObj) =>{
                console.log(newFoodObj)
                addFoodContainer.innerHTML += `
                <li>${addFoodName}
                  <span class="delete" id="dayId-${dayId}-mealtimeId-${mealtimeId}-foodId-${newFoodObj.id}"> -</span>
                </li>`
              })//end of then
    }
  })


  //-------------end of add to list-----------------//

//------------shopping list----------//
//selecting dom elements for manipulation
var input = document.querySelector("input[type = 'text']");
var ul = document.querySelector(".todos");
var container = document.querySelector("div");
var lists = document.querySelectorAll("li");
var spans = document.getElementsByTagName("span");
var pencil = document.querySelector("#pencil");
var saveBtn = document.querySelector(".save");
var clearBtn = document.querySelector(".clear");
var tipsBtn = document.querySelector(".tipBtn");
var closeBtn = document.querySelector(".closeBtn");
var overlay = document.getElementById("overlay")


//function to delete todo if delete span is clicked.
function deleteTodo(){
  for(let span of spans){
    span.addEventListener ("click",function (){
      span.parentElement.remove();
      event.stopPropagation();
    });
  }
}

//function to load todo if list is found in local storage.
function loadTodo(){
  if(localStorage.getItem('todoList')){
    ul.innerHTML = localStorage.getItem('todoList');
    deleteTodo();
  }
}

//event listener for input to add new todo to the list.
input.addEventListener("keypress",function(keyPressed){
  if(keyPressed.which === 13){
    //creating lists and span when enter is clicked
    var li = document.createElement("li");
    var spanElement = document.createElement("span");
    var icon = document.createElement("i");

    var newTodo = this.value;
    this.value = " " ;

    icon.classList.add('fas', 'fa-trash-alt');
    spanElement.append(icon);
    ul.appendChild(li).append(spanElement,newTodo);

    deleteTodo();

    }

});

// event listener to linethrough list if clicked
ul.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
      ev.target.classList.toggle('checked');
    }
  },false
);

//hide input box,when pencil icon is clicked
pencil.addEventListener('click', function(){
  input.classList.toggle('display');
});



//save todolist state so user can access it later
saveBtn.addEventListener('click',function(){
  localStorage.setItem('todoList',ul.innerHTML );

});

//clear all todo when clear button is clicked
clearBtn.addEventListener('click', function(){
  ul.innerHTML= "";
  localStorage.removeItem('todoList',ul.innerHTML );
});

//display overlay when tips btn is clicked
tipsBtn.addEventListener("click",function(){
   overlay.style.height = "100%";
});

//close overlay when close btn is clicked
closeBtn.addEventListener("click",function(e){
  e.preventDefault;
  overlay.style.height = "0";

})

//delete todo
deleteTodo();

//load Todo
loadTodo();

//-------------end of shopping list------//
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
