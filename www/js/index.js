
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        $(document).ready(startSearch);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
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

function startSearch(){
    navigator.geolocation;

    console.log("code reached");

    var para = document.getElementById("test");

    var placesList = document.getElementById('places');
    var error = document.createElement("p");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        error.textContent = "geo location does work";
    }
    else{
        error.textContent = "geo location doesnt work";
    }

    placesList.appendChild(error);

    function showPosition(position) {
        console.log("show position");

        var API_KEY  = "AIzaSyBcKQuhMx3T7GqjQFS9se0zphzm2iMR0Bk";

        var restaurants;

        initMap();
        placesList.appendChild(error);

        function initMap() {
            console.log("init map");
            // Create the map.
            var latlon = {lat: position.coords.latitude , lng: position.coords.longitude };
            error.textContent += latlon;

            placesList.appendChild(error);

            console.log("position");
            restaurants = new google.maps.Map(document.getElementById('restaurantView'), {
                center: latlon,
                zoom: 17
            });

            console.log("map");

            // Create the places service.
            var service = new google.maps.places.PlacesService(restaurants);
            var getNextPage = null;
            var moreButton = document.getElementById('more');
            moreButton.onclick = function() {
                moreButton.disabled = true;
                if (getNextPage) getNextPage();
            };

            // Perform a nearby search.
            service.nearbySearch(
                {location: latlon, radius: 1500, type: ['restaurant']},
                function(results, status, pagination) {
                    console.log("nearby search b4 ok");
                    console.log(status);
                    if (status !== 'OK') return;
                    console.log("nearby search");

                    createMarkers(results);
                    moreButton.disabled = !pagination.hasNextPage;
                    getNextPage = pagination.hasNextPage && function() {
                        pagination.nextPage();
                    };
                });
        }

        function createMarkers(places) {
            var bounds = new google.maps.LatLngBounds();
            var placesList = document.getElementById('places');

            for (var i = 0; i < 10; i++) {
                place = places[i];

                console.log(place);

                var photos = place.photos;
                if(!photos){
                    console.log('error');

                }

                sessionStorage.setItem("placeName" + i, place.name);
                sessionStorage.setItem("placeLocationLat" + i, place.geometry.location.lat() );
                sessionStorage.setItem("placeLocationLng" + i, place.geometry.location.lng() );

                console.log(place.geometry.location.lat());

                var img = document.createElement("img");

                var li = document.createElement('li');
                var div_ = document.createElement("div");
                var restaurantPage = document.createElement('button');

                li.textContent = place.name;

                var ImgSrc = place.photos[0].getUrl();
                img.src = ImgSrc;

                restaurantPage.style.backgroundImage="url(" + ImgSrc + ")";
                restaurantPage.className="links";
                restaurantPage.textContent=place.name;
                restaurantPage.value=i;

                div_.appendChild(li);
                div_.appendChild(restaurantPage);

                placesList.appendChild(div_);


                bounds.extend(place.geometry.location);
            }
            restaurants.fitBounds(bounds);
        }

        var places = document.getElementById('places');

        $(places).on('click', 'button', function(){
            sessionStorage.setItem("selectedRestaurant", this.value);
            window.location.href = "map.html";
        })

    }



}
