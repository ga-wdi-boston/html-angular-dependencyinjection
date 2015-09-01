![General Assembly Logo](http://i.imgur.com/ke8USTq.png)


## Objectives
* Show an example of Dependency Injection(DI) in JS.
* Use DI to implement a Controller that has depends on built-in services and modules.
* Use these injected services in a Controller.

## Setup

Get AngularJS libraries.

```bower install```

## Dependency Injection (DI)

We are going to look at Dependency Injection, as a general concept in software develop, and how it's used in Angular.

"Dependency injection means giving an object its instance variables. Really. That's it."

[Wikipedia: Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection)

## DI in Javascript

Lets create some code that could use Dependency injection!, **Final version is di_done.js**

**Create a file di.js**

*Create joe*

```javascript
// Create a Person with an address and Profile.                                 

function Person(street, city, state, zip, fname, lname, dob){
  this.street = street;
  this.city = city;
  this.state = state;
  this.zip = zip;
  this.fName = fname;
  this.lName = lname;
};

var joe = new Person('33 Main St', 'Melrose', 'MA', '09849', 'joe', 'smoe');
console.log('joe is ');
console.log(joe);
```

Now joe has some roomies, tom and liz. Create them.

```javascript 
...
var joe = new Person('33 Main St', 'Melrose', 'MA', '09849', 'joe', 'smoe');
console.log('joe is ');
console.log(joe);

var tom = new Person('33 Main St', 'Melrose', 'MA', '09849', 'tom', 'smith');
console.log('tom is ');
console.log(tom);

var liz = new Person('33 Main St', 'Melrose', 'MA', '09849', 'liz', 'jones');
console.log('liz is ');
console.log(liz);
```

Oops, let's refactor out the Address, and call it a Location, OK?

```javascript
///////////////////////////////////////////                                         
// Create a Location                                                                

function Location(street, city, state, zip, fname, lname, dob){
  this.street = street;
  this.city = city;
  this.state = state;
  this.zip = zip;
};

///////////////////////////////////////////                                         
// Create a Person with an address and Profile.                                     

function Person(address, fname, lname, dob){
  this.address = address;
  this.fName = fname;
  this.lName = lname;
};

var address1 = new Location('33 Main St', 'Melrose', 'MA', '09849');
var joe = new Person(address1, 'joe', 'smoe');
console.log('joe is ');
console.log(joe);

var tom = new Person(address1,'tom', 'smith');
console.log('tom is ');
console.log(tom);

var liz = new Person(address1,'liz', 'jones');
console.log('liz is ');
console.log(liz);

```

We **Seperated our Concerns** by refactoring the Location concern/concept into it's own class. *Yeah, now we can change how we implement a Location!!*

So, Lets give Location a way to look up it's latitude and longitude. But, we have to use a remote services, e.g. an API that provides this info.


```javascript
///////////////////////////////////////////
// Create a LatLongSerice

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

function Location(street, city, state, zip,LatLongService){
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

// Address now uses, and depends on, the LatLongService. So lets inject it.
// 
var address1 = new Location('33 Main St', 'Melrose', 'MA', '09849',LatLongService);

var joe = new Person(address1, 'joe', 'smoe');
console.log('joe is ');
console.log(joe);

var tom = new Person(address1,'tom', 'smith');
console.log('tom is ');
console.log(tom);

var liz = new Person(address1,'liz', 'jones');
console.log('liz is ');
console.log(liz);

```

Bummer, it doesn't work, huh? 

Oh, seems like the LatLongService depends on JQuery to 
provide the ``$.ajax`` for remote AJAX calls.

We can fix that using a Dummy or Mock LatLongService. I'm just not ready to commit to all these libraries before I get my Data/Domain Model yet.

```javascript
///////////////////////////////////////////
// Create a Mock or Dummy LatLongService
function DummyLatLongService(){
}

DummyLatLongService.get = function(zip){
  this.lat =  '38.272689';
  this.long = '-76.289063';
};
...

Location.prototype.getCoordinates = function(LatLongService){
  LatLongService.get.bind(this);
  LatLongService.get(this.zip);
};

...

var address1 = new Location('33 Main St', 'Melrose', 'MA', '09849', DummyLatLongService);

```

So, we found that by using a some software design concepts out code could be more flexible and easily testable. 

And we didn't need to get everything working to validate our domain or data model.

##### Design Concepts

* Seperation of Concerns. Each concern, (Location), was localized to it's own software artifact, in this case a JS class.
* Single Responsibility Principal. Each class should have one *Responsibility*. Location class was responsible for it's Location-like Behavior.
* Dependency Injection. By injecting in objects to a client class we make it much more flexible and easier to test.
* Open for Change, Closed for Modification. The Person class is open for change. It's Location can change it's implementation with having to change the Person's implementation/code.

The last four of these Principles are part of a very common design tool/concept call **SOLID**. This is an acronym for:

- Single Responsibility Principal.
- Open for Change, Closed for Modificaton.
- Liskov Substitution Principal
- Dependency Injection.

SOLID baaaaby!

[Uncle Bob's SOLID](http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod)

[Javascript Dependency Injection](http://rjzaworski.com/2013/02/javascript-dependency-injection-what-you-should-know)

## DI in Angular

Take a look at pets.html, it should contain this code:  
*Note: we are using the $scope as the View Model* 

```html
<!DOCTYPE html>
<html ng-app='petsApp'>
<head>
  <title></title>
  <script type="text/javascript" src="bower_components/angular/angular.js"></script>
  <script type="text/javascript" src="app/app.js"></script>
  <script type="text/javascript" src="app/controllers/petsController.js"></script>

</head>
  <!-- Using $scope as the View Model -->
  <body ng-controller="PetsController">
  <h3> Pets</h3>
  <br/>
  <table>
    <tr>
      <th>Name</th>
      <th>Species</th>
      <th>Age</th>
    </tr>
    <tr ng-repeat="pet in pets">
      <td>{{pet.name}}</td>
      <td>{{pet.species}}</td>
      <td>{{pet.age}}</td>
    </tr>
  </table>
  <br/>
  <span>Oldest pet: {{oldestPet().name}}</span>
  <br/>
  <span>Number of pets: {{totalPets()}}</span>
  </body>
</html>

```

OK, nothing to new here. *Let's move on*

### Inject $scope into the Controller.

Take a look at the person controller. 

*Notice: it gets the $scope injected into in by angular!*

```javascript
/* globals angular: true */
(function(angular){
  'use strict';
  // Constructor Function that will be used for the
  // Controller
  function PetsController($scope){

    $scope.pets = [
      {name: 'Rover', species: 'Dog', age: 7},
      {name: 'Milo', species: 'Horse', age: 13},
      {name: 'Dolce', species: 'Cat', age: 1},
      {name: 'Mertle', species: 'Turtle', age: 134}
    ];
    console.log($scope.pets);

    $scope.totalPets = function(){
      return $scope.pets.length;
    };  

    $scope.oldestPet = function() {
      var canidatePet = this.pets[0];

      $scope.pets.forEach(function(pet){
        if (pet.age > canidatePet.age){
          canidatePet = pet;
        }
      });
      return canidatePet;
    };

  } // end of Constructor function

  // The controller is part of the app module
  angular.module('petsApp').controller('PetsController', PetsController);

})(angular);
```

## Documentation

[AngularJS](https://angularjs.org/)

[API Documentation](https://docs.angularjs.org/api)

[Angular type of Dependency Injection](http://merrickchristensen.com/articles/javascript-dependency-injection.html) 