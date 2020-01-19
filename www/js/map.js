function initMap() {
    var map;


    var selectedRestaurant = sessionStorage.getItem("selectedRestaurant");

    var restaurantName = sessionStorage["placeName" + selectedRestaurant];
    var restaurantLocationLat = sessionStorage["placeLocationLat" + selectedRestaurant];
    var restaurantLocationLng = sessionStorage["placeLocationLng" + selectedRestaurant];
    console.log(restaurantName, restaurantLocationLat);

    var $nameHeader = $('#restaurantName');
    $nameHeader.text(restaurantName);


    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: parseFloat(restaurantLocationLat), lng: parseFloat(restaurantLocationLng)},
        zoom: 19
    });

    loadPhotos(restaurantName);
}

function loadPhotos(restaurantName){

    var firebaseConfig = {
        apiKey: "yourAPIkey",
        authDomain: "crunchtimereviews-8cd97.firebaseapp.com",
        databaseURL: "https://crunchtimereviews-8cd97.firebaseio.com",
        projectId: "crunchtimereviews-8cd97",
        storageBucket: "crunchtimereviews-8cd97.appspot.com",
        messagingSenderId: "109223634195"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var restaurantUploads = document.getElementById('restaurantPhotos');

    var rootRef = firebase.database().ref('reviews/' + restaurantName + '/user1');
    rootRef.on('value', function(snapshot) {
        console.log(snapshot.val());

        if( snapshot.val().new_picture ){
            var newImg = document.createElement("img");
            newImg.src = snapshot.val().new_picture;
            newImg.className = 'user-img';
            restaurantUploads.appendChild(newImg);
        }

        if( snapshot.val().rating ) {
            var newReview = document.createElement('p');
            newReview.textContent = 'stars:' + snapshot.val().rating;
            restaurantUploads.appendChild(newReview);
        }

    });

}

$(document).ready(initMap);
