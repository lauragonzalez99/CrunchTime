
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

    //initializing variables
    navigator.geolocation;
    var placesList = document.getElementById('places');
    var error = document.createElement("p");
    var bannerMsg = document.createElement("bannerMsg")

    //Error checking for geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else{
        error.textContent = "Geolocation is not supported";
        placesList.appendChild(error);
    }



    function showPosition(position) {

        var restaurants;
        initMap();

        function initMap() {

            // Create the map.
            var latlon = {lat: position.coords.latitude , lng: position.coords.longitude };
            error.textContent += latlon;

            // Storing current location
            restaurants = new google.maps.Map(document.getElementsByClassName('restaurantView'), {
                center: latlon,
                zoom: 17
            });


            // Create the places service.
            var service = new google.maps.places.PlacesService(restaurants);

            // Button for loading more results
            var getNextPage = null;
            var moreButton = document.getElementById('more');
            moreButton.onclick = function() {
                moreButton.disabled = true;
                moreButton.style.display = "none";
                if (getNextPage) getNextPage();
            };


            // Perform a nearby search.
            service.nearbySearch(
                {location: latlon, radius: 1500, type: ['restaurant']},
                function(results, status, pagination) {
                    if (status !== 'OK') return;

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


                var photos = place.photos;
                if(!photos){
                    console.log('error');

                }
                // using local storage for data persistence
                sessionStorage.setItem("placeName" + i, place.name);
                sessionStorage.setItem("placeLocationLat" + i, place.geometry.location.lat() );
                sessionStorage.setItem("placeLocationLng" + i, place.geometry.location.lng() );

                // generating containers for the search results
                var img = document.createElement("img");
                var restaurantNamePanel = document.createElement('div');
                var restaurantInfoPanel = document.createElement("div");
                var restaurantPage = document.createElement('button');
                var ImgSrc = place.photos[0].getUrl();

                // setting names/pictures, classes for css
                restaurantInfoPanel.className="infoPanel";
                restaurantNamePanel.className="namePanel";
                restaurantNamePanel.textContent = place.name;
                img.src = ImgSrc;
                restaurantPage.className="button-links";
                restaurantPage.style.backgroundImage="url(" + ImgSrc + ")";
                restaurantPage.value=i;

                // implementing the containers
                placesList.appendChild(restaurantInfoPanel);
                restaurantInfoPanel.appendChild(restaurantPage);
                restaurantInfoPanel.appendChild(restaurantNamePanel);

                bounds.extend(place.geometry.location);
            }
            restaurants.fitBounds(bounds);
        }

        // sending the restaurant links to the map page
        var places = document.getElementById('places');

        $(places).on('click', 'button', function(){
            sessionStorage.setItem("selectedRestaurant", this.value);
            window.location.href = "map.html";
        })

    }
}
