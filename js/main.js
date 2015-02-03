var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var turf = require('turf');
var hogan = require('hogan.js');
require('mapbox.js');

Backbone.$ = $;

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
var Receiver = Backbone.Model.extend({
  initialize: function() {
    this.on('received', this.checkCompletion);
    this.fetch();
  },
  fetch: function() {
    this.fetchLocations();
    this.geolocate();
  },
  checkCompletion: function() {
    if (this.get("currentLocation") == null) {
      return false;
    } else if (this.get("locations") == null) {
      return false;
    } else {
      this.onComplete();
      return true;
    }
  },
  onComplete: function() {
    this.set("nearest", turf.nearest(this.get("currentLocation"), this.get("htLocations")));
    console.log(this.get("nearest"));
    this.trigger('complete');
    console.log(this.attributes);
  },
  today: function() {
    var d = new Date();
    if (d === 0) {
      return "sunday";
    } else if (d === 1) {
      return "monday";
    } else if (d === 2) {
      return "tuesday";
    } else if (d === 3) {
      return "wednesday";
    } else if (d === 4) {
      return "thursday";
    } else if (d === 5) {
      return "friday";
    } else if (d === 6) {
      return "saturday";
    }
  },
  fetchLocations: function() {
    var self = this;
    $.ajax({
      method: "GET",
      url: "data/locations.geojson",
      dataType: "json"
    }).done(function(locations) {
      var htLocations = _.clone(locations);
      htLocations.features = _.filter(htLocations.features, function(feature) {
        return feature.properties.heady === true;
      });
      var htLocationsToday = _.clone(htLocations);
      htLocationsToday.features = _.filter(htLocationsToday.features, function(feature) {
        return feature.properties.headyDay.indexOf(self.today()) !== -1;
      });
      self.set({
        'locations': locations,
        'htLocations': htLocations,
        'htLocationsToday': htLocationsToday
      });
      self.trigger('received');
      self.trigger('received:locations');
    });
  },
  geolocate: function() {
    var self = this;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        self.set("currentLocation", turf.point([position.coords.longitude, position.coords.latitude]));
        self.trigger('received');
      });
    }
  },
  data: function() {
    return {
      htNearest: this.get('nearest').properties.name + ", " + this.get('nearest').properties.address,
      lat: this.get('nearest').geometry.coordinates[1],
      lng: this.get('nearest').geometry.coordinates[0]
    };
  }
});
var ContainerView = Backbone.View.extend({
  events: {

  },
  initialize: function() {
    this.initializeMap();
    this.model.on('complete', this.render, this);
  },
  template: function() {
    return hogan.compile($('#template-container').html()).render(this.model.data());
  },
  render: function() {
    console.log("completed");
    this.$el.html(this.template());
  },
  initializeMap: function() {
    L.mapbox.accessToken = 'pk.eyJ1Ijoid2lsbHBvdHMiLCJhIjoiSTJYS0RCNCJ9.jPqwSxzqRHyjLAUoFS3vgQ';
    L.mapbox.map('map', 'mapbox.light', {
      zoomControl: false
    }).setView([44.07377376789347, -72.79678344726562], 9);
  },
  drawMap: function() {

  }
});

var container = new ContainerView({
  el: "#container",
  model: new Receiver({

  })
});