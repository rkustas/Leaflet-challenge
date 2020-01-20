
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    // var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    //     attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    //     maxZoom: 18,
    //     id: "mapbox.light",
    //     accessToken: API_KEY
    // });

    // var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    //     attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    //     maxZoom: 18,
    //     id: "mapbox.outdoors",
    //     accessToken: API_KEY
    // });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
    //   "Light Map": grayscale,
      "Satellite": satellite
    //   "Outdoors": outdoors
    };
  
    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
      "Earthquakes": earthquakes
    //   "Fault lines": faultlines
    };
  
    // Create the map object with options
    var map = L.map("map", {
      center: [0, 0],
      zoom: 12,
      layers: [satellite, earthquakes]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }

  function createMarkers(data) {
    console.log(data)
    // console.log(data.features)
    // console.log(data.features[0].geometry.coordinates)
    
    function selectColor(magnitude) {
        switch (true) {
            case (magnitude <= 1):
                return "Chartreuse";
            case (magnitude > 1 && magnitude <= 2):
                return "LightGreen";
            case (magnitude > 2 && magnitude <= 3):
                return "Gold";
            case (magnitude > 3 && magnitude <= 4):
                return "Orange";
            case (magnitude > 4 && magnitude <= 5):
                return "DarkOrange";
            case (magnitude > 5):
                return "Red"
            default:
                return "black";
        }
    }
    for (var i = 0;i < data.features.length;i ++) {
        var geo = data.features[i].geometry
        console.log(geo[i]);
    
        var coords = [];
        // Loop through the stations array
        for (var index = 0; index < geo.length; index++) {
            var eGeo = geo[index];
            var c = geo.coordinates
            var [long, lat] = c
        
            // For each station, create a marker and bind a popup with the station's name
            var coord = L.marker([lat, long]);
        
            // Add the marker to the bikeMarkers array
            coords.push(coord);
        }
        // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(coords));
  }
}

  d3.json(link, createMarkers);