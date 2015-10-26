import Rx from 'rx';
import Cycle from '@cycle/core';
import {makeDOMDriver, h} from '@cycle/dom';

import makeTableDataDriver from './table-data-driver';
import makeDatamapDriver from './datamap-driver';

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

function alternativeView(state) {
  return Rx.Observable.interval(1000).map(function (time) {
    if (time % 2 === 0) {
      return h('div');
    } else {
      return h('div', [
        h('div', {id: 'datamap', className: 'sections'}, [
          h('div', {className: 'datamap-europe'}),
          h('div', {className: 'datamap-asia'}),
          h('div', {className: 'datamap-us'})
        ]),
        h('div', {style: {width: '300px', margin: 'auto'}}, [
          locationsList(state.locations)
        ])
      ]);
    }
  });
}

function view(state) {
  return h('div', [
    h('div', {id: 'datamap', className: 'sections'}, [
      h('div', {className: 'datamap-europe'}),
      h('div', {className: 'datamap-asia'}),
      h('div', {className: 'datamap-us'})
    ]),
    h('div', {style: {width: '300px', margin: 'auto'}}, [
      locationsList(state.locations)
    ])
  ]);
}

function prepareDataMap$(container$, statistics$) {
  return Rx.Observable.combineLatest(
    container$, statistics$,
    (container, statistics) => ({
      container, statistics
    })
  );
}

function getDOMElement$(DOMDriver, selector) {
  const DOMObservable = DOMDriver.select(selector).observable;
  return DOMObservable.map(results => results[0]);
}

//Location : {
  //id: String,
  //name: String,
  //country; String,
  //price: Number
//}

//State : {
  //locations: List Location
//}

function main(drivers) {
  const BASE_STATE = {
    locations: []
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

  let containerEU$ = getDOMElement$(drivers.DOM, '.datamap-europe');
  let containerAS$ = getDOMElement$(drivers.DOM, '.datamap-asia');
  let containerUS$ = getDOMElement$(drivers.DOM, '.datamap-us');

  return {
    DOM: view$,
    DataMapEU: prepareDataMap$(containerEU$, statistics$),
    DataMapAS: prepareDataMap$(containerAS$, statistics$),
    DataMapUS: prepareDataMap$(containerUS$, statistics$)
  };
}

let drivers = {
  DOM: makeDOMDriver('#app'),
  TableData: makeTableDataDriver(),
  DataMapEU: makeDatamapDriver('europe'),
  DataMapAS: makeDatamapDriver('asia'),
  DataMapUS: makeDatamapDriver('us')
};

Cycle.run(main, drivers);
