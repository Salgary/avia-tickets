import '../css/style.css';
import './plugins';
import locations from './store/locations';
import formUI from './views/form';
import currencyUI from './views/currency';
import ticketUI from './views/tickets';
document.addEventListener('DOMContentLoaded', e => {
  const form = formUI.form;

  // Events
  initApp();
  form.addEventListener('submit', e => {
    e.preventDefault();
    onFormSubmit();
  });

  // handlers
  async function initApp() {
    await locations.init();
    formUI.setAutocompleteData(locations.shortCities);
  }

  async function onFormSubmit() {
    const origin = locations.getCityCodeByKey(formUI.originValue); 
    const destination = locations.getCityCodeByKey(formUI.destinationValue);
    console.log(origin,destination);
    const depart_date = formUI.departDateValue;
    const return_date = formUI.returnDateValue;
    const currency = currencyUI.currecyValue;
    console.log(depart_date,return_date,currency);

    await locations.fetchTickets({
      origin,
      destination,
      depart_date,
      return_date,
      currency,
    });

    console.log(locations.lastSearch);
    console.log(currencyUI.getCurrencySymbol());
    
    // vivod biletov na ekran
    ticketUI.renderTickets(locations.lastSearch);
    // 

    // add to favorite
    // -------------------------------------------------
    
    
    // var addfavorite = document.getElementsByClassName('add-favorite');
    // var container2 = document.querySelector('.tickets-sections .row');
    // var favorite_place = document.getElementsByClassName('favorites');
    // var favorite_place = document.querySelector('.favorite');

    var container_drop = document.getElementById('dropdown1');
    var addfavorite = document.getElementsByClassName('add-favorite');
    console.log(addfavorite);

    function foo (tid) {
      let fragment2 = '';
      fragment2 += fav_content(locations.lastSearch, tid, currencySymbol);
      container_drop.insertAdjacentHTML("afterbegin", fragment2);

      // var tid = document.querySelector('.ticket-id').getAttribute('value');
      // var favor = document.querySelector(".add-favorite");
      // var fav_select = favor.closest(".ticket-card").outerHTML;
      // function fav_return() { return `${fav_select}`};
      // function fav_return2() { return fav_select};

      // console.log(tid);
      // console.log(addfavorite);
      // console.log(`${fav_select}`);
      // console.log(fav_return2());
      // favorite_place[0].innerHTML = fav_select;
    };

    var links_as_arr = Array.from(addfavorite);

    links_as_arr.forEach(element => {
      element.addEventListener('click', e => {
        e.preventDefault();
        var tid = e.currentTarget.getAttribute('value')
        console.log(tid)
        foo(tid);
        // delete favorite
        var delfavorite = document.getElementsByClassName('delete-favorite');
        var del_as_arr = Array.from(delfavorite);
        console.log(del_as_arr);
        del_as_arr.forEach(element => {
          element.addEventListener('click', e => {
            e.preventDefault();
            var delitem = e.currentTarget.closest(".favorite-item");
            // console.log(delitem);
            delitem.remove();
          });
        });
      }); 
    }); 

    



    // function clearContainer2() {
    //   container2.innerHTML = '';
    // }
    // addfavorite[0].addEventListener('click', foo, true);

    var currencySymbol = currencyUI.getCurrencySymbol();
    
    function fav_content (tickets, id, currency) {
      return `
      <div class="favorite-item  d-flex align-items-start">
        <img
          src="${tickets[id].airline_logo}"
          class="favorite-item-airline-img"
        />
        <div class="favorite-item-info d-flex flex-column">
          <div
            class="favorite-item-destination d-flex align-items-center"
          >
            <div class="d-flex align-items-center mr-auto">
              <span class="favorite-item-city">${tickets[id].origin_name} </span>
              <i class="medium material-icons">flight_takeoff</i>
            </div>
            <div class="d-flex align-items-center">
              <i class="medium material-icons">flight_land</i>
              <span class="favorite-item-city">${tickets[id].destination_name}</span>
            </div>
          </div>
          <div class="ticket-time-price d-flex align-items-center">
            <span class="ticket-time-departure">${tickets[id].departure_at}</span>
            <span class="ticket-price ml-auto">${currency}${tickets[id].price}</span>
          </div>
          <div class="ticket-additional-info">
            <span class="ticket-transfers">Пересадок: ${tickets[id].transfers}</span>
            <span class="ticket-flight-number">Номер рейса: ${tickets[id].flight_number}</span>
          </div>
          <a
            class="waves-effect waves-light btn-small pink darken-3 delete-favorite ml-auto"
            >Delete</a
          >
        </div>
      </div>
      `
    };
  }
});


