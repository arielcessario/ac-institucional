'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'duScroll',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'acUtils',
  'acAnimate',
  'acContacts'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}])
    .controller('AppController', AppController);

AppController.$inject = ['$location', '$timeout', '$document'];
function AppController($location, $timeout, $document) {

  var vm = this;
  vm.goToAnchor = goToAnchor;

  function goToAnchor(id) {
    $location.path('/main');

    $timeout(function () {
      var duration = 1000;
      var offset = 50; //pixels; adjust for floating menu, context etc
      //Scroll to #some-id with 30 px "padding"
      //Note: Use this in a directive, not with document.getElementById
      var someElement = angular.element(document.getElementById(id));
      $document.scrollToElement(someElement, offset, duration);
    }, 20);
  }

  function sendMail() {


  }

}
