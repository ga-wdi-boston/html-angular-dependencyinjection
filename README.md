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

### DI in Javascript

There are two types of DI in javascript.
Lets Look at some code that could use Dependency injection!, **Open up di.js**

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

#### ViewModel and $scope

There is a concept of a *_View Model_* in Angular. This View Model will allow a Controller to share Data with a View. 

#### [Angular View Model is NOT a Rails model: optional, little deep maybe](RailsViewModel.md)


#####In Angular there are **TWO** ways to share data between an Controller and a View.   

* First, and **preferred** is using the "Controller as" method.  The View Model is an instance of the Controller.
* Second is to use `$scope`. The View Model is `$scope`.

### Using "Controller as" method.

This is the recommended way to to share data. The View Model will be an instance of the Controller.

**Create a pets.html**

```html
<!document html>
<html ng-app>
  <head>
     <script type='text/javascript' src='bower_components/angular/angular.js'></script>
  </head>
  <body>
  </body>
</html>
```
**Create a app/app.js**

```javascript
angular.module('petsApp', []);
```

**Add the application name/module to the ng-app directive in the pets.html**

```html
...
<html ng-app='petsApp'>
...
```

This will name the Angular application, provide a namespace for it, 'petsApp', and a top level module. *We'll learn about modules later.*

**Add a Controller file, app/controllers/petsController.js**

```javascript
(ƒ(angular){

  // Constructor Function                                                                                         
  function PetsController(){
    this.pets = [{name: 'Rover', species: 'Dog', age: 7},{name: 'Milo', species: 'Horse', age: 3}, {name: 'Sh*tCa\
t', species: 'Cat', age: 11}, {name: 'Mertle', species: 'Turtle', age: 123 } ];

  }
 
  // The Controller is part of the module.                                                                        
  angular.module('petsApp').controller('PetsController', PetsController);

})(angular);
```

Lots of stuff here. 

We are creating a Controller for pets. It's really just a Javascript Constructor Function. *Later, we'll use it to create ONE instance of a PetsController.*

Then we create an array of object literals, each one holding data about a pet. *The controller instance we create in the view will have it's 'pets' property set to this array of pets.*

Notice that we put all the code in an IIFE that get's passed the *global* angular variable. *Passing in a global is just an optimization, JS doesn't need to search up though all enclosing scopes to look for a variable.*

*We do this so we can put private variables in this scope that will NOT pollute the global namespace.*

*We haven't yet created any private variables, but we may as time goes on*

**Update the pets.html to use this controller**

```html
  ...
  <head>
  <script type='text/javascript' src='bower_components/angular/angular.js'><\
/script>
  <script type='text/javascript' src='app/app.js'></script>
  <script type='text/javascript' src='app/controllers/petsController.js'></script>
  </head>

  <body ng-controller="PetsController as petsCtrl">
    <h3>Pets</h3>
    <br/>
    <table>
      <tr>
        <th>Name</th>
        <th>Species</th>
	<th>Age</th>
      </tr>
      <tr ng-repeat="pet in petsCtrl.pets">
	<td>{{ pet.name }}</td>
        <td>{{ pet.species}}</td>
        <td>{{ pet.age }}</td>
      </tr>
    </table>
  </body>
```

Open this pets.html in the browser. You should see a table of pets.

First, we included the javascript files for the app, app.js, and the controller, app/controllers/pets_controller.js.

Then in the ``body`` tag we created a ``ng-controller`` attribute. We set this attribute to have a value that will make the one *instance* of the PetsController avaialble in the View. The name will be 'petsCtrl' in the view will refer to this ONE instance of the PetsController.


**Add this to the PetsController, right above the angular.module line.**

```javascript
... 
  PetsController.prototype.totalPets = function(pet){
    return this.pets.length;
  };

  PetsController.prototype.oldestPet = function(){
    var candidatePet = this.pets[0];

    this.pets.forEach(ƒ(pet){
      if (pet.age > candidatePet.age) {
	     candidatePet = pet;
      }
    });

    return candidatePet;
  };
... 
```

Here we create to methods on the controller. 


**Add this to the pets.html**

```html
 <br/>
    <span>Oldest pet: {{ petsCtrl.oldestPet().name }}</span><br/>
    <span>Total number of pets: {{ petsCtrl.totalPets() }}</span>
```

This will use these two Controller methods in the View.


### Using $scope (OPTIONAL)
The ViewModel is shared between a Controller and a View. __In this case $scope is the ViewModel.__

* The ViewModel, ``$scope``, is injected into the Controller.
* The Controller can add or change a properties in the $scope and make them visible to the View.


In Angular, one must _explicitly_ set a property on the ViewModel, $scope, in the Controller for it to become available in the View. 

For example, in order to share a property between a Controller and a View one __must__ set this property on the ViewModel, $scope.

In the Controller:  

```javascript
$scope.pet = {name: 'Rover', species: 'Dog', age: 7};

```

Is made available in the View:


```html
 <p> {{pet.name} is only {{pet.age}</p>
```


## Lab: Customer's Controller

Let's refactor the code we've used in the previous lesson about Views and Directives into an Angular Controller.


1. Start with the code from the last directives lesson, directives_last.html.  
2. Rename this html file to customers.html.  
3. Create a application module for this customer's app in app/customers.js  
4. Update the ng-app directive in the customers.html, ya know in the html tag. 
5. Create a controller in the app/controllers/customersController.js  
	5.1 Create an array of customers in the controller, *hint move it from the ng-init.*  
	5.2 Create controller properties for ``sortBy`` and ``reverse``.  

6. Update the body tag so we will create one instance of the CustomersController for the view. The view will refer to this instance ``as`` customersCtrl.  
7. Invoke the CustomersController.doSort method where needed. *Yes, you must create this controller method.*  
8. Invoke the CustomersController.numOfCustomers method where needed. *Yes, you must create this controller method.* 

**The customers_done.html file will have the finished template.**

## Documentation

[AngularJS](https://angularjs.org/)

[API Documentation](https://docs.angularjs.org/api)

[Angular type of Dependency Injection](http://merrickchristensen.com/articles/javascript-dependency-injection.html) 