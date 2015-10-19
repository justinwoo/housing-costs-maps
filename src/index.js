import Cycle from '@cycle/core';
import {makeDOMDriver, h} from '@cycle/dom';
import Rx from 'rx';

import makeDatamapDriver from './datamap-driver';

function log(name, value) {
  console.log(name, value);
  return value;
}

function locationsList(locations) {
  let children = locations.map(location =>
    h('tr', [
      h('td', `${location.name}`),
      h('td', `${location.country}`),
      h('td', `${location.price.toFixed(2)} USD/night`)
    ])
  );
  return h('table', h('tbody', children));
}

function view(state) {
  return h('div', [
    h('div', {style: {width: '300px', margin: 'auto'}}, [
      locationsList(state.locations)
    ])
  ]);
}

//Location : {
  //id: String,
  //name: String,
  //country; String,
  //price: Number
//}

//State : {
  //locations: List Location,
  //error: String
//}

function main(drivers) {
  const BASE_STATE = {
    locations: [],
    error: null
  };

  let state$ = Rx.Observable
    .merge(
      drivers.TableData
    )
    .startWith(BASE_STATE)
    .scan((a, mapper) => mapper(a));

  let view$ = state$
    .map(state => view(state));

  let statistics$ = state$
    .map(state => {
      let byCountryTally = state.locations.reduce((a, v) => {
        let {country, price} = v;
        if (!a[country]) {
          a[country] = [price];
        } else {
          a[country].push(price);
        }
        return a;
      }, {});

      let byCountry = [];
      for (let name in byCountryTally) {
        let prices = byCountryTally[name];
        let price = prices.reduce((a, b) => a + b) / prices.length;
        byCountry.push({
          name,
          price
        });
      }

      let byCityTally = state.locations.reduce((a, v) => {
        let {name, price} = v;
        if (!a[name]) {
          a[name] = [price];
        } else {
          a[name].push(price);
        }
        return a;
      }, {});

      let byCity = [];
      for (let name in byCityTally) {
        let prices = byCityTally[name];
        let price = prices.reduce((a, b) => a + b) / prices.length;
        byCity.push({
          name,
          price
        });
      }

      return {
        byCountry,
        byCity
      };
    });

  return {
    DOM: view$,
    DataMapEU: statistics$,
    DataMapAS: statistics$,
    DataMapUS: statistics$
  };
}

function makeTableDataDriver() {
  let data = [
    ['Tokyo', 'JPN', 37.86],
    ['Nagoya', 'JPN', 47.71],
    ['Kyoto', 'JPN', 59.29],
    ['Nagoya', 'JPN', 49.57],
    ['Tokyo', 'JPN', 64.43],
    ['Aomori', 'JPN', 47.00],
    ['Hakodate', 'JPN', 56.00],
    ['Sapporo', 'JPN', 33.11],
    ['Hong Kong', 'HKG', 46.70],
    ['Washington', 'USA', 56.86],
    ['Helsinki', 'FIN', 48.13],
    ['Copenhagen', 'DNK', 39.50],
    ['Hamburg', 'DEU', 59.00],
    ['Groningen', 'NLD', 45.00],
    ['Rotterdam', 'NLD', 48.00],
    ['Leuven', 'BEL', 29.21],
    ['San Francisco', 'USA', 113],
  ];

  let locations = data.map((v, i) => ({
    id: i,
    name: v[0],
    country: v[1],
    price: v[2]
  }));

  return function tableDataDriver() {
    return Rx.Observable.just(locations)
      .map(locations => state => Object.assign({}, {locations}));
  };
}

let drivers = {
  DOM: makeDOMDriver('#app'),
  TableData: makeTableDataDriver(),
  DataMapEU: makeDatamapDriver('europe', 'datamap-europe'),
  DataMapAS: makeDatamapDriver('asia', 'datamap-asia'),
  DataMapUS: makeDatamapDriver('us', 'datamap-us')
};

Cycle.run(main, drivers);
