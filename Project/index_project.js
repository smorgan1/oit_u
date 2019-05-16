mapboxgl.accessToken = 'pk.eyJ1IjoibWVyZWRpdGhtYXJrcyIsImEiOiJjanV2dTF2ODYwNHExNDNzZDNicnBqY2QyIn0.H3Yqa2EDbrCQ18wJnoevsg'
// This adds the map to your page
var map = new mapboxgl.Map({
  // container id specified in the HTML
  container: 'map',
  // style URL
  style: 'mapbox://styles/mapbox/light-v10',
  // initial position in [lon, lat] format
  center: [-77.034084, 38.909671],
  // initial zoom
  zoom: 14
});

const eventsOutput0 = data.resultsPage.results.event.map(event => {
  var output = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [event.location.lat, event.location.lng],
    },
    properties: {
      // headliner: event.performance.billing,
      // artists: event.performance.artist.displayName,
      title: event.displayName,
      date: event.start.date,
      city: event.location.city,
    },
  };

  return output
})


console.log(eventsOutput0)

function flyToStore(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15
  });
}

function createPopUp(currentFeature) {
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  // Check if there is already a popup on the map and if so, remove it
  if (popUps[0]) popUps[0].remove();

  var popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML('<h3>Sweetgreen</h3>' +
      '<h4>' + currentFeature.properties.address + '</h4>')
    .addTo(map);
}

function buildLocationList(data) {
  // Iterate through the list of stores
  for (i = 0; i < data.features.length; i++) {
    var currentFeature = data.features[i];
    // Shorten data.feature.properties to `prop` so we're not
    // writing this long form over and over again.
    var prop = currentFeature.properties;
    // Select the listing container in the HTML and append a div
    // with the class 'item' for each store
    var listings = document.getElementById('listings');
    var listing = listings.appendChild(document.createElement('div'));
    listing.className = 'item';
    listing.id = 'listing-' + i;

    // Create a new link with the class 'title' for each store
    // and fill it with the store address
    var link = listing.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title';
    link.dataPosition = i;
    link.innerHTML = prop.address;
    // Add an event listener for the links in the sidebar listing
  link.addEventListener('click', function(e) {
    // Update the currentFeature to the store associated with the clicked link
    var clickedListing = data.features[this.dataPosition];
    // 1. Fly to the point associated with the clicked link
    flyToStore(clickedListing);
    // 2. Close all other popups and display popup for clicked store
    createPopUp(clickedListing);
    // 3. Highlight listing in sidebar (and remove highlight for all other listings)
    var activeItem = document.getElementsByClassName('active');
    if (activeItem[0]) {
      activeItem[0].classList.remove('active');
    }
    this.parentNode.classList.add('active');
  });

    // Create a new div with the class 'details' for each store
    // and fill it with the city and phone number
    var details = listing.appendChild(document.createElement('div'));
    details.innerHTML = prop.city;
    if (prop.phone) {
      details.innerHTML += ' -- ' + prop.phoneFormatted;
    }
  }
}

map.on('load', function (e) {
  // This is where your '.addLayer()' used to be, instead add only the source without styling a layer
  map.addSource("places", {
    "type": "geojson",
    "data": stores
  });
  // Initialize the list
  buildLocationList(stores);
});

// This is where your interactions with the symbol layer used to be
// Now you have interactions with DOM markers instead
stores.features.forEach(function(marker, i) {
  // Create an img element for the marker
  var el = document.createElement('div');
  el.id = "marker-" + i;
  el.className = 'marker';
  // Add markers to the map at all points
  new mapboxgl.Marker(el, {offset: [0, -23]})
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);

  el.addEventListener('click', function(e){
    // 1. Fly to the point
    flyToStore(marker);

    // 2. Close all other popups and display popup for clicked store
    createPopUp(marker);

    // 3. Highlight listing in sidebar (and remove highlight for all other listings)
    var activeItem = document.getElementsByClassName('active');

    e.stopPropagation();
    if (activeItem[0]) {
       activeItem[0].classList.remove('active');
    }

    var listing = document.getElementById('listing-' + i);
    listing.classList.add('active');
  });
});
