// toggle
var gridItems = document.getElementsByClassName("grid__item");

Array.from(gridItems).forEach(function (element) {
    // add click even listener to each .grid__item
    element.addEventListener('click', function () {

        if (element.classList.contains('grid__item--active')) {
            // if this element is active, then make inactive
            element.classList.remove('grid__item--active');
        } else {
            // else, remove active class from any that might have it
            var activeEls = document.getElementsByClassName('grid__item--active');
            Array.from(activeEls).forEach(function (activeEl) {
                activeEl.classList.remove('grid__item--active');
            });
            // make this element active
            element.classList.add('grid__item--active');
        }
    });

});


// mapbox stuff

mapboxgl.accessToken = 'pk.eyJ1IjoiY2FuZHJvbyIsImEiOiJjam95c3oyNXQyZWRvM3BwaDh1M3ZjdGVuIn0.MeVUbAnkD5W4KBVnjDJc5A';

var mapSettings = {
    style: 'mapbox://styles/mapbox/light-v9',
    zoom: 15.5,
    pitch: 45,
    bearing: -17.6 };


var mapCardiff = new mapboxgl.Map({
    style: mapSettings.style,
    center: [-3.1848228, 51.4782085],
    zoom: mapSettings.zoom,
    pitch: mapSettings.pitch,
    bearing: mapSettings.bearing,
    container: 'map-cardiff' });


var mapEdinburgh = new mapboxgl.Map({
    style: mapSettings.style,
    center: [-3.2021022, 55.9485947],
    zoom: mapSettings.zoom,
    pitch: mapSettings.pitch,
    bearing: mapSettings.bearing,
    container: 'map-edinburgh' });


var mapDublin = new mapboxgl.Map({
    style: mapSettings.style,
    center: [-6.3157431, 53.3242996],
    zoom: mapSettings.zoom,
    pitch: mapSettings.pitch,
    bearing: mapSettings.bearing,
    container: 'map-dublin' });



var maps = [mapCardiff, mapEdinburgh, mapDublin];var _loop = function _loop(


i) {

    var thisMap = maps[i];

    function rotateCamera(timestamp) {
        // clamp the rotation between 0 -360 degrees
        // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
        maps[i].rotateTo(timestamp / 100 % 360, { duration: 0 });
        // Request the next frame of the animation.
        requestAnimationFrame(rotateCamera);

    }

    thisMap.on('load', function () {
        // Start the animation.
        rotateCamera(0);
        // Insert the layer beneath any symbol layer.
        var layers = thisMap.getStyle().layers;

        var labelLayerId;
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
                labelLayerId = layers[i].id;
                break;
            }
        }

        thisMap.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
                'fill-extrusion-color': '#aaa',

                // use an 'interpolate' expression to add a smooth transition effect to the
                // buildings as the user zooms in
                'fill-extrusion-height': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "height"]],

                'fill-extrusion-base': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "min_height"]],

                'fill-extrusion-opacity': .6 } },

        labelLayerId);
    });};for (var i = 0; i < maps.length; i++) {_loop(i);

}