// Creating map object
var myMap = L.map("map", {
  center: [44.9778, -93.2650],
  zoom: 11
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);


// API query URL
var url = "https://gis.hennepin.us/arcgis/rest/services/HennepinData/HEALTH/MapServer/1/query?where=1%3D1&outFields=*&outSR=4326&f=json";


var hospitalIcon = L.icon({
  iconUrl: 'static/images/hospital.png',
  iconSize:     [36, 36], // size of the icon
  iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

// Grab the data with d3
d3.json(url, function(response) {
  // console.log(response.features);


  // Create a new marker cluster group
  var markers = L.markerClusterGroup();

  // Loop through data
  for (var i = 0; i < response.features.length; i++) {
    console.log(response.features[i]);

    // Set the data location property to a variable
    var location = response.features[i].geometry;
    var title = response.features[i].attributes.NAME;

    // Check for location property
     if (location) {

      // Add a new marker to the cluster group and bind a pop-up
      markers.addLayer(L.marker([location.y, location.x],{title: title, icon: hospitalIcon})
        .bindPopup(title));
     }

  }


  // Add our marker cluster layer to the map
  myMap.addLayer(markers);

});
