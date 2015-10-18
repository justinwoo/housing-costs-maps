import Datamap from 'datamaps'
import d3 from 'd3';

function getProjection(region) {
  if (region === 'europe') {
    return function(element) {
      var projection = d3.geo.equirectangular()
        .center([7, 30])
        .rotate([0, -20])
        .scale(700)
        .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
      var path = d3.geo.path()
        .projection(projection);

      return {path: path, projection: projection};
    };
  }
  if (region === 'asia') {
    return function(element) {
      var projection = d3.geo.equirectangular()
        .center([115, 30])
        .rotate([-10, -10, -15])
        .scale(1500)
        .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
      var path = d3.geo.path()
      var path = d3.geo.path()
        .projection(projection);

      return {path: path, projection: projection};
    };
  }
  if (region === 'us') {
    return function(element) {
      var projection = d3.geo.equirectangular()
        .center([-100, 40])
        .rotate([0, 0, 0])
        .scale(400)
        .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
      var path = d3.geo.path()
      var path = d3.geo.path()
        .projection(projection);

      return {path: path, projection: projection};
    };
  }
}

function getColor(value) {
  if (value < 40) return 'LOW';
  if (value < 55) return 'MEDIUM';
  else return 'HIGH';
}

export default function makeDatamapDriver(region, container) {
  var datamap = new Datamap({
    element: document.getElementById(container),
    setProjection: getProjection(region),
    geographyConfig: {
      popupTemplate: function(geo, data) {
        return [
          '<div class="hoverinfo"><strong>',
          `${geo.properties.name}`,
          data ? `: ${data.price}` : '',
          '</strong></div>'
        ].join('');
      }
    },
    fills: {
      LOW: '#2ca02c',
      MEDIUM: '#ff7f0e',
      HIGH: '#d62728',
      defaultFill: "lightgrey"
    }
  });

  return function datamapDriver(input$) {
    input$.subscribe(statistics => {
      let choroPleth = statistics.byCountry.reduce((a, country) => {
        a[country.name] = {
          price: country.price,
          fillKey: getColor(country.price)
        };
        return a;
      }, {});
      datamap.updateChoropleth(choroPleth);
    });
  };
}
