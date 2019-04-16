
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
        query: ['restaurant']

    };

    // creating the Places Service
    var restaurantView = document.getElementById("restaurantList");
    var moreButton = document.getElementById('more');

    var service = new google.maps.places.PlacesService(restaurantView);

    service.textSearch(request, function(results,status) {
        if (status !== 'OK') return;

        showRestaurants(results,0);

        moreButton.onclick = function(){
            showRestaurants(results,10);

        }

    });
}

function repeatSymbolNumTimes(symbol, times) {
    var repeatedSymbol = "";

    while (times > 0) {
        repeatedSymbol += symbol;
        times--;
    }
    return repeatedSymbol;
}

function checkIfOpen(status){
    if (status == true){
        return "Open now";
    }
    else{
        return "Closed";
    }
}

function findRestaurant(){
    var input, filter, infoPanel, txtValue, i, restaurantList, namePanel;
    input = document.getElementById("searchInput");
    restaurantList = document.getElementById("restaurantList");
    filter = input.value.toUpperCase().trim();
    infoPanel = restaurantList.getElementsByClassName("infoPanel");

    for (i=0; i<infoPanel.length;i++){
        namePanel = infoPanel[i].getElementsByClassName("namePanel");
        txtValue=namePanel.textContent;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            infoPanel[i].style.display = "";
        }else{
            infoPanel[i].style.display="none";
        }
    }

}
function showRestaurants(place, number){

    var restaurants = document.getElementById('restaurantList');

    var starSymbol = '\u2605';

    for (var i = number; i < (number+10); i++){

        // declarations for containers
        var restaurantPage = document.createElement('button');
        var restaurantNamePanel = document.createElement('div');
        var restaurantDetailPanel = document.createElement("p");
        var restaurantInfoPanel = document.createElement('div');
        var restaurantPricePanel = document.createElement("div");
        var restaurantStatusPanel = document.createElement("p");

        // settings variables to store JSON responses
        var imgSrc = place[i].photos[0].getUrl();
        var priceIndicator = repeatSymbolNumTimes("$",place[i].price_level);
        var restaurantStatus = checkIfOpen(place[i].opening_hours.open_now);
        var addressFormat = place[i].formatted_address.split(",");
        var restaurantAddress = addressFormat[0];

        // settings classes for css
        restaurantInfoPanel.className="infoPanel";
        restaurantNamePanel.className="namePanel";
        restaurantDetailPanel.className="detailPanel";
        restaurantPricePanel.className="pricePanel";
        restaurantPage.className="button-links";
        restaurantStatusPanel.className="statusPanel";

        // adding data to containers
        restaurantPage.style.backgroundImage="url(" + imgSrc + ")";
        restaurantNamePanel.textContent = place[i].name;
        restaurantPricePanel.textContent = priceIndicator;
        restaurantDetailPanel.textContent = place[i].rating + starSymbol + ' (' + place[i].user_ratings_total + ' ratings' +  ')';
        restaurantDetailPanel.innerHTML += '<br>' + restaurantAddress;
        restaurantStatusPanel.innerHTML += '<br>' + restaurantStatus;

        if (restaurantStatus == "Open now"){
            restaurantStatusPanel.className+=" open";
        }
        else{
            restaurantStatusPanel.className+=" closed";
        }

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
        restaurantDetailPanel.appendChild(restaurantStatusPanel);

    }

    var moreButton = document.getElementById("more");
    restaurants.appendChild(moreButton);


    $('.infoPanel').on('click', 'button', function () {
        //context: this;
        sessionStorage.setItem("selectedRestaurant", this.value);
        window.location.href = "map.html";
    })

}
