document.addEventListener('DOMContentLoaded', () => {
  const dayContainer = document.querySelector('#list-group')
  let breakfastTitle = document.getElementById('breakfast-title');
  let lunchTitle = document.getElementById('lunch-title');
  let dinnerTitle = document.getElementById('dinner-title');
  const breakfastCard = document.querySelector('#breakfast-detail')
  const lunchCard = document.querySelector('#lunch-detail')
  const dinnerCard = document.querySelector('#dinner-detail')
  let oneWeek = []


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
      // debugger
        breakfastTitle.innerText = `${foundDay.mealtimes[0].name}`
        breakfastCard.innerHTML = '';
        debugger
        breakfastFood.forEach((food) =>
        breakfastCard.innerHTML += `
          <ul>
            <li>${food.name}
            <button class="mini ui teal basic button" id=${food.id}>-</button>
          </li>

          </ul>
        `
      )

      lunchTitle.innerText = `${foundDay.mealtimes[1].name}`
      lunchCard.innerHTML = '';
      lunchFood.forEach((food) =>
      lunchCard.innerHTML += `
        <ul>
          <li>${food.name}
          <button class="mini ui teal basic button">-</button>
        </li>

        </ul>
      `
    )

    dinnerTitle.innerText = `${foundDay.mealtimes[2].name}`
    dinnerCard.innerHTML = '';
    dinnerFood.forEach((food) =>
    dinnerCard.innerHTML += `
      <ul>
        <li>${food.name}
        <button class="mini ui teal basic button">-</button>
      </li>

      </ul>
    `
  )
        // <ul>
        //   <li>${foundDay.mealtimes[1].name}
        //   <button class="mini ui teal basic button">-</button>
        //   </li>
        // </ul>
        // <ul>
        //   <li>${foundDay.mealtimes[2].name}
        //   <button class="mini ui teal basic button">-</button>
        //   </li>
        // </ul>
      }
    })

        //     breakfastCard.innerHTML = `
        //       <ul>
        //       <li>${foods[0].name}
        //       <button class="mini ui teal basic button">-</button>
        //       </li>
        //       </ul>
        //       `
        //   })
  //   }//end of if click on day
  // })//end of addEventListener
  //-------------END event listener click on days-------//


})//end of DOM Content
