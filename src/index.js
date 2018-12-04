document.addEventListener('DOMContentLoaded', () => {
  const dayContainer = document.querySelector('#list-group')
  const breakfastCard = document.querySelector('#breakfast-detail')
  const lunchCard = document.querySelector('#lunch-detail')
  const dinnerCard = document.querySelector('#dinner-detail')
  let allDays = []


  //--------------fetch days & show-----------------//
  fetch('http://localhost:3000/api/v1/users/1/days')
    .then(res => res.json())
    .then(json => {
      allDays = json
      json.forEach(day => {
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
        fetch(`http://localhost:3000/api/v1/users/1/days/${clickedDayId}/foods`)
          .then(r => r.json())
          .then(foods =>{
            debugger
            breakfastCard.innerHTML = `
              <ul>
              <li>${foods[0].name}
              <button class="mini ui teal basic button">-</button>
              </li>
              </ul>
              `
          })
    }//end of if click on day
  })//end of addEventListener
  //-------------END event listener click on days-------//


})//end of DOM Content
