// Create a Dummy or Mock LatLogService
function DummyLatLongService(){
}

DummyLatLongService.get = function(zip){
  return {
    lat: '44449999393939',
    long: '2847623953939'
  };
}

// Create a LatLongService
function LatLongService(){
};

// Create a getter method for our Latitude Longiude service
LatLongService.get = function(zip){
  var result;
  $.ajax({url: 'http://getit.com/', data: zip})
    .done(function(data){
      result.lat = data.lat;
      result.long = data.long;
    });
  return result;
};

// Constructor function to create locations, cool.
function Location(street, city, state, zip, LLService){
  this.street = street;
  this.city = city;
  this.state = state;
  this.zip = zip;
  // Everytime we create a Location we will use the
  // LatLongService to query a remote API to get
  // the lat and long.
  var result = LLService.get(zip);
  this.lat = result.lat;
  this.long = result.long;
}
// Like to have one address I can plug in for each roomie, right?
// this will be an address with a MOCK lat log service
 var address1 = new Location('33 Main St', 'Melrose', 'MA', '09876', DummyLatLongService);

// This will be an address with the REAL lat log service, that makes a remote
// request to an API.
//  var address1 = new Location('33 Main St', 'Melrose', 'MA', '09876', LatLongService);

// Create a Person with an Address
function Person(address, fname, lname){
  this.address = address;
  this.fname = fname;
  this.lname = lname;
}

// Create a person, joe.
var joe = new Person(address1, 'smoe');
console.log('joe is ');
console.log(joe);

var tom = new Person(address1, 'tom', 'smith');
console.log('tom is ');
console.log(tom);

var liz = new Person(address1, 'liz', 'jones');
console.log('liz is ');
console.log(liz);
