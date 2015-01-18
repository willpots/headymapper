L.mapbox.accessToken = 'pk.eyJ1Ijoid2lsbHBvdHMiLCJhIjoiSTJYS0RCNCJ9.jPqwSxzqRHyjLAUoFS3vgQ';
var map = L.mapbox.map('map', 'mapbox.light')
  .setView([44.07377376789347, -72.79678344726562], 9);

$.ajax({
  method: "GET",
  url: "locations.geojson",
  dataType: "json"
})
.done(function(geojson) {
  geojson.features = geojson.features.filter(function(feature) {
    console.log(feature);
    return feature.properties.type === "store";
  });
  $.each(geojson.features, function(index, feature) {
    feature.properties = styleProperties(feature.properties);
  });
  var geoJsonLayer = L.geoJson(geojson, {
    pointToLayer: function(feature, latlng) {
      return L.marker(latlng, feature.properties.markerOptions);
    }
  }).on('layeradd', function(e) {
    var marker = e.layer,
      feature = marker.feature;

    marker.setIcon(L.icon(feature.properties.icon));
  }).addTo(map);
});

function styleProperties(properties) {
  var icon = "";
  var day;
  properties.markerOptions = {};
  if (properties.heady === true) {
    icon += "ht_";
    day = properties.headyDay.replace(" ", "_");
  } else if (properties.lawsons === true) {
    icon += "law_";
    day = properties.lawsonsDay.replace(" ", "_");
  }
  properties.markerOptions["icon"] = L.icon({
    "iconUrl": "images/" + icon + day + ".png",
    "iconSize": [40, 40],
    "iconAnchor": [20, 20],
    "popupAnchor": [0, -25],
    "className": "dot"
  });
  return properties;
}