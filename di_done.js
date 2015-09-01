///////////////////////////////////////////
// Create a Mock or Dummy LatLongService
function DummyLatLongService(){
}

DummyLatLongService.get = function(zip){
  this.lat =  '38.272689';
  this.long = '-76.289063';
};

///////////////////////////////////////////
// Create a LatLongService

function LatLongService(){
}

LatLongService.get = function(zip){
  // save this point in scope
  // so then call back below can use it.
  var _self = this;

  // pseudo code
  // returns a JQuery Promise
  return $.ajax({url: 'http://getit.com'})
    .then(function(data){
      _self.lat = data.lat;
      _self.long = data.long;
    });;
};
///////////////////////////////////////////
// Create a Location

function Location(street, city, state, zip, LatLongService){
  this.street = street;
  this.city = city;
  this.state = state;
  this.zip = zip;
  this.getCoordinates(LatLongService);
};

Location.prototype.getCoordinates = function(LatLongService){
  LatLongService.get.bind(this);
  LatLongService.get(this.zip);
};

///////////////////////////////////////////
// Create a Person with an address and Profile.

function Person(address, fname, lname, dob){
  this.address = address;
  this.fName = fname;
  this.lName = lname;
};

var address1 = new Location('33 Main St', 'Melrose', 'MA', '09849', DummyLatLongService);

var joe = new Person(address1, 'joe', 'smoe');
console.log('joe is ');
console.log(joe);

var tom = new Person(address1,'tom', 'smith');
console.log('tom is ');
console.log(tom);

var liz = new Person(address1,'liz', 'jones');
console.log('liz is ');
console.log(liz);
