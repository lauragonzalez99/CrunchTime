$(document).ready(function(){
    function initMap() {

        var selection=1;
        var dataLng= sessionStorage.getItem("placeLng"+selection);
        var dataLat= sessionStorage.getItem("placeLat"+selection);
        var dataId= sessionStorage.getItem("placeId"+selection);
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: dataLat, lng: dataLng},
            zoom: 15
        });

        var request = {
            placeId: dataId,
            fields: ['name', 'formatted_address', 'place_id', 'geometry']
        };

        var infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);

        service.getDetails(request, function(place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });
                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                        'Place ID: ' + place.place_id + '<br>' +
                        place.formatted_address + '</div>');
                    infowindow.open(map, this);
                });
            }
        });
    }

    initMap();
});



