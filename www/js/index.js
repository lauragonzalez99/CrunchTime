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
        navigator.geolocation.getCurrentPosition(function(position){
                initSearch(position,1500, 'restaurant')},
            onError,
            { timeout: 30000, enableHighAccuracy: true });
    } else {
        console.log('geolocation unsuccessful')
    }

    function onError(){
        console.log('geolocation not working');
    }
}

function initSearch(position, distance, input){

    var lat= position.coords.latitude;
    var lng= position.coords.longitude;
    var location = new google.maps.LatLng(lat,lng);

    var request = {
        location:location,
        radius: distance,
        query: [input]

    };

    // creating the Places Service
    var restaurantView = document.getElementById("restaurantList");
    var moreButton = document.getElementById('more');
    var lessButton = document.getElementById('less');
    var service = new google.maps.places.PlacesService(restaurantView);

    service.textSearch(request, function(results,status) {
        if (status !== 'OK') return;

        showRestaurants(results,10);

        moreButton.onclick = function(){
            showRestaurants(results,5);
            this.style.display="none";
            toggleButton(lessButton);
        };

        lessButton.onclick = function(){
            collapseRestaurants(5);
            this.style.display="none";
            toggleButton(moreButton);
        };

    });
}

function toggleButton(button){
    if (button.style.display=='block'){
        button.style.display='none';
    }
    else{
        button.style.display='block';
    }
}

function collapseRestaurants(number){
    var restaurantList = document.getElementById("restaurantList");
    for (var i = number; i > 0; i--){
        restaurantList.removeChild(restaurantList.lastChild);
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

function checkIfOpen(status){
    if (status == true){
        return "Open now";
    }
    else{
        return "Closed";
    }
}


function matchRestaurant(){
    var input, filter, restaurantList, infoPanel, namePanel, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    restaurantList = document.getElementById("restaurantList");
    infoPanel = restaurantList.getElementsByClassName("infoPanel");

    for (i=0; i < infoPanel.length; i++){
        namePanel = infoPanel[i].getElementsByClassName("namePanel")[0];
        txtValue=(namePanel.textContent || namePanel.innerText);
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

    //this checks if the show restaurants function is being called for the first time or
    //when load more is called
    var begin = 0;
    if (number === 5){
        begin = 10;
        number += begin;
    }
    else{
        begin = 0;
    }

    for (var i = begin; i < (number); i++){

        console.log(place[i]);

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
        sessionStorage.setItem("placeName" + i, place[i].name);
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


    $('.infoPanel').on('click', 'button', function () {
        //context: this;
        sessionStorage.setItem("selectedRestaurant", this.value);
        window.location.href = "map.html";
    })



}

$(document).ready(getLocation);