import currencyUI from './currency';

class TicketUI {
    constructor (currency) {
        this.container = document.querySelector('.tickets-sections .row');
        this.getCurrencySymbol = currency.getCurrencySymbol.bind(currency);
    }
    renderTickets(tickets) {
        console.log('start renderTickets')
        this.clearContainer();
        if (!tickets.length) {
            this.showEmptyMsg();
            return;
        }

        let fragment = '';
        const currency = this.getCurrencySymbol();

        tickets.forEach((element,index) => {
            let id = index;
            const template = TicketUI.TicketTamplate(element,id,currency);
            fragment += template;
            // console.log(TicketUI.TicketTamplate(element,currency));
        });
        this.container.insertAdjacentHTML("afterbegin", fragment);
        
    }

    clearContainer() {
        this.container.innerHTML = '';
    }
    showEmptyMsg() {
        const template = TicketUI.EmptyMsgTemplate();
        this.container.insertAdjacentHTML("afterbegin", template);
    }
    static EmptyMsgTemplate() {
        return `
        <div class="tickets-empty-res-msg">
            По вашему запросу билетов не найдено.
          </div>
        `
    }
    static TicketTamplate(ticket, id, currency) {
        return `
        <div class="col s12 m6">
            <div class="card ticket-card">
              <div class="ticket-airline d-flex align-items-center">
                <img
                  src="${ticket.airline_logo}"
                  class="ticket-airline-img"
                />
                <span class="ticket-airline-name"
                  >${ticket.airline_name}</span
                >
              </div>
              <div class="ticket-destination d-flex align-items-center">
                <div class="d-flex align-items-center mr-auto">
                  <span class="ticket-city">${ticket.origin_name}</span>
                  <i class="medium material-icons">flight_takeoff</i>
                </div>
                <div class="d-flex align-items-center">
                  <i class="medium material-icons">flight_land</i>
                  <span class="ticket-city">${ticket.destination_name}</span>
                </div>
              </div>
              <div class="ticket-time-price d-flex align-items-center">
                <span class="ticket-time-departure">${ticket.departure_at}</span>
                <span class="ticket-price ml-auto">${currency}${ticket.price}</span>
              </div>
              <div class="ticket-additional-info">
                <span class="ticket-transfers">Пересадок: ${ticket.transfers}</span>
                <span class="ticket-flight-number">Номер рейса: ${ticket.flight_number}</span>
              </div>
              <a class="waves-effect waves-light btn-small green darken-1 add-favorite ml-auto" value=${id}>Add to favorites</a>
            </div>
          </div>
        `;
    }
}




const ticketUI = new TicketUI(currencyUI);

export default ticketUI;