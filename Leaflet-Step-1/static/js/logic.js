

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(queryUrl, function(data) {
  console.log(data.features);
  // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
  createFeatures(data.features);
});


function createFeatures(earthquakeData) {
  function processFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3>
      <hr><p>Magnitude: ${feature.properties.mag}</p><p>${new Date(feature.properties.time)}</p>`);
  };



  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: processFeature,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {radius: feature.properties.mag*5, fillOpacity: 0.5, color: getColor(feature.properties.mag)});
    }
  }); 

  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: "sk.eyJ1IjoiYWdyYXdhbHJlZW5hIiwiYSI6ImNrMGpzaDhqeTAzbnkzY2t5dTMwd3A3OXEifQ.Bdh3m1Bzzi52S8VutyGWZw"
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: "sk.eyJ1IjoiYWdyYXdhbHJlZW5hIiwiYSI6ImNrMGpzaDhqeTAzbnkzY2t5dTMwd3A3OXEifQ.Bdh3m1Bzzi52S8VutyGWZw"
  });
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  let overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create a new map
  var myMap = L.map("map", {
    center: [
      37.09, -118.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control containing our baseMaps
  // Be sure to add an overlay Layer containing the earthquake GeoJSON
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 1, 2, 3, 4, 5],
		labels = [];

	// loop through our density intervals and generate a label with a colored square for each interval
	for (var i = 0; i < grades.length; i++) {
		div.innerHTML +=
			'<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
			grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
	}

	return div;
};

legend.addTo(myMap);
};

  
function getColor(d) {
	return d > 5  ? '#E31A1C' :
	       d > 4  ? '#FC4E2A' :
	       d > 3   ? '#FD8D3C' :
	       d > 2   ? '#FEB24C' :
	       d > 1   ? '#FED976' :
	                  '#FFEDA0';
}


