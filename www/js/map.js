function initMap() {
    var map;

    var selectedRestaurant = sessionStorage.getItem("selectedRestaurant");
    console.log(selectedRestaurant + " " + selectedRestaurant);
    var restaurantName = sessionStorage["placeName" + selectedRestaurant];
    var restaurantLocationLat = sessionStorage["placeLocationLat" + selectedRestaurant];
    var restaurantLocationLng = sessionStorage["placeLocationLng" + selectedRestaurant];
    console.log(restaurantName, restaurantLocationLat);

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: parseFloat(restaurantLocationLat), lng: parseFloat(restaurantLocationLng)},
        zoom: 19
    });

}

$(document).ready(initMap());




