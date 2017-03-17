var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: new google.maps.LatLng(48.463649,  -123.311951),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
        function addMarker(location) {
        marker = new google.maps.Marker({
            position: location,
            map: map
        });
        }
    //Test for browser compatibility
if (window.openDatabase) {
    //Create the database the parameters are 1. the database name 2.version number 3. a description 4. the size of the database (in bytes) 1024 x 1024 = 1MB
    var mydb = openDatabase("locations_db", "0.1", "A Database of Favourite Locations", 1024 * 1024);

    //create the cars table using SQL for the database using a transaction
    mydb.transaction(function(t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY ASC, latitude TEXT, longitude TEXT)");
    });



} else {
    alert("WebSQL is not supported by your browser!");
}

//function to output the list of cars in the database

function updateLocList(transaction, results) {
		console.log(transaction);
    console.log(results);
    //initialise the listitems variable
    var listitems = "";
    //get the car list holder ul
    var listholder = document.getElementById("loclist");

    //clear cars list ul
    listholder.innerHTML = "";

    var i;
    //Iterate through the results
    for (i = 0; i < results.rows.length; i++) {
        //Get the current row
        var row = results.rows.item(i);

        listholder.innerHTML += "<li>" + row.latitude + " - " + row.longitude + " (<a href='javascript:void(0);' onclick='deleteLoc(" + row.id + ");'>Delete Location</a>)";
    }

}

//function to get the list of cars from the database

function outputLocs() {
    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
        mydb.transaction(function(t) {
            t.executeSql("SELECT * FROM locations", [], updateLocList);
        });
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}

//function to add the car to the database

function addLoc() {
    //check to ensure the mydb object has been created
    if (mydb) {
        //get the values of the make and model text inputs
        var latitude = document.getElementById("latitude").value;
        var longitude = document.getElementById("longitude").value;

        //Test to ensure that the user has entered both a make and model
        if (latitude !== "" && longitude !== "") {
            //Insert the user entered details into the cars table, note the use of the ? placeholder, these will replaced by the data passed in as an array as the second parameter
            mydb.transaction(function(t) {
                t.executeSql("INSERT INTO locations (latitude, longitude) VALUES (?, ?)", [latitude, longitude]);
                outputLocs();
            });
        } else {
            alert("You must enter a latitude and longitude!");
        }
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}


//function to remove a car from the database, passed the row id as it's only parameter

function deleteLoc(id) {
    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
        mydb.transaction(function(t) {
            t.executeSql("DELETE FROM locations WHERE id=?", [id], outputLocs);
        });
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}

outputLocs();