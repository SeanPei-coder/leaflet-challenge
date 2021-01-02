

// set up two dataset paths;
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var url_tectonic_plates = "../leaflet-challenge/Leaflet-Step-2/GeoJSON/PB2002_boundaries.json";



// read in earthquakeInfo;
d3.json(url, function(earthquakeInfo) {

    var platesMarkers = [];
    var line_1 = [];
    // read in tectonic plates Info;
    d3.json(url_tectonic_plates, function(platesInfo){

        var tectonicPlates = platesInfo.features;
        console.log(tectonicPlates);
        
        // to get multi polyline points;
        for(var i = 0; i < tectonicPlates.length; i++) {

            var line_2 = [];
            for( var j = 0; j < tectonicPlates[i].geometry.coordinates.length; j++) {
                
                line_2.push(
                    [tectonicPlates[i].geometry.coordinates[j][1],tectonicPlates[i].geometry.coordinates[j][0]]
                ); 
            }
            line_1.push(line_2);
            platesMarkers.push(
                L.polyline(line_1, {
                    color:"orange"                  
                })
            )
        }

    var earthquakes = earthquakeInfo.features;
    // console.log(earthquakes);
    var earthquakeMarkers = [];

    for( var i=0; i < earthquakes.length; i++) {

        earthquakeMarkers.push(
            L.circle([earthquakes[i].geometry.coordinates[1],earthquakes[i].geometry.coordinates[0]], {
                color:"black",
                fillColor:getColors(earthquakes[i].properties.mag),
                weight:0.5,
                fillOpacity:1,
                // scale with mag level
                radius: earthquakes[i].properties.mag*50000
            }).bindPopup("<h1>" + "Place: " + earthquakes[i].properties.place + " Magnitude: " + earthquakes[i].properties.mag + "</h1> <hr> <h3> Time: " +  new Date(earthquakes[i].properties.time) + "</h3>")
        )
    }

    var API_KEY = config.API_KEY;
    // set up baseMaps;
    var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "light-v10",
            accessToken: API_KEY
    });
    
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-v9",
        accessToken: API_KEY
    });

    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "outdoors-v9",
        accessToken: API_KEY
    });


    // overlayMaps
    var plates = L.layerGroup(platesMarkers);
    var seismic = L.layerGroup(earthquakeMarkers);

    var baseMaps = {
                "Satellite": satellite,
                "Grayscale": grayscale,
                "Outdoors": outdoors
    };

    var overlayMaps = {
                "Earthquakes": seismic,
                "FaultyLines": plates,
    };
    
    var map = L.map("map", {
                center:[39.876019, -117.224121],
                zoom: 3,
                layers:[satellite, seismic, plates]
    });

    L.control.layers(baseMaps, overlayMaps, {
                collapsed: false
            }).addTo(map);

    var legend = L.control({ position:'bottomright' });
    legend.onAdd = function(map) {

        var div = L.DomUtil.create("div", "info legend"),
            grades = [0,1,2,3,4,5],
            labels = [];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColors(grades[i] ) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    }
    legend.addTo(map);  
    });    
});      

// circles' colors;
function getColors(mag) {
    return mag >= 5 ? '#ef551a' : // Means: if (mag >= 5) return '#ef551a' else…
    mag >= 4 ? '#d77430' : // if (mag >= 4) return '#d77430' else etc…
    mag >= 3 ? '#c09445' :
    mag >= 2 ? '#a8b35b' : 
    mag >= 1 ? '#91d370' : 
    '#79f286';
}