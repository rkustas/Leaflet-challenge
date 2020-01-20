// Data from last 30 days
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var myMap = L.map("map", {
    center: [0,0],
    zoom: 5
  });

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "mapbox.streets",
accessToken: API_KEY
}).addTo(myMap);


d3.json(link, function(data) {
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
    // Iterate through to grab coordinates
    for (var i = 0;i < data.features.length;i ++) {
        var coord = data.features[i].geometry.coordinates
        var mag = data.features[i].properties.mag
        // console.log(mag)
        console.log(coord)
        var [long, lat] = coord
        L.circle([lat, long], {
            fillOpacity: 0.5,
            color: "black",
            fillColor: selectColor(mag),
            radius: mag * 20000
        }).bindPopup("<h3>" + "Title: "+ data.features[i].properties.title + "</h3>" + "Mag: "+mag+"<br>" + "magType: "+ data.features[i].properties.magType).addTo(myMap);

        var legend = L.control({position: 'bottomright'});
    }
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            magnitudes = [0,1,2,3,4,5],
            labels = [];

        // Loop through the magnitude intervals
        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
                '<i style="background:' + selectColor(magnitudes[i] + 1) + '"></i> ' +
                magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);

});