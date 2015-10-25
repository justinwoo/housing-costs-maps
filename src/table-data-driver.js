export default function makeTableDataDriver() {
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
