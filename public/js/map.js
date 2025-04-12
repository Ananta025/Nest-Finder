let mapToken = map_Token;
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker({color: "red"})
  .setLngLat(coordinates)
  .addTo(map);

// Add map controls
map.addControl(new mapboxgl.NavigationControl());

// Make sure the map resizes properly when window is resized
window.addEventListener('resize', () => {
  map.resize();
});

// Ensure the map container fits its bounds when loaded
map.on('load', function() {
  map.resize();
});