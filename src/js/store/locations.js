import api from '../services/apiService';
import {formatDate} from '../helpers/date';

class Locations {
  constructor(api, helpers) {
    this.api = api;
    this.countries = null;
    this.cities = null;
    this.shortCities = {};
    this.lastSearch = {};
    this.airlines = {};
    this.formatDate = helpers.formatDate;
  }
  async init() {
    const response = await Promise.all([
      this.api.countries(),
      this.api.cities(),
      this.api.airlines(),
    ]);

    const [countries, cities, airlines] = response;
    this.countries = this.serializeCountries(countries);
    this.cities = this.serializeCities(cities);
    this.shortCities = this.createShortCities(this.cities);
    this.airlines = this.serializeAirlines(airlines);
    console.log(this.cities);

    return response;
  }

  // getCityCodeByKey(key) {
  //   return this.cities[key].code;
  // }

  getCityCodeByKey(key) {
    const city = Object.values(this.cities).find((item) => item.full_name === key);
    return city.code;
  }

  getCityNameByCode(code) {
    return this.cities[code].name;  
  }

  getAirlineNameByCode(code) {
    return this.airlines[code] ? this.airlines[code].name : ''; 
  }

  getAirlineLogoByCode(code) {
    return this.airlines[code] ? this.airlines[code].logo : ''; 
  }

  createShortCities(cities) {
    return Object.entries(cities).reduce((acc, [key,value]) => {
      acc[value.full_name] = null;
      return acc;
    }, {});
  }

  serializeCountries(countries) {
    return countries.reduce((acc, country) => {
      acc[country.code] = country;
      return acc;
    }, {});
  }

  // serializeCities(cities) {
  //   return cities.reduce((acc, city) => {
  //     const country_name = this.countries[city.country_code].name;
  //     const key = `${city.name},${country_name}`;
  //     acc[key] = {
  //       ...city,
  //       country_name,
  //     };
  //     return acc;
  //   }, {});
  // }

  serializeCities(cities) {
    return cities.reduce((acc, city) => {
      const country_name = this.countries[city.country_code].name;
      const full_name = `${city.name},${country_name}`;
      city.name = city.name || city.name_translations.en;
      acc[city.code] = {
        ...city,
        country_name,
        full_name,
      };
      return acc;
    }, {});
  }

  serializeAirlines(airlines) {
    return airlines.reduce((acc, item) => {
      item.logo = `https://pics.avs.io/200/200/${item.code}.png` ;
      item.name = item.name || item.name_translations.en; 
      acc[item.code] = item;
      return acc;
    }, {});
  }

  async fetchTickets(params) {
    const response = await this.api.prices(params);
    // this.lastSearch = response.data;
    // серилизовать поиск так что бы внури были название города и страны
    this.lastSearch = this.serializeTickets(response.data);
  }

  serializeTickets(tickets) {
    return Object.values(tickets).map((item) => {
      return {
        ...item,
        origin_name: this.getCityNameByCode(item.origin),
        destination_name: this.getCityNameByCode(item.destination),
        airline_logo: this.getAirlineLogoByCode(item.airline),
        airline_name: this.getAirlineNameByCode(item.airline),
        departure_at: this.formatDate(item.departure_at, 'dd MMM yyyy HH:mm'),
        return_at: this.formatDate(item.return_at, 'dd MMM yyyy HH:mm'),
      } 
    })
  }
}

const locations = new Locations(api, {formatDate});

export default locations;
