

    // Initialize Firebase
// <script>

// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyAInA05COssl8DL9M08qWxMPeZJ2N4KfsI",
//     authDomain: "awsometrain-aa61e.firebaseapp.com",
//     databaseURL: "https://awsometrain-aa61e.firebaseio.com",
//     projectId: "awsometrain-aa61e",
//     storageBucket: "awsometrain-aa61e.appspot.com",
//     messagingSenderId: "196474254126",
//     appId: "1:196474254126:web:7693fcd31bd51b08"
// };
var firebaseConfig = {
    apiKey: "AIzaSyB00G4DN0gXBcuemtf2fygEC6juS_fozzk",
    authDomain: "train-scheduler-59a85.firebaseapp.com",
    databaseURL: "https://train-scheduler-59a85.firebaseio.com",
    projectId: "train-scheduler-59a85",
    storageBucket: "",
    messagingSenderId: "222151815512",
    appId: "1:222151815512:web:b3613ea0cdc759f4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

    var database = firebase.database();

    // Capture Button Click

    $("#addTrain").on("click", function (event) {
        event.preventDefault();

        // Grabbed values from text boxes
        var trainName = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        var firstTrain = $("#firstTrain").val().trim();
        var freq = $("#interval").val().trim();

        // Code for handling the push
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: freq
        });
    });


    // Firebase watcher + initial loader : This code behaves similarly to .on("value")
var dbRef = database.ref();
    dbRef.on("child_added", function (childSnapshot) {

        var newTrain = childSnapshot.val().trainName;
        var newLocation = childSnapshot.val().destination;
        var newFirstTrain = childSnapshot.val().firstTrain;
        var newFreq = childSnapshot.val().frequency;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");

        // Current Time
        var currentTime = moment();

        // Difference between the times
        var diffTime = moment().diff(moment(startTimeConverted), "minutes");

        // Time apart (remainder)
        var tRemainder = diffTime % newFreq;

        // Minute(s) Until Train
        var tMinutesTillTrain = newFreq - tRemainder;

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        var catchTrain = moment(nextTrain).format("HH:mm");

        // Display On Page
        $("#all-display").append(
            ' <tr><td>' + newTrain +
            ' </td><td>' + newLocation +
            ' </td><td>' + newFreq +
            ' </td><td>' + catchTrain +
            ' </td><td>' + tMinutesTillTrain + ' </td></tr>');

        // Clear input fields
        $("#trainName, #destination, #firstTrain, #interval").val("");
        return false;
    },
        //Handle the errors
        function (errorObject) {
            console.log("Errors handled: " , errorObject);
        });

