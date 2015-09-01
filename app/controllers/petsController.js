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
