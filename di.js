///////////////////////////////////////
// Constructor Function for Latitude/Longitute Service
function LatLongService(){
};

LatLongService.get(zipcode){
  // pseudo-code for accessing a remote lat/long service
  $.ajax({url: ...}).done(function(latLongData){
    return {lat: latLongData.lat, long: latLongData.long};
  }; 
}

///////////////////////////////////////
// Constructor Functon for DUMMY used in tests, or until API is hooked up
function LatLongServiceDummy(){
};
LatLongServiceDummy.get(zipcode){
  this.lat = '38.272689';
  this.long = '-76.289063'
}

///////////////////////////////////////
// Constructor Function for UserProfile
function UserProfile(fname, lname, dob){
  this.fName = fname;
  this.lName = lname;
  this.dob = dob
};
// method to calculate current age
UserProfile.prototype.age = function(){
  var diff = new Date() - this.dob; 
  return Math.floor(diff/31536000000);
};

///////////////////////////////////////
// Constructor Function for Location.
// Notice it's dependency is a service that get the lat/long
function Location(street, city, state, zipcode, latLongService){
  this.street = street;
  this.city = city;
  this.state = state;
  this.zip = zipcode;
  this.getCoord(latLongService);  // get the lat/long using the service
};

// Call the Remote, AJAX, service to the get the lat/long 
// given the zip    
Location.prototype.getCoord = function(coordService){
  if (coordService){
    var lat_long = coordService.get(this.zip)
        .then(function(lat_long){
          this.lat = lat_long.latitude;
          this.long = lat_long.longitute
        }.bind(this));
  } 
};

///////////////////////////////////////
// Constructor Function to create a Person NOT using DI
// Not using DI!
function Person(street, city, state, zip, fname, lname){
  // 1) The Dependencies, (Location, LatLongService, Profile), are hidden inside 
  // the implemtation. Not good practice.
  // 2) Difficult to change for testing, would like a LatLongService mock/stub
  //    that would not use a Remote API.
  this.address = new Location(street, city, state, zip, LatLongService());
  this.profile = new Profile(fname, lname);
};

// Poor joe, he's hard to test. I hate you right now joe, arrrgggg.
var joe = new Person("35 Main St.", "Melrose", "MA", "08768", 'Joe', 'Smoe');

///////////////////////////////////////
// Constructor Function to create a Person that IS using DI
// Using DI!
function PersonDI(location, profile){
  this.address = location;
  this.profile = profile;
}

///////////////////////////////////////
// Create Joe's profile
var joeProfile = new UserProfile('Joe', 'Smoe', '4/8/89');
Object.freeze(joeProfile);

// Create Joe's Address using DI!
var joeAddress = new Location('44 Main St', 'Melrose', 'MA', '09876', LatLongService());
Object.freeze(joeAddress);

// Create Joe
var joeDI = new Person(joeAddress, joeProfile);

///////////////////////////////////////
// Create Joe's address using DI with a Mock LatLongService!
var joeDummyAddress = new Location('44 Main St', 'Melrose', 'MA', '09876', LatLongServiceDummy;
Object.freeze(joeDummyAddress);

// Create Dummy Joe, good for testing!
var joeDIDummy new Person(joeDummyAddress, joeProfile);


