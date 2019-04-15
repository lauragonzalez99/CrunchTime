
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
        navigator.geolocation.getCurrentPosition(initSearch, onError, { timeout: 30000, enableHighAccuracy: true });
    } else {
        console.log('geolocation unsuccessful')
    }

    function onError(){
        console.log('geolocation not working');
    }
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

    var restaurantView = document.getElementById("restaurantList");
    var service = new google.maps.places.PlacesService(restaurantView);
    service.textSearch(request, callback);

    function callback(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            showRestaurants(place);
        }
    }
}

function repeatSymbolNumTimes(symbol, times) {
    var repeatedSymbol = "";

    while (times > 0) {
        repeatedSymbol += symbol;
        times--;
    }
    return repeatedSymbol;
}

function showRestaurants(place){

    var restaurants = document.getElementById('restaurantList');
    var starSymbol = '\u2605';

    for (var i = 0; i < 10; i++){

        // declarations for containers
        var restaurantPage = document.createElement('button');
        var restaurantNamePanel = document.createElement('div');
        var restaurantDetailPanel = document.createElement("p");
        var restaurantInfoPanel = document.createElement('div');
        var restaurantPricePanel = document.createElement("div");

        // settings variables to store JSON responses
        var imgSrc = place[i].photos[0].getUrl();
        var priceIndicator = repeatSymbolNumTimes("$",place[i].price_level);
        var addressFormat = place[i].formatted_address.split(",");
        var restaurantAddress = addressFormat[0];

        // settings classes for css
        restaurantInfoPanel.className="infoPanel";
        restaurantNamePanel.className="namePanel";
        restaurantDetailPanel.className="detailPanel";
        restaurantPricePanel.className="pricePanel";
        restaurantPage.className="button-links";

        // adding data to containers
        restaurantPage.style.backgroundImage="url(" + imgSrc + ")";
        restaurantNamePanel.textContent = place[i].name;
        restaurantPricePanel.textContent = priceIndicator;
        restaurantDetailPanel.textContent = place[i].rating + starSymbol + ' (' + place[i].user_ratings_total + ' ratings' +  ')';
        restaurantDetailPanel.innerHTML += '<br>' + restaurantAddress;

        // using local storage for data persistence
        sessionStorage.setItem("placeName" + i, place.name);
        sessionStorage.setItem("placeLocationLat" + i, place[i].geometry.location.lat() );
        sessionStorage.setItem("placeLocationLng" + i, place[i].geometry.location.lng() );
        restaurantPage.value=i;

        // appending containers
        restaurants.appendChild(restaurantInfoPanel);
        restaurantInfoPanel.appendChild(restaurantPage);
        restaurantInfoPanel.appendChild(restaurantPricePanel);
        restaurantInfoPanel.appendChild(restaurantNamePanel);
        restaurantInfoPanel.appendChild(restaurantDetailPanel);

    }


    $('.infoPanel').on('click', 'button', function () {
        //context: this;
        sessionStorage.setItem("selectedRestaurant", this.value);
        window.location.href = "map.html";
    })

}
