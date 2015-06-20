'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('app', [
  'ngSanitize'
]);
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'templates/login.html',
    controller: 'LoginController'
  });

  $routeProvider.when('/home', {
    templateUrl: 'templates/home.html',
    controller: 'HomeController'
  });

  $routeProvider.otherwise({redirectTo: '/login'});
}]);

app.factory('AuthenticationService', ['$http','$location', function($http, $location) {
  return {
    login: function(credentials) {
      return $http.post("/auth/login", credentials);
    },
    logout: function() {
      return $http.get("/auth/logout");
    }
  };
}]);

app.controller('LoginController', ['$scope', '$location', 'AuthenticationService', function($scope, $location, AuthenticationService){
  $scope.credentials = { username: "", password: "" };

  $scope.login = function() {
    AuthenticationService.login($scope.credentials).success(function() {
      $location.path('/home');
    });
  }
}]);

app.controller('HomeController', ['$scope', '$location', 'AuthenticationService', function($scope, $location, AuthenticationService) {
  $scope.title = 'Home';
  $scope.message = 'Mouse over these images to see a directive at work!';

  $scope.logout = function() {
    AuthenticationService.logout().success(function() {
      $location.path('/login');
    });
  };
}]);

app.directive('showsMessageWhenHovered', function() {
  return {
    restrict: 'A', // A = Attribute; C = Class Names; E = Element; M = HTML Comment
    link: function(scope, element, attrs) {
      var originalMessage = scope.message;
      element.bind('mouseover', function() {
        scope.message = attrs.message;
        scope.$apply();
      });
      element.bind('mouseout', function() {
        scope.message = originalMessage;
        scope.$apply();
      });
    }
  };
});