
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url, function(data) {
    console.log(data.features);

    createMap(data.features);
});



function createMap(earthquakes) {

    var map = L.map("map", {
        center:[39.876019, -117.224121],
        zoom: 5,
        // layers:[lightmap,]
        });
        
        L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "light-v10",
            accessToken: API_KEY
        }).addTo(map);

    for( var i=0; i < earthquakes.length; i++) {
        var earthquake = earthquakes[i];
        // console.log(earthquake.geometry.coordinates[1]);

        L.circle([earthquake.geometry.coordinates[1],earthquake.geometry.coordinates[0]], {
            color:"black",
            fillColor:getColors(earthquake.properties.mag),
            weight:0.5,
            fillOpacity:1,
            
            radius: earthquake.properties.mag*10000
        }).bindPopup("<h1>" + "Place: " + earthquakes[i].properties.place + " Magnitude: " + earthquakes[i].properties.mag + "</h1> <hr> <h3> Time: " +  new Date(earthquakes[i].properties.time) + "</h3>").addTo(map);
    }
    var legend = L.control({ position:'bottomright' });
    legend.onAdd = function(map) {

    var div = L.DomUtil.create("div", "info legend"),
        grades = [0,1,2,3,4,5],
        labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColors(grades[i]) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};
    
legend.addTo(map);


}

function getColors(mag) {
    return mag >= 5 ? '#ef551a' : // Means: if (d >= 1966) return 'green' else…
    mag >= 4 ? '#d77430' : // if (d >= 1960) return 'black' else etc…
    mag >= 3 ? '#c09445' :
    mag >= 2 ? '#a8b35b' : 
    mag >= 1 ? '#91d370' : 
    mag >= 0 ? '#79f286' : 
    'grey';
}

