// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

// Determine sizes for each markers on the map
function size(magnitude) {
  return magnitude * 30000;
}

// Loop thru the features and create one marker for each place object
function colors(magnitude) {
  var color = "";
  if (magnitude <= 1) {
    return color = "#4BFC3D";
  }
  else if (magnitude <= 2) {
    return color = "#DAF7A6";
  }
  else if (magnitude <= 3) {
    return color = "#FFC300";
  }
  else if (magnitude <= 4) {
    return color = "#FF5733";
  }
  else if (magnitude <= 5) {
    return color = "#C70039";
  }
  else if (magnitude > 5) {
    return color = "#900C3F";
  }
  else {
    return color = "#ff00bf";
  }
}

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Check on coordinates and magnitude data 
  console.log(earthquakeData[0].geometry.coordinates[1]);
  console.log(earthquakeData[0].geometry.coordinates[0]);
  console.log(earthquakeData[0].properties.mag);

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "<hr> <p> Earthquake Magnitude: " + feature.properties.mag + "</p>")
  }

  var earthquakes = L.geoJSON(earthquakeData, {

    onEachFeature: onEachFeature,

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    pointToLayer: function (feature, coordinates) {
      // Determine Marker Colors, Size, and Opacity for each earthquake.
      var geoMarkers = {
        radius: size(feature.properties.mag),
        fillColor: colors(feature.properties.mag),
        fillOpacity: 0.30,
        stroke: true,
        weight: 1
      }
      return L.circle(coordinates, geoMarkers);
    }
  })

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

// Create function for earthquake map
function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };


  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      20, -0
    ],
    zoom: 3,
    layers: [street, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  // // Set up the legend.
  // // Create a legend to display info about our map.
  // var legend = L.control({ 
  //   position: 'bottomright' 
  // });

  // // When the layer control is added, insert a div with the class of "info legend".
  // legend.onAdd = function () {

  //   var div = L.DomUtil.create('div', 'info legend'),
  //       magnitude = [0, 1, 2, 3, 4, 5];

  //   // loop through our density intervals and generate a label with a colored square for each interval
  //   for (var i = 0; i < magnitude.length; i++) {
  //     div.innerHTML +=
  //       '<i style="background:' + colors(magnitude[i] + 1) + '"></i> ' +
  //       magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
  //   }

  //   return div;
  // };

  // // Add the info legend to the map.
  // legend.addTo(myMap);

}