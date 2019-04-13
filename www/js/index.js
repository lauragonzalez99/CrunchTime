
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }

};

app.initialize();

function getLocation() {

    navigator.geolocation;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initSearch, onError(), { timeout: 30000, enableHighAccuracy: true });
    } else {
        console.log('geolocation unsuccessful')
    }
}

function onError(){
    var page= document.getElementById("page");
    page.textContent+="Geolocation Error";
}

function initSearch(position){

    var lat= position.coords.latitude;
    var lng= position.coords.longitude;
    var location = new google.maps.LatLng(lat,lng);


    var request = {
        location:location,
        radius: 1500,
        query: ['restaurant'],

    };

    var page= document.getElementById("page");
    var restaurantView = document.getElementById("restaurantView");
    page.textContent+=location;
    var service = new google.maps.places.PlacesService(restaurantView);
    service.textSearch(request, callback);

    function callback(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            showRestaurants(place);
        }
    }
}

function showRestaurants(place){

    var imgRequestUrl = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=";
    var API_KEY = "AIzaSyBcKQuhMx3T7GqjQFS9se0zphzm2iMR0Bk";

    var restaurantView= document.getElementById("restaurantView");
    var placesList = document.getElementById("places");

    var img = document.createElement("img");
    img.src=imgSrc;
    restaurantView.append(img);
    for (var i=0; i < 1; i++){
        var restaurant = place[i];
    }
}
