document.addEventListener("DOMContentLoaded", initApp, false);

function initApp(){

    var $uploaded = $("#uploaded");
    var $photo = $("#photo");
    var $submit = $("#btnsubmit");
    var $form = $("#review_form");
    var fakeImage = $photo.src;
    $uploaded.hide();

    var selectedRestaurant = sessionStorage.getItem("selectedRestaurant");
    console.log(selectedRestaurant + " " + selectedRestaurant);
    var currentRestaurant = sessionStorage["placeName" + selectedRestaurant];
    console.log(currentRestaurant);

    $('#starsQuestion').text('How many stars would you rate your experience at ' + currentRestaurant + "?");

    var firebaseConfig = {
        apiKey: "yourAPIKey",
        authDomain: "YourProjectID.firebaseapp.com",
        databaseURL: "https://YourProjectID.firebaseio.com",
        projectId: "yourProjectID",
        storageBucket: "yourProjectID.appspot.com",
        messagingSenderId: "__"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    var rootRef = firebase.database().ref();
    function writeUserData(username,rating, restaurant, imageUrl) {
        firebase.database().ref('reviews/' + restaurant + '/' + username).set({
            username: username,
            restaurant: restaurant,
            rating: rating,
            new_picture: imageUrl
        });

    }

    $("#takePhoto").click(function(event){
        event.preventDefault();

        var options = { quality: 25,
            destinationType: Camera.DestinationType.DATA_URL,
            cameraDirection: Camera.Direction.FRONT,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            correctOrientation: true,
            allowEdit: true,
            saveToPhotoAlbum:true
        };
        navigator.camera.getPicture(cameraSuccess, cameraError, options);

        function cameraSuccess(imageData){

            displayImage(imageData);

        }
        function cameraError(errorData){
            navigator.notification.alert("Error: " + JSON.stringify(errorData), null, "Camera Error", "OK");
        }

    });


    function displayImage(imageData) {
        $photo.attr("src", "data:image/jpeg;base64," + imageData);
        $uploaded.show();
    }
    var selectedRating;
    var $rating = $("#star-rating");
    $rating.change(function(){
        selectedRating = $(this).children("option:selected").val();
        //alert("You have selected the country - " + selectedCountry);
    });

    $submit.click(function(event){
        event.preventDefault();

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+'-'+time;


        // var downloadurl = dataurl;
        var dataurl = $photo.attr("src");

        if( dataurl !== fakeImage ){
            navigator.notification.alert(dataurl);

            var blob = dataURLtoBlob(dataurl);

            var storageRef = firebase.storage().ref();
            var imageRef = storageRef.child('images/' + currentRestaurant + dateTime + '.jpg');

            try{

                imageRef.put(blob).then(function(snapshot) {

                    imageRef.getDownloadURL().then(function(url) {
                        //downloadurl = url;
                        writeUserData("user1", selectedRating, currentRestaurant, url);
                        navigator.notification.alert('Review uploaded!');

                    }).catch(function(error) {
                        navigator.notification.alert('error1: ' + e);
                    });

                });

            }
            catch (e){
                navigator.notification.alert('error2: ' + e);
            }

        } else {
            writeUserData("user1", selectedRating, currentRestaurant, '');
        }

        $form.reset();
        navigator.notification.alert("Your review has been posted! Thank you!");

    });

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }
}
