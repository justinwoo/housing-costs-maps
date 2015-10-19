const COORDINATES = {
  'Tokyo': {
    radius: 10,
    coords: [35.69, 139.69]
  },
  'Nagoya': {
    radius: 10,
    coords: [35.18, 136.91]
  },
  'Kyoto': {
    radius: 10,
    coords: [35.01, 135.77]
  },
  'Aomori': {
    radius: 10,
    coords: [40.82, 140.75]
  },
  'Hakodate': {
    radius: 10,
    coords: [41.77, 140.73]
  },
  'Sapporo': {
    radius: 10,
    coords: [43.06, 141.35]
  },
  'Hong Kong': {
    radius: 10,
    coords: [22.40, 114.11]
  },
  'Washington': {
    radius: 10,
    coords: [38.91, -77.04]
  },
  'Helsinki': {
    radius: 10,
    coords: [60.17, 24.94]
  },
  'Copenhagen': {
    radius: 10,
    coords: [55.68, 12.57]
  },
  'Hamburg': {
    radius: 10,
    coords: [53.55, 9.99]
  },
  'Groningen': {
    radius: 10,
    coords: [53.22, 6.57]
  },
  'Rotterdam': {
    radius: 10,
    coords: [51.92, 4.48]
  },
  'Leuven': {
    radius: 10,
    coords: [50.88, 4.70]
  },
  'San Francisco': {
    radius: 10,
    coords: [37.77, -122.42]
  }
};

export default function getCoordinates(name) {
  return COORDINATES[name];
}
