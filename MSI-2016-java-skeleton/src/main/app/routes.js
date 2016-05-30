var angular = require('angular');
var module = angular.module('MsiApp');

module.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states
  $stateProvider
    .state('root', {
      template: "<main></main>"
    })
    .state('root.home', {
        url: "/",
        template: "<home-page></home-page>"
    })
    .state('root.one', {
      url: "/one",
      template: "<h1>Root.one</h1>"
    })
    .state('root.two', {
      url: "/two",
      template: "<h1>Root.two</h1>"
    });
});
